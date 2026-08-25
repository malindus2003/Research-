import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Sliders, ArrowRight, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Sparkles, Apple, Carrot, Milk, Fish, Beef } from 'lucide-react';
import axios from 'axios';

const QUICK_PRESETS = [
  { name: "Fresh Strawberries", category: "Fruits", temp: 9.5, humidity: 91, nh3: 0.04, co2: 1050, voc: 0.52, hours: 80, dis: 20, mould: false },
  { name: "Cavendish Bananas", category: "Fruits", temp: 9.0, humidity: 88, nh3: 0.03, co2: 980, voc: 0.48, hours: 90, dis: 25, mould: false },
  { name: "Romaine Lettuce", category: "Vegetables", temp: 5.0, humidity: 90, nh3: 0.04, co2: 600, voc: 0.20, hours: 40, dis: 5, mould: false },
  { name: "Baby Spinach Leaves", category: "Vegetables", temp: 5.8, humidity: 92, nh3: 0.06, co2: 740, voc: 0.35, hours: 75, dis: 22, mould: false },
  { name: "Pasteurized Milk", category: "Dairy", temp: 3.2, humidity: 66, nh3: 0.04, co2: 420, voc: 0.10, hours: 48, dis: 2, mould: false },
  { name: "Fresh Chicken Breast", category: "Meat", temp: 4.1, humidity: 79, nh3: 0.32, co2: 580, voc: 0.38, hours: 64, dis: 15, mould: false },
  { name: "Yellowfin Tuna", category: "Fish", temp: 1.1, humidity: 86, nh3: 0.08, co2: 440, voc: 0.14, hours: 18, dis: 4, mould: false }
];

export default function MultiModalAssessor({ currentVisionFeatures, selectedZone }) {
  const [itemName, setItemName] = useState("Fresh Strawberries");
  const [category, setCategory] = useState("Fruits");
  const [storageHours, setStorageHours] = useState(72);

  // Sensor inputs
  const [temp, setTemp] = useState(9.2);
  const [humidity, setHumidity] = useState(90);
  const [nh3, setNh3] = useState(0.04);
  const [co2, setCo2] = useState(980);
  const [voc, setVoc] = useState(0.48);

  // Vision inputs
  const [useVision, setUseVision] = useState(true);
  const [discoloration, setDiscoloration] = useState(15);
  const [mouldDetected, setMouldDetected] = useState(false);
  const [textureDegradation, setTextureDegradation] = useState(20);

  // Prediction State
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyPreset = (preset) => {
    setItemName(preset.name);
    setCategory(preset.category);
    setTemp(preset.temp);
    setHumidity(preset.humidity);
    setNh3(preset.nh3);
    setCo2(preset.co2);
    setVoc(preset.voc);
    setStorageHours(preset.hours);
    setDiscoloration(preset.dis);
    setMouldDetected(preset.mould);
  };

  useEffect(() => {
    if (selectedZone) {
      setTemp(selectedZone.current_temp);
      setHumidity(selectedZone.current_humidity);
      setNh3(selectedZone.nh3);
      setCo2(selectedZone.co2);
      setVoc(selectedZone.voc);
      setCategory(selectedZone.category);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (currentVisionFeatures) {
      setCategory(currentVisionFeatures.category);
      setDiscoloration(currentVisionFeatures.discoloration_score);
      setMouldDetected(currentVisionFeatures.mould_detected);
      setTextureDegradation(currentVisionFeatures.texture_degradation);
      setUseVision(true);
    }
  }, [currentVisionFeatures]);

  useEffect(() => {
    runPrediction();
  }, [itemName, category, storageHours, temp, humidity, nh3, co2, voc, useVision, discoloration, mouldDetected, textureDegradation]);

  const runPrediction = async () => {
    try {
      setLoading(true);
      const payload = {
        item_name: itemName,
        category: category,
        storage_duration_hours: Number(storageHours),
        sensor_data: {
          storage_zone: selectedZone ? selectedZone.name : "Cold Storage",
          temperature: Number(temp),
          humidity: Number(humidity),
          nh3: Number(nh3),
          co2: Number(co2),
          voc: Number(voc)
        },
        vision_data: useVision ? {
          category: category,
          discoloration_score: Number(discoloration),
          mould_detected: mouldDetected,
          mould_coverage: mouldDetected ? 5.0 : 0.0,
          ripeness_stage: mouldDetected ? "Spoiled / Rotten" : (discoloration > 20 ? "Overripe / Wilting" : "Fresh / Optimal"),
          texture_degradation: Number(textureDegradation),
          visual_spoilage_score: mouldDetected ? 85.0 : Number(discoloration * 1.5 + textureDegradation * 0.5)
        } : null
      };

      const res = await axios.post("http://localhost:8000/api/predictions/assess", payload);
      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case "Low":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> LOW RISK (FRESH)</span>;
      case "Medium":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> MEDIUM RISK</span>;
      case "High":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> HIGH RISK (USE FIRST)</span>;
      case "Critical":
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 animate-pulse"><XCircle className="h-3.5 w-3.5" /> CRITICAL (DISPOSE)</span>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Universal AI Spoilage & Shelf-Life Assessor</h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> All Food Categories Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Merges physical gas & climate sensors with visual CV indicators across Fruits, Veg, Dairy, Fish & Meat
          </p>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-slate-400">Quick Test Items:</span>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {QUICK_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
            >
              {p.name} ({p.category})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        
        {/* Controls & Simulators */}
        <div className="lg:col-span-6 space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-emerald-400" /> Multi-Source Input Parameters
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Food Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Food Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1"
              >
                <option value="Fruits">Fruits (Bananas, Strawberries, Apples...)</option>
                <option value="Vegetables">Vegetables (Lettuce, Spinach, Tomatoes...)</option>
                <option value="Dairy">Dairy (Milk, Cheese, Yogurt...)</option>
                <option value="Fish">Fish & Seafood (Tuna, Salmon, Prawns...)</option>
                <option value="Meat">Meat & Poultry (Chicken, Beef, Pork...)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Storage Elapsed Duration:</span>
              <span className="font-bold text-emerald-400">{storageHours} Hours ({(storageHours / 24.0).toFixed(1)} days)</span>
            </div>
            <input
              type="range"
              min="1"
              max="168"
              value={storageHours}
              onChange={(e) => setStorageHours(e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
            />
          </div>

          {/* Sensor Parameter Sliders */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">IoT Sensor Telemetry</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Temp:</span>
                  <span className="font-mono text-white">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="20"
                  step="0.5"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Humidity:</span>
                  <span className="font-mono text-white">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="98"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">NH₃ (ppm):</span>
                  <span className="font-mono text-purple-400">{nh3}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.0"
                  step="0.01"
                  value={nh3}
                  onChange={(e) => setNh3(e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">CO₂ (ppm):</span>
                  <span className="font-mono text-emerald-400">{co2}</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="2000"
                  step="25"
                  value={co2}
                  onChange={(e) => setCo2(e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">VOC / Ethylene:</span>
                  <span className="font-mono text-amber-400">{voc}</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="1.5"
                  step="0.02"
                  value={voc}
                  onChange={(e) => setVoc(e.target.value)}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Computer Vision Toggle */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vision Features</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={useVision}
                  onChange={(e) => setUseVision(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                Enable CV Fusion
              </label>
            </div>

            {useVision && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Browning / Bruise:</span>
                    <span className="font-mono text-white">{discoloration}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={discoloration}
                    onChange={(e) => setDiscoloration(e.target.value)}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-slate-400"
                  />
                </div>
                <div className="flex items-center justify-center pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-rose-300">
                    <input
                      type="checkbox"
                      checked={mouldDetected}
                      onChange={(e) => setMouldDetected(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                    />
                    Fungal Spores / Mould
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Results & Action Recommendations */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {prediction && (
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 flex flex-col h-full justify-between">
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    {prediction.category} Spoilage Assessment
                  </span>
                  {getRiskBadge(prediction.risk_level)}
                </div>

                {/* Big Metric Gauges */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-xs text-slate-400">Remaining Shelf-Life (RSL)</span>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                      {prediction.remaining_shelf_life_hours} <span className="text-sm font-normal text-slate-400">hours</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Approx. {(prediction.remaining_shelf_life_hours / 24.0).toFixed(1)} days usable
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-xs text-slate-400">Spoilage Probability</span>
                    <div className="text-3xl font-extrabold text-rose-400 mt-1">
                      {prediction.spoilage_probability} <span className="text-sm font-normal text-slate-400">%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, prediction.spoilage_probability)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dominant Spoilage Factors */}
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-300">Identified Spoilage Drivers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {prediction.dominant_spoilage_factors.map((factor, i) => (
                      <span key={i} className="px-2 py-1 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700/80">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Intelligent Culinary Recommendation ({prediction.category})
                </span>
                <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <strong className="block text-amber-300 font-semibold mb-0.5">{prediction.storage_action}</strong>
                  <ul className="space-y-1 mt-1 list-disc list-inside text-[11px] text-amber-200/90">
                    {prediction.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
