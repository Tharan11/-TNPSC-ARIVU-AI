import { create } from 'zustand';
import type { Language, User, ExamGroup } from '../lib/types';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;

  selectedExam: ExamGroup | null;
  setSelectedExam: (exam: ExamGroup | null) => void;

  t: (ta: string, en: string) => string;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'TAMIL',
  setLanguage: (language) => set({ language }),

  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  selectedExam: null,
  setSelectedExam: (selectedExam) => set({ selectedExam }),

  t: (ta, _en) => ta,
}));

export function useT() {
  const lang = useAppStore((s) => s.language);
  return (ta: string, en: string) => (lang === 'TAMIL' ? ta : en);
}
