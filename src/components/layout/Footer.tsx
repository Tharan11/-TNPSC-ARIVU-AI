import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Github, Twitter, Facebook } from 'lucide-react';
import { useT } from '../../store';

const FOOTER_LINKS = {
  exams: [
    { label: 'Group 1', to: '/exams/group-1' },
    { label: 'Group 2', to: '/exams/group-2' },
    { label: 'Group 2A', to: '/exams/group-2a' },
    { label: 'Group 4', to: '/exams/group-4' },
    { label: 'VAO', to: '/exams/vao' },
  ],
  learn: [
    { labelTa: 'AI ஆசிரியர்', labelEn: 'AI Tutor', to: '/ai-tutor' },
    { labelTa: 'மாக் தேர்வு', labelEn: 'Mock Tests', to: '/tests' },
    { labelTa: 'நடப்பு நிகழ்வுகள்', labelEn: 'Current Affairs', to: '/current-affairs' },
    { labelTa: 'முந்தைய வினாத்தாள்', labelEn: 'Previous Papers', to: '/pyq' },
    { labelTa: 'படிப்புத் திட்டம்', labelEn: 'Study Planner', to: '/planner' },
  ],
  community: [
    { labelTa: 'விவாதம்', labelEn: 'Discussions', to: '/community' },
    { labelTa: 'தரவரிசை', labelEn: 'Leaderboard', to: '/leaderboard' },
    { labelTa: 'வெற்றிக் கதைகள்', labelEn: 'Success Stories', to: '/community/success-stories' },
  ],
  about: [
    { labelTa: 'எங்களைப் பற்றி', labelEn: 'About Us', to: '/about' },
    { labelTa: 'தொடர்பு', labelEn: 'Contact', to: '/contact' },
    { labelTa: 'தனியுரிமை', labelEn: 'Privacy', to: '/privacy' },
    { labelTa: 'விதிமுறைகள்', labelEn: 'Terms', to: '/terms' },
    { labelTa: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', labelEn: 'FAQ', to: '/faq' },
  ],
};

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-[#080C18] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-black font-bold text-sm">அ</div>
              <span className="font-bold text-white">ARIVU <span className="text-brand-primary">AI</span></span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              {t('"அறிவே வெற்றி" — தமிழ்நாட்டின் ஒவ்வொரு மாணவருக்கும் இலவச TNPSC தயாரிப்பு.',
                '"Knowledge is Victory" — Free TNPSC prep for every student in Tamil Nadu.')}
            </p>
            {/* Contact Buttons */}
            <div className="flex flex-col gap-2">
              <a href="mailto:gangatharan110907@gmail.com"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-primary transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                gangatharan110907@gmail.com
              </a>
              <a href="tel:+918248007152"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-brand-primary transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                +91 82480 07152
              </a>
              <a href="https://wa.me/918248007152?text=Hi%20ARIVU%20AI%20-%20I%20need%20help"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-green-400/10 flex items-center justify-center transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Exams */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('தேர்வுகள்', 'Exams')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.exams.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('படிப்பு', 'Learn')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.learn.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {t(l.labelTa, l.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('சமூகம்', 'Community')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.community.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {t(l.labelTa, l.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">
              {t('பற்றி', 'About')}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.about.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {t(l.labelTa, l.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2026 ARIVU AI. {t('எல்லா உரிமைகளும் பாதுகாக்கப்பட்டவை.', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Twitter className="w-3.5 h-3.5 text-gray-500" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Facebook className="w-3.5 h-3.5 text-gray-500" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Github className="w-3.5 h-3.5 text-gray-500" />
            </a>
          </div>
          <p className="text-xs text-gray-600">
            {t('தமிழ்நாடு மாணவர்களுக்கு அர்பணிப்புடன் ❤️', 'Made with ❤️ for Tamil Nadu students')}
          </p>
        </div>
      </div>
    </footer>
  );
}
