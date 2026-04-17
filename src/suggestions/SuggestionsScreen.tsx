import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createGeminiClient } from './geminiClient';
import { createSuggestionsService, AISuggestion, ClimbingStyle, SuggestionRequest, SuggestionIntent } from './suggestionsService';
import { profileRepository } from '@/profile/profileRepository';
import { Sparkles, AlertCircle, WifiOff, Loader2, Target, BrainCircuit } from 'lucide-react';

const STYLES: ClimbingStyle[] = ['bouldering', 'sport', 'trad'];
const suggestionsService = createSuggestionsService(createGeminiClient());

export default function SuggestionsScreen() {
  const { t } = useTranslation();
  const [maxGrade, setMaxGrade] = useState('');
  const [style, setStyle] = useState<ClimbingStyle>('bouldering');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [streamText, setStreamText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const streamRef = useRef('');

  useEffect(() => {
    profileRepository.get();
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  async function getAISuggestions(intent: SuggestionIntent = 'general') {
    if (!maxGrade) { setError(t('climbForm.validation.required')); return; }
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setStreamText('');
    streamRef.current = '';

    const req: SuggestionRequest = { maxGrade, style, intent };

    const result = await suggestionsService.getSuggestionsStream(req, (chunk) => {
      streamRef.current += chunk;
      setStreamText(streamRef.current);
    });

    if (result.status === 'success') {
      setSuggestions(result.suggestions);
      setStreamText('');
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

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={() => getAISuggestions('general')} disabled={loading || isOffline}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {t('suggestions.submit')}
          </button>
          <button onClick={() => getAISuggestions('weakness')} disabled={loading || isOffline}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
            <BrainCircuit className="w-4 h-4" />
            分析弱點
          </button>
          <button onClick={() => getAISuggestions('training_plan')} disabled={loading || isOffline}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
            <Target className="w-4 h-4" />
            四週計畫
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Streaming live output */}
      {loading && streamText && (
        <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-5">
          <p className="text-xs text-indigo-400 mb-2 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> 正在生成…
          </p>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
            {streamText}
            <span className="inline-block w-1.5 h-4 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>
      )}

      {/* Final parsed suggestions */}
      {!loading && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{s.name}</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-xs font-mono">{s.grade}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{s.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
