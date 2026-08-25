import React from 'react';
import { Package, AlertTriangle, Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Batches */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Batches</span>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Package className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white">{stats.total_monitored_batches}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">{stats.safe_batches} safe</span>
            <span>• across 5 categories</span>
          </p>
        </div>
      </div>

      {/* Critical & High Spoilage Alerts */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-rose-900/50 transition-all glow-rose">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Spoilage Risk Alerts</span>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-rose-400">{stats.critical_batches + stats.high_priority_batches}</div>
          <p className="text-xs text-rose-300/80 mt-1">
            {stats.critical_batches} critical (dispose) • {stats.high_priority_batches} high priority (cook now)
          </p>
        </div>
      </div>

      {/* Mean Spoilage Probability */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-amber-900/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Avg Spoilage Probability</span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-amber-400">{stats.avg_spoilage_probability}%</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, stats.avg_spoilage_probability)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Storage Zones Status */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-900/50 transition-all glow-emerald">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">IoT Cold Storage Nodes</span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-emerald-400">
            {stats.total_storage_zones - stats.zones_needing_attention} / {stats.total_storage_zones}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {stats.zones_needing_attention === 0 ? "All zones within optimal limits" : `${stats.zones_needing_attention} zone(s) with thermal/gas drift`}
          </p>
        </div>
      </div>

    </div>
  );
}
