import { Trophy, Medal } from 'lucide-react';
import { useT } from '../store';

const MOCK_LEADERS = [
  { rank: 1, name: 'ரமேஷ் நிறைவழ்', xp: 12450 },
  { rank: 2, name: 'Priya Sharma', xp: 11820 },
  { rank: 3, name: 'விஜய் ராஜ்', xp: 10990 },
  { rank: 4, name: 'கவின் பிரசாத்', xp: 9870 },
  { rank: 5, name: 'Arun Kumar', xp: 9210 },
  { rank: 6, name: 'Meena Subramaniam', xp: 8640 },
];

const medalColor = (rank: number) =>
  rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-gray-600';

export default function LeaderboardPage() {
  const t = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-2 mb-8">
        <Trophy className="w-7 h-7 text-yellow-400" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {t('தரவரிசை', 'Leaderboard')}
        </h1>
      </div>
      <div className="space-y-2">
        {MOCK_LEADERS.map((leader) => (
          <div
            key={leader.rank}
            className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${medalColor(leader.rank)}`}>
                {leader.rank <= 3 ? <Medal className="w-5 h-5" /> : leader.rank}
              </span>
              <span className="text-white font-medium">{leader.name}</span>
            </div>
            <span className="text-brand-primary font-semibold">{leader.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-6 text-center">
        {t('இது மாதிரி தரவு — Supabase இணைப்புக்குப் பிறகு உண்மையான தரவரிசை காட்டப்படும்.', 'This is sample data — real rankings will appear once connected to Supabase.')}
      </p>
    </div>
  );
}
