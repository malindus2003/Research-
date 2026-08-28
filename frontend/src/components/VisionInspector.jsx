import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Video, 
  VideoOff, 
  Sliders, 
  XCircle, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  Apple, 
  Carrot, 
  Milk, 
  Fish, 
  Beef,
  Clock,
  Hourglass,
  Calendar,
  Zap,
  TrendingDown
} from 'lucide-react';
import axios from 'axios';

// Comprehensive high-resolution photographic presets across ALL 5 food categories
const SAMPLE_PRESETS = [
  // 1. Fruits
  {
    id: "strawberries_mould",
    name: "Mouldy Strawberries",
    category: "Fruits",
    icon: "🍓",
    container: "Container #C-104 (Fruit Chamber)",
    imageUrl: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Spoiled / Senescent (Rotting)",
    ripeness_percent: 98,
    visual_spoilage_score: 92,
    risk_level: "Critical",
    discoloration_score: 38,
    mould_detected: true,
    mould_coverage: 14.5,
    texture_degradation: 65,
    baseline_shelf_life_hours: 120.0,
    remaining_shelf_life_hours: 0.0,
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
    baseline_shelf_life_hours: 120.0,
    remaining_shelf_life_hours: 16.5,
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
    baseline_shelf_life_hours: 120.0,
    remaining_shelf_life_hours: 96.0,
    detected_defects: [],
    bounding_boxes: [
      { label: "PRIME CRISP TURGOR", type: "fresh", x: 20, y: 15, width: 60, height: 70, color: "#10b981" }
    ]
  },

  // 2. Vegetables
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
    baseline_shelf_life_hours: 96.0,
    remaining_shelf_life_hours: 14.0,
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
    baseline_shelf_life_hours: 96.0,
    remaining_shelf_life_hours: 74.0,
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
    baseline_shelf_life_hours: 96.0,
    remaining_shelf_life_hours: 18.0,
    detected_defects: [
      "Loss of skin firmness & localized bruising",
      "High carotenoid softness breakdown"
    ],
    bounding_boxes: [
      { label: "SOFTENING TISSUE", type: "overripe", x: 28, y: 25, width: 48, height: 50, color: "#f59e0b" }
    ]
  },

  // 3. Dairy
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
    baseline_shelf_life_hours: 168.0,
    remaining_shelf_life_hours: 0.0,
    detected_defects: [
      "Uncontrolled surface fungal mycelium",
      "Yellow curd acidification"
    ],
    bounding_boxes: [
      { label: "FUNGAL MYCELIUM PATCH", type: "spoilage", x: 30, y: 30, width: 42, height: 40, color: "#ef4444" }
    ]
  },
  {
    id: "milk_fresh",
    name: "Fresh Whole Milk",
    category: "Dairy",
    icon: "🥛",
    container: "Container #C-301 (Dairy Fridge)",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    ripeness_stage: "Optimal Fresh",
    ripeness_percent: 25,
    visual_spoilage_score: 6,
    risk_level: "Low",
    discoloration_score: 1,
    mould_detected: false,
    mould_coverage: 0.0,
    texture_degradation: 2,
    baseline_shelf_life_hours: 168.0,
    remaining_shelf_life_hours: 142.0,
    detected_defects: [],
    bounding_boxes: [
      { label: "STABLE LACTIC HOMOGENEITY", type: "fresh", x: 20, y: 20, width: 60, height: 60, color: "#10b981" }
    ]
  },

  // 4. Fish & Seafood
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
    baseline_shelf_life_hours: 48.0,
    remaining_shelf_life_hours: 38.0,
    detected_defects: [],
    bounding_boxes: [
      { label: "OPTIMAL ASTAXANTHIN TRANSLUCENCY", type: "fresh", x: 22, y: 20, width: 56, height: 60, color: "#10b981" }
    ]
  },

  // 5. Meat & Poultry
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
    baseline_shelf_life_hours: 96.0,
    remaining_shelf_life_hours: 76.0,
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
    baseline_shelf_life_hours: 96.0,
    remaining_shelf_life_hours: 8.5,
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
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
    if (onInspectionComplete) {
      onInspectionComplete(SAMPLE_PRESETS[0]);
    }
    return () => {
      stopCamera();
    };
  }, []);

  const filteredPresets = selectedCategoryFilter === "all"
    ? SAMPLE_PRESETS
    : SAMPLE_PRESETS.filter(p => p.category.toLowerCase() === selectedCategoryFilter.toLowerCase());

  const handleSelectPreset = (preset) => {
    stopCamera();
    setSelectedPresetId(preset.id);
    setCurrentContainerName(preset.container);
    setPreviewImage(preset.imageUrl);
    setCvResult(preset);
    setDummyLevel(preset.visual_spoilage_score);
    setIsManualOverride(false);

    if (onInspectionComplete) {
      onInspectionComplete(preset);
    }
  };

  const handleCategoryFilterClick = (cat) => {
    setSelectedCategoryFilter(cat);
    const matches = cat === "all" ? SAMPLE_PRESETS : SAMPLE_PRESETS.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    if (matches.length > 0) {
      handleSelectPreset(matches[0]);
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
        await runBackendAnalysis(dataUrl, cvResult?.category || "Fruits");
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
    runBackendAnalysis(dataUrl, cvResult?.category || "Fruits");
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

  // Dynamic Remaining Shelf-Life & Spoilage Computation
  const computeRemainingShelfLife = (val, category, isMould) => {
    const baselines = {
      "Fruits": 120.0,
      "Vegetables": 96.0,
      "Meat": 96.0,
      "Fish": 48.0,
      "Dairy": 168.0
    };
    const baseline = baselines[category] || 120.0;

    if (val >= 78 || isMould) {
      return {
        hours: 0.0,
        days: 0.0,
        percentage: 0,
        action: "EXPIRED: Quarantine & Dispose Immediately",
        safeDeadline: "Expired - Do not cook or serve",
        decayRate: "Severe degradation (> 5.2x baseline decay)"
      };
    }

    if (val < 25) {
      const h = Math.round(baseline * (1.0 - (val / 100.0) * 0.5) * 10) / 10;
      return {
        hours: h,
        days: Math.round((h / 24.0) * 10) / 10,
        percentage: Math.round(100 - val),
        action: "Optimal Quality (Standard FIFO Rotation)",
        safeDeadline: `Safe for ~${Math.round(h / 24.0)} days in cold storage`,
        decayRate: "Normal baseline metabolic aging (1.0x)"
      };
    }

    if (val < 55) {
      const h = Math.round(baseline * 0.65 * (1.0 - ((val - 25) / 30) * 0.3) * 10) / 10;
      return {
        hours: h,
        days: Math.round((h / 24.0) * 10) / 10,
        percentage: Math.round(100 - val),
        action: "Prime Culinary Quality (Cook within 2-3 days)",
        safeDeadline: `Optimal flavor peak for next ${h} hours`,
        decayRate: "Moderate respiration & ethylene activity (1.6x)"
      };
    }

    // Overripe / High Risk (55% - 77%)
    const h = Math.round(baseline * 0.22 * (1.0 - ((val - 55) / 23) * 0.6) * 10) / 10;
    return {
      hours: Math.max(2.0, h),
      days: Math.round((h / 24.0) * 10) / 10,
      percentage: Math.round(100 - val),
      action: "PRIORITY CHEF USE (Cook / Divert Today)",
      safeDeadline: `Must consume within ${Math.max(2, Math.round(h))} hours!`,
      decayRate: "Accelerated cellular breakdown (3.4x decay)"
    };
  };

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

  // Active Shelf-Life Prediction Object
  const shelfLifePrediction = computeRemainingShelfLife(
    dummyLevel,
    cvResult?.category || "Fruits",
    cvResult?.mould_detected || false
  );

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5 bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800">
      
      {/* Top Bar with Clean Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1eae4] dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Container Optical Scanner & Ripeness Assessor</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            Photographic inspection across Fruits, Vegetables, Dairy, Fish & Meat with Remaining Shelf-Life Prediction
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              onClick={stopCamera}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <VideoOff className="h-4 w-4" /> Stop Live Camera
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-colors"
            >
              <Video className="h-4 w-4" /> Open Container Camera
            </button>
          )}
        </div>
      </div>

      {/* 5-Category Filter Tabs Strip */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-[#f4f8f5] dark:bg-slate-800/80 p-2 rounded-xl border border-[#d7e5dc] dark:border-slate-700">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1">Filter Food Category:</span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All Categories", icon: null },
            { id: "fruits", label: "Fruits", icon: <Apple className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> },
            { id: "vegetables", label: "Vegetables", icon: <Carrot className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> },
            { id: "dairy", label: "Dairy", icon: <Milk className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> },
            { id: "fish", label: "Fish & Seafood", icon: <Fish className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> },
            { id: "meat", label: "Meat & Poultry", icon: <Beef className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryFilterClick(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategoryFilter === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-[#d1ded5] dark:border-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real Photo Presets Strip - Seamless Light/Dark Theme Cards */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-1">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center group ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-[#d1ded5] dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-sm'
              }`}
            >
              <div className="w-full h-24 rounded-lg overflow-hidden relative bg-slate-100 dark:bg-slate-950 mb-2 border border-[#d1ded5] dark:border-slate-700">
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className={`absolute top-1 right-1 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                  preset.risk_level === 'Critical'
                    ? 'bg-rose-600 text-white'
                    : preset.risk_level === 'High'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-700 text-white'
                }`}>
                  {preset.risk_level}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 flex items-center gap-1">
                <span>{preset.icon}</span> {preset.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{preset.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Dummy Simulation Slider with Dynamic Color Level */}
      {(() => {
        const getLevelColor = (val) => {
          if (val < 25) return { text: "text-emerald-800 dark:text-emerald-400", bg: "bg-emerald-600", border: "border-emerald-500", badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-600", label: "LOW RISK (UNRIPE / FIRM)", colorHex: "#059669" };
          if (val < 55) return { text: "text-emerald-800 dark:text-emerald-400", bg: "bg-emerald-600", border: "border-emerald-500", badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-600", label: "LOW RISK (OPTIMAL RIPE)", colorHex: "#047857" };
          if (val < 78) return { text: "text-amber-800 dark:text-amber-400", bg: "bg-amber-600", border: "border-amber-500", badge: "bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-600", label: "HIGH RISK (OVERRIPE / WILTED)", colorHex: "#d97706" };
          return { text: "text-rose-800 dark:text-rose-400", bg: "bg-rose-600", border: "border-rose-500", badge: "bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-300 border border-rose-400 dark:border-rose-600 animate-pulse", label: "CRITICAL RISK (SPOILED / MOULD)", colorHex: "#dc2626" };
        };
        const levelTheme = getLevelColor(dummyLevel);

        return (
          <div className={`p-5 rounded-2xl bg-[#f8faf9] dark:bg-slate-850 border ${levelTheme.border} shadow-sm space-y-3 dark:bg-slate-800/60`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className={`h-5 w-5 ${levelTheme.text}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Ripeness & Spoilage Level Simulation:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-2 shadow-sm ${levelTheme.badge}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${levelTheme.bg}`} />
                  {dummyLevel}% Level — {levelTheme.label}
                </span>
              </div>
            </div>

            {/* Custom Multi-Color Gradient Slider Track */}
            <div className="mt-2 relative">
              <div className="h-3.5 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 relative">
                {/* 4-Color Full Gradient Background */}
                <div
                  className="absolute inset-0 h-full w-full opacity-60"
                  style={{
                    background: "linear-gradient(to right, #059669 0%, #10b981 35%, #f59e0b 70%, #dc2626 100%)"
                  }}
                />
                {/* Active Colored Fill Bar */}
                <div
                  className="h-full rounded-full transition-all duration-150 shadow-sm"
                  style={{
                    width: `${dummyLevel}%`,
                    backgroundColor: levelTheme.colorHex
                  }}
                />
              </div>

              {/* Range input layered cleanly over track */}
              <input
                type="range"
                min="0"
                max="100"
                value={dummyLevel}
                onChange={(e) => handleDummySliderChange(e.target.value)}
                className="w-full h-3.5 absolute top-0 left-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Interactive Milestone Clicker Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e1eae4] dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleDummySliderChange(10)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  dummyLevel < 25
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#d1ded5] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🟢</span> 0% - 25% Unripe (Firm)
              </button>

              <button
                type="button"
                onClick={() => handleDummySliderChange(40)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  dummyLevel >= 25 && dummyLevel < 55
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#d1ded5] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>✨</span> 35% - 50% Optimal Ripe
              </button>

              <button
                type="button"
                onClick={() => handleDummySliderChange(72)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  dummyLevel >= 55 && dummyLevel < 78
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#d1ded5] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>⚠️</span> 70% - 75% Overripe (Soft)
              </button>

              <button
                type="button"
                onClick={() => handleDummySliderChange(94)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  dummyLevel >= 78
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-300 border-rose-600 shadow-sm animate-pulse'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#d1ded5] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🚨</span> 90% - 100% Spoiled (Mould)
              </button>
            </div>
          </div>
        );
      })()}

      {/* DEDICATED REMAINING SHELF-LIFE (RSL) PREDICTION HERO CARD */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ecfdf5] via-[#f0fdf4] to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-emerald-400 dark:border-emerald-600/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 dark:border-emerald-900/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Hourglass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                Remaining Shelf-Life (RSL) Dynamic Prediction
              </h3>
              <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                AI Multi-Modal Degradation Model • {cvResult?.category || "Fruits"} Preservability
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
              shelfLifePrediction.hours === 0
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-400 animate-pulse'
                : (shelfLifePrediction.hours < 20 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-400' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border-emerald-400')
            }`}>
              {shelfLifePrediction.action}
            </span>
          </div>
        </div>

        {/* Shelf-Life Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Main Countdown Gauge */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Usable Shelf-Life Remaining
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${
                shelfLifePrediction.hours === 0 ? 'text-rose-600 dark:text-rose-400' : (shelfLifePrediction.hours < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400')
              }`}>
                {shelfLifePrediction.hours}
              </span>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Hours</span>
              {shelfLifePrediction.days > 0 && (
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ~{shelfLifePrediction.days} Days
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
              {shelfLifePrediction.safeDeadline}
            </p>
          </div>

          {/* Freshness & Quality Retention Score */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Freshness & Turgor Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {shelfLifePrediction.percentage}%
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Quality Score</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-1 overflow-hidden border border-slate-200 dark:border-slate-600">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${shelfLifePrediction.percentage}%`,
                  backgroundColor: shelfLifePrediction.percentage > 50 ? '#059669' : (shelfLifePrediction.percentage > 20 ? '#d97706' : '#dc2626')
                }}
              />
            </div>
          </div>

          {/* Biological Decay Multiplier */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Degradation Velocity
            </span>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
              {shelfLifePrediction.decayRate}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Dynamic multi-modal fusion of visual ripeness ({dummyLevel}%) & storage parameters.
            </p>
          </div>

        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Real Photographic Container View with AI Bounding Box & Risk Overlay */}
        <div className="md:col-span-5 flex flex-col items-center justify-between p-4 bg-[#f8faf9] dark:bg-slate-850 rounded-2xl border border-[#d1ded5] dark:border-slate-800 relative dark:bg-slate-900/60">
          
          <div className="w-full flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 pb-2 mb-2 border-b border-[#e1eae4] dark:border-slate-800">
            <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Camera className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {currentContainerName}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              Optical Sensor
            </span>
          </div>

          {isCameraActive ? (
            <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center border border-emerald-600">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <button
                onClick={captureCameraFrame}
                className="absolute bottom-3 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xl flex items-center gap-2"
              >
                <Camera className="h-4 w-4" /> Snap & Inspect Item
              </button>
            </div>
          ) : previewImage ? (
            <div className="relative w-full flex flex-col items-center">
              
              {/* Photo Frame with Overlays */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm border border-[#d1ded5] dark:border-slate-700 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Food Container Inspection"
                  className="w-full h-full object-cover"
                />

                {/* Risk Overlay Banner directly on photo */}
                {cvResult && (
                  <div className={`absolute top-2 left-2 right-2 px-3 py-2 rounded-lg backdrop-blur-md border text-xs font-bold flex items-center justify-between shadow-lg ${
                    cvResult.risk_level === 'Critical'
                      ? 'bg-rose-900/95 text-white border-rose-400'
                      : cvResult.risk_level === 'High'
                      ? 'bg-amber-900/95 text-white border-amber-400'
                      : 'bg-emerald-900/95 text-white border-emerald-400'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      {cvResult.risk_level === 'Critical' ? <XCircle className="h-4 w-4 text-rose-300 animate-pulse" /> : (cvResult.risk_level === 'High' ? <AlertTriangle className="h-4 w-4 text-amber-300" /> : <CheckCircle2 className="h-4 w-4 text-emerald-300" />)}
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
                    className="border-2 rounded-lg border-dashed bg-rose-500/20 pointer-events-none flex items-start justify-start p-1"
                  >
                    <span
                      style={{ backgroundColor: box.color }}
                      className="text-[10px] font-black text-white px-1.5 py-0.5 rounded shadow uppercase"
                    >
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full flex items-center justify-between mt-3 font-semibold">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <Upload className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> Upload Custom Photo
                </button>
                <button
                  onClick={startCamera}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 transition-colors font-bold"
                >
                  <Video className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> Open Live Camera
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-64 border-2 border-dashed border-[#d1ded5] dark:border-slate-700 hover:border-emerald-600 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center bg-white dark:bg-slate-900"
            >
              <div className="p-3 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 mb-2">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload Container Food Photo</span>
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
              <div className="p-5 rounded-2xl bg-[#f8faf9] dark:bg-slate-850 border border-[#d1ded5] dark:border-slate-800 shadow-sm dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> Ripeness / Spoilage Lifecycle Stage:
                  </span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    Stage {ripenessStep} of 4: {cvResult.ripeness_stage}
                  </span>
                </div>

                {/* 4 Steps Graphic */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  
                  {/* Step 1: Unripe */}
                  <div className={`p-3 rounded-xl border text-center transition-all ${
                    ripenessStep === 1
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-300 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-[#d1ded5] dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    <span className="text-[10px] block font-bold">Stage 1</span>
                    <span className="text-xs">🟢 Unripe / Firm</span>
                  </div>

                  {/* Step 2: Optimal Ripe */}
                  <div className={`p-3 rounded-xl border text-center transition-all ${
                    ripenessStep === 2
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-300 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-[#d1ded5] dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    <span className="text-[10px] block font-bold">Stage 2</span>
                    <span className="text-xs">✨ Optimal Ripe</span>
                  </div>

                  {/* Step 3: Overripe */}
                  <div className={`p-3 rounded-xl border text-center transition-all ${
                    ripenessStep === 3
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-600 text-amber-950 dark:text-amber-300 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-[#d1ded5] dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    <span className="text-[10px] block font-bold">Stage 3</span>
                    <span className="text-xs">⚠️ Overripe (Soft)</span>
                  </div>

                  {/* Step 4: Spoiled / Rotten */}
                  <div className={`p-3 rounded-xl border text-center transition-all ${
                    ripenessStep === 4
                      ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-600 text-rose-950 dark:text-rose-300 font-bold shadow-sm animate-pulse'
                      : 'bg-white dark:bg-slate-900 border-[#d1ded5] dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    <span className="text-[10px] block font-bold">Stage 4</span>
                    <span className="text-xs">🚨 Spoiled (Mould)</span>
                  </div>

                </div>
              </div>

              {/* 4 Sensory Indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-[#d1ded5] dark:border-slate-800 shadow-sm dark:bg-slate-900/80">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Surface Browning / Discoloration</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{cvResult.discoloration_score}%</div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-[#d1ded5] dark:border-slate-800 shadow-sm dark:bg-slate-900/80">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Microbial Fungal / Mould Patch</span>
                  <div className="text-xl font-bold mt-1 flex items-center gap-1.5">
                    {cvResult.mould_detected ? (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1 text-sm font-bold">
                        <AlertTriangle className="h-4 w-4" /> Detected ({cvResult.mould_coverage}%)
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 text-sm font-bold">
                        <CheckCircle2 className="h-4 w-4" /> Clear (0%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-[#d1ded5] dark:border-slate-800 shadow-sm dark:bg-slate-900/80">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tissue & Texture Breakdown</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{cvResult.texture_degradation}%</div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-[#d1ded5] dark:border-slate-800 shadow-sm dark:bg-slate-900/80">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Flagged Defect Regions</span>
                  <div className="text-base font-bold text-emerald-800 dark:text-emerald-400 mt-1">
                    {cvResult.bounding_boxes?.length || 0} Region(s) Flagged
                  </div>
                </div>
              </div>

              {/* Detected Spoilage Symptoms Box */}
              {cvResult.detected_defects?.length > 0 ? (
                <div className={`p-4 rounded-xl border ${
                  cvResult.risk_level === 'Critical'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                }`}>
                  <span className={`text-xs font-bold flex items-center gap-1.5 mb-1.5 ${
                    cvResult.risk_level === 'Critical' ? 'text-rose-900 dark:text-rose-400' : 'text-amber-900 dark:text-amber-400'
                  }`}>
                    <AlertTriangle className="h-4 w-4" /> Identified Spoilage Symptoms in Container Photo:
                  </span>
                  <ul className="text-xs space-y-1 list-disc list-inside font-medium">
                    {cvResult.detected_defects.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
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
