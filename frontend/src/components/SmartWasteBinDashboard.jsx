import React, { useState, useEffect } from 'react';
import { Trash2, DollarSign, Scale, Layers, AlertTriangle, ArrowRight, CheckCircle2, PieChart as PieIcon, Cpu, Plus, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import WasteRegistrationModal from './WasteRegistrationModal';

export default function SmartWasteBinDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompartment, setSelectedCompartment] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/waste/metrics");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load waste metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl">
        <div className="animate-spin h-8 w-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-mono">Loading Smart Waste Bin Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Smart Waste Bin Identification & Categorization</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                IoT Sorting & Cost-Loss Tracking
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated multi-compartment weight tracking, fill-level alerts, and financial cost-loss analytics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsRegistrationOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <Plus className="h-4 w-4" /> Add Wastage
            </button>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Total Food Waste Today</span>
              <div className="text-lg font-extrabold text-rose-400">{data.total_food_waste_today_kg} kg</div>
            </div>
            <div className="text-right border-l border-slate-800 pl-4">
              <span className="text-[11px] text-slate-400">Direct Cost Loss</span>
              <div className="text-lg font-extrabold text-amber-400">{data.total_cost_loss_today}</div>
            </div>
          </div>
        </div>

        {/* Hardware Status */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5 text-sky-400" /> {data.hardware_status.mcu}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
            <Scale className="h-3.5 w-3.5 text-emerald-400" /> {data.hardware_status.load_cells}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-purple-400" /> {data.hardware_status.sorting_mechanism}
          </span>
        </div>
      </div>

      {/* 4 Smart Bin Compartments Real-Time Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.compartments.map((comp) => (
          <button
            type="button"
            key={comp.id}
            onClick={() => setSelectedCompartment(comp)}
            className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between text-left transition-all duration-200 hover:-translate-y-1 hover:border-rose-400/60 hover:shadow-lg hover:shadow-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-500/70 ${
              comp.fill_level_percent > 75 ? 'border-rose-500/50 glow-rose' : 'border-slate-800'
            }`}
            aria-label={`View waste subcategories for ${comp.name}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{comp.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  comp.fill_level_percent > 75 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}>
                  {comp.fill_level_percent > 75 ? 'BIN ALMOST FULL' : 'NORMAL'}
                </span>
              </div>

              {/* Visual Fill Gauge */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Fill Level:</span>
                  <span className="font-bold">{comp.fill_level_percent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      comp.fill_level_percent > 75 ? 'bg-rose-500' : (comp.fill_level_percent > 50 ? 'bg-amber-500' : 'bg-emerald-500')
                    }`}
                    style={{ width: `${comp.fill_level_percent}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Measured Weight:</span>
                  <span className="font-bold text-white">{comp.current_weight_kg} kg / {comp.capacity_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Cost Loss:</span>
                  <span className="font-bold text-amber-400">{comp.cost_loss_today}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Frequent Items Discarded:</span>
              <ul className="text-[11px] text-slate-300 list-disc list-inside mt-0.5 space-y-0.5">
                {comp.frequent_items.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="truncate">{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              View waste subcategories <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Waste Subcategory Modal */}
      {selectedCompartment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waste-subcategory-title"
          onClick={() => setSelectedCompartment(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCompartment(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label="Close waste subcategory popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Waste subcategories
              </span>
              <h3 id="waste-subcategory-title" className="mt-1 text-lg font-bold text-white">
                {selectedCompartment.name}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Items currently recorded under this main waste category.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {selectedCompartment.frequent_items.map((item, index) => (
                <div
                  key={`${selectedCompartment.id}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs font-bold text-rose-400">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-xs">
              <div className="rounded-xl bg-slate-950/60 p-3">
                <span className="text-slate-400">Current weight</span>
                <p className="mt-1 font-bold text-white">{selectedCompartment.current_weight_kg} kg</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-3">
                <span className="text-slate-400">Estimated cost loss</span>
                <p className="mt-1 font-bold text-amber-400">{selectedCompartment.cost_loss_today}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <WasteRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

      {/* Waste Category Breakdown & Daily Financial Loss Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Waste Composition Breakdown */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Food Waste Category Breakdown</h3>
              <p className="text-xs text-slate-400">Identified through AI Computer Vision classifier</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.waste_composition.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.category}</span>
                  <span className="font-mono text-slate-300">{item.weight_kg} kg ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Direct Loss: <strong className="text-amber-400">LKR {item.cost_rs.toLocaleString()}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Waste Trend Chart */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Daily Waste & Cost Loss Trend</h3>
                <p className="text-xs text-slate-400">7-Day smart bin load cell measurements</p>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="total_food_waste_kg" fill="#f43f5e" name="Food Waste (kg)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Reduction Recommendations */}
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-4 w-4" /> AI Waste Reduction Interventions:
            </span>
            <ul className="space-y-1 text-xs text-slate-200">
              {data.waste_reduction_recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
