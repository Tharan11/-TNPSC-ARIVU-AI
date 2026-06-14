import StaticPage from '../components/common/StaticPage';
import { useT } from '../store';

export default function TermsPage() {
  const t = useT();
  return (
    <StaticPage titleTa="பயன்பாட்டு விதிமுறைகள்" titleEn="Terms of Service">
      <p>
        {t(
          'TNPSC ARIVU AI தளத்தைப் பயன்படுத்துவதன் மூலம், நீங்கள் இந்தச் சேவையை கல்வி நோக்கங்களுக்காக மட்டுமே பயன்படுத்த ஒப்புக்கொள்கிறீர்கள். தளத்தின் உள்ளடக்கத்தை மறுவிற்பனை செய்யவோ அல்லது தவறாகப் பயன்படுத்தவோ அனுமதி இல்லை.',
          'By using TNPSC ARIVU AI, you agree to use this service for educational purposes only. Reselling, redistributing, or misusing the platform content is not permitted.'
        )}
      </p>
      <p>
        {t(
          'எங்கள் சேவைகள் "இருக்கும் வகையில்" வழங்கப்படுகின்றன, மேலும் காலத்திற்கேற்ப மேம்படுத்தப்படலாம்.',
          'Our services are provided "as is" and may be updated or improved over time.'
        )}
      </p>
    </StaticPage>
  );
}
