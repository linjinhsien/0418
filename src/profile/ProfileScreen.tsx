import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { profileRepository, UserProfile } from './profileRepository';
import { Save, Loader2 } from 'lucide-react';

type ProfileForm = Omit<UserProfile, 'id'>;

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ProfileForm>({ name: '', homeGym: '', climbingSince: '', goals: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    profileRepository.get().then(p => { if (p) setForm({ name: p.name ?? '', homeGym: p.homeGym ?? '', climbingSince: p.climbingSince ?? '', goals: p.goals ?? '' }); });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await profileRepository.save({ id: 'singleton', ...form });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: keyof ProfileForm; label: string; type?: string }[] = [
    { key: 'name', label: t('profile.name') },
    { key: 'homeGym', label: t('profile.homeGym') },
    { key: 'climbingSince', label: t('profile.climbingSince'), type: 'date' },
    { key: 'goals', label: t('profile.goals') },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('profile.title')}</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-sm text-slate-400 mb-1">{label}</label>
            <input
              type={type ?? 'text'}
              value={form[key] ?? ''}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={label}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? '✓ 已儲存' : t('profile.save')}
        </button>
      </form>
    </div>
  );
}
