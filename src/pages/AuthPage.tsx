import { useState } from 'react';
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
