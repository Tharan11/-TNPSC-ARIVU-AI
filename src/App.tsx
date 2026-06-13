import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import AITutorPage from './pages/AITutorPage';
import ExamsPage from './pages/ExamsPage';
import CurrentAffairsPage from './pages/CurrentAffairsPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:slug" element={<ExamsPage />} />
          <Route path="/tests" element={<TestPage />} />
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          <Route path="/ai-tutor" element={<AITutorPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
