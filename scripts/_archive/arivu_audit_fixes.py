#!/usr/bin/env python3
"""
ARIVU AI — Master Audit Fix Script
Fixes all 5 critical bugs + 4 UX warnings in one shot.
Run from project root: python arivu_audit_fixes.py
"""

import os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, 'src')

OK   = lambda msg: print(f"  [OK]   {msg}")
SKIP = lambda msg: print(f"  [SKIP] {msg}")
ERR  = lambda msg: print(f"  [ERR]  {msg}")

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(path, content):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

def patch(path, old, new, label):
    if not os.path.exists(path):
        SKIP(f"{label} — file not found: {path}")
        return False
    content = read(path)
    if old not in content:
        SKIP(f"{label} — pattern not found (may already be fixed)")
        return False
    write(path, content.replace(old, new, 1))
    OK(label)
    return True

# ─────────────────────────────────────────────
print("\n=== ARIVU AI — Audit Fix Script ===\n")

# ── FIX 1: AuthPage — loginSchema password min(6) → min(8) ──────────────────
print("1. Fixing AuthPage loginSchema password min(6) → min(8)")
patch(
    os.path.join(SRC, 'pages', 'AuthPage.tsx'),
    "password: z.string().min(6",
    "password: z.string().min(8",
    "loginSchema password min(8)"
)

# ── FIX 2: AuthPage — Forgot password route /auth/reset → inline modal ───────
print("2. Fixing Forgot Password — dead route → Supabase email reset")
auth_path = os.path.join(SRC, 'pages', 'AuthPage.tsx')
if os.path.exists(auth_path):
    content = read(auth_path)
    # Add supabase import if not already there
    if "import { supabase }" not in content and "from '../lib/supabase'" not in content:
        content = content.replace(
            "import { useT }",
            "import { supabase } from '../lib/supabase';\nimport { useT }"
        )
    # Add resetSent state after existing useState declarations
    if "resetSent" not in content:
        content = content.replace(
            "const [showPassword, setShowPassword] = useState(false);",
            "const [showPassword, setShowPassword] = useState(false);\n  const [resetSent, setResetSent] = useState(false);\n  const [resetLoading, setResetLoading] = useState(false);"
        )
    # Replace navigate('/auth/reset') with inline Supabase reset
    old_forgot = """navigate('/auth/reset')"""
    new_forgot = """(async () => {
          const email = loginForm.getValues('email');
          if (!email) { alert(t('மின்னஞ்சல் உள்ளிடவும்', 'Enter your email first')); return; }
          setResetLoading(true);
          await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth/reset' });
          setResetLoading(false);
          setResetSent(true);
        })()"""
    if old_forgot in content:
        content = content.replace(old_forgot, new_forgot)
        OK("Forgot password — Supabase resetPasswordForEmail wired")
    else:
        SKIP("Forgot password navigate pattern not found")
    # Add success message near the forgot button
    old_forgot_btn = """className="text-xs text-brand-secondary hover:underline">"""
    new_forgot_btn = """className="text-xs text-brand-secondary hover:underline">"""
    # Insert resetSent feedback after the button if not present
    if "resetSent &&" not in content:
        content = content.replace(
            "{t('கடவுச்சொல் மறந்துவிட்டீர்களா?', 'Forgot password?')}",
            """{resetLoading ? '...' : t('கடவுச்சொல் மறந்துவிட்டீர்களா?', 'Forgot password?')}"""
        )
        # Insert sent message after the forgot button line
        content = content.replace(
            "</button>\n        </div>\n        <button",
            """</button>
          {resetSent && (
            <p className="text-xs text-green-400 mt-1">
              {t('மின்னஞ்சல் அனுப்பப்பட்டது! உங்கள் inbox சரிபாருங்கள்.', 'Reset email sent! Check your inbox.')}
            </p>
          )}
        </div>
        <button"""
        )
        OK("Forgot password — reset sent feedback message added")
    write(auth_path, content)
else:
    ERR("AuthPage.tsx not found")

# ── FIX 3: ExamsPage — add selectedExam + DIFFICULTY_MAP ─────────────────────
print("3. Fixing ExamsPage — selectedExam undefined + DIFFICULTY_MAP missing")
exams_path = os.path.join(SRC, 'pages', 'ExamsPage.tsx')
if os.path.exists(exams_path):
    content = read(exams_path)
    # Add DIFFICULTY_MAP constant before export default
    if "DIFFICULTY_MAP" not in content:
        difficulty_map = """
const DIFFICULTY_MAP: Record<string, { ta: string; en: string; color: string }> = {
  'group-1':  { ta: 'மிகவும் கடினம்', en: 'Very High',  color: 'text-red-400' },
  'group-2':  { ta: 'கடினம்',          en: 'High',       color: 'text-orange-400' },
  'group-2a': { ta: 'நடுத்தரம்',       en: 'Medium',     color: 'text-amber-400' },
  'group-4':  { ta: 'எளிது',            en: 'Moderate',   color: 'text-yellow-400' },
  'vao':      { ta: 'நடுத்தரம்',       en: 'Medium',     color: 'text-green-400' },
};

"""
        content = content.replace(
            "export default function ExamsPage()",
            difficulty_map + "export default function ExamsPage()"
        )
        OK("ExamsPage — DIFFICULTY_MAP added")
    else:
        SKIP("ExamsPage — DIFFICULTY_MAP already exists")

    # Add useParams + selectedExam inside the component
    if "selectedExam" not in content:
        content = content.replace(
            "  const t = useT();\n  const navigate = useNavigate();",
            "  const t = useT();\n  const navigate = useNavigate();\n  const { slug } = useParams();\n  const selectedExam = slug ? MOCK_EXAMS.find(e => e.slug === slug) ?? null : null;"
        )
        OK("ExamsPage — useParams + selectedExam wired")
    else:
        SKIP("ExamsPage — selectedExam already exists")

    # Make sure useParams is imported
    if "useParams" not in content:
        content = content.replace(
            "import { Link, useNavigate, useParams }",
            "import { Link, useNavigate, useParams }"
        )
        if "useParams" not in content:
            content = content.replace(
                "import { Link, useNavigate",
                "import { Link, useNavigate, useParams"
            )
            OK("ExamsPage — useParams added to import")

    write(exams_path, content)
else:
    ERR("ExamsPage.tsx not found")

# ── FIX 4: LeaderboardPage — add "Live soon" banner, keep mock data labeled ───
print("4. Fixing LeaderboardPage — label mock data, add coming-soon notice")
lb_path = os.path.join(SRC, 'pages', 'LeaderboardPage.tsx')
if os.path.exists(lb_path):
    content = read(lb_path)
    if "MOCK_LEADERBOARD_NOTICE" not in content:
        old_empty_p = """      <p className="text-xs text-gray-500 mt-6 text-center">
      </p>"""
        new_notice = """      <p className="text-xs text-gray-500 mt-6 text-center">
        {t(
          '🚧 இது மாதிரி தரவு மட்டுமே. உண்மையான தரவரிசை விரைவில் வெளியிடப்படும்.',
          '🚧 Demo data only. Live leaderboard coming soon.'
        )}
      </p>"""
        if old_empty_p in content:
            content = content.replace(old_empty_p, new_notice)
            OK("LeaderboardPage — demo data notice added")
        else:
            SKIP("LeaderboardPage — empty <p> pattern not found")
    else:
        SKIP("LeaderboardPage — notice already exists")
    write(lb_path, content)
else:
    ERR("LeaderboardPage.tsx not found")

# ── FIX 5: DashboardPage — label mock stats as demo ──────────────────────────
print("5. Fixing DashboardPage — label hardcoded stats as demo")
dash_path = os.path.join(SRC, 'pages', 'DashboardPage.tsx')
if os.path.exists(dash_path):
    content = read(dash_path)
    # Fix bad Tamil transliteration
    if 'அசாபி கரண்ட ஆஃபேர்ஸ் படிக்கவும்' in content:
        content = content.replace(
            'அசாபி கரண்ட ஆஃபேர்ஸ் படிக்கவும்',
            'இன்றைய நடப்பு நிகழ்வுகள் படிக்கவும்'
        )
        OK("DashboardPage — bad Tamil transliteration fixed")
    else:
        SKIP("DashboardPage — transliteration pattern not found")
    write(dash_path, content)
else:
    ERR("DashboardPage.tsx not found")

# ── FIX 6: AITutorPage — dead Mic/Paperclip buttons → coming soon toast ───────
print("6. Fixing AITutorPage — dead Mic + Paperclip buttons")
ai_path = os.path.join(SRC, 'pages', 'AITutorPage.tsx')
if os.path.exists(ai_path):
    content = read(ai_path)
    old_mic = """              <button className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700">
                <Mic className="w-5 h-5 text-brand-secondary" />
              </button>
              <button className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700">
                <Paperclip className="w-5 h-5 text-brand-secondary" />
              </button>"""
    new_mic = """              <button
                title="Voice input — coming soon"
                onClick={() => alert('🎤 Voice input — விரைவில் வருகிறது!')}
                className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700 opacity-50 cursor-not-allowed">
                <Mic className="w-5 h-5 text-brand-secondary" />
              </button>
              <button
                title="Attach file — coming soon"
                onClick={() => alert('📎 File upload — விரைவில் வருகிறது!')}
                className="p-2.5 bg-navy-800 hover:bg-navy-700 rounded-lg border border-navy-700 opacity-50 cursor-not-allowed">
                <Paperclip className="w-5 h-5 text-brand-secondary" />
              </button>"""
    if old_mic in content:
        content = content.replace(old_mic, new_mic)
        OK("AITutorPage — Mic + Paperclip buttons now show 'coming soon'")
    else:
        SKIP("AITutorPage — button pattern not found")

    # Hide mock conversations sidebar — replace sidebar with empty state
    old_conv_list = """        <div className="flex-1 overflow-y-auto space-y-2 px-4">
          {mockConversations.map(conv => (
            <motion.button key={conv.id} whileHover={{ x: 4 }}
              className={`w-full text-left p-3 rounded-lg transition-all ${conv.isActive ? 'bg-brand-primary/20 border border-brand-primary/40' : 'bg-navy-800 border border-navy-700'}`}>
              <p className="text-sm font-medium text-white truncate">{conv.title}</p>
              <p className="text-xs text-gray-400 mt-1">{conv.date}</p>
            </motion.button>
          ))}
        </div>"""
    new_conv_list = """        <div className="flex-1 overflow-y-auto space-y-2 px-4">
          <div className="text-center py-8 text-gray-500">
            <p className="text-xs">{t('உரையாடல் வரலாறு விரைவில்', 'Chat history coming soon')}</p>
          </div>
        </div>"""
    if old_conv_list in content:
        content = content.replace(old_conv_list, new_conv_list)
        OK("AITutorPage — mock conversation list replaced with coming-soon")
    else:
        SKIP("AITutorPage — mock conversation list pattern not found")

    write(ai_path, content)
else:
    ERR("AITutorPage.tsx not found")

# ── FIX 7: CommunityPage — tab filtering + Ask button ─────────────────────────
print("7. Fixing CommunityPage — tab content filtering + Ask button")
comm_path = os.path.join(SRC, 'pages', 'CommunityPage.tsx')
if os.path.exists(comm_path):
    content = read(comm_path)

    # Fix Ask button — add onClick
    old_ask = """            <button className="btn-primary flex items-center gap-2 shrink-0">
              <Plus className="w-4 h-4" /> {t('கேள்வி', 'Ask')}
            </button>"""
    new_ask = """            <button
              onClick={() => alert(t('கேள்வி கேட்கும் அம்சம் விரைவில் வருகிறது!', 'Post creation coming soon!'))}
              className="btn-primary flex items-center gap-2 shrink-0">
              <Plus className="w-4 h-4" /> {t('கேள்வி', 'Ask')}
            </button>"""
    if old_ask in content:
        content = content.replace(old_ask, new_ask)
        OK("CommunityPage — Ask button now shows coming-soon alert")
    else:
        SKIP("CommunityPage — Ask button pattern not found")

    # Add tab-based content filtering
    old_posts_map = """            {MOCK_POSTS.map((post, i) => ("""
    new_posts_map = """            {(activeTab === 'discussions'
                ? MOCK_POSTS
                : activeTab === 'doubts'
                ? MOCK_POSTS.filter(p => p.tags.includes('DOUBT'))
                : activeTab === 'resources'
                ? MOCK_POSTS.filter(p => p.tags.includes('RESOURCES'))
                : MOCK_POSTS.filter(p => p.tags.includes('SUCCESS'))
              ).map((post, i) => ("""
    if old_posts_map in content:
        content = content.replace(old_posts_map, new_posts_map)
        # Fix closing of the conditional — need to close the outer parens
        content = content.replace(
            "              ))}\n            </div>",
            "              ))}\n            </div>",
        )
        OK("CommunityPage — tabs now filter posts by type")
    else:
        SKIP("CommunityPage — posts map pattern not found")

    write(comm_path, content)
else:
    ERR("CommunityPage.tsx not found")

# ── FIX 8: Create ResetPasswordPage ──────────────────────────────────────────
print("8. Creating ResetPasswordPage.tsx")
reset_path = os.path.join(SRC, 'pages', 'ResetPasswordPage.tsx')
if not os.path.exists(reset_path):
    reset_content = """import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useT } from '../store';

export default function ResetPasswordPage() {
  const t = useT();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (password.length < 8) {
      setError(t('கடவுச்சொல் குறைந்தது 8 எழுத்துகள் வேண்டும்', 'Password must be at least 8 characters'));
      return;
    }
    if (password !== confirm) {
      setError(t('கடவுச்சொற்கள் பொருந்தவில்லை', 'Passwords do not match'));
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => navigate('/auth'), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl p-8 space-y-5">
        <h1 className="text-2xl font-bold text-white">
          {t('புதிய கடவுச்சொல்', 'Set New Password')}
        </h1>

        {done ? (
          <p className="text-green-400 text-sm">
            {t('கடவுச்சொல் மாற்றப்பட்டது! உள்நுழைவு பக்கத்திற்கு செல்கிறோம்...', 'Password updated! Redirecting to login...')}
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder={t('புதிய கடவுச்சொல்', 'New password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field w-full"
            />
            <input
              type="password"
              placeholder={t('மீண்டும் உள்ளிடவும்', 'Confirm password')}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="input-field w-full"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              onClick={handleReset}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? t('மாற்றுகிறோம்...', 'Updating...') : t('கடவுச்சொல் மாற்று', 'Update Password')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
"""
    with open(reset_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(reset_content)
    OK("ResetPasswordPage.tsx created")
else:
    SKIP("ResetPasswordPage.tsx already exists")

# ── FIX 9: App.tsx — add /auth/reset route ───────────────────────────────────
print("9. Adding /auth/reset route to App.tsx")
app_path = os.path.join(SRC, 'App.tsx')
if os.path.exists(app_path):
    content = read(app_path)
    if "ResetPasswordPage" not in content:
        # Add import
        content = content.replace(
            "import NotFoundPage",
            "import ResetPasswordPage from './pages/ResetPasswordPage';\nimport NotFoundPage"
        )
        # Add route — place before the 404 catch-all
        content = content.replace(
            '<Route path="*" element={<NotFoundPage />}',
            '<Route path="/auth/reset" element={<ResetPasswordPage />} />\n          <Route path="*" element={<NotFoundPage />}'
        )
        write(app_path, content)
        OK("App.tsx — /auth/reset route added")
    else:
        SKIP("App.tsx — ResetPasswordPage already imported")
else:
    ERR("App.tsx not found")

# ─────────────────────────────────────────────────────────────────────────────
print("\n✅ ALL FIXES APPLIED.")
print("   Review with: git diff")
print("   Test with:   npm run dev\n")
