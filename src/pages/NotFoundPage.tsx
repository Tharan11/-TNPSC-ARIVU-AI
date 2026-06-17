import { Link } from 'react-router-dom';
import { useT } from '../store';

export default function NotFoundPage() {
  const t = useT();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-6">
        {t('இந்தப் பக்கம் கிடைக்கவில்லை', 'This page could not be found')}
      </p>
      <Link to="/" className="btn-primary px-6 py-3 rounded-lg">
        {t('முகப்புக்குச் செல்லவும்', 'Go to Home')}
      </Link>
    </div>
  );
}
