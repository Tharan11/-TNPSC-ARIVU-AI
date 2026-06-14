import { motion } from 'framer-motion';
import { useT } from '../../store';

interface StaticPageProps {
  titleTa: string;
  titleEn: string;
  children?: React.ReactNode;
}

export default function StaticPage({ titleTa, titleEn, children }: StaticPageProps) {
  const t = useT();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          {t(titleTa, titleEn)}
        </h1>
        <div className="prose prose-invert prose-sm sm:prose-base text-gray-400 leading-relaxed space-y-4">
          {children || (
            <p>{t('இந்தப் பக்கம் தயாராகிக்கொண்டிருக்கிறது. விரைவில் வருகிறது!', 'This page is under construction. Coming soon!')}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
