import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  RefreshCw, 
  Layers, 
  TrendingUp, 
  Users, 
  Trash2, 
  Cpu, 
  Sun, 
  Moon, 
  ShoppingBag, 
  Package,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChefHat,
  CreditCard,
  Crown,
  Armchair,
  Receipt,
  Flame,
  Utensils
} from 'lucide-react';

export const ROLES = [
  {
    id: 'admin',
    title: 'Admin (Full Access)',
    shortTitle: 'Admin',
    description: 'Executive overview, AI models, inventory valuation, and all research modules',
    icon: <Crown className="h-4 w-4 text-amber-500" />,
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    defaultModule: 'executive'
  },
  {
    id: 'cashier',
    title: 'Cashier (Front-of-House)',
    shortTitle: 'Cashier',
    description: 'POS menu ordering, live table map, and customer sales ledger',
    icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    defaultModule: 'pos_menu'
  },
  {
    id: 'staff',
    title: 'Kitchen & Floor Staff',
    shortTitle: 'Kitchen Staff',
    description: 'Live KDS cooking tickets, line station loads, and cold storage restock',
    icon: <ChefHat className="h-4 w-4 text-blue-500" />,
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    defaultModule: 'kds'
  }
];

export default function Header({
  activeModule,
  onSelectModule,
  currentRole = 'admin',
  onSelectRole,
  stats,
  onRefresh,
  activeAlertCount,
  onOpenAlerts,
  isDarkMode,
  onToggleTheme
}) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ROLE-SPECIFIC DOCK MODULE DEFINITIONS (1 Screen = 1 Dedicated Purpose)
  const getModulesForRole = () => {
    if (currentRole === 'cashier') {
      return [
        {
          id: 'pos_menu',
          label: 'POS Menu Ordering',
          shortLabel: 'POS Menu',
          badge: 'Order',
          badgeColor: 'bg-emerald-600',
          icon: <Utensils className="h-3.5 w-3.5" />
        },
        {
          id: 'tables_map',
          label: 'Restaurant Table Map',
          shortLabel: 'Table Map',
          icon: <Armchair className="h-3.5 w-3.5" />
        },
        {
          id: 'orders_ledger',
          label: 'Orders & Sales Ledger',
          shortLabel: 'Sales Ledger',
          icon: <Receipt className="h-3.5 w-3.5" />
        }
      ];
    }

    if (currentRole === 'staff') {
      return [
        {
          id: 'kds',
          label: 'Kitchen Display (KDS)',
          shortLabel: 'KDS Tickets',
          badge: stats?.active_kitchen_tickets ? `${stats.active_kitchen_tickets}` : null,
          badgeColor: 'bg-amber-500',
          icon: <Flame className="h-3.5 w-3.5" />
        },
        {
          id: 'kitchen',
          label: 'Kitchen Stations & Line',
          shortLabel: 'Stations',
          icon: <Users className="h-3.5 w-3.5" />
        },
        {
          id: 'inventory',
          label: 'Perishable Inventory',
          shortLabel: 'Inventory',
          icon: <Package className="h-3.5 w-3.5" />
        },
        {
          id: 'spoilage',
          label: 'Food Spoilage & Quality',
          shortLabel: 'Spoilage',
          badge: stats?.critical_batches ? `${stats.critical_batches}` : null,
          badgeColor: 'bg-rose-500',
          icon: <Cpu className="h-3.5 w-3.5" />
        },
        {
          id: 'waste',
          label: 'Smart Waste Bin',
          shortLabel: 'Waste Bin',
          icon: <Trash2 className="h-3.5 w-3.5" />
        }
      ];
    }

    // Default: Admin (Full Access to all 7 core modules)
    return [
      { 
        id: 'executive', 
        label: 'Executive Hub', 
        shortLabel: 'Executive', 
        badge: 'Core',
        icon: <Layers className="h-3.5 w-3.5" /> 
      },
      { 
        id: 'orders', 
        label: 'Orders & POS', 
        shortLabel: 'Orders', 
        badge: stats?.active_kitchen_tickets ? `${stats.active_kitchen_tickets}` : null,
        badgeColor: 'bg-blue-500',
        icon: <ShoppingBag className="h-3.5 w-3.5" /> 
      },
      { 
        id: 'inventory', 
        label: 'Inventory & Stock', 
        shortLabel: 'Inventory', 
        icon: <Package className="h-3.5 w-3.5" /> 
      },
      { 
        id: 'spoilage', 
        label: 'Food Spoilage & Quality', 
        shortLabel: 'Food Spoilage', 
        badge: stats?.critical_batches ? `${stats.critical_batches}` : null,
        badgeColor: 'bg-rose-500',
        icon: <Cpu className="h-3.5 w-3.5" /> 
      },
      { 
        id: 'kitchen', 
        label: 'Kitchen & Staff', 
        shortLabel: 'Kitchen', 
        icon: <Users className="h-3.5 w-3.5" /> 
      },
      { 
        id: 'demand', 
        label: 'Demand Forecasting', 
        shortLabel: 'Demand', 
        icon: <TrendingUp className="h-3.5 w-3.5" /> 
      },
      { 
        id: 'waste', 
        label: 'Smart Waste Bin', 
        shortLabel: 'Waste Bin', 
        icon: <Trash2 className="h-3.5 w-3.5" /> 
      }
    ];
  };

  const visibleModules = getModulesForRole();
  const activeRoleObj = ROLES.find(r => r.id === currentRole) || ROLES[0];

  const handleRoleSwitch = (role) => {
    if (onSelectRole) {
      onSelectRole(role.id);
    }
    setRoleDropdownOpen(false);
    onSelectModule(role.defaultModule);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-[#cbdad0]/80 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 space-y-2">
        
        {/* Top Tier: Brand Identity, Role Switcher Dropdown & Tools */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo with Live Telemetry Pulse */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-700/25 text-white font-black">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Smart Restaurant Analytics
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" /> AI & IoT Cloud Core
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Research Project J26-IT-333 • SLIIT 2026
              </span>
            </div>
          </div>

          {/* Right Tools & Role Dropdown */}
          <div className="flex items-center gap-2">
            
            {/* ROLE SELECTOR DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all shadow-sm hover:scale-105 ${activeRoleObj.badgeColor} bg-white dark:bg-slate-900`}
                title="Switch User Role / View"
              >
                <div className="flex items-center gap-1.5">
                  {activeRoleObj.icon}
                  <span className="hidden sm:inline">Role:</span>
                  <span className="font-extrabold">{activeRoleObj.shortTitle}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Modal */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Switch Workspace Persona</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Select role to tailor navigation</span>
                  </div>

                  {ROLES.map((role) => {
                    const isSelected = role.id === currentRole;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSwitch(role)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0 mt-0.5">
                          {role.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 dark:text-white">{role.title}</span>
                            {isSelected && (
                              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">Active</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-2">
                            {role.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e4ece7] dark:bg-slate-900 dark:hover:bg-slate-800 border border-[#d5e2d9] dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 shadow-sm"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
              ) : (
                <Moon className="h-4 w-4 text-emerald-800 transition-transform rotate-0 hover:-rotate-12 duration-300" />
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e4ece7] dark:bg-slate-900 dark:hover:bg-slate-800 border border-[#d5e2d9] dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 shadow-sm"
              title="Refresh Real-Time Metrics"
            >
              <RefreshCw className="h-4 w-4 text-emerald-800 dark:text-slate-200" />
            </button>

            {/* Interactive Alert Center Trigger */}
            <button
              onClick={onOpenAlerts}
              className="relative px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all hover:scale-105 shadow-md shadow-emerald-800/20 flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
              {activeAlertCount > 0 ? (
                <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow">
                  {activeAlertCount}
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>

          </div>

        </div>

        {/* Bottom Tier: Floating Segmented Dock Tailored by Selected Role */}
        <div className="p-1 rounded-2xl bg-[#edf4f0] dark:bg-slate-900/90 border border-[#d1ded5] dark:border-slate-800/90 shadow-inner">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {visibleModules.map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`flex-1 min-w-max px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 scale-[1.02]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                  {m.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : (m.badgeColor ? `${m.badgeColor} text-white` : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200')
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
}
