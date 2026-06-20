import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, Target, Newspaper, BookOpen, FileText,
  CalendarCheck, BarChart3, Trophy, Award, User, Settings, ChevronLeft,
} from 'lucide-react';
import { useT } from '../../store';

const SIDEBAR_STORAGE_KEY = 'arivu_sidebar_collapsed';

interface SidebarLink {
  path: string;
  icon: React.ReactNode;
  label: string;
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const t = useT();

  // Restore collapsed state on mount
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (saved === 'true') setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  };

  const links: SidebarLink[] = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: t('டாஷ்போர்டு', 'Dashboard') },
    { path: '/ai-tutor', icon: <Sparkles className="w-5 h-5" />, label: t('AI ஆசிரியர்', 'AI Tutor') },
    { path: '/tests', icon: <Target className="w-5 h-5" />, label: t('தேர்வு எழுது', 'Mock Tests') },
    { path: '/current-affairs', icon: <Newspaper className="w-5 h-5" />, label: t('நடப்பு நிகழ்வுகள்', 'Current Affairs') },
    { path: '/exams', icon: <BookOpen className="w-5 h-5" />, label: t('பாடப் பொருட்கள்', 'Study Materials') },
    { path: '/pyq', icon: <FileText className="w-5 h-5" />, label: t('முந்தைய வினாத்தாள்கள்', 'PYQs') },
    { path: '/planner', icon: <CalendarCheck className="w-5 h-5" />, label: t('படிப்பு திட்டம்', 'Study Planner') },
    { path: '/dashboard', icon: <BarChart3 className="w-5 h-5" />, label: t('பகுப்பாய்வு', 'Analytics') },
    { path: '/leaderboard', icon: <Trophy className="w-5 h-5" />, label: t('தரவரிசை', 'Leaderboard') },
    { path: '/leaderboard', icon: <Award className="w-5 h-5" />, label: t('சாதனைகள்', 'Achievements') },
  ];

  const bottomLinks: SidebarLink[] = [
    { path: '/profile', icon: <User className="w-5 h-5" />, label: t('சுயவிவரம்', 'Profile') },
    { path: '/profile', icon: <Settings className="w-5 h-5" />, label: t('அமைப்புகள்', 'Settings') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderLink = (link: SidebarLink) => (
    <Link
      key={link.path}
      to={link.path}
      title={collapsed ? link.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(link.path)
          ? 'text-brand-primary bg-brand-primary/10'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className="shrink-0">{link.icon}</span>
      <span
        className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
          collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        }`}
      >
        {link.label}
      </span>
    </Link>
  );

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#0A0E1A] border-r border-white/5 transition-all duration-300 ease-in-out z-40 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {links.map(renderLink)}
      </div>

      <div className="border-t border-white/5 py-4 px-2 space-y-1">
        {bottomLinks.map(renderLink)}

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <ChevronLeft className={`w-5 h-5 shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            {t('சுருக்கு', 'Collapse')}
          </span>
        </button>
      </div>
    </aside>
  );
}
