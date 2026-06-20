import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Zap, BookOpen, Target, TrendingUp, Calendar, ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useT, useAppStore } from '../store';
import { supabase } from '../lib/supabase';

interface UserStats {
  streak: number;
  rank: number;
  accuracy: number;
  xp: number;
  lessonsToday: number;
  totalLessons: number;
  displayName: string;
}

export default function DashboardPage() {
  const t = useT();
  const { user } = useAppStore();
  const [stats, setStats] = useState<UserStats>({
    streak: 0, rank: 0, accuracy: 0, xp: 0,
    lessonsToday: 0, totalLessons: 5, displayName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, xp, streak, rank, accuracy, lessons_today, total_lessons')
          .eq('id', user.id)
          .single();
        if (profile) {
          setStats({
            streak: profile.streak ?? 0,
            rank: profile.rank ?? 0,
            accuracy: profile.accuracy ?? 0,
            xp: profile.xp ?? 0,
            lessonsToday: profile.lessons_today ?? 0,
            totalLessons: profile.total_lessons ?? 5,
            displayName: profile.display_name ?? user.email?.split('@')[0] ?? 'மாணவர்',
          });
        }
      } catch (e) {
        console.error('Stats fetch failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const statCards = [
    { icon: Flame,  value: stats.streak,                  label: t('நாள் தொடர்ச்சி','Day Streak'),  color: 'text-orange-400',   bg: 'bg-orange-400/10' },
    { icon: Trophy, value: stats.rank ? `#${stats.rank}` : '—', label: t('தரவரிசை','Rank'),        color: 'text-cyan-400',     bg: 'bg-cyan-400/10' },
    { icon: Star,   value: stats.accuracy ? `${stats.accuracy}%` : '—', label: t('துல்லியம்','Accuracy'), color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: Zap,    value: stats.xp.toLocaleString(),      label: 'XP',                              color: 'text-purple-400',   bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {t('வணக்கம்', 'Welcome')}{stats.displayName ? `, ${stats.displayName}` : ''}!
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {t('TNPSC தேர்வு வெற்றி பெற — ஆரம்பிக்கலாம்', 'Ready to ace TNPSC — lets go')}
          </p>
        </motion.div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0,1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(({ icon: Icon, value, label, color, bg }) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827] border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className={`text-2xl font-bold ${color}`}>{value || '0'}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Today Progress */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">{t('இன்றைய இலக்கு', "Today's Goal")}</p>
            <p className="text-xs text-gray-400">{stats.lessonsToday}/{stats.totalLessons} {t('பாடங்கள்', 'lessons')}</p>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.totalLessons ? (stats.lessonsToday / stats.totalLessons) * 100 : 0}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-brand-primary rounded-full"
            />
          </div>
          {stats.streak > 0 && (
            <p className="text-xs text-orange-400 mt-2">🔥 {stats.streak} {t('நாள் தொடர்ச்சி!', 'day streak!')}</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/ai-tutor',        icon: Brain,    label: t('AI ஆசிரியரிடம் கேள்', 'Ask AI Tutor'),          color: 'text-brand-primary' },
            { to: '/tests',           icon: Target,   label: t('மாக் தேர்வு தொடங்கு', 'Start Mock Test'),        color: 'text-cyan-400' },
            { to: '/current-affairs', icon: TrendingUp, label: t('இன்றைய நடப்பு நிகழ்வுகள் படிக்கவும்', 'Read Current Affairs'), color: 'text-green-400' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}
              className="bg-[#111827] border border-white/10 hover:border-brand-primary/40 rounded-xl p-4 flex items-center gap-3 transition-colors group">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
              <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-brand-primary transition-colors" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
