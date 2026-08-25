import React, { useState, useEffect } from 'react';
import { Users, Clock, Flame, Award, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';

export default function KitchenStaffDashboard() {
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
      console.error("Failed to load kitchen metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl">
        <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-mono">Loading Kitchen & Staff Metrics...</p>
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
              <h2 className="text-lg font-bold text-white">Kitchen Efficiency & Dynamic Staff Optimization</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Workflow & Bottleneck AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time line bottleneck monitoring, peak-hour staff allocation, and staff progression
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Kitchen Overall Efficiency</span>
              <div className="text-lg font-extrabold text-emerald-400">{data.overall_kitchen_efficiency}</div>
            </div>
            <div className="text-right border-l border-slate-800 pl-4">
              <span className="text-[11px] text-slate-400">Avg Prep Time</span>
              <div className="text-lg font-extrabold text-white">{data.avg_ticket_fulfillment_time}</div>
            </div>
          </div>
        </div>

        {/* AI Actionable Directives */}
        <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Flame className="h-4 w-4" /> AI Dynamic Staff Allocation Directives
          </span>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {data.ai_allocation_suggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Peak-Hour Workload & Staffing Demand Chart */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Peak-Hour Workload & Staffing Forecast (11:00 - 22:00)</h3>
            <p className="text-xs text-slate-400">Hourly projected kitchen orders and dynamic cook allocation requirements</p>
          </div>
          <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">
            Dinner Rush: 19:00 - 20:30
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.hourly_peak_forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} yAxisId="left" />
              <YAxis stroke="#64748b" fontSize={11} yAxisId="right" orientation="right" domain={[0, 12]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="predicted_orders" stroke="#f97316" strokeWidth={3} name="Predicted Orders" dot={{ r: 3 }} />
              <Line yAxisId="right" type="stepAfter" dataKey="staff_required" stroke="#10b981" strokeWidth={2} name="Chefs Required" />
              <Line yAxisId="right" type="stepAfter" dataKey="actual_staff" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" name="Scheduled Chefs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kitchen Station Bottleneck Monitors */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Real-Time Kitchen Station Workload & Bottlenecks</h3>
            <p className="text-xs text-slate-400">Monitoring queue latency and load balancing across all 4 production stations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.stations.map((st) => (
            <div
              key={st.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                st.load_level > 85
                  ? 'bg-rose-500/10 border-rose-500/40 glow-rose'
                  : (st.load_level > 65 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900/60 border-slate-800')
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{st.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    st.load_level > 85 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {st.load_level}% Load
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Queue:</span>
                    <span className="font-bold text-white">{st.queue_length} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Prep Time:</span>
                    <span className="font-bold text-white">{st.avg_prep_time_mins} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cooks Assigned:</span>
                    <span className="font-bold text-white">{st.active_cooks} (Target: {st.recommended_cooks})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Recommendation:</span>
                <p className="text-xs text-slate-200 mt-0.5">{st.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Skill Matrix */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Staff Skill-Gap Analysis & Progression Paths</h3>
            <p className="text-xs text-slate-400">Personalized training recommendations and succession planning for kitchen personnel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.staff.map((member) => (
            <div key={member.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{member.name}</h4>
                  <span className="text-[10px] text-slate-400">{member.assigned_station}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {member.skill_level}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Efficiency Rating:</span>
                  <span className="font-bold text-emerald-400">{member.efficiency_rating}%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Identified Skill-Gap: <span className="text-amber-300">{member.skill_gap}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                  <Award className="h-3 w-3" /> Personalized Training:
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{member.training_recommendation}</p>
              </div>

              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{member.career_progression}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
