/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand / Primary ──
        brand: {
          primary:   '#8B5CF6',   // violet-500  — main CTA, active states
          secondary: '#7C3AED',   // violet-600  — deeper shade
          accent:    '#A78BFA',   // violet-400  — hover, highlights
          soft:      '#C4B5FD',   // violet-300  — text on dark
          glow:      '#6D28D9',   // violet-700  — glow shadow base
        },

        // ── Backgrounds ──
        bg: {
          primary:   '#0B0D14',   // deepest navy
          surface:   '#0F1621',   // card bg
          card:      '#111827',   // solid card
          hover:     '#1A2235',   // hover state
          overlay:   '#0D1117',   // modal backdrop
        },

        // ── Borders ──
        border: {
          lo:   'rgba(255,255,255,0.06)',
          mid:  'rgba(255,255,255,0.10)',
          hi:   'rgba(255,255,255,0.18)',
          glow: 'rgba(139,92,246,0.40)',
        },

        // ── Text ──
        text: {
          primary:   '#F1F5F9',   // headings
          secondary: '#CBD5E1',   // body
          muted:     '#64748B',   // hints, meta
          disabled:  '#334155',
          accent:    '#A78BFA',   // violet accent text
        },

        // ── Per-page accent palette ──
        page: {
          home:    '#8B5CF6',   // violet
          quiz:    '#7C3AED',   // violet-deep
          ca:      '#10B981',   // emerald — current affairs
          tutor:   '#F59E0B',   // amber   — AI tutor
          dash:    '#06B6D4',   // cyan    — dashboard
          profile: '#8B5CF6',   // violet
        },

        // ── Semantic ──
        success:  '#10B981',
        warning:  '#F59E0B',
        error:    '#EF4444',
        info:     '#3B82F6',

        // ── Legacy navy (keep for backward compat) ──
        navy: {
          950: '#0B0D14',
          900: '#0F1621',
          800: '#111827',
          700: '#1A2235',
        },
      },

      fontFamily: {
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },

      backdropBlur: {
        glass: '12px',
        'glass-lg': '20px',
      },

      boxShadow: {
        // Liquid glass glow — medium intensity
        'glow-violet': '0 0 24px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.10)',
        'glow-violet-hover': '0 0 40px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glow-sm': '0 0 14px rgba(139,92,246,0.25)',
        'glow-emerald': '0 0 24px rgba(16,185,129,0.35)',
        'glow-amber':   '0 0 24px rgba(245,158,11,0.35)',
        'glow-cyan':    '0 0 24px rgba(6,182,212,0.35)',
        'glow-red':     '0 0 24px rgba(239,68,68,0.35)',
        // Card
        'card':      '0 1px 3px rgba(0,0,0,0.4)',
        'card-hover':'0 4px 16px rgba(0,0,0,0.5)',
      },

      borderRadius: {
        'glass': '14px',
        'pill':  '999px',
      },

      animation: {
        'fade-up':     'fadeUp 0.5s ease-out forwards',
        'fade-in':     'fadeIn 0.3s ease-out forwards',
        'scroll-left': 'scrollLeft 30s linear infinite',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scrollLeft: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(139,92,246,0.3)' },
          '50%':      { boxShadow: '0 0 32px rgba(139,92,246,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
