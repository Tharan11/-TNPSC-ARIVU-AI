import { useState } from 'react';
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
