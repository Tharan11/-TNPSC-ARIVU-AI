import StaticPage from '../components/common/StaticPage';
import { useT } from '../store';

export default function PlannerPage() {
  const t = useT();
  return (
    <StaticPage titleTa="படிப்புத் திட்டம்" titleEn="Study Planner">
      <p>
        {t(
          'தனிப்பயன் படிப்புத் திட்ட அம்சம் தற்போது உருவாக்கத்தில் உள்ளது. விரைவில் உங்கள் தேர்வு தேதி, பலம்/பலவீனம் அடிப்படையில் ஒரு தினசரி படிப்பு அட்டவணையை உருவாக்க முடியும்.',
          'The personalized Study Planner feature is currently in development. Soon you will be able to generate a daily study schedule based on your exam date, strengths, and weak areas.'
        )}
      </p>
    </StaticPage>
  );
}
