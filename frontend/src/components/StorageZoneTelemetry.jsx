import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Gauge, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

export default function StorageZoneTelemetry({ zones, selectedZoneId, onSelectZone, isDarkMode }) {
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
    temperature: { label: "Temperature", unit: "°C", color: "#dc2626", key: "temperature" },
    humidity: { label: "Humidity", unit: "%", color: "#0284c7", key: "humidity" },
    nh3: { label: "Ammonia (NH₃)", unit: "ppm", color: "#7c3aed", key: "nh3" },
    co2: { label: "Carbon Dioxide (CO₂)", unit: "ppm", color: "#059669", key: "co2" },
    voc: { label: "VOC Concentration", unit: "ppm", color: "#d97706", key: "voc" },
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5 bg-white border border-[#d1ded5]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#e1eae4] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">IoT Environmental Storage Telemetry</h2>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              ESP32 Sensor Array
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Continuous multi-sensor monitoring for early spoilage gases & thermal deviations
          </p>
        </div>

        {/* Zone Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {zones.map(z => (
            <button
              key={z.id}
              onClick={() => onSelectZone(z.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                selectedZone.id === z.id
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border-[#d1ded5]'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${z.status === 'optimal' ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`} />
              {z.name.split(':')[0]} ({z.category})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Zone Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#f8faf9] p-4 rounded-xl border border-[#d1ded5]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedZone.name}</h3>
            {selectedZone.status === 'optimal' ? (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold">
                <CheckCircle className="h-4 w-4 text-emerald-700" /> Environment Optimal
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-950 border border-rose-300 font-bold animate-pulse">
                <AlertCircle className="h-4 w-4 text-rose-700" /> Gas / Thermal Drift Detected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">{selectedZone.description}</p>
        </div>
      </div>

      {/* Live 5-Sensor Gauge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        
        {/* 1. Temp */}
        <div 
          onClick={() => setActiveMetric('temperature')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'temperature'
              ? 'bg-rose-50 border-rose-400 shadow-sm ring-1 ring-rose-300'
              : 'bg-white border-[#d1ded5] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 text-rose-700"><Thermometer className="h-4 w-4" /> Temp</span>
            <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">Target: {selectedZone.target_temp}°C</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {selectedZone.current_temp} <span className="text-base font-bold text-slate-500">°C</span>
          </div>
        </div>

        {/* 2. Humidity */}
        <div 
          onClick={() => setActiveMetric('humidity')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'humidity'
              ? 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
              : 'bg-white border-[#d1ded5] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 text-sky-700"><Droplets className="h-4 w-4" /> Humidity</span>
            <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">Target: {selectedZone.target_humidity}%</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {selectedZone.current_humidity} <span className="text-base font-bold text-slate-500">%</span>
          </div>
        </div>

        {/* 3. NH3 */}
        <div 
          onClick={() => setActiveMetric('nh3')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'nh3'
              ? 'bg-purple-50 border-purple-400 shadow-sm ring-1 ring-purple-300'
              : 'bg-white border-[#d1ded5] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 text-purple-700"><Wind className="h-4 w-4" /> NH₃ Ammonia</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${selectedZone.nh3 > 0.2 ? 'bg-rose-600 text-white border-rose-700' : 'bg-emerald-600 text-white border-emerald-700'}`}>
              {selectedZone.nh3 > 0.2 ? 'High' : 'Normal'}
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {selectedZone.nh3} <span className="text-base font-bold text-slate-500">ppm</span>
          </div>
        </div>

        {/* 4. CO2 */}
        <div 
          onClick={() => setActiveMetric('co2')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'co2'
              ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-300'
              : 'bg-white border-[#d1ded5] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-700"><Activity className="h-4 w-4" /> CO₂ Level</span>
            <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">Respiration</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {selectedZone.co2} <span className="text-base font-bold text-slate-500">ppm</span>
          </div>
        </div>

        {/* 5. VOC */}
        <div 
          onClick={() => setActiveMetric('voc')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeMetric === 'voc'
              ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-300'
              : 'bg-white border-[#d1ded5] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 text-amber-700"><Gauge className="h-4 w-4" /> Total VOC</span>
            <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">Degradation</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {selectedZone.voc} <span className="text-base font-bold text-slate-500">ppm</span>
          </div>
        </div>

      </div>

      {/* 24-Hour Telemetry Trend Chart */}
      <div className="bg-[#f8faf9] p-5 rounded-2xl border border-[#d1ded5] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900">
            24-Hour Telemetry Trend: <span style={{ color: metricConfigs[activeMetric].color }}>{metricConfigs[activeMetric].label} ({metricConfigs[activeMetric].unit})</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Recorded via IoT node at 1h intervals</span>
        </div>

        <div className="h-60 w-full">
          {loadingHistory ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
              Loading sensor time-series...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)'
                  }}
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
