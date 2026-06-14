import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, ChevronLeft, ChevronRight, Flag, X, CheckCircle, AlertCircle, Target, Trophy, BarChart3, ArrowLeft, RotateCcw
} from 'lucide-react';
import { useT } from '../store';
import type { Test, TestAttempt } from '../lib/types';
import { MOCK_QUESTIONS } from '../lib/data';
import { formatTime, cn } from '../lib/utils';

type TestMode = 'HUB' | 'ACTIVE' | 'RESULTS';
type FilterType = 'All' | 'FULL_MOCK' | 'DAILY' | 'TOPIC' | 'SUBJECT' | 'ADAPTIVE' | 'GRAND';

// Mock test data
const MOCK_TESTS: Test[] = [
  {
    id: 't1',
    title: 'Full Model Test 1',
    titleTamil: 'முழு மாதிரி தேர்வு 1',
    type: 'FULL_MOCK',
    duration: 180,
    totalMarks: 100,
    negativeMarks: 1 / 3,
    questionCount: 100,
    isPublished: true,
  },
  {
    id: 't2',
    title: 'Daily Quiz - Current Affairs',
    titleTamil: 'தினசரி வினா - நிகழ்வுகள்',
    type: 'DAILY',
    duration: 15,
    totalMarks: 10,
    negativeMarks: 0,
    questionCount: 10,
    isPublished: true,
  },
  {
    id: 't3',
    title: 'History - Mughal Period',
    titleTamil: 'வரலாறு - முகலாய காலம்',
    type: 'TOPIC',
    duration: 45,
    totalMarks: 30,
    negativeMarks: 1 / 3,
    questionCount: 30,
    isPublished: true,
  },
  {
    id: 't4',
    title: 'Geography Full Subject',
    titleTamil: 'புவியியல் முழு பாடம்',
    type: 'SUBJECT',
    duration: 90,
    totalMarks: 50,
    negativeMarks: 1 / 3,
    questionCount: 50,
    isPublished: true,
  },
  {
    id: 't5',
    title: 'Adaptive Learning Test',
    titleTamil: 'தகவமைப்பு கற்றல் தேர்வு',
    type: 'ADAPTIVE',
    duration: 60,
    totalMarks: 40,
    negativeMarks: 1 / 3,
    questionCount: 40,
    isPublished: true,
  },
  {
    id: 't6',
    title: 'Grand Finals Mock 2026',
    titleTamil: 'மிகப்பெரிய இறுதி மாக் 2026',
    type: 'GRAND',
    duration: 180,
    totalMarks: 100,
    negativeMarks: 1 / 3,
    questionCount: 100,
    isPublished: true,
  },
];

// Mock result for demo
const MOCK_RESULT: TestAttempt = {
  id: 'att1',
  testId: 't1',
  status: 'SUBMITTED',
  score: 78,
  totalMarks: 100,
  accuracy: 78,
  rank: 1245,
  timeTaken: 9300,
  answers: [],
  analytics: {
    subjectWise: [
      { subject: 'Tamil', correct: 8, total: 10, accuracy: 80 },
      { subject: 'English', correct: 6, total: 10, accuracy: 60 },
      { subject: 'History', correct: 10, total: 15, accuracy: 100 },
      { subject: 'Geography', correct: 18, total: 25, accuracy: 72 },
      { subject: 'Polity', correct: 20, total: 25, accuracy: 80 },
      { subject: 'Science', correct: 16, total: 15, accuracy: 53 },
    ],
    topicWise: [
      { topic: 'Medieval History', correct: 8, total: 10, accuracy: 80 },
      { topic: 'Physical Geography', correct: 12, total: 15, accuracy: 80 },
      { topic: 'Indian Polity', correct: 20, total: 25, accuracy: 80 },
    ],
    timeAnalysis: { avgTime: 93, maxTime: 180, minTime: 30 },
  },
};

const typeColorMap: Record<string, { bg: string; text: string; label: string }> = {
  FULL_MOCK: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Full Mock' },
  DAILY: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Daily' },
  TOPIC: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Topic' },
  SUBJECT: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Subject' },
  ADAPTIVE: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Adaptive' },
  GRAND: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Grand' },
};

function TestHub({ tests, onStart }: { tests: Test[]; onStart: (test: Test) => void }) {
  const t = useT();
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = tests.filter((test) => filter === 'All' || test.type === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Filter Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {['All', 'FULL_MOCK', 'DAILY', 'TOPIC', 'SUBJECT', 'ADAPTIVE', 'GRAND'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as FilterType)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all',
              filter === f ? 'bg-brand-primary text-black' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
            )}
          >
            {f === 'All' ? t('அனைத்து', 'All') : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((test, idx) => {
          const typeInfo = typeColorMap[test.type];
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card hover:card-glow transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{test.title}</h3>
                  <p className="text-xs text-gray-400 tamil">{test.titleTamil}</p>
                </div>
                <span className={cn('px-2.5 py-1 rounded text-xs font-medium', typeInfo.bg, typeInfo.text)}>
                  {typeInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock size={16} className="text-brand-primary" />
                  <span>{test.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Target size={16} className="text-brand-secondary" />
                  <span>{test.totalMarks} marks</span>
                </div>
                <div className="text-xs text-gray-400">
                  <span>{test.questionCount} questions</span>
                </div>
                <div className="text-xs text-gray-400">
                  <span>
                    {test.negativeMarks > 0
                      ? `-1/${Math.round(1 / (test.negativeMarks as number))}`
                      : t('எதிர்மறை மதிப்பெண் இல்லை', 'No negative marking')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onStart(test)}
                className="w-full btn-primary py-2 text-sm"
              >
                {t('தேர்வ தொடங்க', 'Start Test')}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function QuestionPalette({ totalQuestions, currentIdx, answers, onSelectQ }: {
  totalQuestions: number;
  currentIdx: number;
  answers: Record<string, string | null>;
  onSelectQ: (idx: number) => void;
}) {
  return (
    <div className="card h-full overflow-y-auto max-h-[calc(100vh-200px)]">
      <h3 className="font-bold text-white mb-3">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const answered = !!answers[`q${i + 1}`];
          const marked = false; // In real app, track marked separately
          const visited = true; // Assume all are visited in this demo

          let bgColor = 'bg-gray-600'; // Not visited
          if (answered && marked) bgColor = 'bg-brand-primary'; // Marked
          else if (answered) bgColor = 'bg-success'; // Answered
          else if (visited) bgColor = 'bg-brand-secondary'; // Visited

          return (
            <button
              key={i}
              onClick={() => onSelectQ(i)}
              className={cn(
                'w-10 h-10 rounded-lg font-medium text-xs transition-all',
                i === currentIdx ? 'ring-2 ring-white' : '',
                bgColor,
                i === currentIdx ? 'text-black' : 'text-white'
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TestInterface({ test, onSubmit, onBack }: {
  test: Test;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const t = useT();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  const questions = MOCK_QUESTIONS.slice(0, Math.min(test.questionCount, MOCK_QUESTIONS.length));
  const currentQuestion = questions[currentIdx];
  const currentAnswer = answers[`q${currentIdx + 1}`];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [`q${currentIdx + 1}`]: optionId,
    }));
  };

  const handleMark = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentIdx)) next.delete(currentIdx);
      else next.add(currentIdx);
      return next;
    });
  };

  const handleClear = () => {
    setAnswers((prev) => ({
      ...prev,
      [`q${currentIdx + 1}`]: null,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  const timerColor = timeLeft < 300 ? 'text-red-400' : 'text-brand-primary';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col bg-[#0A0E1A]">
      {/* Top Bar */}
      <div className="bg-navy-800 border-b border-navy-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="btn-ghost p-2">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-white">{test.title}</h2>
            <p className="text-xs text-gray-400">{currentIdx + 1}/{questions.length}</p>
          </div>
        </div>
        <div className={cn('flex items-center gap-2 text-2xl font-mono font-bold', timerColor)}>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Left Panel - Question Palette */}
        <div className="hidden lg:block lg:col-span-1">
          <QuestionPalette
            totalQuestions={questions.length}
            currentIdx={currentIdx}
            answers={answers}
            onSelectQ={setCurrentIdx}
          />
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-2 flex flex-col overflow-y-auto">
          <div className="card flex-1 mb-4">
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">{t('கேள்வி', 'Question')} {currentIdx + 1}</p>
              <p className="text-lg font-semibold text-white mb-2 tamil">{currentQuestion.contentTamil}</p>
              {currentQuestion.contentEnglish && (
                <p className="text-sm text-gray-300">{currentQuestion.contentEnglish}</p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => {
                const optionLabel = String.fromCharCode(65 + idx);
                const isSelected = currentAnswer === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={cn(
                      'w-full p-3 rounded-lg border-2 text-left transition-all',
                      isSelected ? 'border-brand-primary bg-brand-primary/10' : 'border-navy-600 hover:border-navy-500'
                    )}
                  >
                    <span className="font-bold text-brand-primary">{optionLabel}.</span>
                    <span className="ml-2 text-gray-200 tamil">{option.textTamil}</span>
                    {option.textEnglish && (
                      <span className="block ml-5 text-xs text-gray-400">{option.textEnglish}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-xs">
              <button className="text-brand-secondary hover:text-brand-secondary/80 flex items-center gap-1">
                <AlertCircle size={14} />
                {t('சிக்கல் தெரிவிக்க', 'Report Issue')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Summary/Stats */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
          <div className="card">
            <h3 className="font-bold text-white mb-3">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>{t('பதிலளித்தது', 'Answered')}:</span>
                <span className="font-bold text-success">{Object.values(answers).filter(Boolean).length}/{questions.length}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>{t('பর்வுக்கு குறிப்பிடப்பட்ட', 'Marked')}:</span>
                <span className="font-bold text-brand-primary">{markedForReview.size}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-white mb-3 text-sm">Navigation</h3>
            <div className="space-y-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> {t('முந்தைய', 'Prev')}
              </button>
              <button
                onClick={handleNext}
                disabled={currentIdx === questions.length - 1}
                className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-2"
              >
                {t('அடுத்த', 'Next')} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-navy-800 border-t border-navy-700 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="btn-ghost flex items-center gap-1 text-sm"
        >
          <ChevronLeft size={16} /> {t('முந்தைய', 'Prev')}
        </button>

        <button
          onClick={handleMark}
          className={cn(
            'btn-secondary flex items-center gap-1 text-sm',
            markedForReview.has(currentIdx) ? 'ring-2 ring-brand-primary' : ''
          )}
        >
          <Flag size={16} /> {t('ஆய்வுக்கு குறிக்க', 'Mark')}
        </button>

        <button onClick={handleClear} className="btn-ghost flex items-center gap-1 text-sm">
          <X size={16} /> {t('பதிலை அழிக்க', 'Clear')}
        </button>

        <button onClick={onSubmit} className="btn-primary flex items-center gap-1 text-sm ml-auto">
          <CheckCircle size={16} /> {t('சமர्पણ', 'Submit')}
        </button>
      </div>
    </motion.div>
  );
}

function ResultsPage({ result, onRetake, onBack }: {
  result: TestAttempt;
  onRetake: () => void;
  onBack: () => void;
}) {
  const t = useT();

  const scorePct = ((result.score || 0) / (result.totalMarks || 100)) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference * (1 - scorePct / 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Score Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="card flex flex-col items-center py-8"
      >
        <div className="relative w-32 h-32 mb-4">
          <svg width="128" height="128" className="transform -rotate-90">
            <circle cx="64" cy="64" r="45" fill="none" stroke="#1E293B" strokeWidth="8" />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2 }}
            />
          </svg>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-3xl font-bold text-brand-primary"
              >
                {Math.round(result.score || 0)}
              </motion.div>
              <div className="text-xs text-gray-400">/{result.totalMarks}</div>
            </div>
          </motion.div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{t('மெய்நிறுவல் பெறப்பட்டது', 'Score Achieved')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('தரவரிசை', 'Rank')}: #{result.rank}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/20 rounded-lg">
              <Trophy size={20} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t('நির்ভুலতை', 'Accuracy')}</p>
              <p className="text-xl font-bold text-white">{result.accuracy}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-secondary/20 rounded-lg">
              <Clock size={20} className="text-brand-secondary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t('நேரம் எடுத்தவு', 'Time Taken')}</p>
              <p className="text-xl font-bold text-white">{formatTime(result.timeTaken || 0)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/20 rounded-lg">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t('சரியான', 'Correct')}</p>
              <p className="text-xl font-bold text-white">{Math.round((result.accuracy || 0) * (result.totalMarks || 100) / 100)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subject-wise Performance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-brand-primary" />
          {t('வாடை வாரி செயல்பாடு', 'Subject-wise Performance')}
        </h3>
        <div className="space-y-3">
          {result.analytics?.subjectWise.map((subject) => {
            const accuracy = subject.accuracy;
            return (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{subject.subject}</span>
                  <span className="text-xs font-medium text-brand-primary">
                    {subject.correct}/{subject.total} ({accuracy}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={cn(
                      'h-full rounded-full',
                      accuracy >= 80 ? 'bg-success' : accuracy >= 60 ? 'bg-brand-primary' : 'bg-warning'
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Weak Topics */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-warning" />
          {t('பலவீனமான தலைப்புகள்', 'Weak Topics')}
        </h3>
        <div className="space-y-2 text-sm">
          {result.analytics?.topicWise
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 3)
            .map((topic) => (
              <div key={topic.topic} className="flex items-center justify-between p-2 bg-navy-700/50 rounded">
                <span className="text-gray-300">{topic.topic}</span>
                <span className="text-warning font-medium">{topic.accuracy}% accuracy</span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="flex-1 btn-ghost flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> {t('தேர்வுகள்', 'Back to Tests')}
        </button>
        <button onClick={onRetake} className="flex-1 btn-primary flex items-center justify-center gap-2">
          <RotateCcw size={18} /> {t('மீண்டும் எடுக்க', 'Retake Test')}
        </button>
      </div>
    </motion.div>
  );
}

export default function TestPage() {
  const t = useT();
  const [mode, setMode] = useState<TestMode>('HUB');
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  const handleStartTest = (test: Test) => {
    setActiveTest(test);
    setMode('ACTIVE');
  };

  const handleSubmitTest = () => {
    setMode('RESULTS');
  };

  const handleRetake = () => {
    setMode('ACTIVE');
  };

  const handleBackToHub = () => {
    setMode('HUB');
    setActiveTest(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white p-4">
      <div className="max-w-7xl mx-auto">
        {mode === 'HUB' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{t('தேர்வு இடமணி', 'Test Hub')}</h1>
              <p className="text-gray-400">{t('உங்களுக்குப் பொருத்தமான தேர்வ தேர்ந்தெடுக்கவும்', 'Select a test to begin your assessment')}</p>
            </div>
            <TestHub tests={MOCK_TESTS} onStart={handleStartTest} />
          </div>
        )}

        {mode === 'ACTIVE' && activeTest && (
          <TestInterface
            test={activeTest}
            onSubmit={handleSubmitTest}
            onBack={handleBackToHub}
          />
        )}

        {mode === 'RESULTS' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('தேர்வு முடிவுகள்', 'Test Results')}</h1>
              <p className="text-gray-400">{t('உங்கள் செயல்பாட்டை பகுப்பாய்வு செய்க', 'Analyze your performance')}</p>
            </div>
            <ResultsPage
              result={MOCK_RESULT}
              onRetake={handleRetake}
              onBack={handleBackToHub}
            />
          </div>
        )}
      </div>
    </div>
  );
}
