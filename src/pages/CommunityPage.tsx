import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, BookOpen, Award, ThumbsUp, MessageCircle, Tag, Users, Plus, TrendingUp } from 'lucide-react';
import { useT } from '../store';

type TabType = 'discussions' | 'doubts' | 'resources' | 'achievements';

const MOCK_POSTS = [
  { id: '1', title: 'Group 1 Strategy - How I Cracked Prelims', titleTamil: 'குரூப் 1 உத்தி - முன்தேர்வு வெற்றி', author: 'ரமேஷ் நிறைவழ்', authorInitial: 'R', upvotes: 345, replies: 28, tags: ['GROUP_1', 'STRATEGY'], timeAgo: '2h' },
  { id: '2', title: 'Current Affairs January - Important Tips', titleTamil: 'ஜனவரி செய்திகள் - முக்கியம்', author: 'Priya Sharma', authorInitial: 'P', upvotes: 212, replies: 45, tags: ['AFFAIRS', 'TIPS'], timeAgo: '4h' },
  { id: '3', title: 'Help: How to approach History optional?', titleTamil: 'உதவி: வரலாற்றைப் பொறுத்து', author: 'கவின் பிரசாத்', authorInitial: 'K', upvotes: 89, replies: 12, tags: ['DOUBT'], timeAgo: '6h' },
  { id: '4', title: 'Free Resources for Tamil & English', titleTamil: 'தமிழ் மற்றும் ஆங்கில ஆதாரம்', author: 'Arun Kumar', authorInitial: 'A', upvotes: 567, replies: 78, tags: ['RESOURCES'], timeAgo: '1d' },
  { id: '5', title: 'I cleared Group 2A! Success stories', titleTamil: 'குரூப் 2A வெற்றி!', author: 'விஜய் ராஜ்', authorInitial: 'V', upvotes: 891, replies: 156, tags: ['SUCCESS'], timeAgo: '2d' },
  { id: '6', title: 'How to balance studies with work?', titleTamil: 'வேலையுடன் படிப்பைச் சமநிலைப்படுத்து', author: 'Meena Subramaniam', authorInitial: 'M', upvotes: 234, replies: 34, tags: ['BALANCE'], timeAgo: '3d' },
];

const POPULAR_TAGS = [
  { name: 'GROUP_1', count: 245 }, { name: 'AFFAIRS', count: 189 }, { name: 'MOCK_TEST', count: 156 },
  { name: 'STRATEGY', count: 143 }, { name: 'RESOURCES', count: 128 },
];

const ACTIVE_MEMBERS = ['ரமேஷ் நிறைவழ்', 'Priya Sharma', 'கவின் பிரசாத்', 'Arun Kumar', 'விஜய் ராஜ்'];

const STUDY_GROUPS = [
  { name: 'Group 1 Prep - June Batch', members: 234 },
  { name: 'VAO Crash Course', members: 156 },
  { name: 'Current Affairs Discussion', members: 289 },
];

export default function CommunityPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState<TabType>('discussions');
  const tabs: TabType[] = ['discussions', 'doubts', 'resources', 'achievements'];

  const icons: Record<TabType, React.FC<any>> = {
    discussions: MessageSquare, doubts: HelpCircle, resources: BookOpen, achievements: Award
  };

  const labels: Record<TabType, string> = {
    discussions: t('விவாதங்கள்', 'Discussions'),
    doubts: t('சந்தேகங்கள்', 'Doubts'),
    resources: t('ஆதாரங்கள்', 'Resources'),
    achievements: t('சாதனைகள்', 'Achievements'),
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Header */}
      <section className="relative py-12 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{t('சமூகம்', 'Community')}</h1>
              <p className="text-gray-400 text-sm">{t('மாணவர்களுடன் இணைந்து, கேள்விகளைக் கேட்டு, வெற்றிகளைப் பகிர்ந்துகொள்ளுங்கள்', 'Connect, ask questions, share success')}</p>
            </div>
            <button
              onClick={() => alert(t('கேள்வி கேட்கும் அம்சம் விரைவில் வருகிறது!', 'Post creation coming soon!'))}
              className="btn-primary flex items-center gap-2 shrink-0">
              <Plus className="w-4 h-4" /> {t('கேள்வி', 'Ask')}
            </button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-4">
            {tabs.map((tab) => {
              const Icon = icons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab ? 'btn-primary' : 'bg-[#111827] text-gray-400 border border-white/10'
                    }`}
                >
                  <Icon className="w-4 h-4" /> {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Posts */}
            <div className="lg:col-span-2 space-y-4">
              {(activeTab === 'discussions'
                ? MOCK_POSTS
                : activeTab === 'doubts'
                ? MOCK_POSTS.filter(p => p.tags.includes('DOUBT'))
                : activeTab === 'resources'
                ? MOCK_POSTS.filter(p => p.tags.includes('RESOURCES'))
                : MOCK_POSTS.filter(p => p.tags.includes('SUCCESS'))
              ).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card group cursor-pointer hover:border-brand-primary/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {post.authorInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-medium text-gray-400">{post.author}</p>
                          <p className="text-xs text-gray-500">{post.timeAgo}</p>
                        </div>
                        {post.upvotes > 100 && (
                          <div className="flex items-center gap-1 bg-brand-primary/10 rounded-lg px-2.5 py-1 flex-shrink-0">
                            <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                            <span className="text-xs font-semibold text-brand-primary">{post.upvotes}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-secondary transition-colors tamil line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="badge-cyan text-xs px-2.5 py-1">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" /> {post.upvotes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {post.replies}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 hidden lg:block">
              {/* Tags */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <Tag className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-semibold text-white">{t('குறிச்சொற்கள்', 'Popular Tags')}</h3>
                </div>
                <div className="space-y-2">
                  {POPULAR_TAGS.map((tag) => (
                    <div key={tag.name} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm text-gray-300 group-hover:text-brand-secondary transition-colors">
                        {tag.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-[#111827] px-2 py-1 rounded">{tag.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <Users className="w-5 h-5 text-brand-secondary" />
                  <h3 className="font-semibold text-white">{t('உறுப்பினர்கள்', 'Members')}</h3>
                </div>
                <div className="space-y-3">
                  {ACTIVE_MEMBERS.map((member, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center text-xs font-medium text-white">
                        {member.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-brand-secondary transition-colors tamil">
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Groups */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <MessageCircle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-white">{t('குழுக்கள்', 'Groups')}</h3>
                </div>
                <div className="space-y-3">
                  {STUDY_GROUPS.map((group, i) => (
                    <div key={i} className="p-3 bg-[#111827] rounded-lg border border-white/5 cursor-pointer hover:border-brand-primary/30 transition-colors">
                      <p className="text-sm font-medium text-white mb-1 tamil">{group.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{group.members} {t('உறுப்பினர்கள்', 'members')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
