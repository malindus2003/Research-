import React, { useState, useEffect } from 'react';
import { Trash2, DollarSign, Scale, Layers, AlertTriangle, ArrowRight, CheckCircle2, PieChart as PieIcon, Cpu, Plus, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import WasteRegistrationModal from './WasteRegistrationModal';

export default function SmartWasteBinDashboard({ isDarkMode }) {
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
      console.error("Failed to load waste metrics, using fallback:", err);
      setData({
        researcher: "Pathirana P.R.T (IT23324060)",
        module: "Component 4: AI & IoT-Based Automatic Waste Identification, Categorization, and Monitoring",
        hardware_status: {
          mcu: "ESP32 Wi-Fi / MQTT Controller (Online)",
          sorting_mechanism: "Servo Flap & Rotating Motorized Sorter (Active)",
          load_cells: "4x HX711 Calibrated",
          ultrasonic_sensors: "4x HC-SR04 Active"
        },
        total_food_waste_today_kg: 28.5,
        total_cost_loss_today: "LKR 10,900.00",
        estimated_monthly_saving_potential: "LKR 84,500.00",
        compartments: [
          { id: "comp-1", name: "Food Waste Compartment (Organic)", fill_level_percent: 78.5, current_weight_kg: 18.2, capacity_kg: 25.0, ultrasonic_distance_cm: 8.5, status: "warning", frequent_items: ["Leftover Cooked Rice (6.2 kg)", "Vegetable Peelings (4.8 kg)", "Chicken Bones (3.5 kg)", "Plate Scraps (3.7 kg)"], cost_loss_today: "LKR 7,450.00" },
          { id: "comp-2", name: "Recyclable Plastics & Polythene", fill_level_percent: 42.0, current_weight_kg: 4.1, capacity_kg: 12.0, ultrasonic_distance_cm: 22.0, status: "optimal", frequent_items: ["Food takeaway containers", "Sauce bottles", "Stretch wrap"], cost_loss_today: "LKR 450.00" },
          { id: "comp-3", name: "Paper & Cardboard Packaging", fill_level_percent: 35.0, current_weight_kg: 3.8, capacity_kg: 15.0, ultrasonic_distance_cm: 28.0, status: "optimal", frequent_items: ["Egg cartons", "Dry grocery boxes", "Paper napkins"], cost_loss_today: "LKR 280.00" },
          { id: "comp-4", name: "General Non-Recyclable Waste", fill_level_percent: 28.0, current_weight_kg: 2.4, capacity_kg: 12.0, ultrasonic_distance_cm: 32.0, status: "optimal", frequent_items: ["Waxed wrappers", "Miscellaneous packaging"], cost_loss_today: "LKR 120.00" }
        ],
        waste_composition: [
          { category: "Leftover Rice & Grains", weight_kg: 7.4, percentage: 34.5, cost_rs: 2800, color: "#f59e0b" },
          { category: "Vegetable Cuttings & Trimmings", weight_kg: 5.2, percentage: 24.2, cost_rs: 1850, color: "#10b981" },
          { category: "Meat & Seafood Bones/Trimmings", weight_kg: 3.8, percentage: 17.7, cost_rs: 3200, color: "#ef4444" },
          { category: "Bakery & Bread Waste", weight_kg: 2.6, percentage: 12.1, cost_rs: 950, color: "#8b5cf6" },
          { category: "Spoiled / Overripe Produce", weight_kg: 2.5, percentage: 11.5, cost_rs: 1100, color: "#ec4899" }
        ],
        daily_trend: [
          { day: "Mon", total_food_waste_kg: 21.4, cost_loss_rs: 8200 },
          { day: "Tue", total_food_waste_kg: 19.8, cost_loss_rs: 7600 },
          { day: "Wed", total_food_waste_kg: 24.5, cost_loss_rs: 9400 },
          { day: "Thu", total_food_waste_kg: 18.2, total_cost_loss: 7100 },
          { day: "Fri (Today)", total_food_waste_kg: 28.5, cost_loss_rs: 10900 },
          { day: "Sat (Projected)", total_food_waste_kg: 34.0, cost_loss_rs: 13200 },
          { day: "Sun (Projected)", total_food_waste_kg: 31.5, cost_loss_rs: 12100 }
        ],
        waste_reduction_recommendations: [
          "⚠️ Rice Portioning Notice: Cooked rice accounts for 34.5% of daily food waste. Reduce default plate portion by 15% and offer free refills on request.",
          "Vegetable Trim Optimization: 5.2 kg vegetable cuttings detected today. Shift clean carrot/onion scraps to stock pot simmering.",
          "Closed Feedback to Component 1: Excessive Seafood Rice waste on Thursdays (-8% demand adjustment recommended for next cycle)."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl">
        <div className="animate-spin h-8 w-8 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-bold font-mono">Loading Smart Waste Bin Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Smart Waste Bin Identification & Categorization</h2>
              <span className="text-xs px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-bold">
                IoT Sorting & Cost-Loss Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
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
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Food Waste Today</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400">{data.total_food_waste_today_kg} kg</div>
            </div>
            <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">Direct Cost Loss</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400">{data.total_cost_loss_today}</div>
            </div>
          </div>
        </div>

        {/* Hardware Status */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
            <Cpu className="h-4 w-4 text-sky-600 dark:text-sky-400" /> {data.hardware_status.mcu}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
            <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {data.hardware_status.load_cells}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
            <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" /> {data.hardware_status.sorting_mechanism}
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
              comp.fill_level_percent > 75
                ? 'border-rose-400 bg-rose-50/30 dark:border-rose-500/50 dark:bg-rose-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
            aria-label={`View waste subcategories for ${comp.name}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{comp.name}</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  comp.fill_level_percent > 75
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {comp.fill_level_percent > 75 ? 'BIN ALMOST FULL' : 'NORMAL'}
                </span>
              </div>

              {/* Visual Fill Gauge */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  <span>Fill Level:</span>
                  <span>{comp.fill_level_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      comp.fill_level_percent > 75 ? 'bg-rose-500' : (comp.fill_level_percent > 50 ? 'bg-amber-500' : 'bg-emerald-500')
                    }`}
                    style={{ width: `${comp.fill_level_percent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Measured Weight:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{comp.current_weight_kg} kg / {comp.capacity_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Est. Cost Loss:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{comp.cost_loss_today}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Frequent Items Discarded:</span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 list-disc list-inside mt-1 space-y-0.5 font-medium">
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
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-black/30 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCompartment(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close waste subcategory popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Waste subcategories
              </span>
              <h3 id="waste-subcategory-title" className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {selectedCompartment.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Items currently recorded under this main waste category.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {selectedCompartment.frequent_items.map((item, index) => (
                <div
                  key={`${selectedCompartment.id}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                <span className="text-slate-500 dark:text-slate-400">Current weight</span>
                <p className="mt-1 font-bold text-slate-900 dark:text-white">{selectedCompartment.current_weight_kg} kg</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                <span className="text-slate-500 dark:text-slate-400">Estimated cost loss</span>
                <p className="mt-1 font-bold text-amber-700 dark:text-amber-400">{selectedCompartment.cost_loss_today}</p>
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
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Food Waste Category Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Identified through AI Computer Vision classifier</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.waste_composition.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{item.category}</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{item.weight_kg} kg ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  <span>Direct Loss: <strong className="text-amber-700 dark:text-amber-400 font-bold">LKR {item.cost_rs.toLocaleString()}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Waste Trend Chart */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Waste & Cost Loss Trend</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">7-Day smart bin load cell measurements</p>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} />
                  <XAxis dataKey="day" stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={11} />
                  <YAxis stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="total_food_waste_kg" fill="#f43f5e" name="Food Waste (kg)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Reduction Recommendations */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 shadow-sm">
            <span className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" /> AI Waste Reduction Interventions:
            </span>
            <ul className="space-y-1.5 text-xs text-rose-950 dark:text-slate-200 font-medium">
              {data.waste_reduction_recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <ArrowRight className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
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
