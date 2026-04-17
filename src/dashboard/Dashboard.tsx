import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { climbsService } from '@/climbs/climbsService';
import { statsAggregator, ClimbStats } from './statsAggregator';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ClimbStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    climbsService.getClimbs()
      .then(climbs => setStats(statsAggregator.compute(climbs)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400">{t('common.loading')}</div>;

  if (!stats || stats.totalClimbs === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>{t('dashboard.empty')}</p>
      </div>
    );
  }

  const chartData = Object.entries(stats.byGrade).map(([grade, count]) => ({ grade, count }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('dashboard.totalClimbs'), value: stats.totalClimbs },
          { label: t('dashboard.totalSends'), value: stats.totalSends },
          { label: t('dashboard.totalAttempts'), value: stats.totalAttempts },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-slate-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.gradeBreakdown')}</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <XAxis dataKey="grade" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
