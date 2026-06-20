import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings, ChevronDown, BookOpen, Search, Sparkles, Globe, Award, FileText, HelpCircle, Sun, Moon } from 'lucide-react';
import { useAppStore, useT } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import CommandPalette from '../common/CommandPalette';
import StreakBadge from '../common/StreakBadge';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { language, setLanguage, isAuthenticated, user } = useAppStore();
  const t = useT();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
    setMoreOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('arivu-theme');
    const dark = stored === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('arivu-theme', next ? 'dark' : 'light');
  };

  const coreLinks = [
    { path: '/', label: t('முகப்பு', 'Home') },
    { path: '/ai-tutor', label: t('AI ஆசிரியர்', 'AI Tutor') },
    { path: '/tests', label: t('மாதிரி தேர்வுகள்', 'Mock Tests') },
    { path: '/current-affairs', label: t('நடப்பு நிகழ்வுகள்', 'Current Affairs') },
  ];

  const moreLinks = [
    { path: '/pyq', label: t('முந்தைய வினாக்கள்', 'Previous Year Qs'), icon: FileText },
    { path: '/leaderboard', label: t('தரவரிசை', 'Leaderboard'), icon: Award },
    { path: '/community', label: t('கருத்துக்களம்', 'Forum'), icon: HelpCircle },
  ];

  const allMobileLinks = isAuthenticated
    ? [...coreLinks, { path: '/dashboard', label: t('டாஷ்போர்டு', 'Dashboard') }, ...moreLinks]
    : [...coreLinks, ...moreLinks];

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = moreLinks.some((l) => isActive(l.path));

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm border-b border-gray-200 dark:border-gray-800' : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-2">

            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:bg-red-700 transition-colors">
                அ
              </div>
              <span className="font-extrabold text-xl tracking-tight text-red-600">
                ARIVU <span className="text-gray-900 dark:text-white font-medium text-base">AI</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {coreLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive(link.path) ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                  {link.path === '/ai-tutor' && <Sparkles className="w-3.5 h-3.5" />}
                  {link.label}
                </Link>
              ))}

              <div className="relative" ref={moreRef}>
                <button onClick={() => setMoreOpen((v) => !v)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                    isMoreActive || moreOpen ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                  {t('மேலும்', 'More')}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg py-2 z-50">
                      {moreLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.path} to={link.path}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                              isActive(link.path) ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600'
                            }`}>
                            <Icon className="w-4 h-4 text-red-500" />
                            {link.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-400 hover:border-red-300 transition-all w-44">
                <Search className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">{t('தேடல்...', 'Search...')}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-400">Ctrl K</span>
              </button>

              <button onClick={() => setPaletteOpen(true)} className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Search className="w-5 h-5" />
              </button>

              <button onClick={() => setLanguage(language === 'TAMIL' ? 'ENGLISH' : 'TAMIL')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-200 transition-all">
                <Globe className="w-3.5 h-3.5 text-red-500" />
                {language === 'TAMIL' ? 'EN' : 'தமிழ்'}
              </button>

              <button onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                title="Toggle theme">
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
              </button>

              {isAuthenticated ? (
                <>
                  <StreakBadge streak={user?.streak ?? 0} target={5} completed={user?.dailyCompleted ?? 0} />
                  <div className="relative">
                    <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
                          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">{t('அறிவிப்புகள்', 'Notifications')}</span>
                          </div>
                          <div className="p-3 text-center text-sm text-gray-400">{t('புதிய அறிவிப்புகள் இல்லை', 'No new notifications')}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
                          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400">Level {user?.level || 1} · {user?.xp || 0} XP</p>
                          </div>
                          <div className="py-1">
                            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600">
                              <BookOpen className="w-4 h-4" /> {t('டாஷ்போர்டு', 'Dashboard')}
                            </Link>
                            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600">
                              <Settings className="w-4 h-4" /> {t('அமைப்புகள்', 'Settings')}
                            </Link>
                            <button onClick={async () => { const { supabase } = await import('../../lib/supabase'); await supabase.auth.signOut(); window.location.href = '/auth'; }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800">
                              <LogOut className="w-4 h-4" /> {t('வெளியேறு', 'Logout')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth/login" className="text-gray-700 dark:text-gray-300 font-semibold text-sm hover:text-red-600 transition-colors px-3 py-2 hidden sm:block">
                    {t('நுழை', 'Login')}
                  </Link>
                  <Link to="/auth/register" className="bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-700 shadow-sm transition-all duration-200 active:scale-95">
                    {t('இலவசமாக தொடங்கு', 'Start Free')}
                  </Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800">
                <div className="py-3 space-y-1">
                  {allMobileLinks.map((link) => (
                    <Link key={link.path} to={link.path}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive(link.path) ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}>
                      {link.label}
                    </Link>
                  ))}
                  <button onClick={() => setLanguage(language === 'TAMIL' ? 'ENGLISH' : 'TAMIL')}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all sm:hidden">
                    <Globe className="w-4 h-4 text-red-500" />
                    {language === 'TAMIL' ? 'English' : 'தமிழ்'}
                  </button>
                  {!isAuthenticated && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <Link to="/auth/login" className="py-2.5 rounded-xl text-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        {t('நுழை', 'Login')}
                      </Link>
                      <Link to="/auth/register" className="py-2.5 rounded-xl text-center text-sm font-semibold text-white bg-red-600 hover:bg-red-700">
                        {t('தொடங்கு', 'Start Free')}
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
