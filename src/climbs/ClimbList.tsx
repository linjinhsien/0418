import React, { useEffect, useState } from 'react';
import { climbsService } from './climbsService';
import { Climb } from './types';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Trophy, ChevronRight, Hash, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClimbMap } from '@/components/ClimbMap';

export default function ClimbList({ refreshTrigger }: { refreshTrigger?: number }) {
  const { t } = useTranslation();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await climbsService.getClimbs();
        setClimbs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshTrigger]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (climbs.length === 0) {
    return (
      <div className="text-center p-12 bg-white-5 rounded-3xl border border-dashed border-white-10">
        <p className="text-slate-400 font-medium">{t('climbList.empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pl-1">
        <h2 className="text-2xl font-black text-slate-50 flex items-center gap-2">
          <Hash className="w-6 h-6 text-blue-500" />
          {t('climbList.title')}
        </h2>
        <span className="text-slate-500 text-sm font-bold bg-white-5 px-3 py-1 rounded-full border border-white-10">
          共 {climbs.length} 筆
        </span>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {climbs.map((climb, index) => (
            <motion.div
              key={climb.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => toggleExpand(climb.id)}
              className={`group bg-white-5 backdrop-blur-md p-5 rounded-3xl border transition-all cursor-pointer shadow-xl relative overflow-hidden ${
                expandedId === climb.id ? 'border-blue-500 bg-white-10' : 'border-white-10 hover:border-blue-500-50'
              }`}
            >
              <div className={`absolute left-0 top-0 w-1.5 h-full ${
                climb.result === 'sent' ? 'bg-green-500' : 'bg-amber-500'
              }`} />

              <div className="flex items-center justify-between">
                <div className="flex-1 pl-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      climb.result === 'sent' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {t(`climbList.${climb.result}`)}
                    </span>
                    <span className="text-lg font-black text-blue-400">{climb.grade}</span>
                    <h3 className="font-bold text-slate-50 text-lg group-hover:text-blue-300 transition-colors uppercase">
                      {climb.routeName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {climb.date}
                    </div>
                    {climb.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{climb.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`ml-6 text-slate-600 transition-all ${
                  expandedId === climb.id ? 'rotate-180 text-blue-400' : 'group-hover:text-blue-500'
                }`}>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === climb.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-5 mt-5 border-t border-white-10">
                      {climb.location && (
                        <ClimbMap 
                          locationName={climb.location} 
                          locationId={climb.locationId} 
                        />
                      )}
                      
                      {climb.notes && (
                        <div className="mt-4 p-4 bg-white-5 rounded-2xl border border-white-10 italic text-sm text-slate-200 leading-relaxed relative">
                           <span className="absolute -top-2 left-4 px-2 bg-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest">心得紀錄</span>
                          "{climb.notes}"
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(climb.location || '')}&query_place_id=${climb.locationId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 transition-all"
                        >
                          在 Google 地圖中開啟
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
