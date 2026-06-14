import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useT } from '../../store';

export default function Footer() {
  const t = useT();

  const sections = [
    {
      title: t('தேர்வுகள்', 'Exams'),
      links: [
        { label: 'Group 1', path: '/exams/group-1' },
        { label: 'Group 2', path: '/exams/group-2' },
        { label: 'Group 2A', path: '/exams/group-2a' },
        { label: 'Group 4', path: '/exams/group-4' },
        { label: 'VAO', path: '/exams/vao' },
      ],
    },
    {
      title: t('படிப்பு', 'Learning'),
      links: [
        { label: t('AI ஆசிரியர்', 'AI Tutor'), path: '/ai-tutor' },
        { label: t('மாக் தேர்வு', 'Mock Tests'), path: '/tests' },
        { label: t('நடப்பு நிகழ்வுகள்', 'Current Affairs'), path: '/current-affairs' },
        { label: t('முந்தைய வினாக்கள்', 'Previous Year Qs'), path: '/pyq' },
        { label: t('படிப்புத் திட்டம்', 'Study Planner'), path: '/planner' },
      ],
    },
    {
      title: t('சமூகம்', 'Community'),
      links: [
        { label: t('விவாதம்', 'Forum'), path: '/community' },
        { label: t('படிப்பு குழு', 'Study Groups'), path: '/community/groups' },
        { label: t('வழிகாட்டிகள்', 'Mentors'), path: '/community/mentors' },
        { label: t('வெற்றிக் கதைகள்', 'Success Stories'), path: '/success-stories' },
      ],
    },
    {
      title: t('பற்றி', 'About'),
      links: [
        { label: t('எங்களைப் பற்றி', 'About Us'), path: '/about' },
        { label: t('தொடர்பு', 'Contact'), path: '/contact' },
        { label: t('தனியுரிமை', 'Privacy'), path: '/privacy' },
        { label: t('விதிமுறைகள்', 'Terms'), path: '/terms' },
        { label: t('அடிக்கடி கேட்கப்படும் கேள்விகள்', 'FAQ'), path: '/faq' },
      ],
    },
  ];

  return (
    <footer className="bg-[#070B14] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg overflow-hidden">
                <img src="/logo-icon.svg" alt="ARIVU AI" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">ARIVU</span>
                <span className="text-[10px] text-brand-primary font-medium">AI</span>
              </div>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('"அறிவே வெற்றி" — Knowledge is Victory. Free TNPSC preparation for every student in Tamil Nadu.', '"அறிவே வெற்றி" — தமிழ்நாட்டின் ஒவ்வொரு மாணவருக்கும் இலவச TNPSC தயாரிப்பு.')}
            </p>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-xs text-gray-500 hover:text-brand-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            {t('© 2026 TNPSC ARIVU AI. எல்லா உரிமைகளும் பாதுகாக்கப்பட்டவை.', '© 2026 TNPSC ARIVU AI. All rights reserved.')}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            {t('தமிழ்நாட்டு மாணவர்களுக்கு அர்ப்பணிப்புடன்', 'Made with dedication for Tamil Nadu students')} <Heart className="w-3 h-3 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
