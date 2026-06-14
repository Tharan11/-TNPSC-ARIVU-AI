import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings, ChevronDown, BookOpen } from 'lucide-react';
import { useAppStore, useT } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, isAuthenticated, user } = useAppStore();
  const t = useT();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); setNotifOpen(false); }, [location]);

  const navLinks = [
    { path: '/', label: t('முகப்பு', 'Home') },
    { path: '/exams', label: t('தேர்வுகள்', 'Exams') },
    { path: '/tests', label: t('தேர்வு எழுது', 'Tests') },
    { path: '/current-affairs', label: t('நடப்பு நிகழ்வுகள்', 'Current Affairs') },
    { path: '/ai-tutor', label: t('AI ஆசிரியர்', 'AI Tutor') },
    { path: '/community', label: t('சமூகம்', 'Community') },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0A0E1A]/95 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo-icon.svg" alt="ARIVU AI" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight tracking-wide">ARIVU</span>
              <span className="text-[10px] text-brand-primary font-medium -mt-0.5">AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'TAMIL' ? 'ENGLISH' : 'TAMIL')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:border-brand-primary/50 hover:text-brand-primary transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {language === 'TAMIL' ? 'தமிழ்' : 'English'}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full" />
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-[#1F2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/5">
                          <span className="text-sm font-semibold text-white">{t('அறிவிப்புகள்', 'Notifications')}</span>
                        </div>
                        <div className="p-3 text-center text-sm text-gray-500">{t('புதிய அறிவிப்புகள் இல்லை', 'No new notifications')}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-amber-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#0A0E1A]" />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-[#1F2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-400">Level {user?.level || 1} · {user?.xp || 0} XP</p>
                        </div>
                        <div className="py-1">
                          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                            <BookOpen className="w-4 h-4" /> {t('டாஷ்போர்டு', 'Dashboard')}
                          </Link>
                          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                            <Settings className="w-4 h-4" /> {t('அமைப்புகள்', 'Settings')}
                          </Link>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5">
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
                <Link to="/auth/login" className="btn-ghost text-sm hidden sm:block">
                  {t('நுழை', 'Login')}
                </Link>
                <Link to="/auth/register" className="btn-primary text-sm">
                  {t('இலவசமாக தொடங்கு', 'Start Free')}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/5"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'text-brand-primary bg-brand-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => setLanguage(language === 'TAMIL' ? 'ENGLISH' : 'TAMIL')}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all sm:hidden"
                >
                  <BookOpen className="w-4 h-4" />
                  {language === 'TAMIL' ? 'English' : 'தமிழ்'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
