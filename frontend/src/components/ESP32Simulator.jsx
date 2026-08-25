import React, { useState } from 'react';
import { Cpu, Send, CheckCircle, RefreshCw, Flame, AlertOctagon } from 'lucide-react';
import axios from 'axios';

export default function ESP32Simulator({ zones, onTelemetrySent }) {
  const [selectedZone, setSelectedZone] = useState(zones[0]?.id || "zone-1");
  const [temp, setTemp] = useState(4.2);
  const [humidity, setHumidity] = useState(78.0);
  const [nh3, setNh3] = useState(0.35);
  const [co2, setCo2] = useState(650.0);
  const [voc, setVoc] = useState(0.40);
  const [statusMsg, setStatusMsg] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendTelemetry = async (customPayload = null) => {
    setSending(true);
    setStatusMsg("");
    try {
      const zoneObj = zones.find(z => z.id === selectedZone) || zones[0];
      const payload = customPayload || {
        storage_zone: zoneObj.name,
        temperature: Number(temp),
        humidity: Number(humidity),
        nh3: Number(nh3),
        co2: Number(co2),
        voc: Number(voc)
      };

      const res = await axios.post("http://localhost:8000/api/sensors/telemetry", payload);
      setStatusMsg(`Telemetry Packet Transmitted [HTTP 200 OK]`);
      if (onTelemetrySent) onTelemetrySent();
    } catch (err) {
      console.error("Telemetry failed:", err);
      setStatusMsg("Failed to transmit telemetry");
    } finally {
      setSending(false);
    }
  };

  const simulatePreset = (type) => {
    if (type === "anomaly") {
      // Simulate cooling breakdown + ammonia spike in meat zone
      setTemp(11.5);
      setHumidity(92.0);
      setNh3(0.68);
      setCo2(1100.0);
      setVoc(0.85);
      handleSendTelemetry({
        storage_zone: zones[0].name,
        temperature: 11.5,
        humidity: 92.0,
        nh3: 0.68,
        co2: 1100.0,
        voc: 0.85
      });
    } else if (type === "normal") {
      // Restore normal
      setTemp(1.2);
      setHumidity(74.0);
      setNh3(0.08);
      setCo2(430.0);
      setVoc(0.15);
      handleSendTelemetry({
        storage_zone: zones[0].name,
        temperature: 1.2,
        humidity: 74.0,
        nh3: 0.08,
        co2: 430.0,
        voc: 0.15
      });
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">ESP32 IoT Node Simulator & Telemetry Ingestion</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              POST /api/sensors/telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Emulate physical sensor data broadcast from hardware microcontrollers
          </p>
        </div>

        {/* Quick Trigger Preset Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => simulatePreset("anomaly")}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" /> Simulate Spoilage Anomaly
          </button>
          <button
            onClick={() => simulatePreset("normal")}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Reset to Normal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-4 text-xs">
        <div>
          <label className="text-slate-400">Target Node</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          >
            {zones.map(z => (
              <option key={z.id} value={z.id}>{z.name.split(':')[0]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-400">Temp (°C)</label>
          <input
            type="number"
            step="0.1"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div>
          <label className="text-slate-400">Humidity (%)</label>
          <input
            type="number"
            step="0.5"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div>
          <label className="text-slate-400">NH₃ (ppm)</label>
          <input
            type="number"
            step="0.01"
            value={nh3}
            onChange={(e) => setNh3(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div>
          <label className="text-slate-400">CO₂ (ppm)</label>
          <input
            type="number"
            step="10"
            value={co2}
            onChange={(e) => setCo2(e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleSendTelemetry()}
            disabled={sending}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 shadow-md shadow-sky-600/20 transition-colors"
          >
            <Send className="h-3.5 w-3.5" /> Broadcast
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="mt-3 text-xs text-sky-400 font-mono flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5" /> {statusMsg}
        </div>
      )}
    </div>
  );
}
