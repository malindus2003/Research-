import React from 'react';
import { Activity, Bell, RefreshCw, Layers, TrendingUp, Users, Trash2, Cpu } from 'lucide-react';

export default function Header({ activeModule, onSelectModule, stats, onRefresh, activeAlertCount, onOpenAlerts }) {
  const modules = [
    { id: 'executive', label: 'Executive Hub', icon: <Layers className="h-3.5 w-3.5" /> },
    { id: 'demand', label: 'Demand Prediction', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { id: 'kitchen', label: 'Kitchen & Staff', icon: <Users className="h-3.5 w-3.5" /> },
    { id: 'spoilage', label: 'Food Spoilage & Quality', icon: <Cpu className="h-3.5 w-3.5" /> },
    { id: 'waste', label: 'Smart Waste Bin', icon: <Trash2 className="h-3.5 w-3.5" /> }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Clean Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold flex-shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">
              Smart Restaurant Analytics
            </h1>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Real-Time Operational Intelligence
            </span>
          </div>
        </div>

        {/* Clean Nav Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? (m.id === 'spoilage' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' :
                       m.id === 'kitchen' ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' :
                       m.id === 'waste' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' :
                       'bg-emerald-600 text-white shadow-md shadow-emerald-600/30')
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools (Refresh & Alerts) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                {activeAlertCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
