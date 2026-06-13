import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, Paperclip, Zap, Plus, ChevronLeft,
  Brain, X
} from 'lucide-react';
import { useAppStore, useT } from '../store';
import type { AIMessage } from '../lib/types';

interface Conversation {
  id: string;
  title: string;
  date: string;
  mode: 'CHAT' | 'VOICE' | 'PDF_QA' | 'NOTE_GEN' | 'MCQ_GEN' | 'STUDY_PLAN';
  isActive: boolean;
}

const mockConversations: Conversation[] = [
  { id: '1', title: 'தமிழ் நாட்டின் வரலாறு', date: 'Today', mode: 'CHAT', isActive: true },
  { id: '2', title: 'இந்திய அரசியலமைப்பு பகுதி', date: 'Yesterday', mode: 'CHAT', isActive: false },
  { id: '3', title: 'புவியியல் - கோட்டை பகுதி', date: '2 days ago', mode: 'VOICE', isActive: false },
  { id: '4', title: 'மாதிரி கேள்வி தொகுப்பு', date: 'Last week', mode: 'MCQ_GEN', isActive: false },
];

const responseMap: Record<string, string> = {
  history: 'தமிழ்நாட்டின் வரலாறு பண்டைய சோழ பேரரசு, பாண்டிய பேரரசு மற்றும் சேர பேரரசுடன் தொடங்கி, ஆங்கிலேய காலம் வரை பல்வேறு சாம்ராஜ்ய ஆட்சியை கண்டிருக்கிறது. தெರியல் மண்ணிலே பல உயர்ந்த கட்டிடக்கலை மாமிச மற்றும் கலை கொஞ்சம் உருவாகிவிட்டன.',
  வரலாறு: 'தமிழ்நாட்டின் வரலாறு பண்டைய சோழ பேரரசு, பாண்டிய பேரரசு மற்றும் சேர பேரரசுடன் தொடங்கி, ஆங்கிலேய காலம் வரை பல்வேறு சாம்ராஜ்ய ஆட்சியை கண்டிருக்கிறது.',
  constitution: 'இந்திய அரசியலமைப்பு 1950 ஜனவரி 26-ம் தேதியன்று நடுத்தமிழிலாக அமுல்படுத்தப்பட்டது. இது ஜனநாயக வடிவத்தை குறிப்பிடுகிறது மற்றும் அனைத்து குடிமக்களுக்கும் சமைப்புக்குரிய உரிமைகளை வழங்குகிறது.',
  அரசியலமைப்பு: 'இந்திய அரசியலமைப்பு 1950 ஜனவரி 26-ம் தேதியன்று நடுத்தமிழிலாக அமுல்படுத்தப்பட்டது. இது ஜனநாயக வடிவத்திற்கு உரிய நீதித் தொகுப்பைக் கொண்டுள்ளது.',
  geography: 'தமிழ்நாட்டின் புவியியல் சிறப்பு கொண்ட நிலப்பரப்பு, அதாவது மலைகள், சமவெளிகள் மற்றும் கடற்கரைகளால் சூழப்பட்டுள்ளது. இது 130,000 சதுர கி.மீ பரப்பளவாக விரிந்துள்ளது.',
  புவியியல்: 'தமிழ்நாட்டின் புவியியல் சிறப்பு கொண்ட நிலப்பரப்பு, அதாவது மலைகள், சமவெளிகள் மற்றும் கடற்கரைகளால் சூழப்பட்டுள்ளது.',
};

const defaultResponse = 'TNPSC தேர்வுகளுக்கு தயாரிப்புக்கு விடாமுயற்சி மற்றும் முறையான கற்றலை பின்பற்றவும். நீங்கள் மேலும் எந்த பாடப்பொருள் பற்றி கற்க விரும்புகிறீர்கள்?';

function TypingIndicator() {
  return (
    <motion.div className="flex items-end gap-1 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-brand-primary"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

function ConversationHistory({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useT();

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
      className="fixed md:relative md:w-2/5 w-full h-screen bg-navy-900 border-r border-navy-800 flex flex-col"
    >
      <div className="p-4 border-b border-navy-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{t('கலந்துரையாடல்கள்', 'Conversations')}</h2>
        <button onClick={onClose} className="md:hidden">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <button className="m-4 flex items-center justify-center gap-2 btn-primary w-full">
        <Plus className="w-4 h-4" />
        <span className="text-sm">{t('புதிய சாட்', 'New Chat')}</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 px-4">
        {mockConversations.map((conv) => (
          <motion.button
            key={conv.id}
            whileHover={{ x: 4 }}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              conv.isActive
                ? 'bg-brand-primary/20 border border-brand-primary/40'
                : 'bg-navy-800 border border-navy-700 hover:border-navy-600'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate tamil">{conv.title}</p>
                <p className="text-xs text-gray-400 mt-1">{conv.date}</p>
              </div>
              <span className="badge-cyan text-[10px] shrink-0">{conv.mode}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ChatMessage({ msg, idx }: { msg: AIMessage; idx: number }) {
  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-amber-500 flex items-center justify-center mr-3 flex-shrink-0">
          <Zap className="w-4 h-4 text-navy-950" />
        </div>
      )}

      <div
        className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-navy-800 text-white'
            : 'bg-glass border border-navy-700 text-gray-200'
        }`}
      >
        <p className="text-sm leading-relaxed">{msg.content}</p>
      </div>
    </motion.div>
  );
}

export default function AITutorPage() {
  const t = useT();
  const { language } = useAppStore();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: language === 'TAMIL'
        ? 'வணக்கம்! நான் ARIVU, உங்கள் AI பயிற்றி. TNPSC தேர்வுக்கு தயாரிப்பில் உங்களுக்கு உதவ எனக்கு மகிழ்ச்சி. என்ன பற்றி கற்க விரும்புகிறீர்கள்?'
        : 'Hello! I am ARIVU, your AI tutor. I am happy to help you prepare for the TNPSC exam. What would you like to learn about?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [language_, setLanguage_] = useState<'TAMIL' | 'ENGLISH'>('TAMIL');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getResponse = (userMsg: string): string => {
    const lowerMsg = userMsg.toLowerCase();
    for (const [key, value] of Object.entries(responseMap)) {
      if (lowerMsg.includes(key)) {
        return value;
      }
    }
    return defaultResponse;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: AIMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(input);
      const aiMsg: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex overflow-hidden">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPanelOpen(false)}
            className="fixed inset-0 bg-black/50 md:hidden z-30"
          />
        )}
      </AnimatePresence>

      {/* Left Panel - Conversation History (40%) */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/3">
        <ConversationHistory isOpen={true} onClose={() => setIsPanelOpen(false)} />
      </div>

      {/* Mobile Conversation Panel */}
      <div className="md:hidden z-40">
        <ConversationHistory isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </div>

      {/* Right Panel - Chat (60%) */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="bg-navy-900 border-b border-navy-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="md:hidden p-2 hover:bg-navy-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-brand-primary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-amber-500 flex items-center justify-center">
                <Brain className="w-4 h-4 text-navy-950" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">{t('ARIVU', 'ARIVU')}</h1>
                <p className="text-xs text-gray-400">{t('AI குரு', 'AI Tutor')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="badge-cyan cursor-pointer">
              {language_ === 'TAMIL' ? '🇮🇳 தமிழ்' : '🇬🇧 English'}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <ChatMessage key={`${msg.timestamp}-${idx}`} msg={msg} idx={idx} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-navy-900 border-t border-navy-800 p-4 md:p-6 space-y-3">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('உங்கள் கேள்வியை இங்கே உள்ளிடவும்...', 'Type your question here...')}
              rows={1}
              className="input-field resize-none"
              style={{ maxHeight: '120px', minHeight: '44px' }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors border border-navy-700 hover:border-brand-secondary">
                <Mic className="w-5 h-5 text-brand-secondary" />
              </button>
              <button className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors border border-navy-700 hover:border-brand-secondary">
                <Paperclip className="w-5 h-5 text-brand-secondary" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-navy-800 rounded-lg px-2 py-1 border border-navy-700">
                <button
                  onClick={() => setLanguage_('TAMIL')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    language_ === 'TAMIL'
                      ? 'bg-brand-primary text-navy-950'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  தமிழ்
                </button>
                <div className="w-px h-4 bg-navy-700" />
                <button
                  onClick={() => setLanguage_('ENGLISH')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    language_ === 'ENGLISH'
                      ? 'bg-brand-primary text-navy-950'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="btn-primary p-2.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
