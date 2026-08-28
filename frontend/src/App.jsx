import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import StorageZoneTelemetry from './components/StorageZoneTelemetry';
import VisionInspector from './components/VisionInspector';
import MultiModalAssessor from './components/MultiModalAssessor';
import InventoryHealthTable from './components/InventoryHealthTable';
import ActionRecommendations from './components/ActionRecommendations';
import AlertNotificationCenter from './components/AlertNotificationCenter';
import ESP32Simulator from './components/ESP32Simulator';
import DemandForecastingDashboard from './components/DemandForecastingDashboard';
import KitchenStaffDashboard from './components/KitchenStaffDashboard';
import SmartWasteBinDashboard from './components/SmartWasteBinDashboard';
import CentralExecutiveDashboard from './components/CentralExecutiveDashboard';
import { Activity, LayoutDashboard, Camera, Cpu, ListFilter, AlertTriangle, Sparkles, X, TrendingUp, Users, Trash2, Layers, Check } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState(null);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState("zone-fruit");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  // Theme state: defaults to false (Light Mode) for bright, clear visibility
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Top Level Navigation Module: 'executive', 'demand', 'kitchen', 'spoilage', 'waste'
  const [activeModule, setActiveModule] = useState('spoilage');
  
  // Spoilage Sub-Tabs: 'vision', 'assessor', 'inventory', 'sensors', 'simulator'
  const [spoilageSubTab, setSpoilageSubTab] = useState('vision');
  
  const [currentVisionFeatures, setCurrentVisionFeatures] = useState(null);
  const [showAlertsCenter, setShowAlertsCenter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      setRecommendations(recsRes.data.recommendations || []);
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

  const activeCriticalCount = recommendations.filter(
    r => r.severity === 'critical' && r.status !== 'resolved'
  ).length;

  const totalActiveAlertCount = recommendations.filter(
    r => r.status !== 'resolved'
  ).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200`}>
      
      {/* Clean Navigation Header with Live Alert Counter & Theme Toggle */}
      <Header
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        stats={stats}
        onRefresh={fetchAllData}
        activeAlertCount={totalActiveAlertCount}
        onOpenAlerts={() => setShowAlertsCenter(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Module 1: Executive Integration Hub */}
        {activeModule === 'executive' && (
          <CentralExecutiveDashboard
            stats={stats}
            recommendations={recommendations}
            onNavigateModule={setActiveModule}
            onOpenAlertsCenter={() => setShowAlertsCenter(true)}
            onRefresh={fetchAllData}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Module 2: Demand Prediction */}
        {activeModule === 'demand' && (
          <DemandForecastingDashboard isDarkMode={isDarkMode} />
        )}

        {/* Module 3: Kitchen & Staff */}
        {activeModule === 'kitchen' && (
          <KitchenStaffDashboard isDarkMode={isDarkMode} />
        )}

        {/* Module 4: Food Spoilage & Quality Assessment */}
        {activeModule === 'spoilage' && (
          <div className="space-y-6">
            
            {/* Spoilage Module Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Food Spoilage & Quality Assessment</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Multi-Modal Spoilage Prediction & Optical Container Quality Inspection
                </p>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSpoilageSubTab('vision')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'vision'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" /> Container Camera Scanner
                </button>

                <button
                  onClick={() => setSpoilageSubTab('assessor')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'assessor'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" /> Multi-Modal Assessor
                </button>

                <button
                  onClick={() => setSpoilageSubTab('sensors')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'sensors'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" /> IoT Telemetry
                </button>

                <button
                  onClick={() => setSpoilageSubTab('inventory')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'inventory'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <ListFilter className="h-3.5 w-3.5" /> Batch Matrix
                </button>

                <button
                  onClick={() => setSpoilageSubTab('simulator')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    spoilageSubTab === 'simulator'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> ESP32 Sim
                </button>
              </div>
            </div>

            {/* Top KPIs Summary */}
            <StatsCards stats={stats} isDarkMode={isDarkMode} />

            {/* Sub-View: Container Camera Scanner */}
            {spoilageSubTab === 'vision' && (
              <div className="space-y-6">
                <VisionInspector onInspectionComplete={handleVisionInspectionComplete} isDarkMode={isDarkMode} />
                <ActionRecommendations 
                  recommendations={recommendations} 
                  isDarkMode={isDarkMode} 
                  onOpenAlertsCenter={() => setShowAlertsCenter(true)}
                  onRefresh={fetchAllData}
                />
              </div>
            )}

            {/* Sub-View: Multi-Modal Assessor */}
            {spoilageSubTab === 'assessor' && (
              <div className="space-y-6">
                <MultiModalAssessor
                  currentVisionFeatures={currentVisionFeatures}
                  selectedZone={selectedZone}
                  isDarkMode={isDarkMode}
                />
                <ActionRecommendations 
                  recommendations={recommendations} 
                  isDarkMode={isDarkMode} 
                  onOpenAlertsCenter={() => setShowAlertsCenter(true)}
                  onRefresh={fetchAllData}
                />
              </div>
            )}

            {/* Sub-View: IoT Storage Telemetry */}
            {spoilageSubTab === 'sensors' && (
              <div className="space-y-6">
                <StorageZoneTelemetry
                  zones={zones}
                  selectedZoneId={selectedZoneId}
                  onSelectZone={setSelectedZoneId}
                  isDarkMode={isDarkMode}
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
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {/* Sub-View: ESP32 Hardware Simulator */}
            {spoilageSubTab === 'simulator' && (
              <div className="space-y-6">
                <ESP32Simulator
                  zones={zones}
                  onTelemetrySent={fetchAllData}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

          </div>
        )}

        {/* Module 5: Smart Waste Bin */}
        {activeModule === 'waste' && (
          <SmartWasteBinDashboard isDarkMode={isDarkMode} />
        )}

      </main>

      {/* Advanced Interactive Alert Notification Center Drawer */}
      <AlertNotificationCenter
        isOpen={showAlertsCenter}
        onClose={() => setShowAlertsCenter(false)}
        recommendations={recommendations}
        onRefresh={fetchAllData}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors">
        <p className="font-medium">
          Smart Restaurant Analytics • Real-Time AI & IoT Operational Decision Support
        </p>
      </footer>

    </div>
  );
}
