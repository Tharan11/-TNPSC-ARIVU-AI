import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, ChevronDown, ChevronUp, Search, Award, BookOpen } from 'lucide-react';
import { useT } from '../store';
import { finalAnswerKeys, FinalAnswerKey } from '../data/finalAnswerKeys';

const EXAM_GROUPS = [
  {
    id: 'group1',
    name: 'Group 1',
    tamil: 'குரூப் 1',
    color: '#F59E0B',
    desc: 'Deputy Collector, DSP மற்றும் உயர் பதவிகள்',
    descEn: 'Deputy Collector, DSP & higher posts',
    url: 'https://www.tnpsc.gov.in/English/answerkeys.aspx',
  },
  {
    id: 'group2',
    name: 'Group 2',
    tamil: 'குரூப் 2',
    color: '#06B6D4',
    desc: 'Sub-Registrar, HR&CE மற்றும் நேர்முகத்தேர்வு பதவிகள்',
    descEn: 'Sub-Registrar, HR&CE & interview posts',
    url: 'https://www.tnpsc.gov.in/English/answerkeys.aspx',
  },
  {
    id: 'group2a',
    name: 'Group 2A',
    tamil: 'குரூப் 2A',
    color: '#10B981',
    desc: 'Junior Assistant மற்றும் நேர்முகத்தேர்வு இல்லாத பதவிகள்',
    descEn: 'Junior Assistant & non-interview posts',
    url: 'https://www.tnpsc.gov.in/English/answerkeys.aspx',
  },
  {
    id: 'group4',
    name: 'Group 4',
    tamil: 'குரூப் 4',
    color: '#8B5CF6',
    desc: 'ஜூனியர் அசிஸ்டன்ட், டைப்பிஸ்ட் மற்றும் அலுவலக பதவிகள்',
    descEn: 'Junior Assistant, Typist & office posts',
    url: 'https://www.tnpsc.gov.in/English/answerkeys.aspx',
  },
  {
    id: 'vao',
    name: 'VAO',
    tamil: 'VAO',
    color: '#EF4444',
    desc: 'கிராம நிர்வாக அலுவலர்',
    descEn: 'Village Administrative Officer',
    url: 'https://www.tnpsc.gov.in/English/answerkeys.aspx',
  },
  {
    id: 'ccse4',
    name: 'CCSE IV (Group 4)',
    tamil: 'CCSE IV',
    color: '#EC4899',
    desc: 'Combined Civil Services Exam IV',
    descEn: 'Combined Civil Services Exam IV',
    url: 'https://www.tnpsc.gov.in/English/answerkeys.aspx',
  },
];

const TNPSC_OFFICIAL_QP = 'https://www.tnpsc.gov.in/English/answerkeys.aspx';

type TabKey = 'papers' | 'keys';

export default function PYQPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState<TabKey>('papers');
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // ---- Final Answer Keys ----
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

  // ---- Question Papers search filter ----
  const filteredGroups = EXAM_GROUPS.filter(g =>
    search === '' ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.tamil.includes(search) ||
    g.descEn.toLowerCase().includes(search.toLowerCase())
  );

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
              {t('TNPSC அதிகாரப்பூர்வ இணையதளத்தில் இருந்து', 'From TNPSC official website')}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => { setActiveTab('papers'); setExpandedYear(null); setPreviewUrl(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'papers'
                  ? 'bg-brand-primary text-black'
                  : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'
              }`}>
              <BookOpen className="w-3.5 h-3.5" />
              {t('வினாத்தாள்கள்', 'Question Papers')}
            </button>
            <button
              onClick={() => { setActiveTab('keys'); setExpandedYear(null); setPreviewUrl(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'keys'
                  ? 'bg-brand-primary text-black'
                  : 'bg-[#111827] text-gray-400 border border-white/10 hover:border-white/20'
              }`}>
              <Award className="w-3.5 h-3.5" />
              {t('இறுதி விடைத்தாள்கள்', 'Final Answer Keys')}
              <span className="opacity-60">({finalAnswerKeys.length})</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={
                activeTab === 'papers'
                  ? t('தேடு... (குரூப் 1, VAO...)', 'Search exam group...')
                  : t('தேடு... (ஆண்டு, அறிவிப்பு எண், தேர்வு)', 'Search by year, notification no, or exam...')
              }
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 text-sm" />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {activeTab === 'papers' ? (
            <>
              {/* Info banner */}
              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6">
                <span className="text-blue-400 text-lg mt-0.5">ℹ️</span>
                <div>
                  <p className="text-sm text-blue-200 font-medium mb-0.5">
                    {t('வினாத்தாள்கள் + விடைகள் ஒரே PDF-ல கிடைக்கும்', 'Question Papers + Answer Keys in same PDF')}
                  </p>
                  <p className="text-xs text-blue-300/70">
                    {t(
                      'TNPSC அதிகாரப்பூர்வ தளத்தில் வினாத்தாள்கள் விடைகளுடன் சேர்த்து வழங்கப்படுகின்றன. கீழே உள்ள தேர்வை தேர்ந்தெடுத்து TNPSC தளத்திற்கு செல்லவும்.',
                      'TNPSC provides question papers together with answer keys on their official site. Select your exam below and visit TNPSC site.'
                    )}
                  </p>
                </div>
              </div>

              {/* Exam Cards Grid */}
              {filteredGroups.length === 0 ? (
                <p className="text-center text-gray-500 py-12">{t('தேடல் பலனில்லை', 'No results found')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGroups.map(group => (
                    <motion.a
                      key={group.id}
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-[#111827] border border-white/10 rounded-xl p-5 hover:border-white/25 hover:bg-[#141d2e] transition-all cursor-pointer flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${group.color}20` }}>
                          <FileText className="w-5 h-5" style={{ color: group.color }} />
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-base">{group.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t(group.desc, group.descEn)}</p>
                      </div>
                      <div className="mt-auto pt-2 border-t border-white/5 flex items-center gap-1.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                          TNPSC Official
                        </span>
                        <span className="text-xs text-gray-600">{t('கிளிக் செய்து பதிவிறக்கவும்', 'Click to access')}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              {/* Steps guide */}
              <div className="mt-8 bg-[#111827] border border-white/10 rounded-xl p-5">
                <p className="text-sm font-medium text-white mb-3">
                  📋 {t('வினாத்தாள் எப்படி பதிவிறக்குவது?', 'How to download question papers?')}
                </p>
                <ol className="space-y-2">
                  {[
                    t('மேலே உங்கள் தேர்வை (Group 1, 2, VAO...) கிளிக் செய்யுங்கள்', 'Click your exam group above (Group 1, 2, VAO...)'),
                    t('TNPSC தளத்தில் "Objective Type (With Answer Keys)" பகுதி திறக்கும்', 'TNPSC site opens "Objective Type (With Answer Keys)" section'),
                    t('உங்கள் தேர்வு பெயரை தேடி "View" கிளிக் செய்யுங்கள்', 'Search your exam name and click "View"'),
                    t('PDF-ல வினாத்தாள் + விடைகள் இரண்டும் கிடைக்கும்', 'PDF contains both question paper + answer keys'),
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-gray-400">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-medium text-xs mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <a href={TNPSC_OFFICIAL_QP} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg text-sm font-medium transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('TNPSC அதிகாரப்பூர்வ தளம் திற', 'Open TNPSC Official Site')}
                </a>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {keyYears.length === 0 ? (
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
                              👁 {t('பார்', 'Preview')}
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
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                        className="w-full h-96 rounded-lg border border-white/10 bg-white"
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
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8 pb-4">
          {t('அனைத்து PDF-களும் TNPSC அதிகாரப்பூர்வ இணையதளத்தில் இருந்து இணைக்கப்பட்டுள்ளன', 'All PDFs linked from TNPSC official website')}
        </p>
      </section>
    </div>
  );
}
