import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Eye, ChevronDown, ChevronUp, Search, Award, BookOpen } from 'lucide-react';
import { useT } from '../store';
import { finalAnswerKeys, FinalAnswerKey } from '../data/finalAnswerKeys';
import { questionPapers, QuestionPaper } from '../data/questionPapers';

const EXAMS = ['All', 'Group 1', 'Group 2', 'Group 4', 'VAO'];
const EXAM_COLORS: Record<string, string> = {
  'Group 1': '#F59E0B', 'Group 2': '#06B6D4', 'Group 2A': '#10B981',
  'Group 4': '#8B5CF6', 'VAO': '#EF4444',
};
const SUBJECT_COLORS: Record<string, string> = {
  'General Tamil': '#F97316', 'General Studies': '#06B6D4',
  'General English': '#10B981', 'General Knowledge': '#8B5CF6',
  'GS Paper 1': '#06B6D4', 'GS Paper 2': '#8B5CF6', 'GS Paper 3': '#EC4899',
  'Tamil Eligibility Test': '#F97316', 'Answer Key': '#10B981',
};

type TabKey = 'papers' | 'keys';

export default function PYQPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState<TabKey>('papers');
  const [selectedExam, setSelectedExam] = useState('All');
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // ── Question Papers ──────────────────────────────────
  const filteredPapers = questionPapers.filter(p =>
    (selectedExam === 'All' || p.exam === selectedExam) &&
    (search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase()) ||
      String(p.year).includes(search))
  );

  const papersByYear = filteredPapers.reduce((acc, p) => {
    if (!acc[p.year]) acc[p.year] = [];
    acc[p.year].push(p);
    return acc;
  }, {} as Record<number, QuestionPaper[]>);
  const paperYears = Object.keys(papersByYear).map(Number).sort((a, b) => b - a);

  // ── Final Answer Keys ────────────────────────────────
  const filteredKeys = finalAnswerKeys.filter(k =>
    search === '' ||
    k.examName.toLowerCase().includes(search.toLowerCase()) ||
    (k.year !== null && String(k.year).includes(search)) ||
    (k.notificationNo !== null && k.notificationNo.includes(search))
  );
  const keysByYear = filteredKeys.reduce((acc, k) => {
    const y = k.year ?? 0;
    if (!acc[y]) acc[y] = [];
    acc[y].push(k);
    return acc;
  }, {} as Record<number, FinalAnswerKey[]>);
  const keyYears = Object.keys(keysByYear).map(Number).sort((a, b) => b - a);

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
              {t('TNPSC அதிகாரப்பூர்வ & prepp.in இல் இருந்து', 'From TNPSC official & prepp.in')}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => { setActiveTab('papers'); setExpandedYear(null); setPreviewUrl(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'papers' ? 'bg-brand-primary text-black' : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'}`}>
              <BookOpen className="w-3.5 h-3.5" />
              {t('வினாத்தாள்கள்', 'Question Papers')}
              <span className="opacity-60">({questionPapers.length})</span>
            </button>
            <button onClick={() => { setActiveTab('keys'); setExpandedYear(null); setPreviewUrl(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'keys' ? 'bg-brand-primary text-black' : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'}`}>
              <Award className="w-3.5 h-3.5" />
              {t('இறுதி விடைத்தாள்கள்', 'Final Answer Keys')}
              <span className="opacity-60">({finalAnswerKeys.length})</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text"
              placeholder={activeTab === 'papers'
                ? t('தேடு... (ஆண்டு, தேர்வு, பாடம்)', 'Search by year, exam or subject...')
                : t('தேடு... (ஆண்டு, அறிவிப்பு எண்)', 'Search by year or notification no...')}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 text-sm" />
          </div>

          {/* Exam filter - only for papers tab */}
          {activeTab === 'papers' && (
            <div className="flex flex-wrap gap-2">
              {EXAMS.map(exam => (
                <button key={exam} onClick={() => { setSelectedExam(exam); setExpandedYear(null); setPreviewUrl(null); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedExam === exam ? 'bg-brand-primary text-black' : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'}`}
                  style={selectedExam === exam && exam !== 'All' ? { backgroundColor: EXAM_COLORS[exam] } : {}}>
                  {exam}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-3">

          {activeTab === 'papers' ? (
            paperYears.length === 0 ? (
              <p className="text-center text-gray-500 py-12">{t('தேடல் பலனில்லை', 'No results found')}</p>
            ) : paperYears.map(year => (
              <motion.div key={year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <span className="font-semibold text-white">{year}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{papersByYear[year].length} {t('தாள்கள்', 'papers')}</span>
                    {expandedYear === year ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {expandedYear === year && (
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {papersByYear[year].map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${EXAM_COLORS[p.exam] || '#F59E0B'}20` }}>
                            <FileText className="w-4 h-4" style={{ color: EXAM_COLORS[p.exam] || '#F59E0B' }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{p.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full mt-0.5 inline-block"
                              style={{ backgroundColor: `${SUBJECT_COLORS[p.subject] || '#06B6D4'}20`, color: SUBJECT_COLORS[p.subject] || '#06B6D4' }}>
                              {p.subject}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => setPreviewUrl(previewUrl === p.pdfUrl ? null : p.pdfUrl)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-colors">
                            <Eye className="w-3.5 h-3.5" /> {t('பார்', 'Preview')}
                          </button>
                          <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 rounded-lg text-xs text-brand-primary transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> {t('திற', 'Open')}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedYear === year && previewUrl && papersByYear[year].find(p => p.pdfUrl === previewUrl) && (
                  <div className="border-t border-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">{t('PDF முன்னோட்டம்', 'PDF Preview')}</p>
                      <button onClick={() => setPreviewUrl(null)} className="text-xs text-gray-500 hover:text-white">✕ {t('மூடு', 'Close')}</button>
                    </div>
                    <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                      className="w-full h-96 rounded-lg border border-white/10 bg-white" title="PDF Preview" />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {t('PDF திறக்கவில்லையா?', 'PDF not loading?')}{' '}
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        {t('நேரடியாக திற', 'Open directly')}
                      </a>
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            keyYears.length === 0 ? (
              <p className="text-center text-gray-500 py-12">{t('தேடல் பலனில்லை', 'No results found')}</p>
            ) : keyYears.map(year => (
              <motion.div key={year} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <span className="font-semibold text-white">{year === 0 ? t('ஆண்டு தெரியவில்லை', 'Unknown Year') : year}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{keysByYear[year].length} {t('விடைத்தாள்கள்', 'keys')}</span>
                    {expandedYear === year ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {expandedYear === year && (
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {keysByYear[year].map((key) => (
                      <div key={key.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/20">
                            <Award className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {key.examName}
                              {key.notificationNo ? ` (${t('அறிவிப்பு', 'Notif.')} ${key.notificationNo}/${key.year ?? ''})` : ''}
                            </p>
                            <p className="text-xs text-gray-500">{t('வெளியிடப்பட்ட தேதி', 'Published')}: {key.publishedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => setPreviewUrl(previewUrl === key.pdfUrl ? null : key.pdfUrl)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-colors">
                            <Eye className="w-3.5 h-3.5" /> {t('பார்', 'Preview')}
                          </button>
                          <a href={key.pdfUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 rounded-lg text-xs text-brand-primary transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> {t('திற', 'Open')}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedYear === year && previewUrl && keysByYear[year].find(k => k.pdfUrl === previewUrl) && (
                  <div className="border-t border-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">{t('PDF முன்னோட்டம்', 'PDF Preview')}</p>
                      <button onClick={() => setPreviewUrl(null)} className="text-xs text-gray-500 hover:text-white">✕ {t('மூடு', 'Close')}</button>
                    </div>
                    <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                      className="w-full h-96 rounded-lg border border-white/10 bg-white" title="PDF Preview" />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {t('PDF திறக்கவில்லையா?', 'PDF not loading?')}{' '}
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        {t('நேரடியாக திற', 'Open directly')}
                      </a>
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
        <p className="text-center text-xs text-gray-600 mt-8 pb-4">
          {t('வினாத்தாள்கள்: prepp.in | விடைத்தாள்கள்: TNPSC அதிகாரப்பூர்வ இணையதளம்', 'Question Papers: prepp.in | Answer Keys: TNPSC Official')}
        </p>
      </section>
    </div>
  );
}
