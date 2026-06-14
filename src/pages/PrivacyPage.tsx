import StaticPage from '../components/common/StaticPage';
import { useT } from '../store';

export default function PrivacyPage() {
  const t = useT();
  return (
    <StaticPage titleTa="தனியுரிமைக் கொள்கை" titleEn="Privacy Policy">
      <p>
        {t(
          'உங்கள் தனிப்பட்ட தகவல்களை நாங்கள் பாதுகாப்பாக கையாள்கிறோம். உங்கள் பெயர், மின்னஞ்சல் மற்றும் கற்றல் முன்னேற்ற தரவு ஆகியவை தேர்வுத் தயாரிப்பு அனுபவத்தை மேம்படுத்த மட்டுமே பயன்படுத்தப்படும், மூன்றாம் தரப்பினருடன் பகிரப்படாது.',
          'We take your privacy seriously. Information such as your name, email, and learning progress data is used solely to improve your exam preparation experience and is never sold or shared with third parties.'
        )}
      </p>
      <p>
        {t(
          'மேலும் கேள்விகளுக்கு, எங்கள் தொடர்பு பக்கம் வழியாக எங்களைத் தொடர்பு கொள்ளவும்.',
          'For further questions, please reach us via our Contact page.'
        )}
      </p>
    </StaticPage>
  );
}
