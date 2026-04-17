import React from 'react';
import { LayoutDashboard, History, Sparkles, User } from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Climber
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <NavLink icon={<History className="w-5 h-5" />} label="攀爬記錄" active />
          <NavLink icon={<LayoutDashboard className="w-5 h-5" />} label="儀表板" />
          <NavLink icon={<Sparkles className="w-5 h-5" />} label="AI 建議" />
          <NavLink icon={<User className="w-5 h-5" />} label="個人檔案" />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
    active ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
  }`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);
