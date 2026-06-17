import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Target, Sparkles, FileText, FlaskConical, Newspaper, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../../store';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface PaletteItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const t = useT();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const quickNav: PaletteItem[] = [
    { icon: <Target className="w-4 h-4" />, label: t('நேரடி தேர்வு அறைக்கு செல்', 'Go to Live Mock Test Room'), path: '/tests' },
    { icon: <Sparkles className="w-4 h-4" />, label: t('AI ஆசிரியர் அரட்டையை திற', 'Open AI Tutor Chat'), path: '/ai-tutor' },
  ];

  const recentlyViewed: PaletteItem[] = [
    { icon: <FileText className="w-4 h-4" />, label: t('பாடம் 8: தமிழக வரலாறு & பண்பாடு', 'Unit 8: History & Culture of Tamil Nadu'), path: '/exams' },
    { icon: <FlaskConical className="w-4 h-4" />, label: t('குரூப் II முதல்நிலை மாதிரி தேர்வு #4', 'Group II Preliminary Mock Test #4'), path: '/tests' },
  ];

  const latestUpdates: PaletteItem[] = [
    { icon: <Newspaper className="w-4 h-4" />, label: t('நடப்பு நிகழ்வுகள் - ஜூன் 2026 மாத தொகுப்பு', 'Current Affairs - June 2026 Monthly Capsule'), path: '/current-affairs' },
  ];

  const filterItems = (items: PaletteItem[]) =>
    query.trim() === ''
      ? items
      : items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  const sections = [
    { title: t('விரைவு வழிசெலுத்தல்', 'QUICK NAVIGATION'), items: filterItems(quickNav) },
    { title: t('சமீபத்தில் பார்த்தவை', 'RECENTLY VIEWED'), items: filterItems(recentlyViewed) },
    { title: t('சமீபத்திய புதுப்பிப்புகள்', 'LATEST UPDATES'), items: filterItems(latestUpdates) },
  ].filter((s) => s.items.length > 0);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-0 z-[101] flex justify-center px-4 pt-4 sm:pt-24"
          >
            <div className="w-full max-w-xl bg-[#1F2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden h-full sm:h-auto sm:max-h-[70vh] flex flex-col">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('தேர்வுகள், தலைப்புகளை தேடுங்கள், அல்லது AI கேளுங்கள்...', 'Search mock tests, topics, or ask AI...')}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors sm:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
                <kbd className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-gray-500">Esc</kbd>
              </div>

              {/* Results */}
              <div className="overflow-y-auto flex-1 py-2">
                {sections.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    {t('முடிவுகள் இல்லை', 'No results found')}
                  </div>
                )}
                {sections.map((section) => (
                  <div key={section.title} className="px-2 py-1">
                    <div className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-gray-500">
                      {section.title}
                    </div>
                    {section.items.map((item) => (
                      <button
                        key={item.path + item.label}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                      >
                        <span className="text-brand-primary">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
