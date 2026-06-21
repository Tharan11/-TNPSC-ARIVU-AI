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
  const [isDark, setIsDark] = useState(true);
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
    // Default dark — system follow
    const stored = localStorage.getItem('arivu-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
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
        scrolled
          ? 'bg-[#0B0D14]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-[#0B0D14]/80 backdrop-blur-md border-b border-white/[0.06]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-2">

            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg transition-all duration-200"
                style={{
                  background: 'rgba(139,92,246,0.20)',
                  border: '1px solid rgba(139,92,246,0.50)',
                  boxShadow: '0 0 16px rgba(139,92,246,0.30), inset 0 1px 0 rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)',
                }}>
                அ
              </div>
              <span className="font-bold text-xl tracking-tight" style={{ color: '#C4B5FD', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                ARIVU <span style={{ color: '#F1F5F9', fontWeight: 400, fontSize: '1rem' }}>AI</span>
              </span>
            </Link>

            {/* ── DESKTOP NAV ── */}
            <div className="hidden lg:flex items-center gap-1">
              {coreLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
                  style={isActive(link.path) ? {
                    color: '#C4B5FD',
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.40)',
                    boxShadow: '0 0 14px rgba(139,92,246,0.22)',
                  } : {
                    color: '#94A3B8',
                    border: '1px solid transparent',
                  }}>
                  {link.path === '/ai-tutor' && <Sparkles className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />}
                  {link.label}
                </Link>
              ))}

              <div className="relative" ref={moreRef}>
                <button onClick={() => setMoreOpen((v) => !v)}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1"
                  style={isMoreActive || moreOpen ? {
                    color: '#C4B5FD',
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.40)',
                  } : {
                    color: '#94A3B8',
                    border: '1px solid transparent',
                  }}>
                  {t('மேலும்', 'More')}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-56 rounded-2xl py-2 z-50"
                      style={{
                        background: 'rgba(11,13,20,0.95)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                      }}>
                      {moreLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link key={link.path} to={link.path}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-all duration-150"
                            style={isActive(link.path) ? {
                              color: '#C4B5FD',
                              background: 'rgba(139,92,246,0.15)',
                            } : {
                              color: '#94A3B8',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C4B5FD'; (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.10)'; }}
                            onMouseLeave={e => { if (!isActive(link.path)) { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}>
                            <Icon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                            {link.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── RIGHT CONTROLS ── */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Search bar */}
              <button onClick={() => setPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all w-44"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#64748B',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.45)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)'; }}>
                <Search className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">{t('தேடல்...', 'Search...')}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#475569' }}>Ctrl K</span>
              </button>

              <button onClick={() => setPaletteOpen(true)}
                className="md:hidden p-2 rounded-xl transition-all"
                style={{ color: '#64748B' }}>
                <Search className="w-5 h-5" />
              </button>

              {/* Language toggle */}
              <button onClick={() => setLanguage(language === 'TAMIL' ? 'ENGLISH' : 'TAMIL')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#94A3B8',
                }}>
                <Globe className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
                {language === 'TAMIL' ? 'EN' : 'தமிழ்'}
              </button>

              {/* Theme toggle */}
              <button onClick={toggleTheme}
                className="p-2 rounded-xl transition-all"
                style={{ color: '#64748B' }}
                title="Toggle theme">
                {isDark
                  ? <Sun className="w-5 h-5" style={{ color: '#FCD34D' }} />
                  : <Moon className="w-5 h-5" style={{ color: '#A78BFA' }} />}
              </button>

              {isAuthenticated ? (
                <>
                  <StreakBadge streak={user?.streak ?? 0} target={5} completed={user?.dailyCompleted ?? 0} />

                  {/* Notifications */}
                  <div className="relative">
                    <button onClick={() => setNotifOpen(!notifOpen)}
                      className="relative p-2 rounded-xl transition-all"
                      style={{ color: '#64748B' }}>
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full"
                        style={{ background: '#8B5CF6', boxShadow: '0 0 6px rgba(139,92,246,0.8)' }} />
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden"
                          style={{
                            background: 'rgba(11,13,20,0.97)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                          }}>
                          <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{t('அறிவிப்புகள்', 'Notifications')}</span>
                          </div>
                          <div className="p-4 text-center text-sm" style={{ color: '#64748B' }}>
                            {t('புதிய அறிவிப்புகள் இல்லை', 'No new notifications')}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile */}
                  <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(139,92,246,0.20)',
                          border: '1px solid rgba(139,92,246,0.50)',
                          boxShadow: '0 0 10px rgba(139,92,246,0.25)',
                        }}>
                        <User className="w-4 h-4" style={{ color: '#C4B5FD' }} />
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: '#475569' }} />
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden"
                          style={{
                            background: 'rgba(11,13,20,0.97)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                          }}>
                          <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{user?.name || 'User'}</p>
                            <p className="text-xs" style={{ color: '#64748B' }}>Level {user?.level || 1} · {user?.xp || 0} XP</p>
                          </div>
                          <div className="py-1">
                            {[
                              { to: '/dashboard', Icon: BookOpen, label: t('டாஷ்போர்டு', 'Dashboard') },
                              { to: '/profile', Icon: Settings, label: t('அமைப்புகள்', 'Settings') },
                            ].map(({ to, Icon, label }) => (
                              <Link key={to} to={to}
                                className="flex items-center gap-2 px-3 py-2 text-sm transition-all"
                                style={{ color: '#94A3B8' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C4B5FD'; (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.10)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                <Icon className="w-4 h-4" /> {label}
                              </Link>
                            ))}
                            <button
                              onClick={async () => {
                                const { supabase } = await import('../../lib/supabase');
                                await supabase.auth.signOut();
                                window.location.href = '/auth';
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-all"
                              style={{ color: '#FCA5A5' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.10)'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
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
                  <Link to="/auth/login"
                    className="font-medium text-sm transition-all px-3 py-2 rounded-xl hidden sm:block"
                    style={{ color: '#94A3B8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C4B5FD'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}>
                    {t('நுழை', 'Login')}
                  </Link>
                  <Link to="/auth/register"
                    className="font-medium text-sm px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
                    style={{
                      background: 'rgba(139,92,246,0.18)',
                      border: '1px solid rgba(139,92,246,0.50)',
                      color: '#C4B5FD',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 0 18px rgba(139,92,246,0.28), inset 0 1px 0 rgba(255,255,255,0.10)',
                    }}>
                    {t('இலவசமாக தொடங்கு', 'Start Free')}
                  </Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl transition-all"
                style={{ color: '#64748B' }}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── MOBILE MENU ── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="py-3 space-y-1">
                  {allMobileLinks.map((link) => (
                    <Link key={link.path} to={link.path}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={isActive(link.path) ? {
                        color: '#C4B5FD',
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px solid rgba(139,92,246,0.35)',
                        boxShadow: '0 0 12px rgba(139,92,246,0.20)',
                      } : {
                        color: '#94A3B8',
                        border: '1px solid transparent',
                      }}>
                      {link.label}
                    </Link>
                  ))}
                  <button onClick={() => setLanguage(language === 'TAMIL' ? 'ENGLISH' : 'TAMIL')}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all sm:hidden"
                    style={{ color: '#94A3B8' }}>
                    <Globe className="w-4 h-4" style={{ color: '#A78BFA' }} />
                    {language === 'TAMIL' ? 'English' : 'தமிழ்'}
                  </button>
                  {!isAuthenticated && (
                    <div className="grid grid-cols-2 gap-2 pt-2"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <Link to="/auth/login"
                        className="py-2.5 rounded-xl text-center text-sm font-medium"
                        style={{
                          color: '#94A3B8',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.10)',
                        }}>
                        {t('நுழை', 'Login')}
                      </Link>
                      <Link to="/auth/register"
                        className="py-2.5 rounded-xl text-center text-sm font-medium"
                        style={{
                          color: '#C4B5FD',
                          background: 'rgba(139,92,246,0.18)',
                          border: '1px solid rgba(139,92,246,0.50)',
                          boxShadow: '0 0 14px rgba(139,92,246,0.25)',
                        }}>
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
