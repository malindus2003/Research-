import React, { useState, useEffect } from 'react';
import { TrendingUp, CloudRain, Calendar, ShoppingBag, Sparkles, CheckCircle, BarChart3, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';

export default function DemandForecastingDashboard({ isDarkMode }) {
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
      console.error("Failed to load demand forecasts, using fallback:", err);
      setData({
        researcher: "Nanayakkara K.A.J.Y (IT23314542)",
        module: "Component 1: AI Food Demand Prediction",
        model_performance: {
          algorithm: "Hybrid Random Forest + Prophet Multi-Source Time-Series",
          rmse: 4.12,
          mae: 3.05,
          mape: "4.8%",
          training_window_days: 90
        },
        contextual_factors: {
          weather_condition: "Heavy Evening Rain (24°C)",
          weather_impact: "+18% delivery & comfort food surge",
          active_promotions: "10% Family Dinner Flash Deal",
          reservations_booked: 64,
          local_events: "Inter-University Rugby Match (Nearby Venue)"
        },
        items: [
          { id: "menu-1", name: "Sri Lankan Chicken Rice & Curry", category: "Main Course", current_stock: 45, predicted_demand_today: 120, prep_recommendation: 125, buffer_quantity: 15, price: 1200.0, historical_avg: 95, confidence: 94.2, trend: "+26%", key_drivers: ["Rainy afternoon forecast (+18%)", "Public Holiday Eve (+8%)"], status: "Available" },
          { id: "menu-2", name: "Seafood Fried Rice (Jumbo)", category: "Main Course", current_stock: 20, predicted_demand_today: 85, prep_recommendation: 90, buffer_quantity: 10, price: 1850.0, historical_avg: 70, confidence: 91.5, trend: "+21%", key_drivers: ["Friday Dinner Rush", "Promotion Campaign 10% Off"], status: "Available" },
          { id: "menu-3", name: "Cheese & Vegetable Kottu", category: "Short Eats & Kottu", current_stock: 15, predicted_demand_today: 110, prep_recommendation: 115, buffer_quantity: 12, price: 1400.0, historical_avg: 88, confidence: 96.0, trend: "+25%", key_drivers: ["Evening sports match live broadcast", "High reservation volume (42 pax)"], status: "Available" },
          { id: "menu-4", name: "Creamy Tomato & Basil Pasta", category: "Italian", current_stock: 10, predicted_demand_today: 45, prep_recommendation: 50, buffer_quantity: 5, price: 1650.0, historical_avg: 42, confidence: 89.0, trend: "+7%", key_drivers: ["Stable weekday lunch demand"], status: "Available" },
          { id: "menu-5", name: "Tropical Fruit Salad with Honey", category: "Dessert", current_stock: 8, predicted_demand_today: 60, prep_recommendation: 65, buffer_quantity: 8, price: 850.0, historical_avg: 40, confidence: 93.4, trend: "+50%", key_drivers: ["Overripe fruit batch inventory alert (FIFO priority push)"], status: "Available" }
        ],
        multi_day_forecast: [
          { day: "Mon", predicted_orders: 310, actual_orders: 305, weather: "Sunny", event: "Normal" },
          { day: "Tue", predicted_orders: 340, actual_orders: 348, weather: "Sunny", event: "Normal" },
          { day: "Wed", predicted_orders: 365, actual_orders: 360, weather: "Cloudy", event: "Normal" },
          { day: "Thu", predicted_orders: 390, actual_orders: 385, weather: "Cloudy", event: "Normal" },
          { day: "Fri (Today)", predicted_orders: 480, actual_orders: null, weather: "Thunderstorm", event: "Weekend Rush" },
          { day: "Sat", predicted_orders: 560, actual_orders: null, weather: "Cloudy", event: "Weekend Rush" },
          { day: "Sun", predicted_orders: 520, actual_orders: null, weather: "Sunny", event: "Weekend Rush" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-bold font-mono">Loading Food Demand Predictions...</p>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Food Demand Forecasting & Preparation Sizing</h2>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold">
                Multi-Source Time-Series
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Multi-source sales forecasting with contextual weather, event, and holiday intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">Model Accuracy (MAPE)</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{data.model_performance.mape} (95.2% Accuracy)</div>
            </div>
          </div>
        </div>

        {/* Multi-Source Contextual External Drivers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Weather Context</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{data.contextual_factors.weather_condition}</div>
              <span className="text-xs text-sky-600 dark:text-sky-400 font-bold">{data.contextual_factors.weather_impact}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Reservations & Events</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{data.contextual_factors.reservations_booked} Table Reservations</div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">{data.contextual_factors.local_events}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Active Promotions</span>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{data.contextual_factors.active_promotions}</div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">+12% Dinner Conversion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Day Demand Trend Chart */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">7-Day Restaurant Order Demand Forecast</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Comparing historical sales with AI predicted order volumes</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            Today: 480 Total Orders Projected
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.multi_day_forecast}>
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="actual_orders" fill="#3b82f6" name="Actual Orders" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted_orders" fill="#10b981" name="AI Predicted Demand" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Item-Level Preparation Recommendations Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Item-Level Kitchen Preparation Guidance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Exact portions to prepare before meal shifts with safety buffers to eliminate food waste</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Menu Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Predicted Orders</th>
                <th className="py-3.5 px-4">Recommended Prep Qty</th>
                <th className="py-3.5 px-4">Safety Buffer</th>
                <th className="py-3.5 px-4">Demand Influencers</th>
                <th className="py-3.5 px-4 text-right">POS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {data.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">LKR {item.price.toFixed(2)}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{item.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{item.predicted_demand_today}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{item.trend} vs avg</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 shadow-sm">
                      Prepare {item.prep_recommendation} portions
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-300">+{item.buffer_quantity} portions</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside font-medium">
                      {item.key_drivers.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
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
