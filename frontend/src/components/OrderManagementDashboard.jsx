import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Flame, 
  Utensils, 
  RefreshCw, 
  X, 
  Check, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  ShieldCheck,
  PackageCheck,
  Armchair,
  CheckCheck,
  Users,
  Receipt,
  Search,
  Filter,
  FileText,
  Eye
} from 'lucide-react';
import axios from 'axios';

export default function OrderManagementDashboard({ onRefresh, isDarkMode }) {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  
  // Dashboard Sub-View: 'kds_pos' (POS & KDS View) or 'history' (Recent Orders Ledger)
  const [activeTab, setActiveTab] = useState('kds_pos');

  // History Search & Filter State
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // New Order State
  const [selectedDish, setSelectedDish] = useState(null);
  const [additionalItems, setAdditionalItems] = useState([]);
  const [showAddItemSelector, setShowAddItemSelector] = useState(false);
  const [tableNumber, setTableNumber] = useState("Table 01");
  const [orderType, setOrderType] = useState("Dine-In");
  const [portionCount, setPortionCount] = useState(1);
  const [customerNote, setCustomerNote] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const [menuRes, ordersRes, statsRes, tablesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/orders/menu"),
        axios.get("http://localhost:8000/api/orders"),
        axios.get("http://localhost:8000/api/orders/stats"),
        axios.get("http://localhost:8000/api/orders/tables")
      ]);
      setMenu(menuRes.data.menu);
      setOrders(ordersRes.data.orders);
      setStats(statsRes.data);
      setTables(tablesRes.data.tables || []);
    } catch (err) {
      console.error("Failed to load order management data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedDish) return;

    try {
      setSubmittingOrder(true);
      const allItems = [
        { menu_id: selectedDish.id, quantity: Number(portionCount) },
        ...additionalItems.map(item => ({ menu_id: item.menu_id, quantity: Number(item.quantity) }))
      ];

      const payload = {
        table_no: orderType === 'Dine-In' ? tableNumber : `${orderType} #${Math.floor(10 + Math.random() * 90)}`,
        order_type: orderType,
        items: allItems,
        customer_note: customerNote
      };

      const res = await axios.post("http://localhost:8000/api/orders", payload);
      setOrderSuccessMessage(`Order #${res.data.order.order_number} placed for ${res.data.order.table_no}! Smart FIFO ingredients deducted.`);
      setShowNewOrderModal(false);
      setSelectedDish(null);
      setAdditionalItems([]);
      setShowAddItemSelector(false);
      setCustomerNote("");
      setPortionCount(1);
      
      await fetchOrderData();
      if (onRefresh) onRefresh();

      setTimeout(() => setOrderSuccessMessage(null), 6000);
    } catch (err) {
      console.error("Failed to submit order:", err);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/status`, { status: newStatus });
      await fetchOrderData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleFreeTable = async (tableNo) => {
    try {
      await axios.post(`http://localhost:8000/api/orders/tables/${encodeURIComponent(tableNo)}/free`);
      setOrderSuccessMessage(`${tableNo} is now cleared, sanitized & free for new guests!`);
      await fetchOrderData();
      if (onRefresh) onRefresh();
      setTimeout(() => setOrderSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Failed to free table:", err);
    }
  };

  const filteredMenu = selectedCategory === "all"
    ? menu
    : menu.filter(m => m.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inPrepOrders = orders.filter(o => o.status === 'in_prep');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const availableTables = tables.filter(t => t.status === 'available');

  // Filtered recent orders for History Ledger
  const filteredHistoryOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.id?.toLowerCase().includes(historySearch.toLowerCase()) ||
      ord.table_no?.toLowerCase().includes(historySearch.toLowerCase()) ||
      ord.items?.some(i => i.name.toLowerCase().includes(historySearch.toLowerCase()));
    
    const matchesStatus = historyStatusFilter === 'all' 
      ? true 
      : historyStatusFilter === 'active' 
      ? (ord.status === 'pending' || ord.status === 'in_prep' || ord.status === 'ready')
      : ord.status === historyStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderOrderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700">● New Pending</span>;
      case 'in_prep':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">🔥 Cooking</span>;
      case 'ready':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">✓ Ready for Pickup</span>;
      case 'completed':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">✓ Served & Paid</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Real-time Order Stream Stats */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 shadow-sm">
                <ShoppingBag className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> Integrated Order & POS Engine
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">• Full Order History & FIFO Depletion</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Order Management, POS & Live Kitchen Tickets
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium max-w-2xl leading-relaxed">
              Real-time POS ordering terminal, kitchen station routing, table floor availability, and complete historical order ledger with Smart FIFO ingredient tracking.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setSelectedDish(menu[0]);
                setShowNewOrderModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4" /> + Place Customer Order
            </button>
            <button
              onClick={fetchOrderData}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-300 dark:border-slate-700"
              title="Refresh Orders & Tables"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#e1eae4] dark:border-slate-800">
            <div className="p-3.5 rounded-xl bg-[#f8faf9] dark:bg-slate-800/80 border border-[#d1ded5] dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Today's Orders Placed</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total_orders_today}</div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">~{stats.on_time_fulfillment_rate} on-time fulfillment</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8faf9] dark:bg-slate-800/80 border border-[#d1ded5] dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Dine-In Table Capacity</span>
              <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-0.5">
                {tables.filter(t => t.status === 'available').length} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ {tables.length} Free</span>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                {tables.filter(t => t.status === 'dining' || t.status === 'in_prep').length} Tables Currently Occupied
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8faf9] dark:bg-slate-800/80 border border-[#d1ded5] dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Active In-Kitchen Tickets</span>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-0.5">{stats.active_kitchen_tickets}</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{stats.in_prep_count} cooking • {stats.ready_for_pickup} ready</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8faf9] dark:bg-slate-800/80 border border-[#d1ded5] dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Daily Food Sales Volume</span>
              <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-0.5">Rs. {stats.total_revenue_lkr.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Real-time revenue tracked</span>
            </div>
          </div>
        )}
      </div>

      {/* Success Notification Alert */}
      {orderSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
            <span>{orderSuccessMessage}</span>
          </div>
          <button onClick={() => setOrderSuccessMessage(null)} className="text-emerald-800 dark:text-emerald-300 hover:text-emerald-950">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* SUB-VIEW SWITCHER: KDS & POS FLOW vs RECENT ORDERS LEDGER */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-[#d1ded5] dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('kds_pos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'kds_pos'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-[#f0f5f2] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ChefHat className="h-4 w-4" />
            <span>Live POS & Kitchen Display (KDS)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-[#f0f5f2] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Recent Orders & History Ledger</span>
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black">
              {orders.length}
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold pr-2 hidden sm:inline">
          Connected with Smart FIFO Inventory & Table Floor Map
        </span>
      </div>

      {/* VIEW 1: POS & KDS LIVE WORKFLOW */}
      {activeTab === 'kds_pos' && (
        <div className="space-y-6">
          
          {/* RESTAURANT FLOOR PLAN: LIVE TABLE AVAILABILITY STATUS */}
          <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e1eae4] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Armchair className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Restaurant Floor Table Map</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                  12 Dine-In Tables
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Free / Available
                </span>
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" /> Cooking
                </span>
                <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Dining (Occupied)
                </span>
              </div>
            </div>

            {/* 12-Table Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {tables.map(tbl => {
                const isAvailable = tbl.status === 'available';
                const isCooking = tbl.status === 'in_prep';
                const isDining = tbl.status === 'dining';

                return (
                  <div
                    key={tbl.table_no}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between ${
                      isAvailable
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                        : isCooking
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 shadow-sm'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black">{tbl.table_no.replace('Table ', 'T-')}</div>
                      <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{tbl.capacity} Seats</div>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-black/5 dark:border-white/5">
                      {isAvailable ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">✓ Free</span>
                      ) : isCooking ? (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block">🔥 Cooking</span>
                      ) : (
                        <button
                          onClick={() => handleFreeTable(tbl.table_no)}
                          className="w-full py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold shadow-sm transition-colors"
                          title="Customers departed? Click to clear table"
                        >
                          Free Table
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LIVE KITCHEN DISPLAY SYSTEM (KDS) KANBAN BOARD */}
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e1eae4] dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                  Kitchen Display System (KDS) Live Tickets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Real-time order ticket progression with automatic Smart FIFO ingredient allocation tags
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#f0f5f2] dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-[#d1ded5] dark:border-slate-700">
                {orders.length} Active & Recent Orders
              </span>
            </div>

            {/* 4-Column Ticket Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Column 1: Pending (New Orders) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> New Orders ({pendingOrders.length})
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingOrders.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-[#d1ded5] dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
                      No new pending orders
                    </div>
                  ) : (
                    pendingOrders.map(ord => (
                      <div key={ord.id} className="p-4 rounded-xl bg-[#f8faf9] dark:bg-slate-800/90 border border-[#d1ded5] dark:border-slate-700 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between border-b border-[#e1eae4] dark:border-slate-700 pb-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">#{ord.order_number} ({ord.table_no})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                            {ord.created_at}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="text-slate-500 font-mono">Rs. {it.unit_price * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* FIFO Ingredients Breakdown */}
                        {ord.ingredients_deducted?.length > 0 && (
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[10px] space-y-1 text-emerald-950 dark:text-emerald-300">
                            <span className="font-bold flex items-center gap-1">
                              <PackageCheck className="h-3 w-3 text-emerald-600" /> Smart FIFO Batches Used:
                            </span>
                            {ord.ingredients_deducted.map((ing, i) => (
                              <div key={i} className="text-slate-600 dark:text-slate-400 font-medium">
                                • {ing.amount_kg}kg {ing.item.split('(')[0]} ({ing.batch})
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#e1eae4] dark:border-slate-700 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">{ord.station_name.split('&')[0]}</span>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'in_prep')}
                            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Flame className="h-3.5 w-3.5" /> Start Cooking
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: In Prep (Cooking) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" /> Cooking / In Prep ({inPrepOrders.length})
                  </span>
                </div>

                <div className="space-y-3">
                  {inPrepOrders.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-[#d1ded5] dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
                      No tickets currently cooking
                    </div>
                  ) : (
                    inPrepOrders.map(ord => (
                      <div key={ord.id} className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800 pb-2">
                          <span className="font-extrabold text-sm text-amber-950 dark:text-amber-200">#{ord.order_number} ({ord.table_no})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {ord.elapsed_mins}m / {ord.target_prep_mins}m
                          </span>
                        </div>

                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-xs font-bold text-slate-900 dark:text-white">
                              {it.quantity}x {it.name}
                            </div>
                          ))}
                        </div>

                        {ord.customer_note && (
                          <p className="text-[10px] text-amber-900 dark:text-amber-300 italic bg-amber-100/60 dark:bg-amber-950/60 p-1.5 rounded">
                            "{ord.customer_note}"
                          </p>
                        )}

                        <div className="pt-2 border-t border-amber-200 dark:border-amber-800 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400">{ord.station_name}</span>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'ready')}
                            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" /> Mark Ready
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Ready for Pickup */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Ready for Pickup ({readyOrders.length})
                  </span>
                </div>

                <div className="space-y-3">
                  {readyOrders.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-[#d1ded5] dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
                      No plates waiting
                    </div>
                  ) : (
                    readyOrders.map(ord => (
                      <div key={ord.id} className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700/60 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                          <span className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">#{ord.order_number} ({ord.table_no})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                            {ord.order_type}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-xs font-bold text-slate-900 dark:text-white">
                              {it.quantity}x {it.name}
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">Rs. {ord.total_amount_lkr}</span>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'completed')}
                            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Served
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 4: Completed (Served & Dining / Cleared) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Completed Orders ({completedOrders.length})
                  </span>
                </div>

                <div className="space-y-3">
                  {completedOrders.slice(0, 4).map(ord => {
                    const isDineIn = ord.order_type === 'Dine-In';
                    const isTableOccupied = ord.table_status === 'dining' || ord.table_status === 'occupied';

                    return (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#d1ded5] dark:border-slate-700 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">#{ord.order_number} ({ord.table_no})</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCheck className="h-3 w-3" /> Served
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      {ord.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#e1eae4] dark:border-slate-700 text-[10px]">
                      <span className="text-slate-500 font-mono font-bold">Rs. {ord.total_amount_lkr}</span>
                      
                      {/* Interactive "Clear & Free Table" button for Dine-In orders */}
                      {isDineIn && (
                        isTableOccupied ? (
                          <button
                            onClick={() => handleFreeTable(ord.table_no)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                            title="Customers have finished and departed. Click to mark table free."
                          >
                            <Armchair className="h-3 w-3" /> Clear & Free Table
                          </button>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                            ✓ Table Cleared
                          </span>
                        )
                      )}
                    </div>
                  </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* POS MENU CATALOG & INGREDIENT RECIPE BROWSER */}
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1eae4] dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                  Menu Item Catalog & Recipe Ingredients (BOM)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Click any dish to inspect required cold storage ingredient batches or instantly fire an order
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["all", "main", "seafood", "salad", "dessert", "beverage"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-[#f0f5f2] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-[#d1ded5] dark:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenu.map(dish => (
                <div
                  key={dish.id}
                  className="p-4 rounded-2xl bg-[#f8faf9] dark:bg-slate-800/80 border border-[#d1ded5] dark:border-slate-700 flex flex-col justify-between transition-all hover:shadow-md group space-y-3"
                >
                  <div>
                    <div className="w-full h-36 rounded-xl overflow-hidden relative bg-slate-100 dark:bg-slate-950 border border-[#d1ded5] dark:border-slate-700 mb-2.5">
                      <img
                        src={dish.image_url}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className={`absolute top-2 right-2 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow ${
                        dish.in_stock ? 'bg-emerald-700 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {dish.in_stock ? "✓ In Stock" : "⚠️ Low Stock"}
                      </span>
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm">
                        {dish.station_name.split('&')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">{dish.name}</h4>
                      <span className="text-sm font-black text-emerald-800 dark:text-emerald-400 font-mono">
                        Rs. {dish.price_lkr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium leading-relaxed">
                      {dish.description}
                    </p>

                    {/* Recipe Ingredient Breakdown */}
                    <div className="mt-3 pt-2.5 border-t border-[#e1eae4] dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recipe Ingredients (BOM):</span>
                      {dish.stock_details?.map((st, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] font-medium">
                          <span className="text-slate-700 dark:text-slate-300">• {st.ingredient.split('(')[0]}</span>
                          <span className={`font-mono text-[10px] font-bold ${st.is_spoilage_risk ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'}`}>
                            {st.required_kg}kg {st.is_spoilage_risk ? '(Low RSL Target)' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedDish(dish);
                        setShowNewOrderModal(true);
                      }}
                      className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Order This Dish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: RECENT ORDERS & SALES LEDGER TABLE */}
      {activeTab === 'history' && (
        <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 space-y-5 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1eae4] dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                Recent Orders & Sales Ledger
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Complete audit history of placed orders, bill totals, table occupancies, and smart FIFO ingredient consumption
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                {filteredHistoryOrders.length} Orders Listed
              </span>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#f4f8f5] dark:bg-slate-800/80 p-3 rounded-xl border border-[#d7e5dc] dark:border-slate-700">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order # (e.g. ORD-1081), Table, or Dish..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-[#c6d7cd] dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-600 shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-6 flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'active', label: 'In Kitchen' },
                { id: 'ready', label: 'Ready' },
                { id: 'completed', label: 'Completed' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setHistoryStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    historyStatusFilter === st.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-[#d1ded5] dark:border-slate-700'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders History Table */}
          <div className="overflow-x-auto rounded-xl border border-[#d1ded5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs text-slate-900 dark:text-slate-100">
              <thead className="bg-[#f0f5f2] dark:bg-slate-800 text-slate-800 dark:text-slate-200 uppercase font-bold border-b border-[#d1ded5] dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order Ref & Time</th>
                  <th className="py-3.5 px-4">Table / Channel</th>
                  <th className="py-3.5 px-4">Items Ordered</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4">Smart FIFO Batches Deducted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6ede8] dark:divide-slate-800">
                {filteredHistoryOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No matching orders found in ledger.
                    </td>
                  </tr>
                ) : (
                  filteredHistoryOrders.map((ord) => {
                    const isDineIn = ord.order_type === 'Dine-In';
                    const isTableOccupied = ord.table_status === 'dining' || ord.table_status === 'occupied';

                    return (
                      <tr key={ord.id} className="hover:bg-[#f9fbf9] dark:hover:bg-slate-800/60 transition-colors">
                        
                        {/* Order Number & Timestamp */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>#{ord.order_number}</span>
                            <span className="text-[10px] font-mono text-slate-400">({ord.id})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Placed at {ord.created_at}
                          </div>
                        </td>

                        {/* Table / Order Channel */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{ord.table_no}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {ord.order_type} • <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{ord.station_name.split('&')[0]}</span>
                          </div>
                        </td>

                        {/* Items Summary */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-0.5">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {it.quantity}x {it.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total Amount in LKR */}
                        <td className="py-3.5 px-4 font-mono font-black text-sm text-emerald-800 dark:text-emerald-400">
                          Rs. {ord.total_amount_lkr.toLocaleString()}
                        </td>

                        {/* Order Status */}
                        <td className="py-3.5 px-4">
                          {renderOrderStatusBadge(ord.status)}
                        </td>

                        {/* Smart FIFO Deductions */}
                        <td className="py-3.5 px-4 max-w-xs">
                          {ord.ingredients_deducted?.length > 0 ? (
                            <div className="space-y-0.5 text-[11px]">
                              {ord.ingredients_deducted.map((ing, i) => (
                                <div key={i} className="text-slate-600 dark:text-slate-300 font-medium">
                                  • {ing.amount_kg}kg {ing.item.split('(')[0]} <span className="text-slate-400 font-mono text-[10px]">({ing.batch.split(' ')[0]})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Standard Stock</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedReceiptOrder(ord)}
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                              title="View Digital Ticket / Receipt"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {isDineIn && isTableOccupied && (
                              <button
                                onClick={() => handleFreeTable(ord.table_no)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm transition-colors"
                                title="Free Table"
                              >
                                Free Table
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* DIGITAL RECEIPT / TICKET INSPECTION MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1eae4] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Order Ticket #{selectedReceiptOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 rounded-xl bg-[#f8faf9] dark:bg-slate-800/80 border border-[#d1ded5] dark:border-slate-700 space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Ref Code: {selectedReceiptOrder.id}</span>
                <span>{selectedReceiptOrder.table_no} ({selectedReceiptOrder.order_type})</span>
              </div>

              <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                <span>Time: {selectedReceiptOrder.created_at}</span>
                <span>Station: {selectedReceiptOrder.station_name.split('&')[0]}</span>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Ordered Dishes:</span>
                {selectedReceiptOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center font-bold">
                    <span className="text-slate-900 dark:text-white">{it.quantity}x {it.name}</span>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400">Rs. {it.unit_price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Total Bill Amount:</span>
                <span className="text-emerald-800 dark:text-emerald-400 font-mono">Rs. {selectedReceiptOrder.total_amount_lkr.toLocaleString()}</span>
              </div>

              {selectedReceiptOrder.customer_note && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 italic">
                  Note: "{selectedReceiptOrder.customer_note}"
                </div>
              )}

              {/* FIFO Deductions */}
              {selectedReceiptOrder.ingredients_deducted?.length > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[10px] space-y-1 text-emerald-950 dark:text-emerald-300">
                  <span className="font-bold flex items-center gap-1">
                    <PackageCheck className="h-3 w-3 text-emerald-600" /> Smart FIFO Ingredients Consumed:
                  </span>
                  {selectedReceiptOrder.ingredients_deducted.map((ing, i) => (
                    <div key={i} className="text-slate-600 dark:text-slate-400 font-medium">
                      • {ing.amount_kg}kg {ing.item} ({ing.batch})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e1eae4] dark:border-slate-800">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLACE NEW ORDER MODAL */}
      {showNewOrderModal && selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-[#d1ded5] dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1eae4] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Place New Customer Order</h3>
              </div>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              
              {/* Selected Dish Card Summary */}
              <div className="p-3.5 rounded-xl bg-[#f8faf9] dark:bg-slate-800 border border-[#d1ded5] dark:border-slate-700 flex items-center gap-3">
                <img src={selectedDish.image_url} alt={selectedDish.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{selectedDish.name}</h4>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 font-mono">
                    Rs. {selectedDish.price_lkr} • {selectedDish.station_name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 dark:text-slate-200 font-bold block mb-1">Order Channel</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-[#f8faf9] dark:bg-slate-800 border border-[#c6d7cd] dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Dine-In">Dine-In (Select Table Below)</option>
                    <option value="Takeout">Takeaway / Takeout</option>
                    <option value="Delivery">Delivery Platform</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-800 dark:text-slate-200 font-bold block mb-1">Selected Table</label>
                  <select
                    disabled={orderType !== 'Dine-In'}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#f8faf9] dark:bg-slate-800 border border-[#c6d7cd] dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-600 disabled:opacity-50"
                  >
                    {tables.map(t => (
                      <option key={t.table_no} value={t.table_no}>
                        {t.table_no} ({t.status === 'available' ? '✓ Free' : 'Occupied'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Free Tables Quick Chips */}
              {orderType === 'Dine-In' && availableTables.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Quick Select Available Free Tables:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTables.map(tbl => (
                      <button
                        key={tbl.table_no}
                        type="button"
                        onClick={() => setTableNumber(tbl.table_no)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs border transition-all ${
                          tableNumber === tbl.table_no
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {tbl.table_no}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-800 dark:text-slate-200">Portion Quantity:</span>
                  <span className="text-emerald-800 dark:text-emerald-400 text-sm font-mono font-bold">
                    {portionCount} portions (Subtotal: Rs. {selectedDish.price_lkr * portionCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPortionCount(n)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all ${
                        portionCount === n
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                          : 'bg-[#f8faf9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#d1ded5] dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Items Section */}
              <div className="pt-2 border-t border-[#e1eae4] dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    Additional Items in Order ({additionalItems.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddItemSelector(!showAddItemSelector)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-extrabold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {showAddItemSelector ? 'Close Picker' : '➕ Add More Items'}
                  </button>
                </div>

                {/* Additional Items Cart List */}
                {additionalItems.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {additionalItems.map((item, idx) => (
                      <div key={`${item.menu_id}-${idx}`} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</h5>
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 font-mono">
                            Rs. {item.price_lkr * item.quantity} ({item.station_name})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...additionalItems];
                              if (updated[idx].quantity > 1) {
                                updated[idx].quantity -= 1;
                                setAdditionalItems(updated);
                              }
                            }}
                            className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-slate-300 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs px-1.5 text-slate-900 dark:text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...additionalItems];
                              updated[idx].quantity += 1;
                              setAdditionalItems(updated);
                            }}
                            className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center hover:bg-slate-300 cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAdditionalItems(additionalItems.filter((_, i) => i !== idx));
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer ml-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Item Dropdown Picker */}
                {showAddItemSelector && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Select Menu Item to Add:</span>
                    {menu.filter(m => m.id !== selectedDish.id).map(m => {
                      const alreadyAdded = additionalItems.some(i => i.menu_id === m.id);
                      return (
                        <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <img src={m.image_url} alt={m.name} className="h-8 w-8 rounded object-cover" />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{m.name}</span>
                              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono font-bold">Rs. {m.price_lkr}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={alreadyAdded}
                            onClick={() => {
                              setAdditionalItems([...additionalItems, {
                                menu_id: m.id,
                                name: m.name,
                                price_lkr: m.price_lkr,
                                station_name: m.station_name,
                                quantity: 1,
                                recipe_bom: m.recipe_bom || []
                              }]);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              alreadyAdded
                                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            {alreadyAdded ? 'Added ✓' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-800 dark:text-slate-200 font-bold block mb-1">Kitchen / Chef Notes</label>
                <textarea
                  rows="2"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="e.g. Less oil, extra chili on the side, allergies..."
                  className="w-full bg-[#f8faf9] dark:bg-slate-800 border border-[#c6d7cd] dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Total Order Summary Pill */}
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between">
                <span className="font-extrabold text-xs text-emerald-950 dark:text-emerald-200">
                  Total Order Amount ({1 + additionalItems.reduce((acc, i) => acc + i.quantity, 0)} items):
                </span>
                <span className="font-black text-sm text-emerald-900 dark:text-emerald-300 font-mono">
                  Rs. {(selectedDish.price_lkr * portionCount) + additionalItems.reduce((sum, item) => sum + (item.price_lkr * item.quantity), 0)}
                </span>
              </div>

              {/* Smart FIFO Ingredient Deduction Preview */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 space-y-1">
                <span className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Smart FIFO Auto-Deduction preview:
                </span>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {[
                    ...selectedDish.recipe_bom.map(b => `${(b.required_kg * portionCount).toFixed(2)}kg ${b.ingredient_name.split('(')[0]}`),
                    ...additionalItems.flatMap(i => (i.recipe_bom || []).map(b => `${(b.required_kg * i.quantity).toFixed(2)}kg ${b.ingredient_name.split('(')[0]}`))
                  ].join(' + ')} will be automatically deducted from cold storage batches with lowest remaining shelf-life.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e1eae4] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Confirm & Send to Kitchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
