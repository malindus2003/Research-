import React, { useState, useEffect } from 'react';
import { Users, Clock, Flame, Award, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';

export default function KitchenStaffDashboard({ isDarkMode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKitchenData();
  }, []);

  const fetchKitchenData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/kitchen/metrics");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load kitchen metrics, using fallback:", err);
      setData({
        researcher: "Pahesara H.H.D.S (IT23349292)",
        module: "Component 2: Kitchen Efficiency and Staff Optimization Analytics",
        overall_kitchen_efficiency: "88.5%",
        avg_ticket_fulfillment_time: "7.4 mins",
        active_bottlenecks_count: 1,
        stations: [
          { id: "station-1", name: "Hot Wok & Kottu Station", active_cooks: 2, recommended_cooks: 3, avg_prep_time_mins: 8.5, target_prep_time_mins: 6.0, queue_length: 14, load_level: 92, bottleneck_status: "High Delay Risk", action: "Allocate 1 auxiliary chef from Cold Larder station immediately" },
          { id: "station-2", name: "Curry & Rice Assembly Bay", active_cooks: 2, recommended_cooks: 2, avg_prep_time_mins: 4.2, target_prep_time_mins: 4.5, queue_length: 4, load_level: 55, bottleneck_status: "Smooth Flow", action: "Maintain current line staffing" },
          { id: "station-3", name: "Grill & Seafood Station", active_cooks: 1, recommended_cooks: 2, avg_prep_time_mins: 14.0, target_prep_time_mins: 10.0, queue_length: 9, load_level: 84, bottleneck_status: "Moderate Bottleneck", action: "Prep protein cuts in advance to reduce grilling latency" },
          { id: "station-4", name: "Salad & Cold Prep Station", active_cooks: 2, recommended_cooks: 1, avg_prep_time_mins: 3.0, target_prep_time_mins: 4.0, queue_length: 2, load_level: 30, bottleneck_status: "Underutilized", action: "Reassign 1 staff member to Kottu Station during 7 PM rush" }
        ],
        staff: [
          { id: "staff-1", name: "K. Perera (Senior Line Chef)", assigned_station: "Hot Wok & Kottu Station", shift: "11:00 AM - 09:30 PM", efficiency_rating: 94, skill_level: "Expert (Level 4)", speed_score: "4.8 / 5.0", skill_gap: "Advanced Pastry & Bakery", training_recommendation: "Executive Kitchen Leadership & Precision Temperature Control", career_progression: "Ready for Sous-Chef Promotion (88% Milestones Complete)" },
          { id: "staff-2", name: "S. Fernando (Junior Chef)", assigned_station: "Salad & Cold Prep Station", shift: "03:00 PM - 11:00 PM", efficiency_rating: 78, skill_level: "Intermediate (Level 2)", speed_score: "3.9 / 5.0", skill_gap: "High-Heat Wok Handling & Kottu Speed", training_recommendation: "Enrolled in 'High-Volume Stir-Fry Optimization' (Module 3)", career_progression: "Target: Line Cook Specialist (62% Completed)" },
          { id: "staff-3", name: "T. Silva (Prep Cook)", assigned_station: "Grill & Seafood Station", shift: "10:00 AM - 07:00 PM", efficiency_rating: 85, skill_level: "Intermediate (Level 3)", speed_score: "4.2 / 5.0", skill_gap: "HACCP Seafood Core Temperature Monitoring", training_recommendation: "Seafood Freshness Grading & Quick-Sear Techniques", career_progression: "Grill Master Track (74% Completed)" }
        ],
        hourly_peak_forecast: [
          { hour: "11:00", predicted_orders: 24, staff_required: 4, actual_staff: 4 },
          { hour: "12:00", predicted_orders: 68, staff_required: 7, actual_staff: 6 },
          { hour: "13:00 (Lunch Peak)", predicted_orders: 95, staff_required: 8, actual_staff: 8 },
          { hour: "14:00", predicted_orders: 45, staff_required: 5, actual_staff: 5 },
          { hour: "15:00", predicted_orders: 18, staff_required: 3, actual_staff: 3 },
          { hour: "16:00", predicted_orders: 22, staff_required: 3, actual_staff: 3 },
          { hour: "17:00", predicted_orders: 38, staff_required: 5, actual_staff: 4 },
          { hour: "18:00", predicted_orders: 74, staff_required: 7, actual_staff: 7 },
          { hour: "19:00 (Dinner Peak)", predicted_orders: 115, staff_required: 9, actual_staff: 7 },
          { hour: "20:00 (Dinner Rush)", predicted_orders: 105, staff_required: 9, actual_staff: 8 },
          { hour: "21:00", predicted_orders: 52, staff_required: 5, actual_staff: 6 }
        ],
        ai_allocation_suggestions: [
          "⚠️ DINNER RUSH ALERT: Station 1 (Hot Wok) requires +1 Cook at 7:00 PM due to 115 projected orders.",
          "Reallocate S. Fernando from Cold Prep to Hot Wok during 7:00 PM - 9:00 PM window.",
          "Pre-portion 50x Curry bases at 5:30 PM to bypass assembly bottlenecks."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl">
        <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-bold font-mono">Loading Kitchen & Staff Metrics...</p>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kitchen Efficiency & Dynamic Staff Optimization</h2>
              <span className="text-xs px-2.5 py-0.5 rounded bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 font-bold">
                Workflow & Bottleneck AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Real-time line bottleneck monitoring, peak-hour staff allocation, and staff progression
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">Kitchen Overall Efficiency</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{data.overall_kitchen_efficiency}</div>
            </div>
            <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">Avg Prep Time</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{data.avg_ticket_fulfillment_time}</div>
            </div>
          </div>
        </div>

        {/* AI Actionable Directives */}
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30 shadow-sm">
          <span className="text-xs font-black text-orange-800 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" /> AI Dynamic Staff Allocation Directives
          </span>
          <ul className="space-y-1.5 text-xs text-orange-950 dark:text-slate-200 font-medium">
            {data.ai_allocation_suggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Peak-Hour Workload & Staffing Demand Chart */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Peak-Hour Workload & Staffing Forecast (11:00 - 22:00)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hourly projected kitchen orders and dynamic cook allocation requirements</p>
          </div>
          <span className="text-xs font-bold text-orange-800 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-500/20 shadow-sm">
            Dinner Rush: 19:00 - 20:30
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.hourly_peak_forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="hour" stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={11} />
              <YAxis stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={11} yAxisId="left" />
              <YAxis stroke={isDarkMode ? "#64748b" : "#475569"} fontSize={11} yAxisId="right" orientation="right" domain={[0, 12]} />
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
              <Line yAxisId="left" type="monotone" dataKey="predicted_orders" stroke="#f97316" strokeWidth={3} name="Predicted Orders" dot={{ r: 3 }} />
              <Line yAxisId="right" type="stepAfter" dataKey="staff_required" stroke="#10b981" strokeWidth={2.5} name="Chefs Required" />
              <Line yAxisId="right" type="stepAfter" dataKey="actual_staff" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" name="Scheduled Chefs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kitchen Station Bottleneck Monitors */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Real-Time Kitchen Station Workload & Bottlenecks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitoring queue latency and load balancing across all 4 production stations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.stations.map((st) => (
            <div
              key={st.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between shadow-sm transition-all ${
                st.load_level > 85
                  ? 'bg-rose-50 border-rose-300 dark:bg-rose-500/10 dark:border-rose-500/40'
                  : (st.load_level > 65 ? 'bg-amber-50 border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/40' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800')
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{st.name}</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    st.load_level > 85 ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                  }`}>
                    {st.load_level}% Load
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Current Queue:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{st.queue_length} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Prep Time:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{st.avg_prep_time_mins} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Cooks Assigned:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{st.active_cooks} (Target: {st.recommended_cooks})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Recommendation:</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5 font-bold">{st.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Skill Matrix */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Staff Skill-Gap Analysis & Progression Paths</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Personalized training recommendations and succession planning for kitchen personnel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.staff.map((member) => (
            <div key={member.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{member.assigned_station}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-500/30">
                  {member.skill_level}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Efficiency Rating:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{member.efficiency_rating}%</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Identified Skill-Gap: <span className="text-amber-700 dark:text-amber-300 font-bold">{member.skill_gap}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-slate-950/60 border border-purple-100 dark:border-slate-800/80 text-xs">
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" /> Personalized Training:
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 font-medium">{member.training_recommendation}</p>
              </div>

              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>{member.career_progression}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
