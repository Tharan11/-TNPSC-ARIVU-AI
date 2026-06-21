import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Radio, ExternalLink, RefreshCw } from 'lucide-react';
import { useT, useAppStore } from '../store';

type Category = 'ALL' | 'NATIONAL' | 'TAMILNADU' | 'ECONOMY' | 'SCIENCE' | 'ENVIRONMENT' | 'SPORTS' | 'POLITICS' | 'SCHEME';

const CATEGORY_COLORS: Record<Category, string> = {
  ALL: '#9CA3AF', NATIONAL: '#F59E0B', TAMILNADU: '#10B981',
  ECONOMY: '#3B82F6', SCIENCE: '#8B5CF6', ENVIRONMENT: '#22C55E',
  SPORTS: '#EF4444', POLITICS: '#EC4899', SCHEME: '#06B6D4',
};

const CATEGORY_LABELS: Record<Category, { ta: string; en: string }> = {
  ALL: { ta: 'அனைத்தும்', en: 'All' },
  NATIONAL: { ta: 'தேசியம்', en: 'National' },
  TAMILNADU: { ta: 'தமிழ்நாடு', en: 'Tamil Nadu' },
  ECONOMY: { ta: 'பொருளாதாரம்', en: 'Economy' },
  SCIENCE: { ta: 'அறிவியல்', en: 'Science' },
  ENVIRONMENT: { ta: 'சுற்றுச்சூழல்', en: 'Environment' },
  SPORTS: { ta: 'விளையாட்டு', en: 'Sports' },
  POLITICS: { ta: 'அரசியல்', en: 'Politics' },
  SCHEME: { ta: 'திட்டங்கள்', en: 'Scheme' },
};

function autoCategory(title: string): Category {
  const t = title.toLowerCase();
  if (/tamil nadu|chennai|tamilnadu|dmk|aiadmk|mk stalin/.test(t)) return 'TAMILNADU';
  if (/economy|gdp|rbi|budget|inflation|rupee|tax|finance|bank/.test(t)) return 'ECONOMY';
  if (/isro|science|technology|space|satellite|research|ai|nuclear/.test(t)) return 'SCIENCE';
  if (/environment|climate|pollution|forest|wildlife|green|solar/.test(t)) return 'ENVIRONMENT';
  if (/sport|cricket|olympic|medal|ipl|football|hockey|athlete/.test(t)) return 'SPORTS';
  if (/scheme|yojana|mission|programme|welfare|subsidy|pmay|pm kisan/.test(t)) return 'SCHEME';
  if (/modi|parliament|election|minister|government|policy|lok sabha|rajya/.test(t)) return 'POLITICS';
  return 'NATIONAL';
}

interface Headline {
  id: string; title: string; source: string; url: string; publishedAt: string;
}

export default function CurrentAffairsPage() {
  const t = useT();
  const { language } = useAppStore();
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [secondsAgo, setSecondsAgo] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setHeadlines(data.headlines || []);
      setUpdatedAt(Date.now());
      setSecondsAgo(0);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsAgo(s => s + 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [updatedAt]);

  const CATEGORIES: Category[] = ['ALL','NATIONAL','TAMILNADU','ECONOMY','SCIENCE','ENVIRONMENT','SPORTS','POLITICS','SCHEME'];

  const filtered = headlines.filter(h => {
    const matchCat = selectedCategory === 'ALL' || autoCategory(h.title) === selectedCategory;
    const matchSearch = searchQuery === '' || h.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <section className="relative py-12 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {t('நடப்பு நிகழ்வுகள்', 'Current Affairs')}
            </h1>
            <p className="text-gray-400">
              {t('TNPSC தேர்வுக்கு முக்கியமான தினசரி செய்திகள்', 'Daily news important for TNPSC exams')}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {filtered.length} {t('செய்திகள்', 'articles')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1 rounded-full">
                <Radio className="w-3 h-3 animate-pulse" />
                {t('நேரலை', 'Live')} · 60s {t('புதுப்பிப்பு', 'refresh')}
              </span>
            </div>
          </motion.div>

          {/* Header bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">{t('நேரலை செய்திகள்', 'Live Headlines')}</span>
              {updatedAt && (
                <span className="text-xs text-gray-500">{secondsAgo}s {t('முன்பு புதுப்பிக்கப்பட்டது', 'ago')}</span>
              )}
            </div>
            <button onClick={fetchNews} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {t('புதுப்பி', 'Refresh')}
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder={t('செய்திகள் தேடு...', 'Search news...')}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-secondary/50 transition-colors" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 pb-4">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: selectedCategory === cat ? `${CATEGORY_COLORS[cat]}20` : '#111827',
                  borderColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : 'rgba(255,255,255,0.1)',
                  color: selectedCategory === cat ? CATEGORY_COLORS[cat] : '#9CA3AF',
                  border: '1px solid',
                }}>
                {t(CATEGORY_LABELS[cat].ta, CATEGORY_LABELS[cat].en)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Cards */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {loading && headlines.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-[#111827] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : error && headlines.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-4">{t('செய்திகள் கிடைக்கவில்லை', 'Could not load news')}</p>
              <button onClick={fetchNews} className="btn-secondary">{t('மீண்டும் முயற்சி', 'Try again')}</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">{t('தேடல் பலனில்லை', 'No results found')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((h, i) => {
                const cat = autoCategory(h.title);
                const color = CATEGORY_COLORS[cat];
                const timeAgo = h.publishedAt
                  ? Math.round((Date.now() - Date.parse(h.publishedAt)) / 60000)
                  : null;
                return (
                  <motion.a key={h.id} href={h.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#111827] border border-white/5 hover:border-white/20 hover:bg-[#151d2e] transition-all group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
                      <span className="text-xs font-bold" style={{ color }}>{cat[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}>
                          {t(CATEGORY_LABELS[cat].ta, CATEGORY_LABELS[cat].en)}
                        </span>
                        <span className="text-xs text-gray-500">{h.source}</span>
                        {timeAgo !== null && (
                          <span className="text-xs text-gray-600 ml-auto">
                            {timeAgo < 60 ? `${timeAgo}m ago` : `${Math.round(timeAgo/60)}h ago`}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-200 leading-snug group-hover:text-white transition-colors">{h.title}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-brand-secondary flex-shrink-0 mt-1 transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
