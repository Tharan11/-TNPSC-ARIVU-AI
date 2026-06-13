export type Language = 'TAMIL' | 'ENGLISH';
export type ExamGroup = 'GROUP_1' | 'GROUP_2' | 'GROUP_2A' | 'GROUP_4' | 'VAO' | 'ENGINEERING' | 'FOREST' | 'POLICE';
export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';
export type TestType = 'TOPIC' | 'SUBJECT' | 'FULL_MOCK' | 'GRAND' | 'DAILY' | 'ADAPTIVE';
export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'ABANDONED';
export type AIMode = 'CHAT' | 'VOICE' | 'PDF_QA' | 'NOTE_GEN' | 'MCQ_GEN' | 'STUDY_PLAN';
export type CACategory = 'NATIONAL' | 'INTERNATIONAL' | 'TAMILNADU' | 'ECONOMY' | 'SCIENCE' | 'ENVIRONMENT' | 'SPORTS' | 'POLITICS' | 'SCHEME';
export type NotifType = 'RECRUITMENT' | 'HALL_TICKET' | 'RESULT' | 'ANSWER_KEY' | 'INTERVIEW' | 'EXAM_DATE' | 'VACANCY';

export interface User {
  id: string;
  email: string;
  name: string;
  nameInTamil?: string;
  avatarUrl?: string;
  role: UserRole;
  preferredLang: Language;
  targetExam?: ExamGroup;
  xp: number;
  coins: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyMins: number;
}

export interface Exam {
  id: string;
  slug: string;
  name: string;
  nameTamil: string;
  group: ExamGroup;
  description: string;
  vacancyCount?: number;
  examDate?: string;
  resultDate?: string;
}

export interface Subject {
  id: string;
  name: string;
  nameTamil: string;
  slug: string;
  icon?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  nameTamil: string;
  slug: string;
  difficulty: Difficulty;
}

export interface Question {
  id: string;
  type: 'MCQ';
  contentTamil: string;
  contentEnglish?: string;
  options: QuestionOption[];
  explanation?: string;
  explanationTamil?: string;
  difficulty: Difficulty;
  isPYQ: boolean;
  year?: number;
}

export interface QuestionOption {
  id: string;
  textTamil: string;
  textEnglish?: string;
  isCorrect: boolean;
}

export interface Test {
  id: string;
  title: string;
  titleTamil?: string;
  type: TestType;
  duration: number;
  totalMarks: number;
  negativeMarks: number;
  questionCount: number;
  isPublished: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  status: AttemptStatus;
  score?: number;
  totalMarks?: number;
  accuracy?: number;
  rank?: number;
  timeTaken?: number;
  answers: AnswerRecord[];
  analytics?: AttemptAnalytics;
}

export interface AnswerRecord {
  questionId: string;
  selectedOption: string | null;
  isCorrect: boolean;
  timeTaken: number;
}

export interface AttemptAnalytics {
  subjectWise: { subject: string; correct: number; total: number; accuracy: number }[];
  topicWise: { topic: string; correct: number; total: number; accuracy: number }[];
  timeAnalysis: { avgTime: number; maxTime: number; minTime: number };
}

export interface CurrentAffair {
  id: string;
  date: string;
  category: CACategory;
  title: string;
  titleTamil: string;
  summary: string;
  summaryTamil: string;
  importanceLevel: number;
}

export interface TnpscNotification {
  id: string;
  type: NotifType;
  title: string;
  titleTamil: string;
  description?: string;
  sourceUrl: string;
  publishedAt: string;
  examDate?: string;
  vacancy?: number;
  isUrgent: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  nameTamil: string;
  description: string;
  descTamil: string;
  icon: string;
  xpReward: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  score: number;
  accuracy: number;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface StudyPlan {
  id: string;
  examGroup: ExamGroup;
  targetDate: string;
  dailyHours: number;
  plan: StudyDay[];
  progress: number;
}

export interface StudyDay {
  date: string;
  topics: string[];
  hours: number;
  isComplete: boolean;
}

export const EXAM_GROUPS: { slug: ExamGroup; name: string; nameTamil: string; icon: string; color: string }[] = [
  { slug: 'GROUP_1', name: 'Group 1', nameTamil: 'குரூப் 1', icon: 'Crown', color: '#F59E0B' },
  { slug: 'GROUP_2', name: 'Group 2', nameTamil: 'குரூப் 2', icon: 'Shield', color: '#06B6D4' },
  { slug: 'GROUP_2A', name: 'Group 2A', nameTamil: 'குரூப் 2A', icon: 'ShieldCheck', color: '#10B981' },
  { slug: 'GROUP_4', name: 'Group 4', nameTamil: 'குரூப் 4', icon: 'FileText', color: '#3B82F6' },
  { slug: 'VAO', name: 'VAO', nameTamil: 'வ.அ.ஒ', icon: 'Landmark', color: '#8B5CF6' },
  { slug: 'ENGINEERING', name: 'Engineering', nameTamil: 'பொறியியல்', icon: 'Wrench', color: '#EC4899' },
  { slug: 'FOREST', name: 'Forest', nameTamil: 'வனத்துறை', icon: 'TreePine', color: '#22C55E' },
  { slug: 'POLICE', name: 'Police', nameTamil: 'காவல்துறை', icon: 'Siren', color: '#EF4444' },
];

export const LEVEL_TIERS = [
  { level: 1, xp: 0, title: 'மாணவர்', titleEn: 'Student' },
  { level: 5, xp: 500, title: 'கற்பவர்', titleEn: 'Learner' },
  { level: 10, xp: 2000, title: 'அறிஞர்', titleEn: 'Scholar' },
  { level: 20, xp: 10000, title: 'மேதை', titleEn: 'Genius' },
  { level: 30, xp: 30000, title: 'வல்லுனர்', titleEn: 'Expert' },
  { level: 50, xp: 100000, title: 'சாதனையாளர்', titleEn: 'Achiever' },
  { level: 100, xp: 500000, title: 'தலைவர்', titleEn: 'Leader' },
];

export const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  TOPIC_COMPLETE: 50,
  DAILY_QUIZ_PERFECT: 30,
  MOCK_SUBMIT: 25,
  MOCK_TOP_10: 100,
  STREAK_7: 200,
  STREAK_30: 1000,
  COMMUNITY_HELP: 5,
  UPVOTE_RECEIVED: 10,
  FIRST_TEST_SUBJECT: 20,
  READ_DAILY_CA: 5,
};
