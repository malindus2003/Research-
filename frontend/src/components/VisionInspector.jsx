import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Eye, CheckCircle2, AlertTriangle, Sparkles, Video, VideoOff, Sliders, XCircle, Layers, ArrowRight, ShieldAlert } from 'lucide-react';
import axios from 'axios';

// High-resolution realistic photography presets covering all categories
const SAMPLE_PRESETS = [
  {
    id: "strawberries_mould",
    name: "Mouldy Strawberries",
    category: "Fruits",
    icon: "🍓",
    container: "Container #C-104 (Berry Crisper)",
    imageUrl: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Spoiled / Senescent (Rotting)",
    ripeness_percent: 98,
    visual_spoilage_score: 92,
    risk_level: "Critical",
    discoloration_score: 38,
    mould_detected: true,
    mould_coverage: 14.5,
    texture_degradation: 65,
    detected_defects: [
      "Active fungal mould colony (Botrytis cinerea)",
      "Surface tissue softening & cellular collapse",
      "Enzymatic browning across 38% surface area"
    ],
    bounding_boxes: [
      { label: "MOULD SPORE PATCH (92%)", type: "spoilage", x: 28, y: 35, width: 44, height: 38, color: "#ef4444" },
      { label: "TISSUE ROT (85%)", type: "spoilage", x: 60, y: 55, width: 28, height: 26, color: "#ef4444" }
    ]
  },
  {
    id: "banana_overripe",
    name: "Overripe Brown Banana",
    category: "Fruits",
    icon: "🍌",
    container: "Container #C-102 (Fruit Chamber)",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Overripe (Use Immediately)",
    ripeness_percent: 85,
    visual_spoilage_score: 74,
    risk_level: "High",
    discoloration_score: 42,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 48,
    detected_defects: [
      "Extensive senescence brown spotting (tyrosine oxidation)",
      "Sugar inversion & soft pulp texture",
      "High ethylene degassing emission"
    ],
    bounding_boxes: [
      { label: "SENESCENCE BROWNING", type: "overripe", x: 25, y: 30, width: 52, height: 42, color: "#f59e0b" }
    ]
  },
  {
    id: "apple_fresh",
    name: "Fresh Crisp Green Apple",
    category: "Fruits",
    icon: "🍏",
    container: "Container #C-101 (Fruit Chamber)",
    imageUrl: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Optimal Ripe (Prime Quality)",
    ripeness_percent: 45,
    visual_spoilage_score: 8,
    risk_level: "Low",
    discoloration_score: 2,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 4,
    detected_defects: [],
    bounding_boxes: [
      { label: "PRIME CRISP TURGOR", type: "fresh", x: 20, y: 15, width: 60, height: 70, color: "#10b981" }
    ]
  },
  {
    id: "spinach_wilted",
    name: "Wilted Yellowing Spinach",
    category: "Vegetables",
    icon: "🥬",
    container: "Container #C-205 (Veg Crisper)",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Wilted / Softening (Use Today)",
    ripeness_percent: 82,
    visual_spoilage_score: 76,
    risk_level: "High",
    discoloration_score: 34,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 58,
    detected_defects: [
      "Chlorophyll breakdown (leaf chlorosis / yellowing)",
      "Severe leaf wilting and moisture loss",
      "Early leaf edge slime degradation"
    ],
    bounding_boxes: [
      { label: "CHLOROSIS / YELLOWING", type: "overripe", x: 20, y: 25, width: 58, height: 50, color: "#f59e0b" }
    ]
  },
  {
    id: "lettuce_crisp",
    name: "Fresh Romaine Lettuce",
    category: "Vegetables",
    icon: "🥗",
    container: "Container #C-201 (Veg Crisper)",
    imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Crisp & Fresh Harvest",
    ripeness_percent: 40,
    visual_spoilage_score: 10,
    risk_level: "Low",
    discoloration_score: 3,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 6,
    detected_defects: [],
    bounding_boxes: [
      { label: "FRESH HYDRATED LEAVES", type: "fresh", x: 18, y: 18, width: 64, height: 64, color: "#10b981" }
    ]
  },
  {
    id: "tomato_overripe",
    name: "Overripe Soft Tomato",
    category: "Vegetables",
    icon: "🍅",
    container: "Container #C-204 (Veg Crisper)",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Overripe / Softening (Use Today)",
    ripeness_percent: 86,
    visual_spoilage_score: 70,
    risk_level: "High",
    discoloration_score: 22,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 52,
    detected_defects: [
      "Loss of skin firmness & localized bruising",
      "High carotenoid softness breakdown"
    ],
    bounding_boxes: [
      { label: "SOFTENING TISSUE", type: "overripe", x: 28, y: 25, width: 48, height: 50, color: "#f59e0b" }
    ]
  },
  {
    id: "cheese_mouldy",
    name: "Mouldy Aged Cheese",
    category: "Dairy",
    icon: "🧀",
    container: "Container #C-302 (Dairy Fridge)",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Spoiled / Sour",
    ripeness_percent: 95,
    visual_spoilage_score: 88,
    risk_level: "Critical",
    discoloration_score: 30,
    mould_detected: true,
    mould_coverage: 16.0,
    texture_degradation: 45,
    detected_defects: [
      "Uncontrolled surface fungal mycelium",
      "Yellow curd acidification"
    ],
    bounding_boxes: [
      { label: "FUNGAL MYCELIUM PATCH", type: "spoilage", x: 30, y: 30, width: 42, height: 40, color: "#ef4444" }
    ]
  },
  {
    id: "salmon_fresh",
    name: "Fresh Atlantic Salmon",
    category: "Fish",
    icon: "🐟",
    container: "Container #C-501 (Seafood Ice)",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Prime Sea-Fresh",
    ripeness_percent: 30,
    visual_spoilage_score: 12,
    risk_level: "Low",
    discoloration_score: 4,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 8,
    detected_defects: [],
    bounding_boxes: [
      { label: "OPTIMAL ASTAXANTHIN TRANSLUCENCY", type: "fresh", x: 22, y: 20, width: 56, height: 60, color: "#10b981" }
    ]
  },
  {
    id: "beef_fresh",
    name: "Fresh Beef Sirloin",
    category: "Meat",
    icon: "🥩",
    container: "Container #C-401 (Meat Chiller)",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Fresh Cut (Optimal)",
    ripeness_percent: 35,
    visual_spoilage_score: 14,
    risk_level: "Low",
    discoloration_score: 5,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 10,
    detected_defects: [],
    bounding_boxes: [
      { label: "HEALTHY OXYMYOGLOBIN RED", type: "fresh", x: 25, y: 25, width: 50, height: 50, color: "#10b981" }
    ]
  },
  {
    id: "meat_oxidized",
    name: "Oxidized Discolored Meat",
    category: "Meat",
    icon: "🍖",
    container: "Container #C-403 (Meat Chiller)",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Oxidized / High Spoilage Risk",
    ripeness_percent: 90,
    visual_spoilage_score: 80,
    risk_level: "High",
    discoloration_score: 44,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 55,
    detected_defects: [
      "Metmyoglobin surface discoloration (dull grey/brown)",
      "Aerobic bacterial slime degradation"
    ],
    bounding_boxes: [
      { label: "OXIDATIVE BROWNING", type: "spoilage", x: 24, y: 28, width: 55, height: 48, color: "#ef4444" }
    ]
  }
];

export default function VisionInspector({ onInspectionComplete }) {
  const [category, setCategory] = useState("Fruits");
  const [selectedPresetId, setSelectedPresetId] = useState(SAMPLE_PRESETS[0].id);
  const [previewImage, setPreviewImage] = useState(SAMPLE_PRESETS[0].imageUrl);
  const [currentContainerName, setCurrentContainerName] = useState(SAMPLE_PRESETS[0].container);
  const [analyzing, setAnalyzing] = useState(false);
  const [cvResult, setCvResult] = useState(SAMPLE_PRESETS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Interactive Dummy Simulation Slider (0% to 100%)
  const [dummyLevel, setDummyLevel] = useState(92);
  const [isManualOverride, setIsManualOverride] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Notify parent on initial load
    if (onInspectionComplete) {
      onInspectionComplete(SAMPLE_PRESETS[0]);
    }
    return () => {
      stopCamera();
    };
  }, []);

  const handleSelectPreset = (preset) => {
    stopCamera();
    setSelectedPresetId(preset.id);
    setCategory(preset.category);
    setCurrentContainerName(preset.container);
    setPreviewImage(preset.imageUrl);
    setCvResult(preset);
    setDummyLevel(preset.visual_spoilage_score);
    setIsManualOverride(false);

    if (onInspectionComplete) {
      onInspectionComplete(preset);
    }
  };

  const handleFileUpload = async (e) => {
    stopCamera();
    const file = e.target.files[0];
    if (file) {
      setCurrentContainerName("Uploaded Container Photo");
      setSelectedPresetId(null);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result;
        setPreviewImage(dataUrl);
        await runBackendAnalysis(dataUrl, category);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setCurrentContainerName("Live Container Camera (Real-Time)");
      setSelectedPresetId(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Check device permissions or select a sample photo.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 400;
    canvas.height = videoRef.current.videoHeight || 300;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    stopCamera();
    setPreviewImage(dataUrl);
    runBackendAnalysis(dataUrl, category);
  };

  const runBackendAnalysis = async (imageDataUrl, targetCategory) => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("category", targetCategory);
      formData.append("image_base64", imageDataUrl);

      const res = await axios.post("http://localhost:8000/api/vision/inspect", formData);
      setCvResult(res.data.features);
      setDummyLevel(res.data.features.visual_spoilage_score || 50);
      setIsManualOverride(false);
      if (onInspectionComplete) {
        onInspectionComplete(res.data.features);
      }
    } catch (err) {
      console.error("CV inspection error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle Dummy Level Slider Movement (Real-Time Interactive Simulation)
  const handleDummySliderChange = (newVal) => {
    const val = Number(newVal);
    setDummyLevel(val);
    setIsManualOverride(true);

    let stage = "Optimal Ripe (Prime Quality)";
    let risk = "Low";
    let mould = false;
    let bboxes = [];
    let defects = [];

    if (val < 25) {
      stage = "Unripe / Firm";
      risk = "Low";
      bboxes = [{ label: "UNRIPE (FIRM TEXTURE)", type: "fresh", x: 25, y: 25, width: 50, height: 50, color: "#10b981" }];
    } else if (val < 55) {
      stage = "Optimal Ripe (Prime Quality)";
      risk = "Low";
      bboxes = [{ label: "OPTIMAL RIPENESS", type: "fresh", x: 20, y: 20, width: 60, height: 60, color: "#10b981" }];
    } else if (val < 78) {
      stage = "Overripe / Wilted (Use Today)";
      risk = "High";
      bboxes = [{ label: "SENESCENCE BROWNING / WILTING", type: "overripe", x: 22, y: 25, width: 56, height: 50, color: "#f59e0b" }];
      defects = ["Surface softening and enzymatic browning", "Loss of moisture / turgor"];
    } else {
      stage = "Spoiled / Rotten (Quarantine)";
      risk = "Critical";
      mould = true;
      bboxes = [
        { label: "MOULD SPORE PATCH", type: "spoilage", x: 28, y: 32, width: 44, height: 40, color: "#ef4444" },
        { label: "DEEP TISSUE ROT", type: "spoilage", x: 55, y: 50, width: 30, height: 30, color: "#ef4444" }
      ];
      defects = ["Active fungal mould growth detected", "Severe microbial decomposition", "Deleterious odour / spoilage risk"];
    }

    const updated = {
      ...cvResult,
      category: category,
      ripeness_stage: stage,
      ripeness_percent: val,
      visual_spoilage_score: val,
      risk_level: risk,
      discoloration_score: Math.round(val * 0.45),
      mould_detected: mould,
      mould_coverage: mould ? Math.round((val - 75) * 0.6) : 0,
      texture_degradation: Math.round(val * 0.7),
      detected_defects: defects,
      bounding_boxes: bboxes
    };

    setCvResult(updated);
    if (onInspectionComplete) {
      onInspectionComplete(updated);
    }
  };

  const getRipenessStep = (stage) => {
    if (!stage) return 2;
    const s = stage.toLowerCase();
    if (s.includes("unripe")) return 1;
    if (s.includes("optimal") || s.includes("fresh") || s.includes("prime") || s.includes("crisp")) return 2;
    if (s.includes("overripe") || s.includes("wilted") || s.includes("soft")) return 3;
    return 4; // Spoiled
  };

  const ripenessStep = cvResult ? getRipenessStep(cvResult.ripeness_stage) : 2;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Container Camera Optical Scanner & Ripeness Assessor</h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              Real Photographic AI Inspection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real photographic inspection of container produce & dynamic level simulation slider
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <VideoOff className="h-4 w-4" /> Stop Live Camera
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow shadow-purple-600/20 transition-colors"
            >
              <Video className="h-4 w-4" /> Open Container Camera
            </button>
          )}

          <select
            value={category}
            onChange={(e) => {
              const newCat = e.target.value;
              setCategory(newCat);
              const match = SAMPLE_PRESETS.find(p => p.category === newCat);
              if (match) handleSelectPreset(match);
            }}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500"
          >
            <option value="Fruits">🍎 Fruits</option>
            <option value="Vegetables">🥬 Vegetables</option>
            <option value="Dairy">🥛 Dairy</option>
            <option value="Fish">🐟 Fish</option>
            <option value="Meat">🥩 Meat</option>
          </select>
        </div>
      </div>

      {/* Real Photo Presets Strip */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Real Photographic Container Samples:</span>
          <span className="text-[11px] text-purple-400 font-medium">Click any photo below to inspect</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
          {SAMPLE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center group ${
                selectedPresetId === preset.id
                  ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-full h-16 rounded-lg overflow-hidden relative bg-slate-950 mb-1.5 border border-slate-800">
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className={`absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                  preset.risk_level === 'Critical' ? 'bg-rose-600 text-white' : (preset.risk_level === 'High' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white')
                }`}>
                  {preset.risk_level}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-200 line-clamp-1 flex items-center gap-1">
                <span>{preset.icon}</span> {preset.name}
              </span>
              <span className="text-[10px] text-slate-400">{preset.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Dummy Simulation Slider for Level Tuning */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-500/30 glow-amber">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold text-white">Interactive Ripeness & Spoilage Simulator (Dummy Level Slider):</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-300">
              Spoilage Level: <strong className="text-white text-sm">{dummyLevel}%</strong>
            </span>
            {isManualOverride && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Manual Override Active
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="100"
            value={dummyLevel}
            onChange={(e) => handleDummySliderChange(e.target.value)}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span className="text-emerald-400">🟢 0% Unripe (Firm)</span>
            <span className="text-emerald-300">✨ 35% Optimal Ripe</span>
            <span className="text-amber-400">⚠️ 70% Overripe (Soft)</span>
            <span className="text-rose-400">🚨 100% Spoiled (Mould)</span>
          </div>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Real Photographic Container View with AI Bounding Box & Risk Overlay */}
        <div className="md:col-span-5 flex flex-col items-center justify-between p-4 bg-slate-900/70 rounded-2xl border border-slate-800 relative">
          
          <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800/80">
            <span className="font-mono flex items-center gap-1.5 text-slate-300">
              <Camera className="h-3.5 w-3.5 text-purple-400" /> {currentContainerName}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Container Optical Sensor
            </span>
          </div>

          {isCameraActive ? (
            <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center border border-purple-500/50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <button
                onClick={captureCameraFrame}
                className="absolute bottom-3 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xl flex items-center gap-2"
              >
                <Camera className="h-4 w-4" /> Snap & Inspect Item
              </button>
            </div>
          ) : previewImage ? (
            <div className="relative w-full flex flex-col items-center">
              
              {/* Photo Frame with Overlays */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Food Container Inspection"
                  className="w-full h-full object-cover"
                />

                {/* Risk Overlay Banner directly on photo */}
                {cvResult && (
                  <div className={`absolute top-2 left-2 right-2 px-3 py-2 rounded-lg backdrop-blur-md border text-xs font-bold flex items-center justify-between shadow-2xl ${
                    cvResult.risk_level === 'Critical'
                      ? 'bg-rose-950/90 text-rose-100 border-rose-500 glow-rose'
                      : cvResult.risk_level === 'High'
                      ? 'bg-amber-950/90 text-amber-100 border-amber-500 glow-amber'
                      : 'bg-emerald-950/90 text-emerald-100 border-emerald-500'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      {cvResult.risk_level === 'Critical' ? <XCircle className="h-4 w-4 text-rose-400 animate-pulse" /> : (cvResult.risk_level === 'High' ? <AlertTriangle className="h-4 w-4 text-amber-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />)}
                      {cvResult.risk_level.toUpperCase()} RISK: {cvResult.ripeness_stage.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs font-black">{cvResult.visual_spoilage_score}% Spoilage</span>
                  </div>
                )}

                {/* Simulated Computer Vision Detection Bounding Box on image */}
                {cvResult?.bounding_boxes?.map((box, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                      borderColor: box.color,
                    }}
                    className="border-2 rounded-lg border-dashed bg-rose-500/10 pointer-events-none flex items-start justify-start p-1"
                  >
                    <span
                      style={{ backgroundColor: box.color }}
                      className="text-[9px] font-black text-black px-1.5 py-0.5 rounded shadow uppercase"
                    >
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full flex items-center justify-between mt-3">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-xs text-slate-400 hover:text-purple-400 flex items-center gap-1 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload any food photo
                </button>
                <button
                  onClick={startCamera}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  <Video className="h-3.5 w-3.5" /> Switch to live webcam
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-64 border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center"
            >
              <div className="p-3 rounded-full bg-slate-800 text-purple-400 mb-2">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Upload Container Food Photo</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Ripeness Stage Progression & Diagnostic Assessment */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          {cvResult && (
            <div className="space-y-4">
              
              {/* 4-Stage Ripeness Level Progression Bar */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-purple-400" /> Ripeness / Spoilage Lifecycle Stage
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    Stage {ripenessStep} of 4: {cvResult.ripeness_stage}
                  </span>
                </div>

                {/* 4 Steps Graphic */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  
                  {/* Step 1: Unripe */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    ripenessStep === 1
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-[10px] block font-mono">Stage 1</span>
                    <span className="text-xs">🟢 Unripe / Firm</span>
                  </div>

                  {/* Step 2: Optimal Ripe */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    ripenessStep === 2
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-[10px] block font-mono">Stage 2</span>
                    <span className="text-xs">✨ Optimal Ripe</span>
                  </div>

                  {/* Step 3: Overripe */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    ripenessStep === 3
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-[10px] block font-mono">Stage 3</span>
                    <span className="text-xs">⚠️ Overripe / Wilted</span>
                  </div>

                  {/* Step 4: Spoiled / Rotten */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    ripenessStep === 4
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow animate-pulse'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-[10px] block font-mono">Stage 4</span>
                    <span className="text-xs">🚨 Spoiled / Rotten</span>
                  </div>

                </div>
              </div>

              {/* 4 Sensory Indicators */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Surface Browning / Discoloration</span>
                  <div className="text-lg font-bold text-slate-100 mt-0.5">{cvResult.discoloration_score}%</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Microbial Fungal / Mould Patch</span>
                  <div className="text-lg font-bold mt-0.5 flex items-center gap-1.5">
                    {cvResult.mould_detected ? (
                      <span className="text-rose-400 flex items-center gap-1 text-sm font-bold">
                        <AlertTriangle className="h-4 w-4" /> Detected ({cvResult.mould_coverage}%)
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1 text-sm font-bold">
                        <CheckCircle2 className="h-4 w-4" /> Clear (0%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Tissue & Texture Breakdown</span>
                  <div className="text-lg font-bold text-slate-100 mt-0.5">{cvResult.texture_degradation}%</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Detected Defect Zones</span>
                  <div className="text-xs font-bold text-purple-300 mt-1">
                    {cvResult.bounding_boxes?.length || 0} Region(s) Flagged
                  </div>
                </div>
              </div>

              {/* Detected Spoilage Symptoms Box */}
              {cvResult.detected_defects?.length > 0 ? (
                <div className={`p-3.5 rounded-xl border ${
                  cvResult.risk_level === 'Critical' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <span className={`text-[11px] font-bold flex items-center gap-1.5 mb-1 ${
                    cvResult.risk_level === 'Critical' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    <AlertTriangle className="h-3.5 w-3.5" /> Identified Spoilage / Risk Symptoms in Photo:
                  </span>
                  <ul className="text-xs space-y-1 list-disc list-inside text-slate-200">
                    {cvResult.detected_defects.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>No biological defects or fungal mould colonies detected. Item in peak harvest condition.</span>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
