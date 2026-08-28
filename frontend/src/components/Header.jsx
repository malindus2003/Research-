import React from 'react';
import { Activity, Bell, RefreshCw, Layers, TrendingUp, Users, Trash2, Cpu, Sun, Moon } from 'lucide-react';

export default function Header({
  activeModule,
  onSelectModule,
  stats,
  onRefresh,
  activeAlertCount,
  onOpenAlerts,
  isDarkMode,
  onToggleTheme
}) {
  const modules = [
    { id: 'executive', label: 'Executive Hub', icon: <Layers className="h-4 w-4" /> },
    { id: 'demand', label: 'Demand Prediction', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'kitchen', label: 'Kitchen & Staff', icon: <Users className="h-4 w-4" /> },
    { id: 'spoilage', label: 'Food Spoilage & Quality', icon: <Cpu className="h-4 w-4" /> },
    { id: 'waste', label: 'Smart Waste Bin', icon: <Trash2 className="h-4 w-4" /> }
  ];

  return (
    <header className="border-b border-[#cbdad0] dark:border-slate-800 bg-white/95 dark:bg-slate-900 sticky top-0 z-40 px-6 py-3 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand with Forest Green Accents */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white font-bold flex-shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              Smart Restaurant Analytics
            </h1>
            <span className="text-xs text-emerald-800 dark:text-emerald-400 mt-1 block font-semibold">
              AI & IoT Food Quality & Spoilage Platform
            </span>
          </div>
        </div>

        {/* Cohesive Emerald & Sage Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-1 ring-emerald-800'
                    : 'bg-[#f0f5f2] hover:bg-[#e4ece7] text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-[#d5e2d9] dark:border-slate-700'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools (Theme Toggle, Refresh & Alerts) */}
        <div className="hidden sm:flex items-center gap-2">
          
          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e4ece7] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#d5e2d9] dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-emerald-800" />}
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e4ece7] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#d5e2d9] dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title="Refresh Metrics"
          >
            <RefreshCw className="h-4 w-4 text-emerald-800 dark:text-slate-200" />
          </button>

          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e4ece7] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#d5e2d9] dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm flex items-center gap-1.5 font-bold"
          >
            <Bell className="h-4 w-4 text-emerald-800 dark:text-slate-200" />
            <span className="text-xs">Alerts</span>
            {activeAlertCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-sm">
                {activeAlertCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
