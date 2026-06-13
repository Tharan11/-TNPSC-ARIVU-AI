import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Flame, Target, Star, Trophy, TrendingUp, AlertTriangle, Clock, Sparkles,
  ArrowUp, Zap, BookOpen, MessageSquare
} from 'lucide-react';
import { useAppStore, useT } from '../store';
import { MOCK_CURRENT_AFFAIRS, MOCK_ACHIEVEMENTS, MOCK_EXAMS } from '../lib/data';
import { formatNumber } from '../lib/utils';

// Mock data for dashboard
const mockAccuracyData = [
  { day: 'Mon', accuracy: 72 },
  { day: 'Tue', accuracy: 75 },
  { day: 'Wed', accuracy: 68 },
  { day: 'Thu', accuracy: 82 },
  { day: 'Fri', accuracy: 79 },
  { day: 'Sat', accuracy: 85 },
  { day: 'Sun', accuracy: 88 },
];

const mockSubjectProgress = [
  { subject: 'Tamil', progress: 65, color: '#F59E0B' },
  { subject: 'English', progress: 58, color: '#06B6D4' },
  { subject: 'Maths', progress: 72, color: '#10B981' },
  { subject: 'Science', progress: 45, color: '#3B82F6' },
  { subject: 'History', progress: 80, color: '#8B5CF6' },
  { subject: 'Polity', progress: 92, color: '#EF4444' },
];

const mockWeakAreas = [
  { topic: 'Constitutional History', accuracy: 45, questionsAttempted: 24 },
  { topic: 'Economics - Inflation', accuracy: 38, questionsAttempted: 19 },
  { topic: 'Physical Geography', accuracy: 52, questionsAttempted: 31 },
];

const stagger = {
  container: { transition: { staggerChildren: 0.08 } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } },
};

function WelcomeHeader() {
  const t = useT();
  const { user } = useAppStore();
  const xpToNextLevel = 2500;
  const currentXp = 1840;
  const xpProgress = (currentXp / xpToNextLevel) * 100;

  return (
    <motion.div variants={stagger.item} className="card-glow mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {t('வணக்கம்', 'Welcome back')}, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-400 text-sm">
            {t('உங்கள் TNPSC தயாரிப்பு பயணத்தைத் தொடரவும்', 'Continue your TNPSC preparation journey')}
          </p>
        </div>
        <div className="badge-gold">
          <span className="tamil font-semibold">{t('அறிஞர்', 'Scholar')} • {user?.level || 5}</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">{t('அடுத்த நிலைக்கு XP', 'XP to next level')}</span>
          <span className="text-xs font-medium text-brand-primary">{currentXp} / {xpToNextLevel}</span>
        </div>
        <div className="w-full h-2.5 bg-navy-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-brand-primary to-amber-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatsRow() {
  const t = useT();
  const { user } = useAppStore();

  const stats = [
    {
      label: t('अध्ययन तार', 'Study Streak'),
      value: `${user?.currentStreak || 7}/${user?.longestStreak || 12}`,
      icon: Flame,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: t('இன்றைய வினாக்கள்', 'Questions Today'),
      value: '24',
      icon: Target,
      color: 'text-brand-secondary',
      bgColor: 'bg-brand-secondary/10',
    },
    {
      label: t('துல்லியம்', 'Accuracy'),
      value: '87%',
      icon: Star,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: t('தரவரிசை', 'Rank'),
      value: '#42',
      icon: Trophy,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
    },
  ];

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div key={i} variants={stagger.item} className="card">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-gray-400 mb-1 tamil">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function AccuracyTrendChart() {
  const t = useT();

  return (
    <motion.div variants={stagger.item} className="card-glow lg:col-span-2 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{t('சரிபார்ப்பு போக்கு', 'Accuracy Trend')}</h3>
          <p className="text-xs text-gray-400 mt-1">{t('கடந்த 7 நாட்கள்', 'Last 7 days')}</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm font-semibold text-success">+16%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={mockAccuracyData}>
          <defs>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: '#F59E0B', r: 4 }}
            fillOpacity={1}
            fill="url(#colorAccuracy)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function SubjectProgress() {
  const t = useT();

  return (
    <motion.div variants={stagger.item} className="card-glow lg:col-span-2 mb-6">
      <h3 className="text-lg font-semibold text-white mb-5">{t('பாடப் பாடங்கள்', 'Subject Progress')}</h3>

      <div className="space-y-4">
        {mockSubjectProgress.map((s) => (
          <div key={s.subject}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300 tamil">{s.subject}</span>
              <span className="text-xs font-semibold text-brand-primary">{s.progress}%</span>
            </div>
            <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ backgroundColor: s.color }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WeakAreas() {
  const t = useT();

  return (
    <motion.div variants={stagger.item} className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-error" />
        <h3 className="text-lg font-semibold text-white">{t('பலவீன பகுதிகள்', 'Weak Areas')}</h3>
      </div>

      <div className="space-y-3">
        {mockWeakAreas.map((area, i) => (
          <motion.div
            key={i}
            variants={stagger.item}
            className="bg-error/5 border border-error/20 rounded-lg p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-white tamil">{area.topic}</span>
              <span className="badge-error">{area.accuracy}%</span>
            </div>
            <p className="text-xs text-gray-400">
              {t(`${area.questionsAttempted} வினாக்கள் முயற்சி செய்யப்பட்டது`, `${area.questionsAttempted} questions attempted`)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function UpcomingExams() {
  const t = useT();

  const getCountdown = (dateStr: string) => {
    const exam = new Date(dateStr);
    const today = new Date();
    const diff = exam.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div variants={stagger.item} className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-white">{t('வரவிருக்கும் தேர்வுகள்', 'Upcoming Exams')}</h3>
      </div>

      <div className="space-y-3">
        {MOCK_EXAMS.slice(0, 3).map((exam) => {
          const countdown = getCountdown(exam.examDate || '');
          return (
            <motion.div
              key={exam.id}
              variants={stagger.item}
              className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-semibold text-white tamil">{exam.name}</span>
                <span className="badge-gold">{countdown} {t('நாட்கள்', 'days')}</span>
              </div>
              <p className="text-xs text-gray-400">{formatNumber(exam.vacancyCount || 0)} {t('காலிப்பணியிடங்கள்', 'vacancies')}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AchievementShowcase() {
  const t = useT();

  const rarityConfig = {
    COMMON: 'bg-gray-600/10 border-gray-600/30 text-gray-400',
    RARE: 'bg-blue-600/10 border-blue-600/30 text-blue-400',
    EPIC: 'bg-purple-600/10 border-purple-600/30 text-purple-400',
    LEGENDARY: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary',
  };

  return (
    <motion.div variants={stagger.item} className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-brand-secondary" />
        <h3 className="text-lg font-semibold text-white">{t('சாதனைகள்', 'Achievements')}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {MOCK_ACHIEVEMENTS.slice(0, 3).map((achievement) => {
          const config = rarityConfig[achievement.rarity as keyof typeof rarityConfig];
          return (
            <motion.div
              key={achievement.id}
              variants={stagger.item}
              className={`${config} border rounded-lg p-3 text-center transition-transform hover:scale-105`}
            >
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-xs font-semibold text-white mb-0.5 tamil">{achievement.name}</p>
              <p className="text-[10px] text-gray-500">{achievement.rarity}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function TodayCurrentAffairs() {
  const t = useT();
  const { language } = useAppStore();

  return (
    <motion.div variants={stagger.item} className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-brand-secondary" />
        <h3 className="text-lg font-semibold text-white">{t('நடப்பு நிகழ்வுகள்', 'Current Affairs')}</h3>
      </div>

      <div className="space-y-3">
        {MOCK_CURRENT_AFFAIRS.slice(0, 3).map((ca) => (
          <motion.div
            key={ca.id}
            variants={stagger.item}
            className="bg-navy-800 border border-navy-700 rounded-lg p-3 hover:border-brand-secondary/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="badge-cyan text-[10px]">{ca.category}</span>
            </div>
            <p className="text-xs font-medium text-white leading-tight mb-1 tamil line-clamp-2">
              {language === 'TAMIL' ? ca.titleTamil : ca.title}
            </p>
            <p className="text-[11px] text-gray-500 line-clamp-2">
              {language === 'TAMIL' ? ca.summaryTamil : ca.summary}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RecommendedNextSteps() {
  const t = useT();

  const recommendations = [
    { icon: Target, label: t('அடுத்த பாதிய வினா முயற்சிக்கவும்', 'Attempt Daily MCQ'), color: 'text-brand-primary' },
    { icon: BookOpen, label: t('அசாபி கரண்ட ஆஃபேர்ஸ் படிக்கவும்', 'Read Today\'s CA'), color: 'text-brand-secondary' },
    { icon: Zap, label: t('பலவீன பகுதிகளை மேம்படுத்தவும்', 'Improve Weak Areas'), color: 'text-warning' },
  ];

  return (
    <motion.div variants={stagger.item} className="card">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-info" />
        <h3 className="text-lg font-semibold text-white">{t('பরிந்துரைக்கப்பட்ட அடுத்த படிகள்', 'Recommended Next Steps')}</h3>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, i) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={i}
              variants={stagger.item}
              className="flex items-center gap-3 p-3 bg-navy-800 border border-navy-700 rounded-lg hover:border-brand-primary/30 transition-colors cursor-pointer group"
            >
              <Icon className={`w-5 h-5 ${rec.color} shrink-0`} />
              <span className="text-sm text-gray-300 tamil group-hover:text-white transition-colors">{rec.label}</span>
              <ArrowUp className="w-4 h-4 text-gray-500 ml-auto group-hover:text-brand-primary transition-colors" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-[#0A0E1A] p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <WelcomeHeader />

        {/* Stats Row */}
        <StatsRow />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <AccuracyTrendChart />
            <SubjectProgress />
            <WeakAreas />
          </div>

          {/* Right Column */}
          <div>
            <UpcomingExams />
            <AchievementShowcase />
            <TodayCurrentAffairs />
          </div>
        </div>

        {/* Recommended Actions */}
        <motion.div variants={stagger.item} className="mt-6">
          <RecommendedNextSteps />
        </motion.div>
      </div>
    </motion.div>
  );
}
