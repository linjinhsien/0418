import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createGeminiClient } from './geminiClient';
import { createSuggestionsService, AISuggestion, ClimbingStyle, SuggestionRequest, SuggestionIntent } from './suggestionsService';
import { profileRepository } from '@/profile/profileRepository';
import { Sparkles, AlertCircle, WifiOff, Loader2, Target, BrainCircuit, Calendar } from 'lucide-react';

const STYLES: ClimbingStyle[] = ['bouldering', 'sport', 'trad'];
const suggestionsService = createSuggestionsService(createGeminiClient());

export default function SuggestionsScreen() {
  const { t } = useTranslation();
  const [maxGrade, setMaxGrade] = useState('');
  const [style, setStyle] = useState<ClimbingStyle>('bouldering');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [streamText, setStreamText] = useState('');

  useEffect(() => {
    // 預填寫：從個人資料抓取最高難度與偏好風格
    profileRepository.get().then(p => {
      if (p) {
        if (p.goals) setMaxGrade(p.goals);
      }
    });

    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { 
      window.removeEventListener('online', onOnline); 
      window.removeEventListener('offline', onOffline); 
    };
  }, []);

  async function getAISuggestions(intent: SuggestionIntent = 'general') {
    // 1. 立即進行基礎驗證
    if (!maxGrade.trim()) {
      setError(t('climbForm.validation.required'));
      return;
    }

    // 2. 瞬間重置所有介面狀態，給予即時回饋
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setStreamText('阿強教練正在整理數據...'); 

    try {
      // 使用最新的狀態值構建請求
      const req: SuggestionRequest = { 
        maxGrade: maxGrade.trim(), 
        style, 
        intent,
        onStreamChunk: (chunk) => {
          setStreamText(prev => {
            // 如果是初始提示，則替換掉
            if (prev === '阿強教練正在整理數據...') return chunk;
            return prev + chunk;
          });
        }
      };
      
      const result = await suggestionsService.getSuggestions(req);
      
      if (result.status === 'success') {
        if (result.suggestions.length === 0) {
          setError('AI 這次沒有產出具體建議，請再試一次。');
        } else {
          setSuggestions(result.suggestions);
          setStreamText(''); // 成功解析後，隱藏流動文字，顯示精美卡片
        }
      } else {
        const msgKey = result.error === 'offline' ? 'suggestions.offline'
          : result.error === 'no_history' ? '沒有攀爬紀錄，請先去記錄一筆吧！'
          : 'suggestions.apiError';
        setError(typeof msgKey === 'string' && msgKey.includes('.') ? t(msgKey) : msgKey);
      }
    } catch (err: any) {
      console.error('AI Suggestion Error:', err);
      setError(err.message || 'AI 服務連線失敗，請檢查網路或金鑰。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black gradient-text">
          {t('suggestions.title')}
        </h1>
        <p className="text-slate-400">
          讓 AI 教練 阿強 根據您的表現，為您制定專屬提升計劃
        </p>
      </div>

      {isOffline && (
        <div className="flex items-center gap-3 bg-red-500-10 border-red-500-20 rounded-2xl px-6 py-4 text-error">
          <WifiOff className="w-5 h-5" />
          <span className="font-semibold">{t('suggestions.offline')}</span>
        </div>
      )}

      {/* Configuration Card */}
      <div className="bg-white-5 backdrop-blur-xl border-white-10 rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Max Grade */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
              您的最高難度
            </label>
            <div className="relative group">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-all" />
              <input
                value={maxGrade}
                onChange={e => setMaxGrade(e.target.value)}
                className="w-full bg-white-5 border-white-10 rounded-xl py-4 pl-12 pr-4 text-slate-50 outline-none transition-all focus:bg-white-10 focus:border-blue-500-50"
                placeholder="例如: V5 / 5.11a"
                required
              />
            </div>
          </div>

          {/* Style Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
              攀岩風格
            </label>
            <div className="flex p-1 bg-white-5 rounded-xl border-white-10">
              {STYLES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                    style === s 
                      ? 'bg-blue-600 text-slate-50 shadow-lg scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-50'
                  }`}
                >
                  {t(`suggestions.styles.${s}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton 
            onClick={() => getAISuggestions('general')}
            loading={loading}
            disabled={isOffline}
            icon={<Sparkles className="w-5 h-5" />}
            label={t('suggestions.submit')}
            primary
          />
          <ActionButton 
            onClick={() => getAISuggestions('weakness')}
            loading={loading}
            disabled={isOffline}
            icon={<BrainCircuit className="w-5 h-5" />}
            label="分析弱點"
          />
          <ActionButton 
            onClick={() => getAISuggestions('training_plan')}
            loading={loading}
            disabled={isOffline}
            icon={<Calendar className="w-5 h-5" />}
            label="四週計畫"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500-10 border-red-500-20 rounded-2xl p-6 text-error animate-pulse">
          <AlertCircle className="w-6 h-6" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Analysis Status */}
      {loading && streamText && (
        <div className="bg-white-5 backdrop-blur-xl border-blue-500-50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading-bar_2s_infinite]" />
          <div className="flex items-center gap-3 mb-4 text-blue-400 font-black tracking-widest uppercase text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            教練分析中
          </div>
          <p className="text-slate-300 leading-relaxed italic">
            "{streamText}"
          </p>
        </div>
      )}

      {/* Results Container */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2 pl-1">
            <BrainCircuit className="w-6 h-6 text-blue-400" />
            阿強教練的建議
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-white-5 backdrop-blur-xl border-white-10 rounded-3xl p-6 hover:scale-[1.02] hover:border-blue-500-50 transition-all group shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">路線建議</span>
                    <h4 className="font-black text-xl text-slate-50 group-hover:text-blue-400 transition-colors uppercase">{s.name}</h4>
                  </div>
                  <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-xl text-sm font-black border border-blue-500/30">
                    {s.grade}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed border-t border-white-10 pt-4">
                  {s.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ onClick, loading, disabled, icon, label, primary }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`relative group h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 ${
        primary 
          ? 'bg-blue-600 text-slate-50 shadow-lg shadow-blue-500/20' 
          : 'bg-white-5 text-slate-400 border-white-10 hover:bg-white-10 hover:text-slate-50'
      }`}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );
}
