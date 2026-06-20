import { useState, useEffect } from 'react';
import { Trophy, Medal, RefreshCw } from 'lucide-react';
import { useT, useAppStore } from '../store';
import { supabase } from '../lib/supabase';

interface Leader { rank: number; name: string; xp: number; isMe?: boolean; }

const medalColor = (rank: number) =>
  rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-gray-500';

export default function LeaderboardPage() {
  const t = useT();
  const { user } = useAppStore();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<Leader | null>(null);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, xp, id')
        .order('xp', { ascending: false })
        .limit(20);
      if (data && data.length > 0) {
        const ranked = data.map((p, i) => ({
          rank: i + 1,
          name: p.display_name || t('அறியப்படாதவர்', 'Anonymous'),
          xp: p.xp || 0,
          isMe: p.id === user?.id,
        }));
        setLeaders(ranked);
        const me = ranked.find(r => r.isMe);
        if (me) setMyRank(me);
      } else {
        setLeaders([]);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaders(); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('தரவரிசை', 'Leaderboard')}</h1>
        </div>
        <button onClick={fetchLeaders} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Refresh">
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {myRank && (
        <div className="mb-6 p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30">
          <p className="text-sm text-brand-primary font-medium">
            {t('உங்கள் தரவரிசை', 'Your Rank')}: #{myRank.rank} — {myRank.xp.toLocaleString()} XP
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_,i) => <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />)}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">{t('இன்னும் யாரும் பங்கேற்கவில்லை. முதலில் நீங்களே ஆகுங்கள்!', 'No users yet — be the first!')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.map((leader) => (
            <div key={leader.rank}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors
                ${leader.isMe ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-white/5 bg-white/[0.02]'}`}>
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${medalColor(leader.rank)}`}>
                  {leader.rank <= 3 ? <Medal className="w-5 h-5" /> : leader.rank}
                </span>
                <span className={`font-medium ${leader.isMe ? 'text-brand-primary' : 'text-white'}`}>
                  {leader.name} {leader.isMe ? t('(நீங்கள்)', '(You)') : ''}
                </span>
              </div>
              <span className="text-brand-primary font-semibold text-sm">{leader.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
