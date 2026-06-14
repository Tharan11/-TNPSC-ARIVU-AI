import StaticPage from '../components/common/StaticPage';
import { Mail, MessageCircle } from 'lucide-react';
import { useT } from '../store';

export default function ContactPage() {
  const t = useT();
  return (
    <StaticPage titleTa="தொடர்பு" titleEn="Contact Us">
      <p>
        {t(
          'உங்கள் கேள்விகள், கருத்துகள் அல்லது பின்னூட்டங்களுக்கு எங்களைத் தொடர்பு கொள்ளவும்.',
          'For questions, feedback, or suggestions, feel free to reach out to us.'
        )}
      </p>
      <div className="flex flex-col gap-3 mt-6">
        <a href="mailto:support@arivuai.com" className="flex items-center gap-2 text-brand-primary hover:underline">
          <Mail className="w-4 h-4" /> support@arivuai.com
        </a>
        <a href="/community" className="flex items-center gap-2 text-brand-primary hover:underline">
          <MessageCircle className="w-4 h-4" /> {t('சமூக மன்றத்தில் கேளுங்கள்', 'Ask in our Community Forum')}
        </a>
      </div>
    </StaticPage>
  );
}
