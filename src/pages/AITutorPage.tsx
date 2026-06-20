import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Zap, Plus, ChevronLeft, Brain } from 'lucide-react';
import { useT } from '../store';
import type { AIMessage } from '../lib/types';

const mockConversations = [
  { id: '1', title: 'தமிழ் நாட்டின் வரலாறு', date: 'Today', mode: 'CHAT', isActive: true },
  { id: '2', title: 'இந்திய அரசியலமைப்பு', date: 'Yesterday', mode: 'CHAT', isActive: false },
  { id: '3', title: 'புவியியல் கோட்டை', date: '2 days ago', mode: 'VOICE', isActive: false },
  { id: '4', title: 'மாதிரி கேள்வி தொகுப்பு', date: 'Last week', mode: 'MCQ_GEN', isActive: false },
];

function TypingIndicator() {
  return (
    <motion.div className="flex items-end gap-1 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-primary"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

function ChatMessage({ msg, idx }: { msg: AIMessage; idx: number }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-amber-500 flex items-center justify-center mr-3 flex-shrink-0">
          <Zap className="w-4 h-4 text-navy-950" />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${isUser ? 'bg-navy-800 text-white' : 'bg-glass border border-navy-700 text-gray-200'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
      </div>
    </motion.div>
  );
}

export default function AITutorPage() {
  const t = useT();
  const [messages, setMessages] = useState<AIMessage[]>([{
    role: 'assistant',
    content: 'வணக்கம்! நான் ARIVU, உங்கள் AI பயிற்றி. TNPSC தேர்வுக்கு தயாரிப்பில் உங்களுக்கு உதவ எனக்கு மகிழ்ச்சி. என்ன பற்றி கற்க விரும்புகிறீர்கள்?',
    timestamp: Date.now(),
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setLang] = useState<'TAMIL' | 'ENGLISH'>('TAMIL');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const callOpenAI = async (userMessage: string): Promise<string> => {
    const res = await fetch('/api/ai-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, lang })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data.reply || 'பதில் கிடைக்கவில்லை';
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: AIMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const response = await callOpenAI(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}`, timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex overflow-hidden">
      <div className="hidden md:flex md:w-64 flex-col bg-navy-900 border-r border-navy-800">
        <div className="p-4 border-b border-navy-800">
          <h2 className="text-lg font-semibold text-white">{t('கலந்துரையாடல்கள்', 'Conversations')}</h2>
        </div>
        <button className="m-4 flex items-center justify-center gap-2 btn-primary">
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t('புதிய சாட்', 'New Chat')}</span>
        </button>
        <div className="flex-1 overflow-y-auto space-y-2 px-4">
          <div className="text-center py-8 text-gray-500">
            <p className="text-xs">{t('உரையாடல் வரலாறு விரைவில்', 'Chat history coming soon')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-navy-900 border-b border-navy-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-amber-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-navy-950" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">ARIVU</h1>
              <p className="text-xs text-green-400">● {t('ஆன்லைன்', 'Online')} — ARIVU AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-navy-800 rounded-lg px-2 py-1 border border-navy-700">
            <button onClick={() => setLang('TAMIL')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${lang === 'TAMIL' ? 'bg-brand-primary text-navy-950' : 'text-gray-400'}`}>
              தமிழ்
            </button>
            <div className="w-px h-4 bg-navy-700" />
            <button onClick={() => setLang('ENGLISH')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${lang === 'ENGLISH' ? 'bg-brand-primary text-navy-950' : 'text-gray-400'}`}>
              EN
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} idx={idx} />)}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-navy-900 border-t border-navy-800 p-4 space-y-3">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={t('உங்கள் கேள்வியை இங்கே உள்ளிடவும்...', 'Type your question here...')}
            rows={1} className="input-field resize-none w-full" style={{ maxHeight: '120px' }}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                title="Voice input"
                onClick={() => {
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRecognition) { alert('உங்கள் browser voice input support செய்யவில்லை'); return; }
                  const recognition = new SpeechRecognition();
                  recognition.lang = lang === 'TAMIL' ? 'ta-IN' : 'en-IN';
                  recognition.interimResults = false;
                  recognition.onresult = (e: any) => setInput(prev => prev + e.results[0][0].transcript);
                  recognition.start();
                }}
                className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700 transition-colors">
                <Mic className="w-5 h-5 text-brand-secondary" />
              </button>
              <label className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700 transition-colors cursor-pointer" title="Attach image">
                <Paperclip className="w-5 h-5 text-brand-secondary" />
                <input type="file" accept="image/*,.pdf,.txt" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setInput(prev => prev + (prev ? '\n' : '') + '[File: ' + file.name + ']');
                  }} />
              </label>
            </div>
            <button onClick={handleSend} disabled={!input.trim() || isTyping}
              className="btn-primary p-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
