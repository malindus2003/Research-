import React from 'react';
import { Package, AlertTriangle, Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Monitored Batches */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md bg-white border border-[#d1ded5]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Monitored Batches</span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <Package className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.total_monitored_batches}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1 font-semibold">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{stats.safe_batches} safe batches</span>
            <span>• across 5 categories</span>
          </p>
        </div>
      </div>

      {/* Spoilage Risk Alerts */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Spoilage Risk Alerts</span>
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-rose-700 dark:text-rose-400">{stats.critical_batches + stats.high_priority_batches}</div>
          <p className="text-xs text-rose-800/90 dark:text-rose-300/80 mt-1 font-bold">
            {stats.critical_batches} critical (dispose) • {stats.high_priority_batches} high priority (cook now)
          </p>
        </div>
      </div>

      {/* Avg Spoilage Probability */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md bg-white border border-[#d1ded5]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Avg Spoilage Rate</span>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-amber-700 dark:text-amber-400">{stats.avg_spoilage_probability}%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div 
              className="bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, stats.avg_spoilage_probability)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cold Storage Health */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md bg-white border border-[#d1ded5]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">IoT Cold Storage Nodes</span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
            {stats.total_storage_zones - stats.zones_needing_attention} / {stats.total_storage_zones}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            {stats.zones_needing_attention === 0 ? "All zones within optimal limits" : `${stats.zones_needing_attention} zone(s) need thermal calibration`}
          </p>
        </div>
      </div>

    </div>
  );
}
