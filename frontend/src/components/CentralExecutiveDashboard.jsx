import React from 'react';
import { Layers, Activity, TrendingUp, Users, AlertTriangle, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, RotateCw } from 'lucide-react';

export default function CentralExecutiveDashboard({ stats, onNavigateModule }) {
  return (
    <div className="space-y-6">
      
      {/* Executive Hero Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5 animate-spin" /> Closed Feedback Loop Active
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-3">
              Operational Intelligence & Waste Reduction Hub
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Unified operational decision-support ecosystem integrating Demand Forecasting, Kitchen Workflow Optimization, Multi-Modal Food Spoilage Detection, and Automated Smart Waste Categorization.
            </p>
          </div>

          {/* Quick Pillar Health Summary */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Demand Target</span>
              <div className="text-lg font-bold text-emerald-400">480 Orders</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Kitchen Efficiency</span>
              <div className="text-lg font-bold text-orange-400">88.5%</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Cold Storage Nodes</span>
              <div className="text-lg font-bold text-purple-400">5 Zones Active</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Daily Food Waste</span>
              <div className="text-lg font-bold text-rose-400">28.5 kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Demand Forecasting */}
        <div
          onClick={() => onNavigateModule('demand')}
          className="glass-panel p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/80 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                Forecasting
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-3 group-hover:text-emerald-400 transition-colors">
              Demand Prediction
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Multi-source time-series sales forecasting & kitchen prep sizing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-emerald-400 flex items-center justify-between">
            <span>Open Demand Module</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Kitchen & Staff */}
        <div
          onClick={() => onNavigateModule('kitchen')}
          className="glass-panel p-5 rounded-2xl border border-orange-500/30 hover:border-orange-500/80 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 uppercase">
                Workflow
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-3 group-hover:text-orange-400 transition-colors">
              Kitchen & Staff
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Peak-hour prediction, line bottleneck detection, and staff career pathways.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-orange-400 flex items-center justify-between">
            <span>Open Kitchen Module</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Food Spoilage & Quality */}
        <div
          onClick={() => onNavigateModule('spoilage')}
          className="glass-panel p-5 rounded-2xl border border-purple-500/40 hover:border-purple-500/90 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group glow-amber"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                Cold Chain
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-3 group-hover:text-purple-400 transition-colors">
              Food Spoilage & Quality
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              IoT Gas/Temp sensors & Computer Vision ripeness/spoilage detection.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-purple-400 flex items-center justify-between">
            <span>Open Spoilage Module</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Smart Waste Bin */}
        <div
          onClick={() => onNavigateModule('waste')}
          className="glass-panel p-5 rounded-2xl border border-rose-500/30 hover:border-rose-500/80 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase">
                Waste Tracking
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-3 group-hover:text-rose-400 transition-colors">
              Smart Waste Bin
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time load cell monitoring, CV waste sorting, and financial loss tracking.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-rose-400 flex items-center justify-between">
            <span>Open Waste Bin Module</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Closed Feedback Loop Architecture Workflow */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-base font-bold text-white mb-2">Cross-Component Closed Feedback Mechanism</h3>
        <p className="text-xs text-slate-400 mb-4">
          How real-time sensor streams and predictions flow across the 4 modules to eliminate restaurant food loss:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">1. Demand Module</span>
            <p className="text-slate-300 text-[11px]">
              Predicts daily portion targets & passes recipe requirements to Kitchen and Cold Storage inventory.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-orange-400 uppercase">2. Kitchen Optimization</span>
            <p className="text-slate-300 text-[11px]">
              Allocates chefs dynamically based on demand volume & preps items before peak rush periods.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-purple-400 uppercase">3. Spoilage Detection</span>
            <p className="text-slate-300 text-[11px]">
              Scans batch shelf-life & routes expiring produce to today's kitchen menu recipes (FIFO).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-rose-400 uppercase">4. Smart Waste Bin</span>
            <p className="text-slate-300 text-[11px]">
              Measures leftover plates & feeds historical waste metrics back into Demand Forecasting to refine future targets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
