import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Info, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useT, useAppStore } from '../store';
import { supabase } from '../lib/supabase';

interface Notif {
  id: string;
  type: 'info' | 'achievement' | 'reminder';
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

const ICON_MAP = { info: Info, achievement: Trophy, reminder: Zap };
const COLOR_MAP = { info: 'text-blue-400', achievement: 'text-yellow-400', reminder: 'text-brand-primary' };

export default function NotificationsPage() {
  const t = useT();
  const { user } = useAppStore();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.id) { setLoading(false); return; }
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      setNotifs(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const markAllRead = async () => {
    if (!user?.id) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-primary" />
          <h1 className="text-2xl font-bold text-white">{t('அறிவிப்புகள்', 'Notifications')}</h1>
          {unread > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-primary text-black text-xs font-bold flex items-center justify-center">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
            <CheckCheck className="w-4 h-4" /> {t('அனைத்தும் படித்தது', 'Mark all read')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">{t('அறிவிப்புகள் இல்லை', 'No notifications yet')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map((n, i) => {
            const Icon = ICON_MAP[n.type] || Info;
            const color = COLOR_MAP[n.type] || 'text-gray-400';
            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${n.read ? 'bg-white/[0.02] border-white/5' : 'bg-brand-primary/5 border-brand-primary/20'}`}>
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.body}</p>
                  <p className="text-xs text-gray-600 mt-1">{new Date(n.created_at).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => deleteNotif(n.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
