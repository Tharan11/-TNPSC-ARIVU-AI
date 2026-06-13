import type { Question, CurrentAffair, TnpscNotification, LeaderboardEntry, Achievement, Exam } from './types';

export const MOCK_EXAMS: Exam[] = [
  {
    id: '1', slug: 'group-1', name: 'TNPSC Group 1', nameTamil: 'TNPSC குரூப் 1',
    group: 'GROUP_1', description: 'Deputy Collector, DSP, District Registrar and other senior posts',
    vacancyCount: 68, examDate: '2026-08-15',
  },
  {
    id: '2', slug: 'group-2', name: 'TNPSC Group 2', nameTamil: 'TNPSC குரூப் 2',
    group: 'GROUP_2', description: 'Sub-Registrar, Municipal Commissioner, Assistant Section Officer',
    vacancyCount: 120, examDate: '2026-07-20',
  },
  {
    id: '3', slug: 'group-2a', name: 'TNPSC Group 2A', nameTamil: 'TNPSC குரூப் 2A',
    group: 'GROUP_2A', description: 'Personal Clerk, Assistant Section Officer (Non-Interview)',
    vacancyCount: 95, examDate: '2026-09-10',
  },
  {
    id: '4', slug: 'group-4', name: 'TNPSC Group 4', nameTamil: 'TNPSC குரூப் 4',
    group: 'GROUP_4', description: 'Village Administrative Officer, Junior Assistant, Bill Collector',
    vacancyCount: 2500, examDate: '2026-06-28',
  },
  {
    id: '5', slug: 'vao', name: 'TNPSC VAO', nameTamil: 'TNPSC வ.அ.ஒ',
    group: 'VAO', description: 'Village Administrative Officer',
    vacancyCount: 500, examDate: '2026-10-05',
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1', type: 'MCQ',
    contentTamil: 'தமிழ்நாட்டின் தலைநகர் எது?',
    contentEnglish: 'What is the capital of Tamil Nadu?',
    options: [
      { id: 'a', textTamil: 'சென்னை', textEnglish: 'Chennai', isCorrect: true },
      { id: 'b', textTamil: 'கோயம்புத்தூர்', textEnglish: 'Coimbatore', isCorrect: false },
      { id: 'c', textTamil: 'மதுரை', textEnglish: 'Madurai', isCorrect: false },
      { id: 'd', textTamil: 'திருச்சிராப்பள்ளி', textEnglish: 'Tiruchirappalli', isCorrect: false },
    ],
    explanationTamil: 'தமிழ்நாட்டின் தலைநகர் சென்னை ஆகும். இது மாநிலத்தின் மிகப்பெரிய நகரமும் ஆகும்.',
    explanation: 'Chennai is the capital of Tamil Nadu and also the largest city in the state.',
    difficulty: 'EASY', isPYQ: true, year: 2020,
  },
  {
    id: 'q2', type: 'MCQ',
    contentTamil: 'வேதாரண்யம் உப்பு சத்தியாகிரகம் எந்த ஆண்டு நடந்தது?',
    contentEnglish: 'In which year did the Vedaranyam Salt Satyagraha take place?',
    options: [
      { id: 'a', textTamil: '1928', textEnglish: '1928', isCorrect: false },
      { id: 'b', textTamil: '1930', textEnglish: '1930', isCorrect: true },
      { id: 'c', textTamil: '1932', textEnglish: '1932', isCorrect: false },
      { id: 'd', textTamil: '1935', textEnglish: '1935', isCorrect: false },
    ],
    explanationTamil: 'ராஜாஜி தலைமையில் 1930-ல் வேதாரண்யம் உப்பு சத்தியாகிரகம் நடைபெற்றது.',
    explanation: 'The Vedaranyam Salt Satyagraha was led by Rajaji in 1930, inspired by Gandhi\'s Dandi March.',
    difficulty: 'MEDIUM', isPYQ: true, year: 2022,
  },
  {
    id: 'q3', type: 'MCQ',
    contentTamil: 'பூமியில் அதிக நீர் கொண்ட பெருங்கடல் எது?',
    contentEnglish: 'Which is the largest ocean on Earth?',
    options: [
      { id: 'a', textTamil: 'அட்லாண்டிக் பெருங்கடல்', textEnglish: 'Atlantic Ocean', isCorrect: false },
      { id: 'b', textTamil: 'இந்தியப் பெருங்கடல்', textEnglish: 'Indian Ocean', isCorrect: false },
      { id: 'c', textTamil: 'பசிபிக் பெருங்கடல்', textEnglish: 'Pacific Ocean', isCorrect: true },
      { id: 'd', textTamil: 'ஆர்க்டிக் பெருங்கடல்', textEnglish: 'Arctic Ocean', isCorrect: false },
    ],
    explanationTamil: 'பசிபிக் பெருங்கடல் உலகின் மிகப்பெரிய பெருங்கடல் ஆகும்.',
    explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
    difficulty: 'EASY', isPYQ: false,
  },
  {
    id: 'q4', type: 'MCQ',
    contentTamil: 'இந்திய அரசியலமைப்பின் பகுதி 21 எதனைப் பற்றியது?',
    contentEnglish: 'What does Part 21 of the Indian Constitution deal with?',
    options: [
      { id: 'a', textTamil: 'அரசியலமைப்பு திருத்தங்கள்', textEnglish: 'Constitutional Amendments', isCorrect: false },
      { id: 'b', textTamil: 'தற்காலிக, இடைக்கால, சிறப்பு விதிகள்', textEnglish: 'Temporary, Transitional & Special Provisions', isCorrect: true },
      { id: 'c', textTamil: 'தேர்தல் விதிகள்', textEnglish: 'Election Rules', isCorrect: false },
      { id: 'd', textTamil: 'அடிப்படை உரிமைகள்', textEnglish: 'Fundamental Rights', isCorrect: false },
    ],
    explanationTamil: 'பகுதி 21 தற்காலிக, இடைக்கால மற்றும் சிறப்பு விதிகளைப் பற்றியது.',
    difficulty: 'HARD', isPYQ: true, year: 2021,
  },
  {
    id: 'q5', type: 'MCQ',
    contentTamil: 'தமிழ்நாட்டில் அதிக மக்கள்தொகை கொண்ட மாவட்டம் எது?',
    contentEnglish: 'Which is the most populous district in Tamil Nadu?',
    options: [
      { id: 'a', textTamil: 'சென்னை', textEnglish: 'Chennai', isCorrect: true },
      { id: 'b', textTamil: 'விருதுநகர்', textEnglish: 'Virudhunagar', isCorrect: false },
      { id: 'c', textTamil: 'தூத்துக்குடி', textEnglish: 'Thoothukudi', isCorrect: false },
      { id: 'd', textTamil: 'நாமக்கல்', textEnglish: 'Namakkal', isCorrect: false },
    ],
    explanationTamil: '2011 மக்கள்தொகை கணக்கெடுப்பின்படி சென்னை மாவட்டமே அதிக மக்கள்தொகை கொண்டது.',
    difficulty: 'MEDIUM', isPYQ: true, year: 2019,
  },
];

export const MOCK_CURRENT_AFFAIRS: CurrentAffair[] = [
  {
    id: 'ca1', date: '2026-06-13', category: 'TAMILNADU',
    title: 'Tamil Nadu Launches New Free Laptop Scheme for College Students',
    titleTamil: 'தமிழ்நாடு கல்லூரி மாணவர்களுக்கு புதிய இலவச மடிக்கணினி திட்டத்தை தொடங்கியது',
    summary: 'TN govt announces free laptops for 5 lakh college students under the "Kalaignar Magalir Urimai" scheme extension.',
    summaryTamil: 'தமிழக அரசு "கலைஞர் மகளிர் உரிமை" திட்ட விரிவாக்கத்தின் கீழ் 5 லட்சம் கல்லூரி மாணவர்களுக்கு இலவச மடிக்கணினி அறிவித்தது.',
    importanceLevel: 4,
  },
  {
    id: 'ca2', date: '2026-06-13', category: 'NATIONAL',
    title: 'India GDP Growth at 7.2% in Q1 FY27',
    titleTamil: 'இந்தியா 2027-ம் நிதியாண்டு முதல் காலாண்டில் 7.2% GDP வளர்ச்சி',
    summary: 'India records 7.2% GDP growth in Q1 FY27, driven by manufacturing and services sectors.',
    summaryTamil: 'உற்பத்தி மற்றும் சேவைத் துறைகளால் இயக்கப்பட்டு இந்தியா 7.2% GDP வளர்ச்சியைப் பதிவு செய்தது.',
    importanceLevel: 3,
  },
  {
    id: 'ca3', date: '2026-06-12', category: 'SCHEME',
    title: 'PM Vishwakarma Scheme Extended to 2029',
    titleTamil: 'PM விஸ்வகர்மா திட்டம் 2029 வரை நீட்டிக்கப்பட்டது',
    summary: 'Central govt extends PM Vishwakarma Scheme for artisans and craftspeople till 2029 with increased allocation.',
    summaryTamil: 'மத்திய அரகு கைவினைஞர்களுக்கான PM விஸ்வகர்மா திட்டத்தை அதிகரிக்கப்பட்ட ஒதுக்கீட்டுடன் 2029 வரை நீட்டித்தது.',
    importanceLevel: 4,
  },
  {
    id: 'ca4', date: '2026-06-12', category: 'ECONOMY',
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%',
    titleTamil: 'RBI ரெப்போ விகிதத்தை 6.5%-ல் மாற்றமின்றி வைத்திருக்கிறது',
    summary: 'Reserve Bank of India maintains repo rate at 6.5% citing stable inflation outlook.',
    summaryTamil: 'நிலையான பணவீக்க கண்ணோட்டத்தை மேற்கோள்காட்டி RBI ரெப்போ விகிதத்தை 6.5%-ல் நிலைநிறுத்தியது.',
    importanceLevel: 3,
  },
  {
    id: 'ca5', date: '2026-06-11', category: 'SCIENCE',
    title: 'ISRO Launches Next-Gen Navigation Satellite',
    titleTamil: 'ISRO அடுத்த தலைமுறை வழிசெலுத்தல் செய்மதியை ஏவியது',
    summary: 'ISRO successfully launches NVS-02 navigation satellite from Sriharikota, enhancing India\'s GPS capabilities.',
    summaryTamil: 'ISRO ஸ்ரீஹரிக்கோட்டாவிலிருந்து NVS-02 வழிசெலுத்தல் செய்மதியை வெற்றிகரமாக ஏவியது.',
    importanceLevel: 4,
  },
];

export const MOCK_NOTIFICATIONS: TnpscNotification[] = [
  {
    id: 'n1', type: 'RECRUITMENT',
    title: 'TNPSC Group 4 Recruitment 2026 — 2500 Vacancies',
    titleTamil: 'TNPSC குரூப் 4 ஆட்சேர்ப்பு 2026 — 2500 காலிப்பணியிடங்கள்',
    description: 'Online application open for Group 4 posts including VAO, Junior Assistant, Bill Collector',
    sourceUrl: '#', publishedAt: '2026-06-10',
    examDate: '2026-08-28', vacancy: 2500, isUrgent: true,
  },
  {
    id: 'n2', type: 'EXAM_DATE',
    title: 'Group 2 Exam Date Announced — July 20, 2026',
    titleTamil: 'குரூப் 2 தேர்வு தேதி அறிவிக்கப்பட்டது — ஜூலை 20, 2026',
    sourceUrl: '#', publishedAt: '2026-06-09',
    examDate: '2026-07-20', isUrgent: false,
  },
  {
    id: 'n3', type: 'RESULT',
    title: 'Group 2A Written Exam Result Published',
    titleTamil: 'குரூப் 2A எழுத்துத் தேர்வு முடிவு வெளியிடப்பட்டது',
    sourceUrl: '#', publishedAt: '2026-06-08', isUrgent: false,
  },
  {
    id: 'n4', type: 'HALL_TICKET',
    title: 'VAO Exam Hall Tickets Available for Download',
    titleTamil: 'VAO தேர்வு ஹால் டிக்கெட் பதிவிறக்கம் கிடைக்கிறது',
    sourceUrl: '#', publishedAt: '2026-06-07', isUrgent: true,
  },
  {
    id: 'n5', type: 'ANSWER_KEY',
    title: 'Group 1 Prelims Answer Key Released',
    titleTamil: 'குரூப் 1 முன்தேர்வு விடை வெளியிடப்பட்டது',
    sourceUrl: '#', publishedAt: '2026-06-05', isUrgent: false,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'கார்த்திக் குமார்', score: 98.5, accuracy: 96 },
  { rank: 2, userId: 'u2', name: 'பிரியா ரமேஷ்', score: 97.2, accuracy: 94 },
  { rank: 3, userId: 'u3', name: 'Arjun Selvan', score: 96.8, accuracy: 93 },
  { rank: 4, userId: 'u4', name: 'தீபா சந்திரன்', score: 95.5, accuracy: 91 },
  { rank: 5, userId: 'u5', name: 'Vikram Rajan', score: 94.1, accuracy: 89 },
  { rank: 6, userId: 'u6', name: 'முருகன் பாண்டியன்', score: 93.7, accuracy: 88 },
  { rank: 7, userId: 'u7', name: 'Lakshmi Narayanan', score: 92.3, accuracy: 87 },
  { rank: 8, userId: 'u8', name: 'சங்கர் கிருஷ்ணன்', score: 91.0, accuracy: 85 },
  { rank: 9, userId: 'u9', name: 'Meena Subramaniam', score: 90.2, accuracy: 84 },
  { rank: 10, userId: 'u10', name: 'கவின் பிரசாத்', score: 89.5, accuracy: 83 },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'Beginnings', nameTamil: 'தொடக்கம்', description: 'Complete your first lesson', descTamil: 'உங்கள் முதல் பாடத்தை முடிக்கவும்', icon: 'Play', xpReward: 10, rarity: 'COMMON' },
  { id: 'a2', name: 'On Fire', nameTamil: 'நெருப்பு', description: '7-day study streak', descTamil: '7 நாள் படிப்புத் தொடர்ச்சி', icon: 'Flame', xpReward: 200, rarity: 'RARE' },
  { id: 'a3', name: 'Gold Standard', nameTamil: 'தங்கம்', description: 'Top 1% in any mock test', descTamil: 'எந்த மாக் தேர்விலும் முதல் 1%', icon: 'Trophy', xpReward: 500, rarity: 'EPIC' },
  { id: 'a4', name: 'Questioner', nameTamil: 'கேள்வி வீரர்', description: 'Ask 50 community questions', descTamil: '50 சமூக கேள்விகளைக் கேட்கவும்', icon: 'HelpCircle', xpReward: 100, rarity: 'RARE' },
  { id: 'a5', name: 'Helper', nameTamil: 'உதவியாளர்', description: 'Get 100 upvotes in community', descTamil: 'சமூகத்தில் 100 வாக்குகள்', icon: 'Heart', xpReward: 200, rarity: 'RARE' },
  { id: 'a6', name: 'Scholar', nameTamil: 'ஆய்வாளர்', description: 'Read 365 daily current affairs', descTamil: '365 அன்றாட நிகழ்வுகளைப் படிக்கவும்', icon: 'BookOpen', xpReward: 1000, rarity: 'LEGENDARY' },
];
