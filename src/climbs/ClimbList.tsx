import React, { useEffect, useState } from 'react';
import { climbsService } from './climbsService';
import { Climb } from './types';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Trophy, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClimbList({ refreshTrigger }: { refreshTrigger?: number }) {
  const { t } = useTranslation();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (climbs.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500">{t('climbList.empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-blue-600" />
        {t('climbList.title')}
      </h2>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {climbs.map((climb, index) => (
            <motion.div
              key={climb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-default"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      climb.result === 'sent' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t(`climbList.${climb.result}`)}
                    </span>
                    <span className="text-sm font-bold text-blue-600">{climb.grade}</span>
                    <h3 className="font-bold text-slate-800">{climb.routeName}</h3>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {climb.date}
                    </div>
                    {climb.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {climb.location}
                        {climb.locationId && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(climb.location)}&query_place_id=${climb.locationId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-500 hover:text-blue-600 underline"
                          >
                            (地圖)
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {climb.notes && (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2 italic">
                      "{climb.notes}"
                    </p>
                  )}
                </div>

                <div className="ml-4 text-slate-300 group-hover:text-blue-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
