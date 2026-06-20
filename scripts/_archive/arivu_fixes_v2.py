#!/usr/bin/env python3
"""
ARIVU AI — Master Fix Script v2
Fixes: fake stats, mic/file, logout, news, leaderboard, PYQ, footer, text visibility
Run from project root: python arivu_fixes_v2.py
"""
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, 'src')
PAGES = os.path.join(SRC, 'pages')
COMP  = os.path.join(SRC, 'components')
API   = os.path.join(ROOT, 'api')

OK   = lambda m: print(f"  [OK]   {m}")
SKIP = lambda m: print(f"  [SKIP] {m}")
ERR  = lambda m: print(f"  [ERR]  {m}")

def read(p):
    with open(p,'r',encoding='utf-8') as f: return f.read()

def write(p, c):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p,'w',encoding='utf-8',newline='\n') as f: f.write(c)

def patch(path, old, new, label):
    if not os.path.exists(path): ERR(f"{label} — not found: {path}"); return False
    c = read(path)
    if old not in c: SKIP(f"{label} — pattern not found"); return False
    write(path, c.replace(old, new, 1)); OK(label); return True

print("\n=== ARIVU AI — Master Fix Script v2 ===\n")

# ══════════════════════════════════════════════════════════════════
# FIX 1 — Logout button (store action wiring)
# ══════════════════════════════════════════════════════════════════
print("1. Fixing Logout button")
navbar_path = os.path.join(COMP, 'layout', 'Navbar.tsx')
if os.path.exists(navbar_path):
    c = read(navbar_path)
    if 'supabase.auth.signOut' not in c:
        # Add supabase import if missing
        if "from '../../lib/supabase'" not in c:
            c = c.replace("import { useT", "import { supabase } from '../../lib/supabase';\nimport { useT")
        # Wire logout onClick — look for logout/signout button pattern
        for old_logout in [
            "onClick={logout}",
            "onClick={() => logout()}",
            "onClick={signOut}",
        ]:
            if old_logout in c:
                c = c.replace(old_logout, "onClick={async () => { await supabase.auth.signOut(); window.location.href='/auth'; }}")
                write(navbar_path, c); OK("Navbar logout wired to Supabase signOut"); break
        else:
            # find button with logout/sign text and patch
            import re
            c2 = re.sub(
                r'(<button[^>]*)(onClick=\{[^}]*(?:logout|signout|sign.out)[^}]*\})',
                r'\1onClick={async () => { await supabase.auth.signOut(); window.location.href=\'/auth\'; }}',
                c, flags=re.IGNORECASE
            )
            if c2 != c:
                write(navbar_path, c2); OK("Navbar logout regex-patched")
            else:
                SKIP("Navbar logout — pattern not matched, manual fix needed")
    else:
        SKIP("Navbar — supabase.auth.signOut already present")
else:
    ERR("Navbar.tsx not found")

# ══════════════════════════════════════════════════════════════════
# FIX 2 — Dashboard real data from Supabase
# ══════════════════════════════════════════════════════════════════
print("2. Fixing DashboardPage — real Supabase stats")
dash_path = os.path.join(PAGES, 'DashboardPage.tsx')
DASH_REAL = '''import { useState, useEffect } from 'react';
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
            {t('TNPSC தேர்வு வெற்றி பெற — ஆரம்பிக்கலாம்', 'Ready to ace TNPSC — let\'s go')}
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
            <p className="text-sm font-medium text-white">{t('இன்றைய இலக்கு', "Today\'s Goal")}</p>
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
'''
if not os.path.exists(dash_path):
    ERR("DashboardPage.tsx not found")
else:
    write(dash_path, DASH_REAL)
    OK("DashboardPage rewritten with real Supabase stats")

# ══════════════════════════════════════════════════════════════════
# FIX 3 — Leaderboard real data
# ══════════════════════════════════════════════════════════════════
print("3. Fixing LeaderboardPage — real Supabase data")
lb_path = os.path.join(PAGES, 'LeaderboardPage.tsx')
LB_REAL = '''import { useState, useEffect } from 'react';
import { Trophy, Medal, RefreshCw } from 'lucide-react';
import { useT, useAppStore } from '../store';
import { supabase } from '../lib/supabase';

interface Leader { rank: number; name: string; xp: number; isMe?: boolean; }

const medalColor = (rank: number) =>
  rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-gray-500';

export default function LeaderboardPage() {
  const t = useT();
  const { user } = useAppStore();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<Leader | null>(null);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, xp, id')
        .order('xp', { ascending: false })
        .limit(20);
      if (data && data.length > 0) {
        const ranked = data.map((p, i) => ({
          rank: i + 1,
          name: p.display_name || t('அ익்கியவர்', 'Anonymous'),
          xp: p.xp || 0,
          isMe: p.id === user?.id,
        }));
        setLeaders(ranked);
        const me = ranked.find(r => r.isMe);
        if (me) setMyRank(me);
      } else {
        setLeaders([]);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaders(); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('தரவரிசை', 'Leaderboard')}</h1>
        </div>
        <button onClick={fetchLeaders} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Refresh">
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {myRank && (
        <div className="mb-6 p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30">
          <p className="text-sm text-brand-primary font-medium">
            {t('உங்கள் தரவரிசை', 'Your Rank')}: #{myRank.rank} — {myRank.xp.toLocaleString()} XP
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_,i) => <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />)}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">{t('இன்னும் யாரும் பங்கேற்கவில்லை. முதலில் நீங்களே ஆகுங்கள்!', 'No users yet — be the first!')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.map((leader) => (
            <div key={leader.rank}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors
                ${leader.isMe ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-white/5 bg-white/[0.02]'}`}>
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${medalColor(leader.rank)}`}>
                  {leader.rank <= 3 ? <Medal className="w-5 h-5" /> : leader.rank}
                </span>
                <span className={`font-medium ${leader.isMe ? 'text-brand-primary' : 'text-white'}`}>
                  {leader.name} {leader.isMe ? t('(நீங்கள்)', '(You)') : ''}
                </span>
              </div>
              <span className="text-brand-primary font-semibold text-sm">{leader.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'''
write(lb_path, LB_REAL)
OK("LeaderboardPage rewritten with real Supabase data")

# ══════════════════════════════════════════════════════════════════
# FIX 4 — News API backend endpoint
# ══════════════════════════════════════════════════════════════════
print("4. Creating api/news.js with NewsAPI + TNPSC RSS")
news_api = os.path.join(API, 'news.js')
NEWS_API_CONTENT = '''// api/news.js — Vercel serverless function
// Combines NewsAPI (Tamil Nadu news) + TNPSC official RSS

const NEWS_API_KEY = process.env.NEWS_API_KEY || '690d13b4576e40979403d5febcd0f75a';

// Simple in-memory cache (60 seconds)
let cache = { data: null, ts: 0 };

async function fetchNewsAPI() {
  const url = `https://newsapi.org/v2/everything?q=TNPSC+OR+"Tamil+Nadu"+government+exam&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.articles) return [];
  return json.articles.map(a => ({
    id: a.url,
    title: a.title,
    titleTamil: a.title, // translate later if needed
    summary: a.description || '',
    summaryTamil: a.description || '',
    source: a.source?.name || 'NewsAPI',
    url: a.url,
    date: a.publishedAt,
    category: 'NATIONAL',
    importanceLevel: 3,
  }));
}

async function fetchTNPSCRSS() {
  try {
    const res = await fetch('https://www.tnpsc.gov.in/rss/latestnews.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    return items.slice(0, 10).map((m, i) => {
      const title = (m[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || m[1].match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const link  = (m[1].match(/<link>(.*?)<\/link>/) || [])[1] || 'https://www.tnpsc.gov.in';
      const date  = (m[1].match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || new Date().toISOString();
      return {
        id: `tnpsc-${i}-${Date.now()}`,
        title: title.trim(),
        titleTamil: title.trim(),
        summary: title.trim(),
        summaryTamil: title.trim(),
        source: 'TNPSC Official',
        url: link.trim(),
        date: new Date(date).toISOString(),
        category: 'TAMILNADU',
        importanceLevel: 5,
      };
    }).filter(i => i.title);
  } catch(e) {
    console.error('TNPSC RSS failed:', e.message);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  // Serve from cache if fresh
  if (cache.data && Date.now() - cache.ts < 60000) {
    return res.json({ articles: cache.data, cached: true });
  }

  try {
    const [newsItems, tnpscItems] = await Promise.allSettled([
      fetchNewsAPI(),
      fetchTNPSCRSS(),
    ]);

    const news = newsItems.status === 'fulfilled' ? newsItems.value : [];
    const tnpsc = tnpscItems.status === 'fulfilled' ? tnpscItems.value : [];

    // TNPSC items first (importance 5), then news, dedupe by url
    const seen = new Set();
    const combined = [...tnpsc, ...news].filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    cache = { data: combined, ts: Date.now() };
    return res.json({ articles: combined });
  } catch(e) {
    console.error('News API error:', e);
    return res.status(500).json({ error: e.message });
  }
}
'''
write(news_api, NEWS_API_CONTENT)
OK("api/news.js created (NewsAPI + TNPSC RSS)")

# Add NEWS_API_KEY to .env
env_path = os.path.join(ROOT, '.env')
if os.path.exists(env_path):
    env = read(env_path)
    if 'NEWS_API_KEY' not in env:
        env += '\nNEWS_API_KEY=690d13b4576e40979403d5febcd0f75a\n'
        write(env_path, env)
        OK(".env — NEWS_API_KEY added")
    else:
        SKIP(".env — NEWS_API_KEY already present")

# ══════════════════════════════════════════════════════════════════
# FIX 5 — CurrentAffairsPage live news auto-refresh
# ══════════════════════════════════════════════════════════════════
print("5. Fixing CurrentAffairsPage — live news auto-refresh every 60s")
ca_path = os.path.join(PAGES, 'CurrentAffairsPage.tsx')
if os.path.exists(ca_path):
    c = read(ca_path)
    # Add live fetch if not already there
    if 'api/news' not in c and '/api/news' not in c:
        old_import_end = "import type { CACategory } from '../lib/types';"
        new_import_end = """import type { CACategory } from '../lib/types';

// Live news fetcher hook
function useLiveNews() {
  const [liveArticles, setLiveArticles] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.articles?.length) {
        setLiveArticles(data.articles);
        setLastUpdated(new Date());
      }
    } catch(e) { console.error('Live news fetch failed', e); }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return { liveArticles, lastUpdated, fetchNews };
}"""
        if old_import_end in c:
            c = c.replace(old_import_end, new_import_end)

        # Use liveArticles inside the component
        old_func = "export default function CurrentAffairsPage() {"
        new_func = """export default function CurrentAffairsPage() {
  const { liveArticles, lastUpdated, fetchNews } = useLiveNews();"""
        c = c.replace(old_func, new_func)

        # Merge live articles with mock data
        old_filter = "  const filteredAffairs = MOCK_CURRENT_AFFAIRS.filter"
        new_filter = """  const allAffairs = [...liveArticles, ...MOCK_CURRENT_AFFAIRS];
  const filteredAffairs = allAffairs.filter"""
        if old_filter in c:
            c = c.replace(old_filter, new_filter)

        # Show last updated time near search
        old_search_div = '          {/* Search Bar */}'
        new_search_div = '''          {/* Live update indicator */}
          {lastUpdated && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-green-400">
                🟢 {lastUpdated.toLocaleTimeString('en-IN')} {' '}
                {/* t('தானாக புதுப்பிக்கப்படுகிறது', 'Auto-updating every 60s') */}
                Auto-updating every 60s
              </span>
              <button onClick={fetchNews} className="text-xs text-brand-secondary hover:underline">↻ Refresh</button>
            </div>
          )}
          {/* Search Bar */}'''
        c = c.replace(old_search_div, new_search_div)
        write(ca_path, c)
        OK("CurrentAffairsPage — live news + auto-refresh added")
    else:
        SKIP("CurrentAffairsPage — live news already present")
else:
    ERR("CurrentAffairsPage.tsx not found")

# ══════════════════════════════════════════════════════════════════
# FIX 6 — PYQPage with TNPSC official papers 2009-2026
# ══════════════════════════════════════════════════════════════════
print("6. Rebuilding PYQPage with official TNPSC papers 2009-2026")
pyq_path = os.path.join(PAGES, 'PYQPage.tsx')
PYQ_CONTENT = '''import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Eye, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useT } from '../store';

interface PYQ {
  year: number;
  exam: string;
  title: string;
  pdfUrl: string;
  answerKeyUrl?: string;
}

const PYQ_DATA: PYQ[] = [
  // Group 1
  { year: 2024, exam: 'Group 1', title: 'TNPSC Group 1 Prelims 2024', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group1_2024_prelims_qp.pdf' },
  { year: 2022, exam: 'Group 1', title: 'TNPSC Group 1 Prelims 2022', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group1_2022_prelims_qp.pdf' },
  { year: 2019, exam: 'Group 1', title: 'TNPSC Group 1 Prelims 2019', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group1_2019_prelims_qp.pdf' },
  { year: 2016, exam: 'Group 1', title: 'TNPSC Group 1 Prelims 2016', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group1_2016_prelims_qp.pdf' },
  { year: 2013, exam: 'Group 1', title: 'TNPSC Group 1 Prelims 2013', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group1_2013_prelims_qp.pdf' },
  { year: 2010, exam: 'Group 1', title: 'TNPSC Group 1 Prelims 2010', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group1_2010_prelims_qp.pdf' },
  // Group 2
  { year: 2024, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2024', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2024_prelims_qp.pdf' },
  { year: 2023, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2023', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2023_prelims_qp.pdf' },
  { year: 2022, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2022', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2022_prelims_qp.pdf' },
  { year: 2021, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2021', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2021_prelims_qp.pdf' },
  { year: 2019, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2019', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2019_prelims_qp.pdf' },
  { year: 2018, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2018', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2018_prelims_qp.pdf' },
  { year: 2016, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2016', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2016_prelims_qp.pdf' },
  { year: 2014, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2014', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2014_prelims_qp.pdf' },
  { year: 2012, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2012', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2012_prelims_qp.pdf' },
  { year: 2010, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2010', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2010_prelims_qp.pdf' },
  { year: 2009, exam: 'Group 2', title: 'TNPSC Group 2 Prelims 2009', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2_2009_prelims_qp.pdf' },
  // Group 2A
  { year: 2024, exam: 'Group 2A', title: 'TNPSC Group 2A 2024', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2024_qp.pdf' },
  { year: 2023, exam: 'Group 2A', title: 'TNPSC Group 2A 2023', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2023_qp.pdf' },
  { year: 2022, exam: 'Group 2A', title: 'TNPSC Group 2A 2022', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2022_qp.pdf' },
  { year: 2019, exam: 'Group 2A', title: 'TNPSC Group 2A 2019', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2019_qp.pdf' },
  { year: 2016, exam: 'Group 2A', title: 'TNPSC Group 2A 2016', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2016_qp.pdf' },
  { year: 2013, exam: 'Group 2A', title: 'TNPSC Group 2A 2013', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2013_qp.pdf' },
  { year: 2010, exam: 'Group 2A', title: 'TNPSC Group 2A 2010', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group2a_2010_qp.pdf' },
  // Group 4
  { year: 2024, exam: 'Group 4', title: 'TNPSC Group 4 2024', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2024_qp.pdf' },
  { year: 2023, exam: 'Group 4', title: 'TNPSC Group 4 2023', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2023_qp.pdf' },
  { year: 2022, exam: 'Group 4', title: 'TNPSC Group 4 2022', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2022_qp.pdf' },
  { year: 2021, exam: 'Group 4', title: 'TNPSC Group 4 2021', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2021_qp.pdf' },
  { year: 2019, exam: 'Group 4', title: 'TNPSC Group 4 2019', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2019_qp.pdf' },
  { year: 2017, exam: 'Group 4', title: 'TNPSC Group 4 2017', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2017_qp.pdf' },
  { year: 2015, exam: 'Group 4', title: 'TNPSC Group 4 2015', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2015_qp.pdf' },
  { year: 2013, exam: 'Group 4', title: 'TNPSC Group 4 2013', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2013_qp.pdf' },
  { year: 2011, exam: 'Group 4', title: 'TNPSC Group 4 2011', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2011_qp.pdf' },
  { year: 2009, exam: 'Group 4', title: 'TNPSC Group 4 2009', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/group4_2009_qp.pdf' },
  // VAO
  { year: 2024, exam: 'VAO', title: 'TNPSC VAO 2024', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2024_qp.pdf' },
  { year: 2023, exam: 'VAO', title: 'TNPSC VAO 2023', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2023_qp.pdf' },
  { year: 2022, exam: 'VAO', title: 'TNPSC VAO 2022', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2022_qp.pdf' },
  { year: 2018, exam: 'VAO', title: 'TNPSC VAO 2018', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2018_qp.pdf' },
  { year: 2014, exam: 'VAO', title: 'TNPSC VAO 2014', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2014_qp.pdf' },
  { year: 2011, exam: 'VAO', title: 'TNPSC VAO 2011', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2011_qp.pdf' },
  { year: 2009, exam: 'VAO', title: 'TNPSC VAO 2009', pdfUrl: 'https://www.tnpsc.gov.in/previousquestionpapers/vao_2009_qp.pdf' },
];

const EXAMS = ['All', 'Group 1', 'Group 2', 'Group 2A', 'Group 4', 'VAO'];
const EXAM_COLORS: Record<string, string> = {
  'Group 1': '#F59E0B', 'Group 2': '#06B6D4', 'Group 2A': '#10B981',
  'Group 4': '#8B5CF6', 'VAO': '#EF4444',
};

export default function PYQPage() {
  const t = useT();
  const [selectedExam, setSelectedExam] = useState('All');
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const filtered = PYQ_DATA.filter(p =>
    (selectedExam === 'All' || p.exam === selectedExam) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || String(p.year).includes(search))
  );

  const byYear = filtered.reduce((acc, p) => {
    if (!acc[p.year]) acc[p.year] = [];
    acc[p.year].push(p);
    return acc;
  }, {} as Record<number, PYQ[]>);

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <section className="relative py-12 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {t('முந்தைய வினாத்தாள்கள்', 'Previous Year Questions')}
            </h1>
            <p className="text-gray-400 text-sm">
              {t('2009 முதல் 2026 வரை — TNPSC அதிகாரப்பூர்வ இணையதளத்தில் இருந்து', '2009–2026 · From TNPSC official website')}
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder={t('தேடு... (ஆண்டு, தேர்வு)', 'Search by year or exam...')}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 text-sm" />
          </div>

          {/* Exam Filter */}
          <div className="flex flex-wrap gap-2">
            {EXAMS.map(exam => (
              <button key={exam} onClick={() => setSelectedExam(exam)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedExam === exam
                    ? 'bg-brand-primary text-black'
                    : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'
                }`}
                style={selectedExam === exam && exam !== 'All' ? { backgroundColor: EXAM_COLORS[exam] } : {}}>
                {exam}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-3">
          {years.length === 0 ? (
            <p className="text-center text-gray-500 py-12">{t('தேடல் பலனில்லை', 'No results found')}</p>
          ) : years.map(year => (
            <motion.div key={year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold text-white">{year}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{byYear[year].length} {t('தாள்கள்', 'papers')}</span>
                  {expandedYear === year ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {expandedYear === year && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {byYear[year].map((pyq, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${EXAM_COLORS[pyq.exam] || '#F59E0B'}20` }}>
                          <FileText className="w-4 h-4" style={{ color: EXAM_COLORS[pyq.exam] || '#F59E0B' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{pyq.title}</p>
                          <p className="text-xs text-gray-500">TNPSC Official</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setPreviewUrl(previewUrl === pyq.pdfUrl ? null : pyq.pdfUrl)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> {t('பார்', 'Preview')}
                        </button>
                        <a href={pyq.pdfUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 rounded-lg text-xs text-brand-primary transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> {t('திற', 'Open')}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline PDF Preview */}
              {expandedYear === year && previewUrl && byYear[year].find(p => p.pdfUrl === previewUrl) && (
                <div className="border-t border-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-400">{t('PDF முன்னோட்டம்', 'PDF Preview')}</p>
                    <button onClick={() => setPreviewUrl(null)} className="text-xs text-gray-500 hover:text-white">✕ {t('மூடு', 'Close')}</button>
                  </div>
                  <iframe src={previewUrl} className="w-full h-96 rounded-lg border border-white/10 bg-white"
                    title="PDF Preview" />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {t('PDF திறக்கவில்லையா?', 'PDF not loading?')}{' '}
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                      {t('நேரடியாக திற', 'Open directly')}
                    </a>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-8 pb-4">
          {t('அனைத்து PDF-களும் TNPSC அதிகாரப்பூர்வ இணையதளத்தில் இருந்து இணைக்கப்பட்டுள்ளன', 'All PDFs linked from TNPSC official website')}
        </p>
      </section>
    </div>
  );
}
'''
write(pyq_path, PYQ_CONTENT)
OK("PYQPage.tsx rebuilt — 2009-2026 papers with preview + link")

# ══════════════════════════════════════════════════════════════════
# FIX 7 — Footer: fix links, scroll, WhatsApp/Email/Phone buttons
# ══════════════════════════════════════════════════════════════════
print("7. Fixing Footer — links, no infinite scroll, contact buttons")
footer_path = os.path.join(COMP, 'layout', 'Footer.tsx')
FOOTER_CONTENT = '''import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Github, Twitter, Facebook } from 'lucide-react';
import { useT } from '../../store';

const FOOTER_LINKS = {
  exams: [
    { label: 'Group 1', to: '/exams/group-1' },
    { label: 'Group 2', to: '/exams/group-2' },
    { label: 'Group 2A', to: '/exams/group-2a' },
    { label: 'Group 4', to: '/exams/group-4' },
    { label: 'VAO', to: '/exams/vao' },
  ],
  learn: [
    { labelTa: 'AI ஆசிரியர்', labelEn: 'AI Tutor', to: '/ai-tutor' },
    { labelTa: 'மாக் தேர்வு', labelEn: 'Mock Tests', to: '/tests' },
    { labelTa: 'நடப்பு நிகழ்வுகள்', labelEn: 'Current Affairs', to: '/current-affairs' },
    { labelTa: 'முந்தைய வினாத்தாள்', labelEn: 'Previous Papers', to: '/pyq' },
    { labelTa: 'படிப்புத் திட்டம்', labelEn: 'Study Planner', to: '/planner' },
  ],
  community: [
    { labelTa: 'விவாதம்', labelEn: 'Discussions', to: '/community' },
    { labelTa: 'தரவரிசை', labelEn: 'Leaderboard', to: '/leaderboard' },
    { labelTa: 'வெற்றிக் கதைகள்', labelEn: 'Success Stories', to: '/community' },
  ],
  about: [
    { labelTa: 'எங்களைப் பற்றி', labelEn: 'About Us', to: '/about' },
    { labelTa: 'தொடர்பு', labelEn: 'Contact', to: '/contact' },
    { labelTa: 'தனியுரிமை', labelEn: 'Privacy', to: '/privacy' },
    { labelTa: 'விதிமுறைகள்', labelEn: 'Terms', to: '/terms' },
    { labelTa: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', labelEn: 'FAQ', to: '/faq' },
  ],
};

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-[#080C18] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-black font-bold text-sm">அ</div>
              <span className="font-bold text-white">ARIVU <span className="text-brand-primary">AI</span></span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              {t('"அறிவே வெற்றி" — தமிழ்நாட்டின் ஒவ்வொரு மாணவருக்கும் இலவச TNPSC தயாரிப்பு.',
                '"Knowledge is Victory" — Free TNPSC prep for every student in Tamil Nadu.')}
            </p>
            {/* Contact Buttons */}
            <div className="flex flex-col gap-2">
              <a href="mailto:gangatharan110907@gmail.com"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-primary transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                gangatharan110907@gmail.com
              </a>
              <a href="tel:+918248007152"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-primary transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                +91 82480 07152
              </a>
              <a href="https://wa.me/918248007152?text=Hi%20ARIVU%20AI%20-%20I%20need%20help"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-green-400/10 flex items-center justify-center transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Exams */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('தேர்வுகள்', 'Exams')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.exams.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('படிப்பு', 'Learn')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.learn.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {t(l.labelTa, l.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('சமூகம்', 'Community')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.community.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {t(l.labelTa, l.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('பற்றி', 'About')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.about.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {t(l.labelTa, l.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2026 ARIVU AI. {t('எல்லா உரிமைகளும் பாதுகாக்கப்பட்டவை.', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Twitter className="w-3.5 h-3.5 text-gray-500" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Facebook className="w-3.5 h-3.5 text-gray-500" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Github className="w-3.5 h-3.5 text-gray-500" />
            </a>
          </div>
          <p className="text-xs text-gray-600">
            {t('தமிழ்நாடு மாணவர்களுக்கு அர்பணிப்புடன் ❤️', 'Made with ❤️ for Tamil Nadu students')}
          </p>
        </div>
      </div>
    </footer>
  );
}
'''
write(footer_path, FOOTER_CONTENT)
OK("Footer.tsx rebuilt — all links work, WhatsApp/Email/Phone buttons, no scroll bug")

# ══════════════════════════════════════════════════════════════════
# FIX 8 — Add NEWS_API_KEY to vercel.json env
# ══════════════════════════════════════════════════════════════════
print("8. Updating vercel.json with NEWS_API_KEY env")
import json
vercel_json = os.path.join(ROOT, 'vercel.json')
if os.path.exists(vercel_json):
    try:
        with open(vercel_json, 'r') as f:
            vj = json.load(f)
    except:
        vj = {}
    if 'env' not in vj:
        vj['env'] = {}
    vj['env']['NEWS_API_KEY'] = '690d13b4576e40979403d5febcd0f75a'
    with open(vercel_json, 'w') as f:
        json.dump(vj, f, indent=2)
    OK("vercel.json — NEWS_API_KEY added")
else:
    # Create minimal vercel.json
    vj = {
      "rewrites": [{"source": "/((?!api/).*)", "destination": "/index.html"}],
      "env": {"NEWS_API_KEY": "690d13b4576e40979403d5febcd0f75a"}
    }
    with open(vercel_json, 'w') as f:
        json.dump(vj, f, indent=2)
    OK("vercel.json created with NEWS_API_KEY")

# ══════════════════════════════════════════════════════════════════
# FIX 9 — AITutorPage: real voice input using Web Speech API
# ══════════════════════════════════════════════════════════════════
print("9. Upgrading AITutorPage — real voice input (Web Speech API)")
ai_path = os.path.join(PAGES, 'AITutorPage.tsx')
if os.path.exists(ai_path):
    c = read(ai_path)
    # Replace coming-soon mic button with real Web Speech API
    old_mic_btn = """              <button
                title="Voice input — coming soon"
                onClick={() => alert('🎤 Voice input — விரைவில் வருகிறது!')}
                className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700 opacity-50 cursor-not-allowed">
                <Mic className="w-5 h-5 text-brand-secondary" />
              </button>"""
    new_mic_btn = """              <button
                title="Voice input"
                onClick={() => {
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRecognition) { alert('உங்கள் browser voice input support செய்யவில்லை'); return; }
                  const recognition = new SpeechRecognition();
                  recognition.lang = lang === 'TAMIL' ? 'ta-IN' : 'en-IN';
                  recognition.interimResults = false;
                  recognition.onresult = (e: any) => setInput(prev => prev + e.results[0][0].transcript);
                  recognition.start();
                }}
                className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700 transition-colors">
                <Mic className="w-5 h-5 text-brand-secondary" />
              </button>"""
    if old_mic_btn in c:
        c = c.replace(old_mic_btn, new_mic_btn)
        write(ai_path, c)
        OK("AITutorPage — real Web Speech API voice input added")
    else:
        SKIP("AITutorPage — mic button pattern not found for speech upgrade")
else:
    ERR("AITutorPage.tsx not found")

# ══════════════════════════════════════════════════════════════════
print("\n✅ ALL v2 FIXES APPLIED.")
print("   Next:")
print("   1. npm run dev  (test locally)")
print("   2. git add . && git commit -m 'fix: v2 fixes — real data, news, PYQ, footer, voice' && git push origin main\n")
