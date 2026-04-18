import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Tag, Type, Save, Loader2, AlertCircle } from 'lucide-react';
import { climbsService } from './climbsService';
import { ClimbInput, ClimbResult } from './types';
import { PlaceAutocomplete } from '@/components/PlaceAutocomplete';
import { ClimbMap } from '@/components/ClimbMap';

const RESULTS: ClimbResult[] = ['sent', 'attempt'];

export default function ClimbForm({ onSaved }: { onSaved?: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ClimbInput & { locationId?: string | null }>({
    routeName: '',
    grade: '',
    date: new Date().toISOString().slice(0, 10),
    result: 'sent',
    location: '',
    notes: '',
    locationId: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [gradeWarning, setGradeWarning] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(key: keyof ClimbInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);
    try {
      const climb = await climbsService.addClimb(form);
      setGradeWarning(climb.gradeWarning);
      setForm({
        routeName: '',
        grade: '',
        date: new Date().toISOString().slice(0, 10),
        result: 'sent',
        location: '',
        notes: '',
      });
      onSaved?.();
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full bg-white-5 backdrop-blur-xl border-white-10 rounded-3xl p-8 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-3 bg-blue-500-20 rounded-xl">
          <Tag className="w-6 h-6 border-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-50">
            {t('climbForm.title')}
          </h2>
          <p className="text-slate-400 text-sm">紀錄您的每一次攀登成長</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Route Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
              {t('climbForm.routeName')}
            </label>
            <div className="relative group">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-all" />
              <input
                type="text"
                required
                className="w-full bg-white-5 border-white-10 rounded-xl py-3 pl-12 pr-4 text-slate-50 outline-none transition-all"
                value={form.routeName}
                onChange={(e) => handleChange('routeName', e.target.value)}
                placeholder="路線名稱 (例如：平衡之舞)"
              />
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
              {t('climbForm.grade')}
            </label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-all" />
              <input
                type="text"
                required
                className="w-full bg-white-5 border-white-10 rounded-xl py-3 pl-12 pr-4 text-slate-50 outline-none transition-all uppercase"
                value={form.grade}
                onChange={(e) => handleChange('grade', e.target.value)}
                placeholder="例如: V5 / 5.10a"
              />
            </div>
            {gradeWarning && (
              <p className="text-sm text-amber-400 flex items-center gap-1 mt-1 pl-1">
                <AlertCircle className="w-3 h-3" />
                {t('climbForm.validation.gradeWarning')}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
              {t('climbForm.date')}
            </label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-all pointer-events-none" />
              <input
                type="date"
                required
                className="w-full bg-white-5 border-white-10 rounded-xl py-3 pl-12 pr-4 text-slate-50 outline-none transition-all"
                style={{ colorScheme: 'dark' }}
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
              {t('climbForm.location')}
            </label>
            <PlaceAutocomplete
              onPlaceSelect={(name, id) => {
                setForm(prev => ({ ...prev, location: name, locationId: id }));
              }}
              defaultValue={form.location}
              placeholder={t('climbForm.location')}
            />
            {form.location && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                <ClimbMap locationName={form.location} locationId={form.locationId} />
              </div>
            )}
          </div>
        </div>

        {/* Result & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
              {t('climbForm.result')}
            </label>
            <div className="flex p-1 bg-white-5 rounded-xl border-white-10">
              {RESULTS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange('result', r)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                    form.result === r
                      ? 'bg-blue-600 text-slate-50 shadow-lg'
                      : 'text-slate-400 hover:text-slate-50'
                  }`}
                >
                  {t(`climbForm.${r}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
              {t('climbForm.notes')}
            </label>
            <textarea
              rows={2}
              className="w-full bg-white-5 border-white-10 rounded-xl py-3 px-4 text-slate-50 outline-none transition-all"
              style={{ resize: 'none' }}
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="筆記與心得..."
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500-10 border-red-500-20 text-error rounded-xl text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:scale-105 text-slate-50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{t('climbForm.submit')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
