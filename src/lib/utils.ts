import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(dateStr: string, lang: 'TAMIL' | 'ENGLISH' = 'ENGLISH'): string {
  const d = new Date(dateStr);
  if (lang === 'TAMIL') {
    const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getLevelForXp(xp: number): number {
  const tiers = [0, 500, 2000, 10000, 30000, 100000, 500000];
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (xp >= tiers[i]) return Math.floor(i * 100 / (tiers.length - 1)) || 1;
  }
  return 1;
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-success';
  if (accuracy >= 60) return 'text-brand-primary';
  if (accuracy >= 40) return 'text-warning';
  return 'text-error';
}

export function getDifficultyLabel(d: string, lang: 'TAMIL' | 'ENGLISH' = 'ENGLISH'): string {
  if (lang === 'TAMIL') {
    return { EASY: 'எளிதான', MEDIUM: 'நடுத்தர', HARD: 'கடினமான', VERY_HARD: 'மிகக் கடினம்' }[d] || d;
  }
  return d.replace('_', ' ');
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
