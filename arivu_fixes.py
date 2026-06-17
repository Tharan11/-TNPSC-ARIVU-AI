#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ARIVU AI - One-shot fix script
Run this from project root: python arivu_fixes.py
Applies: Hindi->Tamil fix, Groq branding fix, leaderboard disclaimer removal,
ProtectedRoute, confirmPassword field+schema, auth persistence (onAuthStateChange),
404 page, Error Boundary, AI tutor rate limiting, gemini.ts removal (dead code,
client-exposed key), t() language fix, lang='ta' attribute support.
"""
import os
import re
import sys

ROOT = os.getcwd()

def read(path):
    full = os.path.join(ROOT, path)
    with open(full, encoding='utf-8') as f:
        return f.read()

def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8', newline='') as f:
        f.write(content)

def replace_or_warn(path, old, new, label):
    s = read(path)
    if old not in s:
        print(f"  [SKIP] {label} -- pattern not found in {path} (may already be fixed)")
        return
    s = s.replace(old, new)
    write(path, s)
    print(f"  [OK] {label}")

results = []

# ---------------------------------------------------------------------------
print("1. Fixing Hindi text -> Tamil in DashboardPage.tsx")
replace_or_warn(
    'src/pages/DashboardPage.tsx',
    "t('अध्ययन तार', 'Study Streak')",
    "t('படிப்பு தொடர்ச்சி', 'Study Streak')",
    "Hindi->Tamil text fix"
)

# ---------------------------------------------------------------------------
print("2. Fixing Groq AI branding -> ARIVU AI in AITutorPage.tsx")
replace_or_warn(
    'src/pages/AITutorPage.tsx',
    "{t('இணைக்கப்பட்டது', 'Connected')} — Groq AI",
    "{t('ஆன்லைன்', 'Online')} — ARIVU AI",
    "Groq branding fix"
)

# ---------------------------------------------------------------------------
print("3. Removing leaderboard 'sample data' disclaimer")
s = read('src/pages/LeaderboardPage.tsx')
new_lines = [ln for ln in s.split('\n') if 'sample data' not in ln and 'மாதிரி தரவு' not in ln]
if len(new_lines) != len(s.split('\n')):
    write('src/pages/LeaderboardPage.tsx', '\n'.join(new_lines))
    print("  [OK] Leaderboard disclaimer removed")
else:
    print("  [SKIP] Leaderboard disclaimer not found (may already be fixed)")

# ---------------------------------------------------------------------------
print("4. Creating ProtectedRoute component")
write('src/components/ProtectedRoute.tsx', """import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const authChecked = useAppStore((state) => state.authChecked);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}
""")
print("  [OK] ProtectedRoute.tsx created")

# ---------------------------------------------------------------------------
print("5. Creating NotFoundPage (404)")
write('src/pages/NotFoundPage.tsx', """import { Link } from 'react-router-dom';
import { useT } from '../store';

export default function NotFoundPage() {
  const t = useT();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-6">
        {t('இந்தப் பக்கம் கிடைக்கவில்லை', 'This page could not be found')}
      </p>
      <Link to="/" className="btn-primary px-6 py-3 rounded-lg">
        {t('முகப்புக்குச் செல்லவும்', 'Go to Home')}
      </Link>
    </div>
  );
}
""")
print("  [OK] NotFoundPage.tsx created")

# ---------------------------------------------------------------------------
print("6. Creating ErrorBoundary component")
write('src/components/ErrorBoundary.tsx', """import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-error mb-4">Something went wrong</h1>
          <p className="text-text-secondary mb-6">
            ஏதோ தவறு நடந்தது. தயவுசெய்து பக்கத்தை மீண்டும் ஏற்றவும்.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="btn-primary px-6 py-3 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
""")
print("  [OK] ErrorBoundary.tsx created")

# ---------------------------------------------------------------------------
print("7. Updating store/index.ts (auth persistence state + t() fix)")
write('src/store/index.ts', """import { create } from 'zustand';
import type { Language, User, ExamGroup } from '../lib/types';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;

  authChecked: boolean;
  setAuthChecked: (val: boolean) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;

  selectedExam: ExamGroup | null;
  setSelectedExam: (exam: ExamGroup | null) => void;

  t: (ta: string, en: string) => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'TAMIL',
  setLanguage: (language) => set({ language }),

  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  authChecked: false,
  setAuthChecked: (authChecked) => set({ authChecked }),

  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  selectedExam: null,
  setSelectedExam: (selectedExam) => set({ selectedExam }),

  t: (ta, en) => (get().language === 'TAMIL' ? ta : en),
}));

export function useT() {
  const lang = useAppStore((s) => s.language);
  return (ta: string, en: string) => (lang === 'TAMIL' ? ta : en);
}
""")
print("  [OK] store/index.ts updated")

# ---------------------------------------------------------------------------
print("8. Updating App.tsx (ProtectedRoute wraps, 404 route, ErrorBoundary, auth listener)")
write('src/App.tsx', """import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import PYQPage from './pages/PYQPage';
import PlannerPage from './pages/PlannerPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TestPage from './pages/TestPage';
import AITutorPage from './pages/AITutorPage';
import ExamsPage from './pages/ExamsPage';
import CurrentAffairsPage from './pages/CurrentAffairsPage';
import CommunityPage from './pages/CommunityPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppStore } from './store';
import { supabase } from './lib/supabase';

function App() {
  const setUser = useAppStore((s) => s.setUser);
  const setIsAuthenticated = useAppStore((s) => s.setIsAuthenticated);
  const setAuthChecked = useAppStore((s) => s.setAuthChecked);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.name || 'User',
          role: 'STUDENT',
          preferredLang: u.user_metadata?.preferred_lang || 'TAMIL',
          targetExam: u.user_metadata?.target_exam || undefined,
          xp: 0,
          coins: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalStudyMins: 0,
        });
        setIsAuthenticated(true);
      }
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.name || 'User',
          role: 'STUDENT',
          preferredLang: u.user_metadata?.preferred_lang || 'TAMIL',
          targetExam: u.user_metadata?.target_exam || undefined,
          xp: 0,
          coins: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalStudyMins: 0,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [setUser, setIsAuthenticated, setAuthChecked]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/auth/register" element={<AuthPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/:slug" element={<ExamsPage />} />
            <Route path="/tests" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
            <Route path="/current-affairs" element={<CurrentAffairsPage />} />
            <Route path="/ai-tutor" element={<AITutorPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/groups" element={<CommunityPage />} />
            <Route path="/community/mentors" element={<CommunityPage />} />
            <Route path="/success-stories" element={<CommunityPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pyq" element={<ProtectedRoute><PYQPage /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><PlannerPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
""")
print("  [OK] App.tsx updated")

# ---------------------------------------------------------------------------
print("9. Updating AuthPage.tsx (password min 8, confirmPassword field+schema)")
write('src/pages/AuthPage.tsx', """import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Phone, Eye, EyeOff, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { useAppStore, useT } from '../store';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, ExamGroup } from '../lib/types';
import { EXAM_GROUPS } from '../lib/types';

type AuthTab = 'login' | 'register';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Need 1 uppercase letter').regex(/[0-9]/, 'Need 1 number'),
  confirmPassword: z.string(),
  targetExam: z.enum(['GROUP_1', 'GROUP_2', 'GROUP_2A', 'GROUP_4', 'VAO', 'ENGINEERING', 'FOREST', 'POLICE'] as const).optional(),
  preferredLang: z.enum(['TAMIL', 'ENGLISH']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string>('');
  const { setUser, setIsAuthenticated, setLanguage } = useAppStore();
  const t = useT();

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { preferredLang: 'TAMIL' },
  });

  const createUser = (id: string, email: string, name: string, lang: 'TAMIL' | 'ENGLISH' = 'TAMIL', exam?: ExamGroup): SupabaseUser => ({
    id, email, name, role: 'STUDENT', preferredLang: lang, targetExam: exam, xp: 0, coins: 0, level: 1, currentStreak: 0, longestStreak: 0, totalStudyMins: 0,
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) throw error;
      setUser(createUser(authData.user!.id, data.email, authData.user?.user_metadata?.name || 'User'));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (e: any) {
      setGlobalError(e?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name, phone: data.phone || null, target_exam: data.targetExam || null, preferred_lang: data.preferredLang } },
      });
      if (error) throw error;
      if (!authData.session) {
        setGlobalError(t('கணக்கு உருவாக்கப்பட்டது! மின்னஞ்சலைச் சரிபார்க்கவும்.', 'Account created! Please check your email to verify your account before logging in.'));
        setTab('login');
        return;
      }
      setUser(createUser(authData.user!.id, data.email, data.name, data.preferredLang, data.targetExam as ExamGroup));
      setIsAuthenticated(true);
      setLanguage(data.preferredLang);
      navigate('/dashboard');
    } catch (e: any) {
      setGlobalError(e?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-navy-900 via-[#0A0E1A] to-navy-900 items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-secondary rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="mb-8 flex justify-center">
            <Zap className="w-16 h-16 text-brand-primary drop-shadow-lg" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2"><span className="text-gradient-gold" lang="ta">அறிவே வெற்றி</span></h1>
          <p className="text-lg text-text-secondary mb-8">Knowledge is Victory</p>
          <div className="space-y-3 text-left text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0" />
              <span>AI-Powered Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-secondary flex-shrink-0" />
              <span>Real Exam Practice</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0" />
              <span>Tamil & English Support</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-brand-primary" />
            <span className="text-xl font-bold text-text-primary">ARIVU AI</span>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8 bg-navy-900 rounded-lg p-1">
            <button
              onClick={() => { setTab('login'); setGlobalError(''); }}
              aria-label={t('உள்நுழைய தாவு', 'Login tab')}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${tab === 'login' ? 'bg-brand-primary text-navy-950' : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              {t('உள்நுழைய', 'Login')}
            </button>
            <button
              onClick={() => { setTab('register'); setGlobalError(''); }}
              aria-label={t('பதிவு தாவு', 'Register tab')}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${tab === 'register' ? 'bg-brand-primary text-navy-950' : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              {t('பதிவு', 'Register')}
            </button>
          </div>

          {globalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error text-sm"
            >
              {globalError}
            </motion.div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <motion.form key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('மின்னஞ்சல்', 'Email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input {...loginForm.register('email')} type="email" placeholder="your@email.com" className="input-field pl-10" />
                </div>
                {loginForm.formState.errors.email && <p className="text-error text-xs mt-1">{loginForm.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('கடவுச்சொல்', 'Password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('கடவுச்சொல்லை உள்ளிடுங்கள்', 'Enter password')}
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={t('கடவுச்சொல்லைக் காட்டு', 'Toggle password visibility')}
                    className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && <p className="text-error text-xs mt-1">{loginForm.formState.errors.password.message}</p>}
              </div>

              <div className="text-right text-sm">
                <button type="button" onClick={() => navigate('/auth/reset')} className="text-brand-primary hover:text-brand-secondary font-medium">
                  {t('கடவுச்சொல் மறந்துவிட்டதா?', 'Forgot password?')}
                </button>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {isLoading ? 'Logging in...' : t('உள்நுழைய', 'Login')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-sm text-text-muted">
                {t('கணக்கு இல்லையா?', 'No account?')}{' '}
                <button type="button" onClick={() => { setTab('register'); setGlobalError(''); }} className="text-brand-primary hover:text-brand-secondary font-medium">
                  {t('பதிவு செய்யவும்', 'Sign up')}
                </button>
              </div>
            </motion.form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <motion.form key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('பெயர்', 'Name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input {...registerForm.register('name')} type="text" placeholder={t('உங்கள் பெயர்', 'Your full name')} className="input-field pl-10" />
                </div>
                {registerForm.formState.errors.name && <p className="text-error text-xs mt-1">{registerForm.formState.errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('மின்னஞ்சல்', 'Email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input {...registerForm.register('email')} type="email" placeholder="your@email.com" className="input-field pl-10" />
                </div>
                {registerForm.formState.errors.email && <p className="text-error text-xs mt-1">{registerForm.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('தொலைபேசி', 'Phone')} ({t('விருப்ப', 'Optional')})</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input {...registerForm.register('phone')} type="tel" placeholder="+91 XXXXX XXXXX" className="input-field pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('கடவுச்சொல்', 'Password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input
                    {...registerForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('குறைந்தபட்சம் 8 எழுத்து', 'At least 8 characters')}
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={t('கடவுச்சொல்லைக் காட்டு', 'Toggle password visibility')}
                    className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && <p className="text-error text-xs mt-1">{registerForm.formState.errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{t('கடவுச்சொல்லை உறுதிப்படுத்தவும்', 'Confirm Password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                  <input
                    {...registerForm.register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('மீண்டும் உள்ளிடவும்', 'Re-enter password')}
                    className="input-field pl-10"
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && <p className="text-error text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">{t('இலக்கு பரீக்ஷை', 'Target Exam')}</label>
                  <select {...registerForm.register('targetExam')} className="input-field text-sm">
                    <option value="">{t('தேர்வு செய்யவும்', 'Select')}</option>
                    {EXAM_GROUPS.map((exam) => (
                      <option key={exam.slug} value={exam.slug}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">{t('மொழி', 'Language')}</label>
                  <select {...registerForm.register('preferredLang')} className="input-field text-sm">
                    <option value="TAMIL">{t('தமிழ்', 'Tamil')}</option>
                    <option value="ENGLISH">English</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                {isLoading ? 'Creating account...' : t('கணக்கை உருவாக்க', 'Create Account')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-sm text-text-muted">
                {t('ஏற்கனவே கணக்கு உள்ளதா?', 'Already have an account?')}{' '}
                <button type="button" onClick={() => { setTab('login'); setGlobalError(''); }} className="text-brand-primary hover:text-brand-secondary font-medium">
                  {t('உள்நுழைய', 'Login')}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
""")
print("  [OK] AuthPage.tsx updated")

# ---------------------------------------------------------------------------
print("10. Adding rate limiting to api/ai-tutor.js")
write('api/ai-tutor.js', """// Simple in-memory rate limiter (per Vercel function instance).
// For production at scale, replace with Vercel KV / Upstash Redis.
const requestLog = new Map();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20; // anonymous users per hour per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;
  requestLog.set(ip, entry);

  return entry.count > MAX_REQUESTS;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { message, lang } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (typeof message !== 'string' || message.length > 2000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API key not configured' });
  }

  const systemPrompt = lang === 'TAMIL'
    ? 'நீங்கள் ARIVU என்ற AI ஆசிரியர். TNPSC தேர்வுகளுக்கு மாணவர்களுக்கு உதவுகிறீர்கள். தமிழிலும் ஆங்கிலத்திலும் பதில் அளிக்கவும். TNPSC Group 1, 2, 2A, 4, VAO தேர்வு பாடங்கள் பற்றி விளக்கமாக பதில் அளிக்கவும்.'
    : 'You are ARIVU, an AI tutor helping students prepare for TNPSC exams. Answer clearly about Tamil history, Indian constitution, geography, science, and current affairs.';

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await groqRes.json();
    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ error: data.error?.message || 'Groq API error' });
    }

    const reply = data.choices?.[0]?.message?.content || 'பதில் கிடைக்கவில்லை';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
""")
print("  [OK] api/ai-tutor.js updated with rate limiting")

# ---------------------------------------------------------------------------
print("11. Removing dead/unsafe gemini.ts (client-exposed key, unused file)")
gemini_path = os.path.join(ROOT, 'src', 'lib', 'gemini.ts')
if os.path.exists(gemini_path):
    os.remove(gemini_path)
    print("  [OK] src/lib/gemini.ts deleted")
else:
    print("  [SKIP] src/lib/gemini.ts not found (already removed)")

# ---------------------------------------------------------------------------
print("12. Removing VITE_GEMINI_API_KEY from .env (unused, was client-exposed)")
env_path = os.path.join(ROOT, '.env')
if os.path.exists(env_path):
    with open(env_path, encoding='utf-8') as f:
        env_lines = f.readlines()
    new_env_lines = [ln for ln in env_lines if 'VITE_GEMINI_API_KEY' not in ln]
    if len(new_env_lines) != len(env_lines):
        with open(env_path, 'w', encoding='utf-8') as f:
            f.writelines(new_env_lines)
        print("  [OK] VITE_GEMINI_API_KEY removed from .env")
    else:
        print("  [SKIP] VITE_GEMINI_API_KEY not found in .env")
else:
    print("  [SKIP] .env not found")

print("\\nALL FIXES APPLIED. Review git diff, then test with: npm run dev")
