import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Sparkles, Trophy, History, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { climbsService } from './climbs/climbsService';
import { statsAggregator } from './dashboard/statsAggregator';
import { t } from './shared/i18n';

function App() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const climbs = await climbsService.getClimbs();
      setStats(statsAggregator.compute(climbs));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black gradient-text mb-2">我的攀岩日誌</h1>
            <p className="text-slate-400">追蹤你的進度，挑戰自我極限。</p>
          </div>
          <button className="bg-gradient-primary px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 hover:scale-105">
            <Plus className="w-5 h-5" />
            <span>記錄新攀爬</span>
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              icon={<Trophy className="w-6 h-6 text-yellow-400" />} 
              label="總攀爬次數" 
              value={stats?.totalClimbs || 0} 
              delay={0.1}
            />
            <StatCard 
              icon={<Sparkles className="w-6 h-6 text-purple-400" />} 
              label="完攀率" 
              value={`${Math.round((stats?.totalSends / stats?.totalClimbs || 0) * 100)}%`} 
              delay={0.2}
            />
            <StatCard 
              icon={<History className="w-6 h-6 text-blue-400" />} 
              label="近期最高難度" 
              value="V7" 
              delay={0.3}
            />
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">推薦路線 (AI)</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 mb-6">開始記錄你的攀爬，Gemini 將為你提供個人化建議。</p>
            <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition-all">
              了解更多
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

const StatCard = ({ icon, label, value, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
  >
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <div className="text-slate-400 text-sm font-medium mb-1">{label}</div>
    <div className="text-3xl font-bold">{value}</div>
  </motion.div>
);

export default App;
