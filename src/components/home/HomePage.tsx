import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Crown, Shield, ShieldCheck, FileText, Landmark, Wrench, TreePine,
  ChevronRight, Trophy, Flame, Star, ArrowRight, Bell, Sparkles, Target,
  Brain, Play, BookOpen, CheckCircle2, Award, Clock, RefreshCw, HelpCircle,
  Twitter, Globe
} from 'lucide-react';
import { useAppStore, useT } from '../../store';
import { EXAM_GROUPS } from '../../lib/types';
import { MOCK_QUESTIONS, MOCK_NOTIFICATIONS, MOCK_CURRENT_AFFAIRS, MOCK_LEADERBOARD } from '../../lib/data';
import { formatNumber } from '../../lib/utils';

const ICON_MAP: Record<string, React.FC<any>> = {
  Crown, Shield, ShieldCheck, FileText, Landmark, Wrench, TreePine, Siren: Shield,
};

function HeroSection() {
  const t = useT();
  const navigate = useNavigate();
  const { language, isAuthenticated } = useAppStore();
  const [typewriter, setTypewriter] = useState('');
  const phrases = ['Group 1', 'Group 2', 'Group 2A', 'Group 4', 'VAO', 'Engineering Services'];
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = phrases[phraseRef.current];
      if (!deletingRef.current) {
        charRef.current++;
        setTypewriter(current.substring(0, charRef.current));
        if (charRef.current === current.length) {
          if (!pauseRef.current) {
            pauseRef.current = setTimeout(() => { deletingRef.current = true; pauseRef.current = null; }, 1500);
          }
          return;
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
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 dark:border-gray-800 py-16 lg:py-24">
      <div className="absolute inset-0 " />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600 mb-6 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('AI-ஆல் இயக்கப்படும் இலவச தளம்', 'AI-Powered Free TNPSC Platform')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
              <span className="text-red-600 block mb-3 font-semibold text-3xl sm:text-4xl tamil">
                {t('வணக்கம்!', 'Welcome!')}
              </span>
              <span className="text-gray-800">{t('TNPSC வெற்றிக்கு', 'Crack TNPSC')}</span>
              <span className="text-red-600 block mt-2 h-16 font-mono">
                {typewriter}
                <span className="animate-pulse font-normal">|</span>
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t(
                'AI ஆசிரியர், மாக் தேர்வுகள், நடப்பு நிகழ்வுகள், முந்தைய வினாக்கள் — எல்லாம் முற்றிலும் இலவசம்.',
                'AI Tutor, Mock Tests, Current Affairs, Previous Year Questions — everything completely free.'
              )}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/ai-tutor" className="btn-primary w-full sm:w-auto text-base py-3 px-8 shadow-sm">
                <Play className="w-4 h-4 fill-current" />
                {t('AI ஆசிரியரை முயற்சி', 'Try AI Tutor Free')}
              </Link>
              <Link to="/exams" className="btn-secondary w-full sm:w-auto text-base py-3 px-8">
                <BookOpen className="w-4 h-4" />
                {t('தேர்வுகளைப் பார்', 'Explore Exams')}
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span><strong className="text-gray-800 dark:text-white">{formatNumber(liveUsers)}</strong> {t('மாணவர்கள் இப்போது', 'studying now')}</span>
              </div>
              <div className="h-4 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span><strong className="text-gray-800 dark:text-white">{formatNumber(testsToday)}</strong> {t('தேர்வுகள் இன்று', 'tests today')}</span>
              </div>
            </div>
          </div>

          {/* Right - Stats Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {!isAuthenticated && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-2xl">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">{t('Login to see your progress', 'Login to see your progress')}</p>
                <Link to="/auth/login" className="btn-primary text-sm py-2 px-5">{t('Login', 'Login')}</Link>
              </div>
            )}
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t('தொடர்ச்சி', 'Day Streak')}</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white">7 {t('நாட்கள்', 'Days')} 🔥</p>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-4 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t('தரம்', 'State Rank')}</p>
                  <p className="text-sm font-extrabold text-gray-800 dark:text-white">#42 (Group 4)</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    ARIVU Profiler
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t('துல்லியம்', 'Accuracy')}</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800 dark:text-white">87%</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold text-gray-400 uppercase">XP</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800 dark:text-white">2,340</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-gray-500 uppercase">{t('இன்றைய இலக்கு', "Today's Goal")}</span>
                    <span className="text-red-600 font-extrabold">3/5 {t('பாடங்கள்', 'lessons')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-red-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotificationTicker() {
  const t = useT();
  const notifications = MOCK_NOTIFICATIONS;
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 overflow-hidden">
        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-lg border border-red-100 text-xs font-extrabold uppercase tracking-widest whitespace-nowrap shrink-0">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>{t('TNPSC அறிவிப்புகள்', 'TNPSC ALERTS')}</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-8 animate-scroll-left whitespace-nowrap">
            {[...notifications, ...notifications].map((n, i) => (
              <Link key={`${n.id}-${i}`} to={`/notifications/${n.id}`}
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${n.isUrgent ? 'text-red-600' : 'text-gray-600 dark:text-gray-300 hover:text-red-600'}`}>
                {n.isUrgent && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                {t(n.titleTamil, n.title)}
                <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamCards() {
  const t = useT();
  const navigate = useNavigate();
  return (
    <section className="bg-white dark:bg-gray-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white dark:text-white tracking-tight">
            {t('தேர்வைத் தேர்வு செய்க', 'Choose Your Exam')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
            {t('உங்கள் இலக்கு தேர்வுக்கான முழு தயாரிப்பு பொருட்களைப் பெறுங்கள்', 'Get complete preparation materials for your target exam')}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {EXAM_GROUPS.map((exam) => {
            const IconComp = ICON_MAP[exam.icon] || FileText;
            return (
              <div key={exam.slug} onClick={() => navigate(`/exams/${exam.slug.toLowerCase()}`)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-800 p-5 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{ background: `${exam.color}15`, border: `1px solid ${exam.color}30` }}>
                    <IconComp className="w-6 h-6" style={{ color: exam.color }} />
                  </div>
                  <h3 className="text-base font-extrabold text-gray-800 dark:text-white mb-0.5">{exam.name}</h3>
                  <p className="tamil text-xs text-gray-400 mb-3">{exam.nameTamil}</p>
                </div>
                <button className="w-full py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{ background: `${exam.color}15`, color: exam.color }}>
                  {t('தொடங்கு', 'Start')}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
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

  const questions = useMemo(() => {
    const mulberry32 = (seed: number) => {
      return () => {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    let userSeed = Number(localStorage.getItem('arivu_quiz_seed'));
    if (!userSeed) { userSeed = Math.floor(Math.random() * 1000000); localStorage.setItem('arivu_quiz_seed', String(userSeed)); }
    const rand = mulberry32(dateSeed + userSeed);
    const pool = [...MOCK_QUESTIONS];
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    return pool.slice(0, Math.min(10, pool.length));
  }, []);

  const handleSelect = (optId: string) => {
    if (selected) return;
    setSelected(optId);
    const isCorrect = questions[currentQ].options.find(o => o.id === optId)?.isCorrect;
    if (isCorrect) setScore(s => s + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setSelected(null); setShowResult(false); }
    else setCompleted(true);
  };

  const q = questions[currentQ];

  if (completed) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 py-16 border-t border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Trophy className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white dark:text-white mb-2">{t('அன்றாட வினா முடிந்தது!', 'Daily Quiz Complete!')}</h3>
          <p className="text-lg text-gray-600 mb-6">{score}/{questions.length} {t('சரியான பதில்கள்', 'correct answers')}</p>
          <Link to="/tests" className="btn-primary inline-flex">
            {t('மேலும் தேர்வுகள்', 'More Tests')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 border-t border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="badge-cyan mb-3">{t('அன்றாட வினா', 'Daily Quiz')}</span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white dark:text-white tracking-tight">{t('இன்றைய வினாக்கள்', "Today's Questions")}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{t('இலவசமாக முயற்சிக்கலாம்', 'Try for free — no signup needed')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < currentQ ? 'bg-red-500' : i === currentQ ? 'bg-red-300' : 'bg-gray-200'}`} />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
              {t(q.isPYQ ? 'PYQ' : 'பயிற்சி', q.isPYQ ? 'PYQ' : 'Practice')}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 60s</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> +10 XP</span>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-gray-800 dark:text-white leading-snug mb-6 tamil">{q.contentTamil}</h3>
          {language === 'ENGLISH' && q.contentEnglish && <p className="text-sm text-gray-500 mb-4">{q.contentEnglish}</p>}

          <div className="space-y-3 mb-6">
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrect = opt.isCorrect;
              let cls = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-red-300 hover:bg-red-50/30 text-gray-700 dark:text-gray-200';
              if (showResult) {
                if (isCorrect) cls = 'bg-green-50 border-green-400 text-green-800 font-bold';
                else if (isSelected && !isCorrect) cls = 'bg-red-50 border-red-300 text-red-800 font-bold';
                else cls = 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 opacity-70';
              } else if (isSelected) cls = 'bg-red-50 border-red-400 text-red-800 font-bold';
              return (
                <button key={opt.id} onClick={() => handleSelect(opt.id)} disabled={!!showResult}
                  className={`${cls} w-full rounded-xl px-4 py-3 text-left transition-all flex items-center justify-between text-sm`}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="tamil">{opt.textTamil}</span>
                  </div>
                  {showResult && isCorrect && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">✗</span>}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <HelpCircle className={`w-4 h-4 mt-0.5 ${selected && q.options.find(o=>o.id===selected)?.isCorrect ? 'text-green-600' : 'text-red-500'}`} />
                <div>
                  <h4 className="text-sm font-extrabold text-gray-800 dark:text-white mb-1">{t('விளக்கம்', 'Explanation')}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed tamil">
                    {language === 'TAMIL' ? (q.explanationTamil || q.explanation) : (q.explanation || q.explanationTamil)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showResult && (
            <button onClick={handleNext} className="btn-primary w-full">
              {currentQ < questions.length - 1 ? t('அடுத்த வினா', 'Next Question') : t('முடிக்க', 'Finish')}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function CurrentAffairsPreview() {
  const t = useT();
  const { language } = useAppStore();
  return (
    <section className="bg-white dark:bg-gray-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="badge-cyan mb-2">{t('தகவல் களஞ்சியம்', 'Daily Updates')}</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white dark:text-white tracking-tight mt-2">
              {t('நடப்பு நிகழ்வுகள்', 'Current Affairs')}
            </h2>
          </div>
          <Link to="/current-affairs" className="text-red-600 hover:text-red-700 font-extrabold text-sm flex items-center gap-1 group whitespace-nowrap">
            {t('அனைத்தையும் பார்', 'View All')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CURRENT_AFFAIRS.slice(0, 3).map((ca, i) => (
            <motion.div key={ca.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{ca.category}</span>
                <h3 className="font-extrabold text-gray-800 dark:text-white mt-3 text-base leading-snug line-clamp-2 tamil">
                  {language === 'TAMIL' ? ca.titleTamil : ca.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed line-clamp-3">
                  {language === 'TAMIL' ? ca.summaryTamil : ca.summary}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < ca.importanceLevel ? 'text-red-500 fill-red-500' : 'text-gray-200'}`} />
                  ))}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
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
    <section className="bg-gray-50 dark:bg-gray-900 py-16 border-t border-gray-100 dark:border-gray-700 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white dark:text-white tracking-tight">{t('தரவரிசை', 'Leaderboard')}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{t('இந்த வாரத்தின் சிறந்த மாணவர்கள்', "This week's top performers")}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
          <div className="space-y-3">
            {MOCK_LEADERBOARD.slice(0, 5).map((entry, i) => (
              <div key={entry.userId} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                entry.rank === 1 ? 'bg-red-50 border-red-100' :
                entry.rank === 2 ? 'bg-gray-50 border-gray-200' :
                entry.rank === 3 ? 'bg-amber-50 border-amber-100' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold ${
                    entry.rank === 1 ? 'bg-red-600 text-white' :
                    entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    entry.rank === 3 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{entry.rank}</span>
                  <div>
                    <h4 className="font-extrabold text-gray-900 dark:text-white text-sm tamil">{entry.name}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{entry.accuracy}% {t('துல்லியம்', 'accuracy')}</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-gray-800 dark:text-white">{entry.score.toFixed(1)} XP</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/leaderboard" className="text-red-600 hover:text-red-700 font-extrabold text-sm flex items-center justify-center gap-1">
              {t('முழு பட்டியல்', 'Full Leaderboard')} <ArrowRight className="w-4 h-4" />
            </Link>
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
    <section className="bg-white dark:bg-gray-950 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white dark:text-white tracking-tight">{t('ஏன் ARIVU AI?', 'Why ARIVU AI?')}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">{t('ஒப்பீடு பாருங்கள்', 'See the comparison')}</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 text-sm font-bold text-gray-600 dark:text-gray-300">{t('வசதிகள்', 'Features')}</th>
                <th className="p-4 text-sm font-extrabold text-red-600 bg-red-50 border-x border-red-100">ARIVU AI</th>
                <th className="p-4 text-sm font-bold text-gray-400 dark:text-gray-500">Testbook</th>
                <th className="p-4 text-sm font-bold text-gray-400 dark:text-gray-500">Winmeen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.map((f) => (
                <Fragment key={f.name}>
                  <tr>
                    <td className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{f.name}</td>
                    <td className="p-4 text-sm font-extrabold bg-red-50/30 dark:bg-red-950/30 border-x border-red-100 dark:border-red-900 text-center">
                      {f.arivu ? <span className="text-green-600">✓</span> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="p-4 text-center">{f.testbook ? <span className="text-green-600">✓</span> : <span className="text-red-400">✗</span>}</td>
                    <td className="p-4 text-center">{f.winmeen ? <span className="text-green-600">✓</span> : <span className="text-red-400">✗</span>}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
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
