import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Download, Star, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useT, useAppStore } from '../store';
import { MOCK_CURRENT_AFFAIRS } from '../lib/data';
import type { CACategory } from '../lib/types';

const CATEGORIES: CACategory[] = [
  'NATIONAL', 'INTERNATIONAL', 'TAMILNADU', 'ECONOMY', 'SCIENCE',
  'ENVIRONMENT', 'SPORTS', 'POLITICS', 'SCHEME'
];

const CATEGORY_COLORS: Record<CACategory, string> = {
  NATIONAL: '#F59E0B',
  INTERNATIONAL: '#06B6D4',
  TAMILNADU: '#10B981',
  ECONOMY: '#3B82F6',
  SCIENCE: '#8B5CF6',
  ENVIRONMENT: '#22C55E',
  SPORTS: '#EF4444',
  POLITICS: '#EC4899',
  SCHEME: '#06B6D4',
};

export default function CurrentAffairsPage() {
  const t = useT();
  const { language } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CACategory | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const filteredAffairs = MOCK_CURRENT_AFFAIRS.filter(ca => {
    const matchesCategory = !selectedCategory || ca.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      ca.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ca.titleTamil.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero */}
      <section className="relative py-12 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {t('நடப்பு நிகழ்வுகள்', 'Current Affairs')}
            </h1>
            <p className="text-gray-400">
              {t('TNPSC தேர்வுக்கு முக்கியமான தினசரி செய்திகள் மற்றும் விசயங்கள்', 'Daily news and topics important for TNPSC exams')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={t('தேடு...', 'Search...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-secondary/50 transition-colors"
            />
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  dateFilter === filter
                    ? 'btn-primary'
                    : 'bg-[#111827] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {filter === 'today' && t('இன்று', 'Today')}
                {filter === 'week' && t('இந்த வாரம்', 'This Week')}
                {filter === 'month' && t('இந்த மாதம்', 'This Month')}
                {filter === 'all' && t('அனைத்து', 'All')}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 pb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/40'
                  : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {t('அனைத்தும்', 'All')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'text-white border-2'
                    : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? `${CATEGORY_COLORS[cat]}20` : undefined,
                  borderColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : undefined,
                  color: selectedCategory === cat ? CATEGORY_COLORS[cat] : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Download Button */}
          <div className="flex justify-end mb-6">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              {t('மாத PDF பதிவிறக்கம்', 'Download Monthly PDF')}
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredAffairs.length > 0 ? (
              filteredAffairs.map((affair, i) => (
                <motion.div
                  key={affair.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card group cursor-pointer hover:border-brand-secondary/40"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[affair.category]}20`,
                        border: `1px solid ${CATEGORY_COLORS[affair.category]}40`,
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: CATEGORY_COLORS[affair.category] }}
                      >
                        {affair.category[0]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="badge-gold text-xs"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[affair.category]}20`,
                            color: CATEGORY_COLORS[affair.category],
                            border: `1px solid ${CATEGORY_COLORS[affair.category]}40`,
                          }}
                        >
                          {affair.category}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3 h-3 ${
                                j < affair.importanceLevel
                                  ? 'text-brand-primary fill-brand-primary'
                                  : 'text-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(affair.date).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-secondary transition-colors tamil">
                        {language === 'TAMIL' ? affair.titleTamil : affair.title}
                      </h3>

                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {language === 'TAMIL' ? affair.summaryTamil : affair.summary}
                      </p>

                      <div className="flex items-center gap-1 mt-3 text-sm text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('விரிவாக படி', 'Read full article')} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">{t('தேடல் பலனில்லை', 'No results found')}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredAffairs.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="p-2 rounded-lg bg-[#111827] border border-white/10 hover:border-white/20 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      i === 1
                        ? 'btn-primary'
                        : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <button className="p-2 rounded-lg bg-[#111827] border border-white/10 hover:border-white/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
