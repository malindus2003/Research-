import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Trash2, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldAlert, XCircle, Apple, Carrot, Milk, Fish, Beef } from 'lucide-react';
import axios from 'axios';

export default function InventoryHealthTable({ items, zones, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New batch form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Fruits",
    storage_zone: zones[0]?.name || "Zone 1: Fruit & Berry Preservation Chamber",
    batch_number: "",
    quantity: "10 kg",
    storage_duration_hours: 24
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batch_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesRisk = selectedRisk === "all" || item.risk_level.toLowerCase() === selectedRisk.toLowerCase();
    return matchesSearch && matchesCat && matchesRisk;
  });

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/inventory/items/${itemId}`);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete inventory item:", err);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/inventory/items", newItem);
      setShowAddModal(false);
      setNewItem({
        name: "",
        category: "Fruits",
        storage_zone: zones[0]?.name || "Zone 1: Fruit & Berry Preservation Chamber",
        batch_number: "",
        quantity: "10 kg",
        storage_duration_hours: 24
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to add inventory item:", err);
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "Fruits":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400"><Apple className="h-3 w-3" /> Fruits</span>;
      case "Vegetables":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400"><Carrot className="h-3 w-3" /> Vegetables</span>;
      case "Dairy":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400"><Milk className="h-3 w-3" /> Dairy</span>;
      case "Fish":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400"><Fish className="h-3 w-3" /> Fish & Seafood</span>;
      case "Meat":
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400"><Beef className="h-3 w-3" /> Meat & Poultry</span>;
    }
  };

  const renderRiskBadge = (level) => {
    switch (level) {
      case "Low":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="h-3 w-3" /> Low (Fresh)</span>;
      case "Medium":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertTriangle className="h-3 w-3" /> Medium</span>;
      case "High":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20"><ShieldAlert className="h-3 w-3" /> High (Priority)</span>;
      case "Critical":
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"><XCircle className="h-3 w-3" /> Critical (Spoiled)</span>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Perishable Inventory Spoilage Health Matrix</h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              {filteredItems.length} Batches (All Categories)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time batch-level shelf-life tracking for Fruits, Vegetables, Dairy, Fish & Meat
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-colors"
        >
          <Plus className="h-4 w-4" /> Register New Batch
        </button>
      </div>

      {/* Category Pills + Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
        {/* Search */}
        <div className="sm:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search fruit, veg, meat or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Quick Filter */}
        <div className="sm:col-span-5 flex items-center gap-1.5 overflow-x-auto">
          {["all", "fruits", "vegetables", "dairy", "fish", "meat"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Risk Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk (Fresh)</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk (Priority Use)</option>
            <option value="critical">Critical (Disposal)</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Item & Batch</th>
              <th className="py-3 px-4">Category & Zone</th>
              <th className="py-3 px-4">Sensory Telemetry</th>
              <th className="py-3 px-4">Remaining Shelf-Life</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Action Recommendation</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
                  No matching inventory batches found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.batch_number} • <span className="text-slate-300">{item.quantity}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{getCategoryBadge(item.category)}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.storage_zone.split(':')[0]}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[11px] font-mono">
                      <span>{item.current_temp}°C</span> • <span>{item.current_humidity}% RH</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      CO₂: {item.current_co2} ppm • VOC: {item.current_voc} ppm
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-bold ${item.remaining_shelf_life_hours < 12 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.remaining_shelf_life_hours} hrs
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Spoilage Prob: {item.spoilage_prob}%
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {renderRiskBadge(item.risk_level)}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="text-[11px] text-slate-300 line-clamp-2">
                      {item.recommendation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Dispatch / Remove batch"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Register New Stored Batch</h3>
            <p className="text-xs text-slate-400 mb-4">Add fresh fruit, vegetable, dairy, or meat harvest to IoT cold storage monitoring</p>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Food Item Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alphonso Mangoes or Broccoli"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Fish">Fish & Seafood</option>
                    <option value="Meat">Meat & Poultry</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 15.0 kg"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Assigned Storage Zone</label>
                <select
                  value={newItem.storage_zone}
                  onChange={(e) => setNewItem({ ...newItem, storage_zone: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-600/20 transition-colors"
                >
                  Save & Assess Health
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
