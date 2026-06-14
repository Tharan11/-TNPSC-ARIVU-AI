import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useT } from '../store';

export default function FAQPage() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qTa: 'ARIVU AI முற்றிலும் இலவசமா?',
      qEn: 'Is ARIVU AI completely free?',
      aTa: 'ஆம், எங்கள் முக்கிய அம்சங்கள் அனைத்தும் தமிழ்நாட்டு மாணவர்களுக்கு இலவசமாக வழங்கப்படுகின்றன.',
      aEn: 'Yes, all our core features are provided free of cost for students preparing for TNPSC exams.',
    },
    {
      qTa: 'AI Tutor எப்படி வேலை செய்கிறது?',
      qEn: 'How does the AI Tutor work?',
      aTa: 'AI Tutor உங்கள் கேள்விகளுக்கு தமிழ் மற்றும் ஆங்கிலத்தில் விளக்கங்களை வழங்கி, பாடங்களைப் புரிந்துகொள்ள உதவுகிறது.',
      aEn: 'The AI Tutor answers your questions and explains concepts in Tamil and English to help you understand topics better.',
    },
    {
      qTa: 'மாக் தேர்வுகள் கிடைக்குமா?',
      qEn: 'Are mock tests available?',
      aTa: 'ஆம், Group 1, 2, 2A, 4 மற்றும் VAO தேர்வுகளுக்கான மாக் தேர்வுகள் கிடைக்கின்றன.',
      aEn: 'Yes, mock tests for Group 1, 2, 2A, 4, and VAO exams are available.',
    },
    {
      qTa: 'எனது முன்னேற்றத்தை எப்படி கண்காணிக்கலாம்?',
      qEn: 'How can I track my progress?',
      aTa: 'உங்கள் டாஷ்போர்டில் streak, தரவரிசை மற்றும் XP புள்ளிகள் மூலம் முன்னேற்றத்தைக் காணலாம்.',
      aEn: 'Your dashboard shows your streak, rank, and XP points to help track your progress.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
        {t('அடிக்கடி கேட்கப்படும் கேள்விகள்', 'Frequently Asked Questions')}
      </h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-white font-medium"
            >
              {t(faq.qTa, faq.qEn)}
              <ChevronDown className={`w-4 h-4 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-3 text-sm text-gray-400"
              >
                {t(faq.aTa, faq.aEn)}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
