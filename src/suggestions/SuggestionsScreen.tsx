import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createGeminiClient } from './geminiClient';
import { createSuggestionsService, AISuggestion, ClimbingStyle, SuggestionRequest } from './suggestionsService';
import { profileRepository } from '@/profile/profileRepository';
import { Sparkles, AlertCircle, WifiOff, Loader2 } from 'lucide-react';

const STYLES: ClimbingStyle[] = ['bouldering', 'sport', 'trad'];
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string ?? '';
const suggestionsService = createSuggestionsService(createGeminiClient(apiKey));

export default function SuggestionsScreen() {
  const { t } = useTranslation();
  const [maxGrade, setMaxGrade] = useState('');
  const [style, setStyle] = useState<ClimbingStyle>('bouldering');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    profileRepository.get().then(p => {
      if (p?.goals) return; // pre-fill only maxGrade from profile if available
    });
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestions([]);
    const req: SuggestionRequest = { maxGrade, style };
    const result = await suggestionsService.getSuggestions(req);
    if (result.status === 'success') {
      setSuggestions(result.suggestions);
    } else {
      const msgKey = result.error === 'offline' ? 'suggestions.offline'
        : result.error === 'no_history' ? 'suggestions.noHistory'
        : 'suggestions.apiError';
      setError(t(msgKey));
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('suggestions.title')}</h1>

      {isOffline && (
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-400">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span className="text-sm">{t('suggestions.offline')}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('suggestions.maxGrade')}</label>
          <input
            value={maxGrade}
            onChange={e => setMaxGrade(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            placeholder="V5 / 5.11a"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('suggestions.style')}</label>
          <div className="flex gap-2">
            {STYLES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  style === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {t(`suggestions.styles.${s}`)}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || isOffline}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {t('suggestions.submit')}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={handleSubmit as any} className="ml-auto text-xs underline">{t('common.retry')}</button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{s.name}</span>
                <span className="text-indigo-400 text-sm font-mono">{s.grade}</span>
              </div>
              <p className="text-slate-400 text-sm">{s.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
