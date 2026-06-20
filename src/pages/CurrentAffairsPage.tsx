import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Star, ArrowRight, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useT, useAppStore } from '../store';
import { MOCK_CURRENT_AFFAIRS } from '../lib/data';
import type { CACategory } from '../lib/types';

const CATEGORIES: CACategory[] = [
  'NATIONAL', 'INTERNATIONAL', 'TAMILNADU', 'ECONOMY', 'SCIENCE',
  'ENVIRONMENT', 'SPORTS', 'POLITICS', 'SCHEME'
];

const CATEGORY_COLORS: Record<CACategory, string> = {
  NATIONAL: '#F59E0B', INTERNATIONAL: '#06B6D4', TAMILNADU: '#10B981',
  ECONOMY: '#3B82F6', SCIENCE: '#8B5CF6', ENVIRONMENT: '#22C55E',
  SPORTS: '#EF4444', POLITICS: '#EC4899', SCHEME: '#06B6D4',
};

const CATEGORY_LABELS: Record<CACategory, { ta: string; en: string }> = {
  NATIONAL: { ta: 'தேசியம்', en: 'National' },
  INTERNATIONAL: { ta: 'சர்வதேசம்', en: 'International' },
  TAMILNADU: { ta: 'தமிழ்நாடு', en: 'Tamil Nadu' },
  ECONOMY: { ta: 'பொருளாதாரம்', en: 'Economy' },
  SCIENCE: { ta: 'அறிவியல்', en: 'Science' },
  ENVIRONMENT: { ta: 'சுற்றுச்சூழல்', en: 'Environment' },
  SPORTS: { ta: 'விளையாட்டு', en: 'Sports' },
  POLITICS: { ta: 'அரசியல்', en: 'Politics' },
  SCHEME: { ta: 'திட்டங்கள்', en: 'Scheme' },
};

export default function CurrentAffairsPage() {
  const t = useT();
  const { language } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CACategory | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [selectedAffair, setSelectedAffair] = useState<typeof MOCK_CURRENT_AFFAIRS[number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const filteredAffairs = MOCK_CURRENT_AFFAIRS.filter(ca => {
    const matchesCategory = !selectedCategory || ca.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      ca.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ca.titleTamil.toLowerCase().includes(searchQuery.toLowerCase());
    const affairDate = new Date(ca.date);
    const now = new Date();
    const daysDiff = (now.getTime() - affairDate.getTime()) / (1000 * 60 * 60 * 24);
    const matchesDate =
      dateFilter === 'all' ? true :
      dateFilter === 'today' ? daysDiff < 1 :
      dateFilter === 'week' ? daysDiff < 7 :
      daysDiff < 31;
    return matchesCategory && matchesSearch && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAffairs.length / PAGE_SIZE));
  const paginatedAffairs = filteredAffairs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero */}
      <section className="relative py-12 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {t('நடப்பு நிகழ்வுகள்', 'Current Affairs')}
            </h1>
            <p className="text-gray-400">
              {t('TNPSC தேர்வுக்கு முக்கியமான தினசரி செய்திகள்', 'Daily news and topics important for TNPSC exams')}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {filteredAffairs.length} {t('நிகழ்வுகள்', 'articles')}
              </span>
            </div>
          </motion.div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={t('தேடு...', 'Search current affairs...')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-secondary/50 transition-colors"
            />
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
              <button key={filter} onClick={() => { setDateFilter(filter); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${dateFilter === filter ? 'btn-primary' : 'bg-[#111827] text-gray-400 hover:text-white border border-white/10'}`}>
                {filter === 'today' && t('இன்று', 'Today')}
                {filter === 'week' && t('இந்த வாரம்', 'This Week')}
                {filter === 'month' && t('இந்த மாதம்', 'This Month')}
                {filter === 'all' && t('அனைத்து', 'All')}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 pb-4">
            <button onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === null ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40' : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'}`}>
              {t('அனைத்தும்', 'All')}
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all`}
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

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            {paginatedAffairs.length > 0 ? paginatedAffairs.map((affair, i) => (
              <motion.div key={affair.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card group cursor-pointer hover:border-brand-secondary/40"
                onClick={() => setSelectedAffair(affair)}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: `${CATEGORY_COLORS[affair.category]}20`, border: `1px solid ${CATEGORY_COLORS[affair.category]}40` }}>
                    <span className="text-xs font-bold" style={{ color: CATEGORY_COLORS[affair.category] }}>
                      {affair.category[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="badge-gold text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${CATEGORY_COLORS[affair.category]}20`, color: CATEGORY_COLORS[affair.category], border: `1px solid ${CATEGORY_COLORS[affair.category]}40` }}>
                        {t(CATEGORY_LABELS[affair.category].ta, CATEGORY_LABELS[affair.category].en)}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < affair.importanceLevel ? 'text-brand-primary fill-brand-primary' : 'text-gray-700'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-auto">{new Date(affair.date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-secondary transition-colors tamil">
                      {language === 'TAMIL' ? affair.titleTamil : affair.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {language === 'TAMIL' ? affair.summaryTamil : affair.summary}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-sm text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('விரிவாக படி', 'Read more')} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-12">
                <p className="text-gray-400">{t('தேடல் பலனில்லை', 'No results found')}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#111827] border border-white/10 hover:border-white/20 transition-colors disabled:opacity-40">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((i) => (
                  <button key={i} onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${i === currentPage ? 'btn-primary' : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'}`}>
                    {i}
                  </button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-[#111827] border border-white/10 hover:border-white/20 transition-colors disabled:opacity-40">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}

          {/* Detail Modal */}
          {selectedAffair && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAffair(null)}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <span className="badge-gold text-xs px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${CATEGORY_COLORS[selectedAffair.category]}20`, color: CATEGORY_COLORS[selectedAffair.category], border: `1px solid ${CATEGORY_COLORS[selectedAffair.category]}40` }}>
                    {t(CATEGORY_LABELS[selectedAffair.category].ta, CATEGORY_LABELS[selectedAffair.category].en)}
                  </span>
                  <button onClick={() => setSelectedAffair(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 tamil">
                  {language === 'TAMIL' ? selectedAffair.titleTamil : selectedAffair.title}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs text-gray-500">{new Date(selectedAffair.date).toLocaleDateString('en-GB')}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 mr-1">{t('TNPSC முக்கியத்துவம்', 'TNPSC Importance')}:</span>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < selectedAffair.importanceLevel ? 'text-brand-primary fill-brand-primary' : 'text-gray-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed text-base">
                  {language === 'TAMIL' ? selectedAffair.summaryTamil : selectedAffair.summary}
                </p>
                <button onClick={() => setSelectedAffair(null)} className="btn-secondary mt-6 w-full">
                  {t('மூடு', 'Close')}
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
