import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { useT } from '../store';

const STORIES = [
  { name: 'ரமேஷ் குமார்', exam: 'Group 2', year: '2024', score: '182/300', quote_ta: 'ARIVU AI இல்லாமல் என் வெற்றி சாத்தியமில்லை. தினசரி மாக் தேர்வுகள் என்னை தயார்படுத்தின.', quote_en: 'Without ARIVU AI, my success would not have been possible. Daily mock tests prepared me well.', initial: 'ர' },
  { name: 'Priya Devi', exam: 'Group 4', year: '2024', score: '195/300', quote_ta: 'AI ஆசிரியர் என்னுடைய சந்தேகங்களை உடனடியாக தீர்த்தது.', quote_en: 'The AI tutor resolved my doubts instantly.', initial: 'P' },
  { name: 'கார்த்திக் ராஜ்', exam: 'VAO', year: '2023', score: '210/300', quote_ta: 'நடப்பு நிகழ்வுகள் பகுதி மிகவும் உதவியது.', quote_en: 'The current affairs section was very helpful.', initial: 'க' },
  { name: 'Meena S', exam: 'Group 2A', year: '2023', score: '178/300', quote_ta: 'முந்தைய வினாத்தாள்கள் practice செய்தேன், தேர்ச்சி கிடைத்தது.', quote_en: 'I practiced previous papers and cleared the exam.', initial: 'M' },
];

export default function SuccessStoriesPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <section className="py-16 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">{t('வெற்றிக் கதைகள்', 'Success Stories')}</h1>
          <p className="text-gray-400">{t('ARIVU AI மூலம் வெற்றி பெற்ற மாணவர்கள்', 'Students who succeeded with ARIVU AI')}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-6">
          {STORIES.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-brand-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">{s.initial}</div>
                <div>
                  <p className="font-semibold text-white">{s.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">{s.exam}</span>
                    <span className="text-xs text-gray-500">{s.year} · {s.score}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,j) => <Star key={j} className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />)}</div>
              <p className="text-sm text-gray-300 leading-relaxed italic">"{t(s.quote_ta, s.quote_en)}"</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
