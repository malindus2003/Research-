import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Gauge, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

export default function StorageZoneTelemetry({ zones, selectedZoneId, onSelectZone }) {
  const [historyData, setHistoryData] = useState([]);
  const [activeMetric, setActiveMetric] = useState('temperature');
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  useEffect(() => {
    if (selectedZone) {
      fetchZoneHistory(selectedZone.id);
    }
  }, [selectedZone?.id]);

  const fetchZoneHistory = async (zoneId) => {
    try {
      setLoadingHistory(true);
      const res = await axios.get(`http://localhost:8000/api/sensors/zones/${zoneId}/history`);
      setHistoryData(res.data.history);
    } catch (err) {
      console.error("Failed to load telemetry history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!selectedZone) return null;

  const metricConfigs = {
    temperature: { label: "Temperature", unit: "°C", color: "#f43f5e", key: "temperature" },
    humidity: { label: "Humidity", unit: "%", color: "#0ea5e9", key: "humidity" },
    nh3: { label: "Ammonia (NH₃)", unit: "ppm", color: "#a855f7", key: "nh3" },
    co2: { label: "Carbon Dioxide (CO₂)", unit: "ppm", color: "#10b981", key: "co2" },
    voc: { label: "VOC Concentration", unit: "ppm", color: "#f59e0b", key: "voc" },
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">IoT Environmental Storage Telemetry</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ESP32 Sensor Array
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous multi-sensor monitoring for early spoilage gases & thermal deviations
          </p>
        </div>

        {/* Zone Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {zones.map(z => (
            <button
              key={z.id}
              onClick={() => onSelectZone(z.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedZone.id === z.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${z.status === 'optimal' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
              {z.name.split(':')[0]} ({z.category})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Zone Header */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">{selectedZone.name}</h3>
            {selectedZone.status === 'optimal' ? (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <CheckCircle className="h-3 w-3" /> Environment Optimal
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium animate-pulse">
                <AlertCircle className="h-3 w-3" /> Gas / Thermal Drift Detected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{selectedZone.description}</p>
        </div>
      </div>

      {/* Live 5-Sensor Gauge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        
        {/* 1. Temp */}
        <div 
          onClick={() => setActiveMetric('temperature')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'temperature' ? 'bg-rose-500/10 border-rose-500/50 shadow-md' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-rose-400" /> Temp</span>
            <span className="text-[10px] text-slate-500">Target: {selectedZone.target_temp}°C</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">
            {selectedZone.current_temp} <span className="text-sm font-normal text-slate-400">°C</span>
          </div>
        </div>

        {/* 2. Humidity */}
        <div 
          onClick={() => setActiveMetric('humidity')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'humidity' ? 'bg-sky-500/10 border-sky-500/50 shadow-md' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-sky-400" /> Humidity</span>
            <span className="text-[10px] text-slate-500">Target: {selectedZone.target_humidity}%</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">
            {selectedZone.current_humidity} <span className="text-sm font-normal text-slate-400">%</span>
          </div>
        </div>

        {/* 3. NH3 */}
        <div 
          onClick={() => setActiveMetric('nh3')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'nh3' ? 'bg-purple-500/10 border-purple-500/50 shadow-md' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Wind className="h-3.5 w-3.5 text-purple-400" /> NH₃ Ammonia</span>
            <span className={`text-[10px] font-bold ${selectedZone.nh3 > 0.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {selectedZone.nh3 > 0.2 ? 'High' : 'Normal'}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">
            {selectedZone.nh3} <span className="text-sm font-normal text-slate-400">ppm</span>
          </div>
        </div>

        {/* 4. CO2 */}
        <div 
          onClick={() => setActiveMetric('co2')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'co2' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-emerald-400" /> CO₂ Level</span>
            <span className="text-[10px] text-slate-500">Respiration</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">
            {selectedZone.co2} <span className="text-sm font-normal text-slate-400">ppm</span>
          </div>
        </div>

        {/* 5. VOC */}
        <div 
          onClick={() => setActiveMetric('voc')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'voc' ? 'bg-amber-500/10 border-amber-500/50 shadow-md' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-amber-400" /> Total VOC</span>
            <span className="text-[10px] text-slate-500">Degradation</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1.5">
            {selectedZone.voc} <span className="text-sm font-normal text-slate-400">ppm</span>
          </div>
        </div>

      </div>

      {/* 24-Hour Telemetry Trend Chart */}
      <div className="mt-5 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300">
            24-Hour Telemetry Trend: <span style={{ color: metricConfigs[activeMetric].color }}>{metricConfigs[activeMetric].label} ({metricConfigs[activeMetric].unit})</span>
          </span>
          <span className="text-[11px] text-slate-400">Recorded via IoT node at 1h intervals</span>
        </div>

        <div className="h-56 w-full">
          {loadingHistory ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Loading sensor time-series...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: metricConfigs[activeMetric].color }}
                  formatter={(val) => [`${val} ${metricConfigs[activeMetric].unit}`, metricConfigs[activeMetric].label]}
                />
                <Line
                  type="monotone"
                  dataKey={metricConfigs[activeMetric].key}
                  stroke={metricConfigs[activeMetric].color}
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: metricConfigs[activeMetric].color }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
