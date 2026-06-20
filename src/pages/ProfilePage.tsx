import { useState, useEffect } from 'react';
import { User, Save, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useT, useAppStore } from '../store';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const t = useT();
  const { user } = useAppStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('display_name, phone, target_exam, avatar_url')
      .eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setName(data.display_name || '');
          setPhone(data.phone || '');
          setTargetExam(data.target_exam || '');
          setAvatar(data.avatar_url || null);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    await supabase.from('profiles').upsert({
      id: user.id,
      display_name: name,
      phone,
      target_exam: targetExam,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const ext = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatar(data.publicUrl);
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: data.publicUrl });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-8">
        <User className="w-6 h-6 text-brand-primary" />
        <h1 className="text-2xl font-bold text-white">{t('சுயவிவரம்', 'My Profile')}</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-5">

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand-primary/20 border-2 border-brand-primary/40 flex items-center justify-center overflow-hidden">
              {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-brand-primary" />}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-400 transition-colors">
              <Camera className="w-3 h-3 text-black" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{name || t('மாணவர்', 'Student')}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('பெயர்', 'Display Name')}</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="input-field w-full" placeholder={t('உங்கள் பெயர்', 'Your name')} />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('தொலைபேசி', 'Phone')}</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="input-field w-full" placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">{t('இலக்கு தேர்வு', 'Target Exam')}</label>
            <select value={targetExam} onChange={e => setTargetExam(e.target.value)}
              className="input-field w-full bg-[#0A0E1A]">
              <option value="">{t('தேர்வை தேர்ந்தெடுக்கவும்', 'Select exam')}</option>
              {['Group 1','Group 2','Group 2A','Group 4','VAO'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? t('சேமிக்கிறோம்...', 'Saving...') : saved ? t('சேமிக்கப்பட்டது ✓', 'Saved ✓') : t('சேமி', 'Save Profile')}
        </button>
      </motion.div>
    </div>
  );
}
