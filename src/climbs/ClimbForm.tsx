import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Tag, Type, Save, Loader2, AlertCircle } from 'lucide-react';
import { climbsService } from './climbsService';
import { ClimbInput, ClimbResult } from './types';
import { PlaceAutocomplete } from '@/components/PlaceAutocomplete';

const RESULTS: ClimbResult[] = ['sent', 'attempt'];

export default function ClimbForm({ onSaved }: { onSaved?: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ClimbInput>({
    routeName: '',
    grade: '',
    date: new Date().toISOString().slice(0, 10),
    result: 'sent',
    location: '',
    notes: '',
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
      setError(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Tag className="w-6 h-6 text-blue-600" />
        {t('climbForm.title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Route Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              {t('climbForm.routeName')}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={form.routeName}
              onChange={(e) => handleChange('routeName', e.target.value)}
              placeholder={t('climbForm.routeName')}
            />
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              {t('climbForm.grade')}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
              value={form.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              placeholder="V5 / 5.10a"
            />
            {gradeWarning && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {t('climbForm.validation.gradeWarning')}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {t('climbForm.date')}
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {t('climbForm.location')}
            </label>
            <PlaceAutocomplete
              onPlaceSelect={(name) => handleChange('location', name)}
              defaultValue={form.location}
              placeholder={t('climbForm.location')}
            />
          </div>
        </div>

        {/* Result */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {t('climbForm.result')}
          </label>
          <div className="flex gap-3">
            {RESULTS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleChange('result', r)}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  form.result === r
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t(`climbForm.${r}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {t('climbForm.notes')}
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder={t('climbForm.notes')}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {t('climbForm.submit')}
        </button>
      </form>
    </div>
  );
}
