import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown, Shield, ShieldCheck, FileText, Landmark, Wrench, TreePine,
  ChevronRight, ShieldAlert, ArrowRight, Calendar, Target
} from 'lucide-react';
import { useT } from '../store';
import { EXAM_GROUPS } from '../lib/types';
import { MOCK_EXAMS } from '../lib/data';

const ICON_MAP: Record<string, React.FC<any>> = {
  Crown, Shield, ShieldCheck, FileText, Landmark, Wrench, TreePine, ShieldAlert,
};

const stagger = {
  container: { transition: { staggerChildren: 0.1 } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
};

export default function ExamsPage() {
  const t = useT();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t('TNPSC தேர்வுகள்', 'TNPSC Exams')}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t(
                'உங்களுக்குத் தகுந்த TNPSC தேர்வைத் தேர்ந்துகொண்டு முழு தயாரிப்பு பொருட்களைப் பெறுங்கள்',
                'Choose your target TNPSC exam and get comprehensive preparation materials'
              )}
            </p>
          </motion.div>

          {/* Exam Grid */}
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {EXAM_GROUPS.map((group) => {
              const exam = MOCK_EXAMS.find(e => e.group === group.slug);
              const IconComp = ICON_MAP[group.icon] || FileText;

              return (
                <motion.div
                  key={group.slug}
                  variants={stagger.item}
                  onClick={() => navigate(`/exams/${group.slug.toLowerCase()}`)}
                  className="group cursor-pointer"
                >
                  <div className="card-glow relative overflow-hidden h-full">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${group.color}15, transparent 70%)` }}
                    />
                    <div className="relative p-6 h-full flex flex-col">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                        style={{ background: `${group.color}15`, border: `1px solid ${group.color}30` }}
                      >
                        <IconComp className="w-7 h-7" style={{ color: group.color }} />
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-1">{group.name}</h3>
                      <p className="tamil text-xs text-gray-500 mb-4">{group.nameTamil}</p>

                      {exam && (
                        <div className="mt-auto space-y-2 text-xs text-gray-400 mb-4">
                          {exam.vacancyCount && (
                            <div className="flex items-center gap-2">
                              <Target className="w-3.5 h-3.5 text-brand-primary" />
                              <span>{exam.vacancyCount.toLocaleString()} {t('இடங்கள்', 'Vacancies')}</span>
                            </div>
                          )}
                          {exam.examDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
                              <span>{new Date(exam.examDate).toLocaleDateString('en-GB')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm font-medium transition-colors group-hover:text-brand-primary" style={{ color: group.color }}>
                        <span>{t('ஆராயு', 'Explore')}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Exam Details Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            {MOCK_EXAMS.map((exam) => (
              <div key={exam.id} className="bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${EXAM_GROUPS.find(g => g.slug === exam.group)?.color}15` }}
                  >
                    {EXAM_GROUPS.find(g => g.slug === exam.group) && (
                      (() => {
                        const group = EXAM_GROUPS.find(g => g.slug === exam.group)!;
                        const Icon = ICON_MAP[group.icon] || FileText;
                        return <Icon className="w-6 h-6" style={{ color: group.color }} />;
                      })()
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exam.name}</h3>
                    <p className="tamil text-sm text-gray-500 mt-1">{exam.nameTamil}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{exam.description}</p>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {exam.vacancyCount && (
                    <div className="bg-[#0A0E1A] rounded-lg p-4 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">{t('இடங்கள்', 'Vacancies')}</p>
                      <p className="text-2xl font-bold text-brand-primary">{exam.vacancyCount.toLocaleString()}</p>
                    </div>
                  )}
                  {exam.examDate && (
                    <div className="bg-[#0A0E1A] rounded-lg p-4 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">{t('தேர்வு தேதி', 'Exam Date')}</p>
                      <p className="text-lg font-bold text-brand-secondary">{new Date(exam.examDate).toLocaleDateString('en-GB')}</p>
                    </div>
                  )}
                  <div className="bg-[#0A0E1A] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">{t('நிலை', 'Difficulty')}</p>
                    <p className="text-lg font-bold text-amber-400">{t('உচ்சம்', 'High')}</p>
                  </div>
                </div>

                <Link
                  to={`/exams/${exam.slug}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {t('விரிவாக அறிக', 'Learn More')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
