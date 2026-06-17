import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Twitter, Facebook, Github } from 'lucide-react';
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
        { label: t('தரவரிசை', 'Leaderboard'), path: '/leaderboard' },
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
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                அ
              </div>
              <span className="font-extrabold text-xl tracking-tight text-red-600">
                ARIVU <span className="text-gray-900 dark:text-white font-medium text-base">AI</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              {t('"அறிவே வெற்றி" — தமிழ்நாட்டின் ஒவ்வொரு மாணவருக்கும் இலவச TNPSC தயாரிப்பு.', '"Arivae Vetri" — Free TNPSC preparation for every student in Tamil Nadu.')}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <a href="https://twitter.com" className="text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://github.com" className="text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors" aria-label="Github">
                <Github className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>gangatharan110907@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>+91 82480 07152</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{t('தூத்துக்குடி, தமிழ்நாடு', 'Thoothukudi, Tamil Nadu')}</span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 tracking-wider uppercase mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-medium">
            &copy; 2026 ARIVU AI. {t('எல்லா உரிமைகளும் பாதுகாக்கப்பட்டவை.', 'All rights reserved.')}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 font-medium">
            <span>{t('தமிழ்நாட்டு மாணவர்களுக்கு அர்ப்பணிப்புடன்', 'Made with dedication for Tamil Nadu students')}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
