import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import StorageZoneTelemetry from './components/StorageZoneTelemetry';
import VisionInspector from './components/VisionInspector';
import MultiModalAssessor from './components/MultiModalAssessor';
import InventoryHealthTable from './components/InventoryHealthTable';
import ActionRecommendations from './components/ActionRecommendations';
import ESP32Simulator from './components/ESP32Simulator';
import DemandForecastingDashboard from './components/DemandForecastingDashboard';
import KitchenStaffDashboard from './components/KitchenStaffDashboard';
import SmartWasteBinDashboard from './components/SmartWasteBinDashboard';
import CentralExecutiveDashboard from './components/CentralExecutiveDashboard';
import { Activity, LayoutDashboard, Camera, Cpu, ListFilter, AlertTriangle, Sparkles, X, TrendingUp, Users, Trash2, Layers } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState(null);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState("zone-fruit");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  // Top Level Navigation Module: 'executive', 'demand', 'kitchen', 'spoilage', 'waste'
  const [activeModule, setActiveModule] = useState('spoilage');
  
  // Spoilage Sub-Tabs: 'vision', 'assessor', 'inventory', 'sensors', 'simulator'
  const [spoilageSubTab, setSpoilageSubTab] = useState('vision');
  
  const [currentVisionFeatures, setCurrentVisionFeatures] = useState(null);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, zonesRes, invRes, recsRes] = await Promise.all([
        axios.get("http://localhost:8000/api/dashboard/stats"),
        axios.get("http://localhost:8000/api/sensors/zones"),
        axios.get("http://localhost:8000/api/inventory/items"),
        axios.get("http://localhost:8000/api/recommendations/")
      ]);

      setStats(statsRes.data);
      setZones(zonesRes.data.zones);
      setInventoryItems(invRes.data.items);
      setRecommendations(recsRes.data.recommendations);
    } catch (err) {
      console.error("Error fetching system data:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const handleVisionInspectionComplete = (features) => {
    setCurrentVisionFeatures(features);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Clean Global Navigation Header */}
      <Header
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        stats={stats}
        onRefresh={fetchAllData}
        activeAlertCount={recommendations.filter(r => r.severity === 'critical' || r.severity === 'high').length}
        onOpenAlerts={() => setShowAlertsDrawer(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Module 1: Executive Integration Hub */}
        {activeModule === 'executive' && (
          <CentralExecutiveDashboard
            stats={stats}
            onNavigateModule={setActiveModule}
          />
        )}

        {/* Module 2: Demand Prediction */}
        {activeModule === 'demand' && (
          <DemandForecastingDashboard />
        )}

        {/* Module 3: Kitchen & Staff */}
        {activeModule === 'kitchen' && (
          <KitchenStaffDashboard />
        )}

        {/* Module 4: Food Spoilage & Quality Assessment */}
        {activeModule === 'spoilage' && (
          <div className="space-y-6">
            
            {/* Spoilage Module Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Food Spoilage & Quality Assessment</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-Modal Spoilage Prediction & Optical Container Quality Inspection
                </p>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSpoilageSubTab('vision')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'vision' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" /> Container Camera Scanner
                </button>

                <button
                  onClick={() => setSpoilageSubTab('assessor')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'assessor' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" /> Multi-Modal Assessor
                </button>

                <button
                  onClick={() => setSpoilageSubTab('sensors')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'sensors' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" /> IoT Telemetry
                </button>

                <button
                  onClick={() => setSpoilageSubTab('inventory')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'inventory' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ListFilter className="h-3.5 w-3.5" /> Batch Matrix
                </button>

                <button
                  onClick={() => setSpoilageSubTab('simulator')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'simulator' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> ESP32 Sim
                </button>
              </div>
            </div>

            {/* Top KPIs Summary */}
            <StatsCards stats={stats} />

            {/* Sub-View: Container Camera Scanner */}
            {spoilageSubTab === 'vision' && (
              <div className="space-y-6">
                <VisionInspector onInspectionComplete={handleVisionInspectionComplete} />
                <ActionRecommendations recommendations={recommendations} />
              </div>
            )}

            {/* Sub-View: Multi-Modal Assessor */}
            {spoilageSubTab === 'assessor' && (
              <div className="space-y-6">
                <MultiModalAssessor
                  currentVisionFeatures={currentVisionFeatures}
                  selectedZone={selectedZone}
                />
                <ActionRecommendations recommendations={recommendations} />
              </div>
            )}

            {/* Sub-View: IoT Storage Telemetry */}
            {spoilageSubTab === 'sensors' && (
              <div className="space-y-6">
                <StorageZoneTelemetry
                  zones={zones}
                  selectedZoneId={selectedZoneId}
                  onSelectZone={setSelectedZoneId}
                />
              </div>
            )}

            {/* Sub-View: Batch Health Matrix Table */}
            {spoilageSubTab === 'inventory' && (
              <div className="space-y-6">
                <InventoryHealthTable
                  items={inventoryItems}
                  zones={zones}
                  onRefresh={fetchAllData}
                />
              </div>
            )}

            {/* Sub-View: ESP32 Hardware Simulator */}
            {spoilageSubTab === 'simulator' && (
              <div className="space-y-6">
                <ESP32Simulator
                  zones={zones}
                  onTelemetrySent={fetchAllData}
                />
              </div>
            )}

          </div>
        )}

        {/* Module 5: Smart Waste Bin */}
        {activeModule === 'waste' && (
          <SmartWasteBinDashboard />
        )}

      </main>

      {/* Side Alerts Drawer */}
      {showAlertsDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 h-full overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Active Spoilage & Waste Alerts</h3>
                </div>
                <button
                  onClick={() => setShowAlertsDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className={`p-3.5 rounded-xl border ${
                      rec.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-orange-500/10 border-orange-500/30'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase text-rose-400">{rec.type}</span>
                    <h4 className="text-xs font-bold text-white mt-1">{rec.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{rec.message}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">👉 {rec.suggested_action}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAlertsDrawer(false)}
              className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Close Alerts Drawer
            </button>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Smart Restaurant Analytics • Real-Time AI & IoT Operational Decision Support
        </p>
      </footer>

    </div>
  );
}
