import StaticPage from '../components/common/StaticPage';
import { useT } from '../store';

export default function AboutPage() {
  const t = useT();
  return (
    <StaticPage titleTa="எங்களைப் பற்றி" titleEn="About Us">
      <p>
        {t(
          'TNPSC ARIVU AI என்பது தமிழ்நாட்டு மாணவர்களுக்கான இலவச, AI-இயங்கும் தேர்வுத் தயாரிப்பு தளம். "அறிவே வெற்றி" என்ற நம்பிக்கையுடன், ஒவ்வொரு மாணவருக்கும் தரமான கல்வி வாய்ப்புகளை வழங்குவதே எங்கள் நோக்கம்.',
          'TNPSC ARIVU AI is a free, AI-powered exam preparation platform built for the students of Tamil Nadu. Guided by the belief "Knowledge is Victory", our mission is to provide quality learning resources to every aspiring candidate.'
        )}
      </p>
    </StaticPage>
  );
}
