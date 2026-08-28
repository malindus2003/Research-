import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Trash2, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldAlert, XCircle, Apple, Carrot, Milk, Fish, Beef, X } from 'lucide-react';
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
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800"><Apple className="h-3.5 w-3.5 text-emerald-700" /> Fruits</span>;
      case "Vegetables":
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800"><Carrot className="h-3.5 w-3.5 text-emerald-700" /> Vegetables</span>;
      case "Dairy":
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-800"><Milk className="h-3.5 w-3.5 text-sky-700" /> Dairy</span>;
      case "Fish":
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-800"><Fish className="h-3.5 w-3.5 text-teal-700" /> Fish & Seafood</span>;
      case "Meat":
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800"><Beef className="h-3.5 w-3.5 text-rose-700" /> Meat & Poultry</span>;
    }
  };

  const renderRiskBadge = (level) => {
    switch (level) {
      case "Low":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Low (Fresh)</span>;
      case "Medium":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300"><AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Medium</span>;
      case "High":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-900 border border-orange-300"><ShieldAlert className="h-3.5 w-3.5 text-orange-600" /> High (Priority)</span>;
      case "Critical":
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-300 animate-pulse"><XCircle className="h-3.5 w-3.5 text-rose-600" /> Critical (Spoiled)</span>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5 bg-white border border-[#d1ded5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e1eae4] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Perishable Inventory Spoilage Matrix</h2>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {filteredItems.length} Batches (All 5 Categories)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Real-time batch-level shelf-life tracking for Fruits, Vegetables, Dairy, Fish & Meat
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-colors"
        >
          <Plus className="h-4 w-4" /> Register New Batch
        </button>
      </div>

      {/* Category Pills + Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#f4f8f5] p-3 rounded-xl border border-[#d7e5dc]">
        {/* Search */}
        <div className="sm:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search fruit, veg, meat or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#c6d7cd] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
          />
        </div>

        {/* Category Quick Filter */}
        <div className="sm:col-span-5 flex items-center gap-1.5 overflow-x-auto">
          {["all", "fruits", "vegetables", "dairy", "fish", "meat"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-[#d1ded5]'
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
            className="w-full bg-white border border-[#c6d7cd] rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
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
      <div className="overflow-x-auto rounded-xl border border-[#d1ded5] bg-white shadow-sm">
        <table className="w-full text-left text-xs text-slate-900">
          <thead className="bg-[#f0f5f2] text-slate-800 uppercase font-bold border-b border-[#d1ded5]">
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
          <tbody className="divide-y divide-[#e6ede8]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                  No matching inventory batches found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#f9fbf9] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">
                      {item.batch_number} • <span className="font-bold text-slate-700">{item.quantity}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{getCategoryBadge(item.category)}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{item.storage_zone.split(':')[0]}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-mono font-bold text-slate-900">
                      <span>{item.current_temp}°C</span> • <span>{item.current_humidity}% RH</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      CO₂: {item.current_co2} ppm • VOC: {item.current_voc} ppm
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className={`text-sm font-bold ${item.remaining_shelf_life_hours < 12 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {item.remaining_shelf_life_hours} hrs
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Spoilage Prob: {item.spoilage_prob}%
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {renderRiskBadge(item.risk_level)}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="text-xs text-slate-700 font-medium line-clamp-2">
                      {item.recommendation}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#d1ded5] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1eae4]">
              <h3 className="text-base font-bold text-slate-900">Register New Perishable Batch</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-800 font-bold block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Red Strawberries"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-[#f8faf9] border border-[#c6d7cd] rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-[#c6d7cd] rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Fish">Fish & Seafood</option>
                    <option value="Meat">Meat & Poultry</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Batch Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BAT-2026-SB99"
                    value={newItem.batch_number}
                    onChange={(e) => setNewItem({ ...newItem, batch_number: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-[#c6d7cd] rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">Quantity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15.0 kg"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-[#c6d7cd] rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">Storage Hours</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItem.storage_duration_hours}
                    onChange={(e) => setNewItem({ ...newItem, storage_duration_hours: Number(e.target.value) })}
                    className="w-full bg-[#f8faf9] border border-[#c6d7cd] rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">Storage Chamber</label>
                <select
                  value={newItem.storage_zone}
                  onChange={(e) => setNewItem({ ...newItem, storage_zone: e.target.value })}
                  className="w-full bg-[#f8faf9] border border-[#c6d7cd] rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e1eae4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  Save & Ingest Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
