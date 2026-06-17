import { useState } from 'react';
import { Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useT } from '../../store';

interface StreakBadgeProps {
  streak: number;
  target: number;
  completed: number;
}

export default function StreakBadge({ streak, target, completed }: StreakBadgeProps) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const isActive = completed >= target;
  const progress = Math.min(completed / target, 1) * 100;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-orange-500/20 to-amber-400/20 border border-amber-400/30'
            : 'bg-white/5 border border-white/10'
        }`}
        aria-label={t('தினசரி ஓட்டம்', 'Daily streak')}
      >
        <Flame
          className={`w-4 h-4 transition-all duration-300 ${
            isActive
              ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
              : 'text-gray-500 opacity-50'
          }`}
          fill={isActive ? 'currentColor' : 'none'}
        />
        <span className={`text-xs font-semibold ${isActive ? 'text-amber-300' : 'text-gray-500'}`}>
          {streak}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-[#1F2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-4 z-50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame
                className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-gray-500'}`}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-semibold text-white">
                {streak}-{t('நாள் ஓட்டம்!', 'Day Streak!')}
              </span>
            </div>

            {isActive ? (
              <p className="text-xs text-gray-400 mb-3">
                {t('இன்றைய இலக்கு முடிந்தது. அருமை!', 'Today\'s target complete. Great work!')}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mb-3">
                {t('ஓட்டத்தை தொடர இன்றைய இலக்கை முடிக்கவும்.', 'Complete today\'s target to keep your streak alive.')}
              </p>
            )}

            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>{t('இன்றைய முன்னேற்றம்', 'Today\'s progress')}</span>
              <span>{completed}/{target}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                    : 'bg-brand-primary/60'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
