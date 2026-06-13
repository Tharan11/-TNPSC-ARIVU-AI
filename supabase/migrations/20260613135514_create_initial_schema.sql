-- TNPSC ARIVU AI Database Schema

-- Enums
CREATE TYPE user_role AS ENUM ('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE auth_provider AS ENUM ('EMAIL', 'GOOGLE', 'OTP', 'GUEST');
CREATE TYPE lang_enum AS ENUM ('TAMIL', 'ENGLISH');
CREATE TYPE exam_group AS ENUM ('GROUP_1', 'GROUP_2', 'GROUP_2A', 'GROUP_4', 'VAO', 'ENGINEERING', 'FOREST', 'POLICE');
CREATE TYPE difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD');
CREATE TYPE test_type AS ENUM ('TOPIC', 'SUBJECT', 'FULL_MOCK', 'GRAND', 'DAILY', 'ADAPTIVE');
CREATE TYPE attempt_status AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EVALUATED', 'ABANDONED');
CREATE TYPE question_type AS ENUM ('MCQ', 'MULTI_SELECT', 'MATCH', 'ASSERTION', 'FILL');
CREATE TYPE question_source AS ENUM ('ADMIN', 'AI_GENERATED', 'PYQ', 'COMMUNITY');
CREATE TYPE ca_category AS ENUM ('NATIONAL', 'INTERNATIONAL', 'TAMILNADU', 'ECONOMY', 'SCIENCE', 'ENVIRONMENT', 'SPORTS', 'POLITICS', 'SCHEME');
CREATE TYPE notif_type AS ENUM ('RECRUITMENT', 'HALL_TICKET', 'RESULT', 'ANSWER_KEY', 'INTERVIEW', 'EXAM_DATE', 'VACANCY');
CREATE TYPE ai_mode AS ENUM ('CHAT', 'VOICE', 'PDF_QA', 'NOTE_GEN', 'MCQ_GEN', 'STUDY_PLAN');
CREATE TYPE post_type AS ENUM ('DOUBT', 'DISCUSSION', 'RESOURCE', 'ANNOUNCEMENT', 'ACHIEVEMENT');
CREATE TYPE achievement_category AS ENUM ('STREAK', 'ACCURACY', 'SPEED', 'COMMUNITY', 'MILESTONE', 'EXAM_GROUP', 'SPECIAL');
CREATE TYPE rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  name TEXT NOT NULL,
  name_in_tamil TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'STUDENT',
  auth_provider auth_provider DEFAULT 'EMAIL',
  google_id TEXT UNIQUE,
  password_hash TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  preferred_lang lang_enum DEFAULT 'TAMIL',
  target_exam exam_group,
  target_year INTEGER,
  state TEXT,
  district TEXT,
  qualification TEXT,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  total_study_mins INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_target_exam ON users(target_exam);
CREATE INDEX idx_users_xp ON users(xp);

-- Exams table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_tamil TEXT NOT NULL,
  exam_grp exam_group NOT NULL,
  description TEXT NOT NULL,
  eligibility JSONB,
  pattern JSONB,
  syllabus JSONB,
  cutoffs JSONB,
  vacancy_count INTEGER,
  application_start TIMESTAMPTZ,
  application_end TIMESTAMPTZ,
  exam_date TIMESTAMPTZ,
  result_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_tamil TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exam-Subject junction
CREATE TABLE exam_subjects (
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  weight INTEGER DEFAULT 1,
  PRIMARY KEY (exam_id, subject_id)
);

-- Topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  name_tamil TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  difficulty difficulty DEFAULT 'MEDIUM',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_topics_subject ON topics(subject_id);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id),
  exam_group exam_group,
  year INTEGER,
  paper_code TEXT,
  question_no INTEGER,
  type question_type DEFAULT 'MCQ',
  content_tamil TEXT NOT NULL,
  content_english TEXT,
  options JSONB NOT NULL,
  explanation TEXT,
  explanation_tamil TEXT,
  difficulty difficulty DEFAULT 'MEDIUM',
  tags TEXT[] DEFAULT '{}',
  source question_source DEFAULT 'ADMIN',
  is_pyq BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE INDEX idx_questions_exam_year ON questions(exam_group, year);
CREATE INDEX idx_questions_is_pyq ON questions(is_pyq);

-- Tests table
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id),
  title TEXT NOT NULL,
  title_tamil TEXT,
  type test_type NOT NULL,
  duration INTEGER NOT NULL,
  total_marks DECIMAL NOT NULL,
  negative_marks DECIMAL DEFAULT 0.33,
  pass_percent DECIMAL DEFAULT 40,
  max_attempts INTEGER,
  is_published BOOLEAN DEFAULT false,
  is_adaptive BOOLEAN DEFAULT false,
  scheduled_at TIMESTAMPTZ,
  created_by_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_tests_type ON tests(type);
CREATE INDEX idx_tests_published ON tests(is_published);

-- Test-Question junction
CREATE TABLE test_questions (
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  marks DECIMAL DEFAULT 1,
  PRIMARY KEY (test_id, question_id)
);

-- Test Attempts table
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  test_id UUID REFERENCES tests(id) NOT NULL,
  status attempt_status DEFAULT 'IN_PROGRESS',
  started_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  time_taken INTEGER,
  score DECIMAL,
  total_marks DECIMAL,
  accuracy DECIMAL,
  rank INTEGER,
  percentile DECIMAL,
  answers JSONB DEFAULT '[]',
  analytics JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_attempts_user ON test_attempts(user_id);
CREATE INDEX idx_attempts_test ON test_attempts(test_id);
CREATE INDEX idx_attempts_score ON test_attempts(score);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  title_tamil TEXT,
  lesson_type TEXT DEFAULT 'TEXT',
  content TEXT,
  content_tamil TEXT,
  video_url TEXT,
  duration INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Current Affairs table
CREATE TABLE current_affairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  category ca_category NOT NULL,
  title TEXT NOT NULL,
  title_tamil TEXT,
  content TEXT NOT NULL,
  content_tamil TEXT,
  summary TEXT,
  summary_tamil TEXT,
  importance_level INTEGER DEFAULT 1 CHECK (importance_level BETWEEN 1 AND 5),
  sources TEXT[] DEFAULT '{}',
  mcqs JSONB,
  tags TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ca_date ON current_affairs(date);
CREATE INDEX idx_ca_category ON current_affairs(category);

-- TNPSC Notifications table
CREATE TABLE tnpsc_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id),
  type notif_type NOT NULL,
  title TEXT NOT NULL,
  title_tamil TEXT,
  description TEXT,
  source_url TEXT NOT NULL,
  document_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  application_start TIMESTAMPTZ,
  application_end TIMESTAMPTZ,
  exam_date TIMESTAMPTZ,
  hall_ticket_date TIMESTAMPTZ,
  result_date TIMESTAMPTZ,
  vacancy INTEGER,
  is_verified BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notif_type ON tnpsc_notifications(type);
CREATE INDEX idx_notif_published ON tnpsc_notifications(published_at);

-- User Notifications table
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tnpsc_notification_id UUID REFERENCES tnpsc_notifications(id),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_notif_user ON user_notifications(user_id);

-- AI Conversations table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type ai_mode DEFAULT 'CHAT',
  title TEXT,
  messages JSONB DEFAULT '[]',
  model TEXT DEFAULT 'gpt-4o',
  total_tokens INTEGER DEFAULT 0,
  cost DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_conv_user ON ai_conversations(user_id);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES topics(id),
  title TEXT NOT NULL,
  content TEXT,
  is_bookmarked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_notes_user ON notes(user_id);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

-- Study Plans table
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  exam_group exam_group NOT NULL,
  target_date DATE NOT NULL,
  daily_hours DECIMAL DEFAULT 4,
  weekly_days INTEGER DEFAULT 6,
  plan JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  progress DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_tamil TEXT NOT NULL,
  description TEXT NOT NULL,
  desc_tamil TEXT NOT NULL,
  icon TEXT NOT NULL,
  category achievement_category NOT NULL,
  condition JSONB NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 0,
  badge_url TEXT,
  rarity rarity DEFAULT 'COMMON',
  is_active BOOLEAN DEFAULT true
);

-- User Achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Rank History table
CREATE TABLE rank_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  exam_group exam_group,
  rank INTEGER NOT NULL,
  total_users INTEGER NOT NULL,
  percentile DECIMAL,
  period TEXT NOT NULL,
  score DECIMAL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rank_user_period ON rank_history(user_id, period);

-- Community Posts table
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type post_type DEFAULT 'DISCUSSION',
  group_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_tamil TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_solved BOOLEAN DEFAULT false,
  is_moderated BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_user ON community_posts(user_id);
CREATE INDEX idx_posts_type ON community_posts(type);

-- Community Replies table
CREATE TABLE community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  content_tamil TEXT,
  upvotes INTEGER DEFAULT 0,
  is_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_replies_post ON community_replies(post_id);

-- Flash Cards table
CREATE TABLE flash_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  front_tamil TEXT NOT NULL,
  front_english TEXT,
  back_tamil TEXT NOT NULL,
  back_english TEXT,
  difficulty difficulty DEFAULT 'MEDIUM',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mind Maps table
CREATE TABLE mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  title_tamil TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions table for auth
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token_hash TEXT NOT NULL,
  device_info JSONB,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnpsc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for content tables
CREATE POLICY "read_exams" ON exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_exams_anon" ON exams FOR SELECT TO anon USING (true);
CREATE POLICY "read_subjects" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_subjects_anon" ON subjects FOR SELECT TO anon USING (true);
CREATE POLICY "read_topics" ON topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_topics_anon" ON topics FOR SELECT TO anon USING (true);
CREATE POLICY "read_questions" ON questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_tests_published" ON tests FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "read_tests_published_anon" ON tests FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "read_lessons" ON lessons FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "read_lessons_anon" ON lessons FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "read_current_affairs" ON current_affairs FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "read_current_affairs_anon" ON current_affairs FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "read_tnpsc_notifications" ON tnpsc_notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_tnpsc_notifications_anon" ON tnpsc_notifications FOR SELECT TO anon USING (true);
CREATE POLICY "read_community_posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "read_community_replies" ON community_replies FOR SELECT USING (true);
CREATE POLICY "read_achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "read_flash_cards" ON flash_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_mind_maps" ON mind_maps FOR SELECT TO authenticated USING (true);

-- RLS Policies: User-scoped tables
CREATE POLICY "select_own_user" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "update_own_user" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "select_own_attempts" ON test_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_attempts" ON test_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_attempts" ON test_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_progress" ON progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_progress" ON progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_progress" ON progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_notifications" ON user_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_notifications" ON user_notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_notifications" ON user_notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_conversations" ON ai_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_conversations" ON ai_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_conversations" ON ai_conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_notes" ON notes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_notes" ON notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_notes" ON notes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_notes" ON notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "select_own_bookmarks" ON bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_bookmarks" ON bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_bookmarks" ON bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "select_own_plans" ON study_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_plans" ON study_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_plans" ON study_plans FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_rank" ON rank_history FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_posts" ON community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_posts" ON community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "insert_own_replies" ON community_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_replies" ON community_replies FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "select_own_sessions" ON sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "delete_own_sessions" ON sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "admin_insert_tests" ON tests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_tests" ON tests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_insert_questions" ON questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_questions" ON questions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_insert_lessons" ON lessons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_lessons" ON lessons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_insert_current_affairs" ON current_affairs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_current_affairs" ON current_affairs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_insert_tnpsc_notifications" ON tnpsc_notifications FOR INSERT TO authenticated WITH CHECK (true);
