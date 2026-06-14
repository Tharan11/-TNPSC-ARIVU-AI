import StaticPage from '../components/common/StaticPage';
import { useT } from '../store';

export default function PYQPage() {
  const t = useT();
  return (
    <StaticPage titleTa="முந்தைய வினாத்தாள்கள்" titleEn="Previous Year Question Papers">
      <p>
        {t(
          'Group 1, 2, 2A, 4 மற்றும் VAO தேர்வுகளுக்கான முந்தைய ஆண்டு வினாத்தாள்கள் விரைவில் இங்கே சேர்க்கப்படும். தற்போது, மாக் தேர்வுப் பகுதியில் பயிற்சி செய்யலாம்.',
          'Previous year question papers for Group 1, 2, 2A, 4, and VAO exams will be added here soon. Meanwhile, you can practice with our Mock Tests section.'
        )}
      </p>
    </StaticPage>
  );
}
