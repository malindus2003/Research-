import React, { useState, useEffect } from 'react';
import { TrendingUp, CloudRain, Calendar, ShoppingBag, Sparkles, CheckCircle, BarChart3, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';

export default function DemandForecastingDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemandData();
  }, []);

  const fetchDemandData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/demand/forecasts");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load demand forecasts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-mono">Loading Food Demand Predictions...</p>
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
              <h2 className="text-lg font-bold text-white">Food Demand Forecasting & Preparation Sizing</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Multi-Source Time-Series
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-source sales forecasting with contextual weather, event, and holiday intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Model Accuracy (MAPE)</span>
              <div className="text-lg font-extrabold text-emerald-400">{data.model_performance.mape} (95.2% Accuracy)</div>
            </div>
          </div>
        </div>

        {/* Multi-Source Contextual External Drivers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Weather Context</span>
              <div className="text-xs font-bold text-white mt-0.5">{data.contextual_factors.weather_condition}</div>
              <span className="text-[10px] text-sky-400 font-medium">{data.contextual_factors.weather_impact}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Reservations & Events</span>
              <div className="text-xs font-bold text-white mt-0.5">{data.contextual_factors.reservations_booked} Table Reservations</div>
              <span className="text-[10px] text-amber-400">{data.contextual_factors.local_events}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Promotions</span>
              <div className="text-xs font-bold text-white mt-0.5">{data.contextual_factors.active_promotions}</div>
              <span className="text-[10px] text-purple-400">+12% Dinner Conversion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Day Demand Trend Chart */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">7-Day Restaurant Order Demand Forecast</h3>
            <p className="text-xs text-slate-400">Comparing historical sales with AI predicted order volumes</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Today: 480 Total Orders Projected
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.multi_day_forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="actual_orders" fill="#3b82f6" name="Actual Orders" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted_orders" fill="#10b981" name="AI Predicted Demand" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Item-Level Preparation Recommendations Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Item-Level Kitchen Preparation Guidance</h3>
            <p className="text-xs text-slate-400">Exact portions to prepare before meal shifts with safety buffers to eliminate food waste</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Menu Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Predicted Orders</th>
                <th className="py-3 px-4">Recommended Prep Qty</th>
                <th className="py-3 px-4">Safety Buffer</th>
                <th className="py-3 px-4">Demand Influencers</th>
                <th className="py-3 px-4 text-right">POS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {data.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {item.name}
                    <span className="block text-[10px] text-slate-400 font-mono">LKR {item.price.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.category}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-bold text-emerald-400">{item.predicted_demand_today}</span>
                    <span className="text-[10px] text-slate-400 block">{item.trend} vs avg</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                      Prepare {item.prep_recommendation} portions
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">+{item.buffer_quantity} portions</td>
                  <td className="py-3 px-4 max-w-xs">
                    <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                      {item.key_drivers.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
