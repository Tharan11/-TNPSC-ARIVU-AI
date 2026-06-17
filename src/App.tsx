import { useEffect } from 'react';
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
