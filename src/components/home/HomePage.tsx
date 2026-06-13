import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Crown, Shield, ShieldCheck, FileText, Landmark, Wrench, TreePine,
  ChevronRight, Trophy, Flame, Star,
  ArrowRight, Bell, Sparkles, Target, Brain
} from 'lucide-react';
import { useAppStore, useT } from '../../store';
import { EXAM_GROUPS } from '../../lib/types';
import { MOCK_QUESTIONS, MOCK_NOTIFICATIONS, MOCK_CURRENT_AFFAIRS, MOCK_LEADERBOARD } from '../../lib/data';
import { formatNumber } from '../../lib/utils';

const ICON_MAP: Record<string, React.FC<any>> = {
  Crown, Shield, ShieldCheck, FileText, Landmark, Wrench, TreePine,
  Siren: Shield,
};

const stagger = {
  container: { transition: { staggerChildren: 0.1 } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
};

function HeroSection() {
  const t = useT();
  const navigate = useNavigate();
  const { isAuthenticated, language, setLanguage } = useAppStore();
  const [typewriter, setTypewriter] = useState('');
  const phrases = ['Group 1', 'Group 2', 'Group 2A', 'Group 4', 'VAO', 'Engineering Services'];
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = phrases[phraseRef.current];
      if (!deletingRef.current) {
        charRef.current++;
        setTypewriter(current.substring(0, charRef.current));
        if (charRef.current === current.length) {
          deletingRef.current = true;
          setTimeout(() => {}, 1500);
        }
      } else {
        charRef.current--;
        setTypewriter(current.substring(0, charRef.current));
        if (charRef.current === 0) {
          deletingRef.current = false;
          phraseRef.current = (phraseRef.current + 1) % phrases.length;
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const liveUsers = 12453 + Math.floor(Math.random() * 50);
  const testsToday = 8234 + Math.floor(Math.random() * 30);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl" />
        {/* Geometric Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000">
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-medium text-brand-primary">
                {t('AI-ஆல் இயக்கப்படும் இலவச தளம்', 'AI-Powered Free Platform')}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
              <span className="tamil text-white">
                {t('வணக்கம்!', 'Welcome!')}
              </span>
              <br />
              <span className="text-gray-300 text-2xl sm:text-3xl font-medium">
                {t('TNPSC தேர்வு வெற்றி பெற', 'Crack TNPSC exams')}
              </span>
              <br />
              <span className="text-gray-400 text-xl sm:text-2xl font-medium">
                {t('ஆரம்பிக்கலாம் —', 'Start preparing for —')}
              </span>
              <br />
              <span className="text-gradient-gold text-3xl sm:text-4xl font-bold font-mono">
                {typewriter}
                <span className="animate-pulse text-brand-primary">|</span>
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              {t(
                'AI ஆசிரியர், மாக் தேர்வுகள், நடப்பு நிகழ்வுகள், முந்தைய வினாக்கள் — எல்லாம் முற்றிலும் இலவசம். தமிழில் கற்கலாம்.',
                'AI Tutor, Mock Tests, Current Affairs, Previous Year Questions — everything completely free. Learn in Tamil.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* Language Switcher */}
              <div className="flex items-center bg-navy-800 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setLanguage('TAMIL')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    language === 'TAMIL'
                      ? 'bg-brand-primary text-navy-950 shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setLanguage('ENGLISH')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    language === 'ENGLISH'
                      ? 'bg-brand-primary text-navy-950 shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
              <Link to="/exams" className="btn-secondary flex items-center justify-center gap-2">
                {t('தேர்வுகளைப் பார்', 'Explore Exams')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Live Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-gray-400">
                  <span className="text-white font-semibold">{formatNumber(liveUsers)}</span> {t('மாணவர்கள் இப்போது', 'studying now')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-secondary" />
                <span className="text-gray-400">
                  <span className="text-white font-semibold">{formatNumber(testsToday)}</span> {t('தேர்வுகள் இன்று', 'tests today')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Stats Card */}
              <div className="bg-glass rounded-2xl p-6 ring-glow-gold">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                    <Flame className="w-6 h-6 text-brand-primary mb-2" />
                    <p className="text-2xl font-bold text-white">7</p>
                    <p className="text-xs text-gray-400">{t('நாள் தொடர்ச்சி', 'Day Streak')}</p>
                  </div>
                  <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                    <Trophy className="w-6 h-6 text-brand-secondary mb-2" />
                    <p className="text-2xl font-bold text-white">#42</p>
                    <p className="text-xs text-gray-400">{t('தரவரிசை', 'Rank')}</p>
                  </div>
                  <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                    <Star className="w-6 h-6 text-success mb-2" />
                    <p className="text-2xl font-bold text-white">87%</p>
                    <p className="text-xs text-gray-400">{t('துல்லியம்', 'Accuracy')}</p>
                  </div>
                  <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                    <Brain className="w-6 h-6 text-brand-accent mb-2" />
                    <p className="text-2xl font-bold text-white">2,340</p>
                    <p className="text-xs text-gray-400">XP</p>
                  </div>
                </div>

                {/* Mini progress */}
                <div className="mt-4 bg-[#111827] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{t('இன்றைய இலக்கு', "Today's Goal")}</span>
                    <span className="text-xs text-brand-primary font-medium">3/5 {t('பாடங்கள்', 'lessons')}</span>
                  </div>
                  <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand-primary to-amber-400 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-glass rounded-lg px-3 py-2 border border-brand-primary/20"
              >
                <span className="text-xs text-brand-primary font-medium">+50 XP 🎯</span>
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-3 -left-3 bg-glass rounded-lg px-3 py-2 border border-brand-secondary/20"
              >
                <span className="text-xs text-brand-secondary font-medium">{t('7 நாள் தொடர்ச்சி!', '7-day streak! 🔥')}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NotificationTicker() {
  const t = useT();
  const notifications = MOCK_NOTIFICATIONS;

  return (
    <section className="border-y border-white/5 bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 py-3 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <Bell className="w-4 h-4 text-brand-primary animate-pulse" />
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
              {t('TNPSC அறிவிப்புகள்', 'TNPSC Alerts')}
            </span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-8 animate-scroll-left whitespace-nowrap">
              {[...notifications, ...notifications].map((n, i) => (
                <Link
                  key={`${n.id}-${i}`}
                  to={`/notifications/${n.id}`}
                  className={`inline-flex items-center gap-2 text-sm transition-colors ${
                    n.isUrgent ? 'text-red-400 font-medium' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {n.isUrgent && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                  {t(n.titleTamil, n.title)}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExamCards() {
  const t = useT();
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {t('தேர்வைத் தேர்வு செய்க', 'Choose Your Exam')}
          </h2>
          <p className="text-gray-400 text-sm">
            {t('உங்கள் இலக்கு தேர்வுக்கான முழு தயாரிப்பு பொருட்களைப் பெறுங்கள்', 'Get complete preparation materials for your target exam')}
          </p>
        </div>

        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {EXAM_GROUPS.map((exam) => {
            const IconComp = ICON_MAP[exam.icon] || FileText;
            return (
              <motion.div
                key={exam.slug}
                variants={stagger.item}
                onClick={() => navigate(`/exams/${exam.slug.toLowerCase()}`)}
                className="group cursor-pointer"
              >
                <div className="card-glow relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${exam.color}15, transparent 70%)` }}
                  />
                  <div className="relative p-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ background: `${exam.color}15`, border: `1px solid ${exam.color}30` }}
                    >
                      <IconComp className="w-6 h-6" style={{ color: exam.color }} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-0.5">{exam.name}</h3>
                    <p className="tamil text-xs text-gray-500 mb-3">{exam.nameTamil}</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: exam.color }}>
                      <span>{t('தொடங்கு', 'Start')}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function DailyQuiz() {
  const t = useT();
  const { language } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const questions = MOCK_QUESTIONS.slice(0, 5);

  const handleSelect = (optId: string) => {
    if (selected) return;
    setSelected(optId);
    const isCorrect = questions[currentQ].options.find(o => o.id === optId)?.isCorrect;
    if (isCorrect) setScore(s => s + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const q = questions[currentQ];

  if (completed) {
    return (
      <section className="py-16 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <Trophy className="w-16 h-16 text-brand-primary mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {t('அன்றாட வினா முடிந்தது!', 'Daily Quiz Complete!')}
          </h3>
          <p className="text-lg text-gray-300 mb-4">
            {t(`${score}/5 சரியான பதில்கள்`, `${score}/5 correct answers`)}
          </p>
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <svg className="w-32 h-32 -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#1F2937" strokeWidth="8" />
              <circle cx="64" cy="64" r="56" fill="none" stroke="#F59E0B" strokeWidth="8"
                strokeDasharray={`${(score / 5) * 351.86} 351.86`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-brand-primary">
              {Math.round(score / 5 * 100)}%
            </span>
          </div>
          <Link to="/tests" className="btn-primary inline-flex items-center gap-2">
            {t('மேலும் தேர்வுகள்', 'More Tests')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-brand-secondary/5 to-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 mb-4">
            <Zap className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs font-medium text-brand-secondary">{t('அன்றாட வினா', 'Daily Quiz')}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{t('இன்றைய 5 வினாக்கள்', "Today's 5 Questions")}</h2>
          <p className="text-gray-400 text-sm mt-1">{t('இலவசமாக முயற்சிக்கலாம்', 'Try for free — no signup needed')}</p>
        </div>

        <div className="card-glow">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                i < currentQ ? 'bg-brand-primary' : i === currentQ ? 'bg-brand-primary/50' : 'bg-white/10'
              }`} />
            ))}
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-gold">{t(q.isPYQ ? 'PYQ' : 'பயிற்சி', q.isPYQ ? 'PYQ' : 'Practice')}</span>
              {q.year && <span className="badge-cyan">{q.year}</span>}
            </div>
            <h3 className="text-lg font-medium text-white leading-relaxed mb-1">
              <span className="tamil">{q.contentTamil}</span>
            </h3>
            {language === 'ENGLISH' && q.contentEnglish && (
              <p className="text-sm text-gray-400 mt-1">{q.contentEnglish}</p>
            )}
          </div>

          {/* Options */}
          <div className="grid gap-3 mb-6">
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrect = opt.isCorrect;
              let cls = 'bg-[#111827] border border-white/10 hover:border-white/20';
              if (showResult) {
                if (isCorrect) cls = 'bg-success/10 border border-success/40';
                else if (isSelected && !isCorrect) cls = 'bg-error/10 border border-error/40';
              } else if (isSelected) {
                cls = 'bg-brand-primary/10 border border-brand-primary/40';
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={showResult}
                  className={`${cls} rounded-xl px-4 py-3 text-left transition-all flex items-center gap-3 disabled:cursor-default`}
                >
                  <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-xs font-medium text-gray-400 shrink-0">
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="text-sm text-white tamil">{opt.textTamil}</span>
                  {language === 'ENGLISH' && opt.textEnglish && (
                    <span className="text-xs text-gray-500 ml-2">{opt.textEnglish}</span>
                  )}
                  {showResult && isCorrect && <Star className="w-4 h-4 text-success ml-auto" />}
                  {showResult && isSelected && !isCorrect && <XIcon className="w-4 h-4 text-error ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="bg-[#111827] border border-white/5 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-brand-secondary mb-1">{t('விளக்கம்', 'Explanation')}</p>
              <p className="text-sm text-gray-300 tamil">
                {language === 'TAMIL' ? (q.explanationTamil || q.explanation) : (q.explanation || q.explanationTamil)}
              </p>
            </motion.div>
          )}

          {/* Next */}
          {showResult && (
            <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              {currentQ < questions.length - 1 ? t('அடுத்த வினா', 'Next Question') : t('முடிக்க', 'Finish')}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CurrentAffairsPreview() {
  const t = useT();
  const { language } = useAppStore();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('நடப்பு நிகழ்வுகள்', 'Current Affairs')}</h2>
            <p className="text-sm text-gray-400 mt-1">{t('இன்றைய முக்கிய செய்திகள்', "Today's top stories")}</p>
          </div>
          <Link to="/current-affairs" className="btn-ghost flex items-center gap-1 text-sm">
            {t('அனைத்தையும் பார்', 'View All')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_CURRENT_AFFAIRS.slice(0, 3).map((ca, i) => (
            <motion.div
              key={ca.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card hover:border-brand-secondary/30 group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-cyan">{ca.category}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < ca.importanceLevel ? 'text-brand-primary fill-brand-primary' : 'text-gray-700'}`} />
                  ))}
                </div>
              </div>
              <h3 className="text-sm font-medium text-white mb-2 group-hover:text-brand-secondary transition-colors tamil">
                {language === 'TAMIL' ? ca.titleTamil : ca.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                {language === 'TAMIL' ? ca.summaryTamil : ca.summary}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                {t('மேலும் படி', 'Read more')} <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeaderboardPreview() {
  const t = useT();

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-brand-primary/3 to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('தரவரிசை', 'Leaderboard')}</h2>
            <p className="text-sm text-gray-400 mt-1">{t('இந்த வாரத்தின் சிறந்த மாணவர்கள்', 'This week\'s top performers')}</p>
          </div>
          <Link to="/leaderboard" className="btn-ghost flex items-center gap-1 text-sm">
            {t('முழு பட்டியல்', 'Full Board')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 gap-y-0 p-1">
            {MOCK_LEADERBOARD.slice(0, 7).map((entry, i) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`contents [&>*]:py-2.5 [&>*]:px-4 ${
                  i < MOCK_LEADERBOARD.length - 1 ? '[&>*]:border-b [&>*]:border-white/5' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    entry.rank === 1 ? 'bg-brand-primary/20 text-brand-primary' :
                    entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                    entry.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    {entry.rank}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30 rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {entry.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white tamil">{entry.name}</span>
                </div>
                <div className="flex items-center text-sm text-brand-primary font-mono font-semibold">
                  {entry.score.toFixed(1)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  {entry.accuracy}% {t('துல்லியம்', 'acc')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesComparison() {
  const t = useT();
  const features = [
    { name: t('AI ஆசிரியர்', 'AI Tutor'), arivu: true, testbook: false, winmeen: false },
    { name: t('மாக் தேர்வுகள்', 'Mock Tests'), arivu: true, testbook: true, winmeen: true },
    { name: t('நடப்பு நிகழ்வுகள்', 'Current Affairs'), arivu: true, testbook: true, winmeen: true },
    { name: t('தமிழ் மொழி ஆதரவு', 'Tamil Language'), arivu: true, testbook: false, winmeen: true },
    { name: t('தகவமைப்பு தேர்வு', 'Adaptive Testing'), arivu: true, testbook: false, winmeen: false },
    { name: t('இலவசம்', 'Free Forever'), arivu: true, testbook: false, winmeen: false },
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('ஏன் ARIVU AI?', 'Why ARIVU AI?')}
          </h2>
          <p className="text-gray-400 text-sm">{t('ஒப்பீடு பாருங்கள்', 'See the comparison')}</p>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-4 gap-0">
            {/* Header */}
            <div className="p-3 border-b border-white/10" />
            <div className="p-3 border-b border-brand-primary/30 text-center">
              <span className="text-sm font-bold text-brand-primary">ARIVU</span>
            </div>
            <div className="p-3 border-b border-white/10 text-center">
              <span className="text-sm font-medium text-gray-500">Testbook</span>
            </div>
            <div className="p-3 border-b border-white/10 text-center">
              <span className="text-sm font-medium text-gray-500">Winmeen</span>
            </div>

            {/* Rows */}
            {features.map((f) => (
              <>
                <div key={`${f.name}-label`} className="p-3 border-t border-white/5 text-sm text-gray-300">{f.name}</div>
                <div key={`${f.name}-arivu`} className="p-3 border-t border-brand-primary/20 text-center">
                  {f.arivu ? <span className="text-success text-lg">✓</span> : <span className="text-gray-600">—</span>}
                </div>
                <div key={`${f.name}-testbook`} className="p-3 border-t border-white/5 text-center">
                  {f.testbook ? <span className="text-success text-lg">✓</span> : <span className="text-error text-lg">✗</span>}
                </div>
                <div key={`${f.name}-winmeen`} className="p-3 border-t border-white/5 text-center">
                  {f.winmeen ? <span className="text-success text-lg">✓</span> : <span className="text-error text-lg">✗</span>}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NotificationTicker />
      <ExamCards />
      <DailyQuiz />
      <CurrentAffairsPreview />
      <LeaderboardPreview />
      <FeaturesComparison />
    </>
  );
}
