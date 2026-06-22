"use client";

import React, { useState, useMemo } from "react";
import {
  Tag,
  Store,
  MousePointerClick,
  DollarSign,
  AlertTriangle,
  Clock,
  Trash2,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  X,
  Sparkles,
  Plus,
  TrendingUp,
  User,
  ShieldCheck,
  Globe,
  Inbox,
  BarChart2,
  PieChart,
  CheckCircle,
  ThumbsUp,
  AlertCircle,
  TrendingDown
} from "lucide-react";
import { type Coupon, type Brand, type DashboardStats } from "@/types";
import { fmt, timeAgo, getExpiryInfo, getTypeLabel } from "@/lib/utils";

interface AdminDashboardClientProps {
  initialStats: DashboardStats;
  initialCoupons: Coupon[];
  initialBrands: Brand[];
}

export function AdminDashboardClient({
  initialStats,
  initialCoupons,
  initialBrands
}: AdminDashboardClientProps) {
  // App-level Navigation and State
  const [activeTab, setActiveTab] = useState<"dashboard" | "coupons" | "brands" | "moderation" | "analytics">("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dealhunter_admin_authed") === "true" ||
             sessionStorage.getItem("dealhunter_admin_authed") === "true";
    }
    return false;
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    setTimeout(() => {
      const u = usernameInput.trim().toLowerCase();
      const p = passwordInput;

      if (u === "admin" && (p === "admin" || p === "admin123" || p === "dealhunter123")) {
        setIsAuthenticated(true);
        if (staySignedIn) {
          localStorage.setItem("dealhunter_admin_authed", "true");
        } else {
          sessionStorage.setItem("dealhunter_admin_authed", "true");
        }
        setIsAuthenticating(false);
      } else {
        setAuthError("Tên đăng nhập hoặc mật khẩu không chính xác.");
        setIsAuthenticating(false);
      }
    }, 800);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dealhunter_admin_authed");
    sessionStorage.removeItem("dealhunter_admin_authed");
  };

  // State & actions for confirmation of deletions
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: "coupon" | "brand" | "bulk_coupon";
    id?: string;
    title: string;
    message: string;
  } | null>(null);

  const executeDelete = () => {
    if (!confirmDelete) return;

    const { type, id } = confirmDelete;
    if (type === "coupon" && id) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setQueue((prev) => prev.filter((c) => c.id !== id));
    } else if (type === "brand" && id) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      setCoupons((prev) => prev.filter((c) => c.brandId !== id));
    } else if (type === "bulk_coupon") {
      setCoupons((prev) => prev.filter((c) => !couponSelected.has(c.id)));
      setCouponSelected(new Set());
    }

    setConfirmDelete(null);
  };

  // Unified State Syncing
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  
  // Initialize Queue with PENDING coupons
  const [queue, setQueue] = useState<Coupon[]>(() =>
    initialCoupons.filter((c) => c.status === "PENDING")
  );

  // Realtime derived pending count
  const pendingCount = queue.length;

  // Realtime derived stats
  const stats = useMemo<DashboardStats>(() => {
    const active = coupons.filter(c => c.status === "ACTIVE").length;
    const expired = coupons.filter(c => c.status === "EXPIRED").length;
    const totalClicks = coupons.reduce((sum, c) => sum + (c.clickCount || 0), 0);

    return {
      coupons: {
        total: coupons.length,
        active,
        expired,
        pending: pendingCount,
        addedToday: initialStats.coupons.addedToday
      },
      brands: {
        total: brands.length,
        active: brands.filter(b => b.isActive).length
      },
      traffic: {
        clicksToday: initialStats.traffic.clicksToday,
        clicksThisMonth: totalClicks > 0 ? totalClicks : initialStats.traffic.clicksThisMonth,
        conversionRate: initialStats.traffic.conversionRate
      },
      revenue: {
        estimatedThisMonth: initialStats.revenue.estimatedThisMonth
      },
      moderation: {
        pendingCount
      }
    };
  }, [coupons, brands, pendingCount, initialStats]);

  // Image Error Fallback Handler for Logos
  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>, brandName: string) => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.logo-fallback');
      if (fallback) {
        fallback.removeAttribute('style');
        fallback.classList.remove('hidden');
        fallback.classList.add('flex');
      }
    }
  };

  // ==========================================
  // PAGE 1: DASHBOARD
  // ==========================================
  const renderDashboard = () => {
    const recentCoupons = coupons.slice(0, 5);
    const topBrands = [...brands].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5);

    return (
      <div className="space-y-6" id="admin-view-dashboard">
        {/* Warning Banner */}
        {pendingCount > 0 && (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 text-sm text-amber-200 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-400 shrink-0 w-5 h-5" />
              <span>
                <strong>{pendingCount} coupons</strong> are waiting in the moderation queue for review.
              </span>
            </div>
            <button
              onClick={() => setActiveTab("moderation")}
              className="bg-amber-500 text-black font-bold px-3 py-1.5 rounded-lg hover:bg-amber-400 transition text-xs shrink-0"
            >
              Review Now
            </button>
          </div>
        )}

        {/* Row 1 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Active Coupons"
            value={stats.coupons.active}
            sub={`+${stats.coupons.addedToday} today`}
            icon={<Tag className="w-4 h-4" />}
            accent="violet"
            trend="+12% vs last week"
          />
          <StatCard
            label="Total Brands"
            value={stats.brands.total}
            sub={`${stats.brands.active} active`}
            icon={<Store className="w-4 h-4" />}
            accent="blue"
            trend=""
          />
          <StatCard
            label="Clicks Today"
            value={stats.traffic.clicksToday}
            sub={`${stats.traffic.conversionRate}% conversion`}
            icon={<MousePointerClick className="w-4 h-4" />}
            accent="green"
            trend="+8% vs yesterday"
          />
          <StatCard
            label="Est. Revenue"
            value={`$${stats.revenue.estimatedThisMonth}`}
            sub="Estimated this month"
            icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
            accent="amber"
            trend=""
          />
        </div>

        {/* Row 2 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Clicks (Month)</div>
              <div className="text-2xl font-bold text-white mt-1">{fmt(stats.traffic.clicksThisMonth)}</div>
            </div>
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pending Review</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Expired Coupons</div>
              <div className="text-2xl font-bold text-red-400 mt-1">{stats.coupons.expired}</div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left panel: Recent coupons */}
          <div className="lg:col-span-3 bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                <h3 className="font-semibold text-white text-sm">Recent Coupons</h3>
                <button onClick={() => setActiveTab("coupons")} className="text-xs text-violet-400 hover:text-violet-300 font-medium transition">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-medium uppercase">
                      <th className="py-2">Brand / Code</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentCoupons.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center overflow-hidden shrink-0">
                              {c.brand.logoUrl && (
                                <img
                                  src={c.brand.logoUrl}
                                  alt=""
                                  className="w-full h-full object-contain"
                                  onError={(e) => handleLogoError(e, c.brand.name)}
                                />
                              )}
                              <div className="logo-fallback hidden absolute inset-0 bg-violet-600/20 text-violet-300 font-extrabold text-[10px] items-center justify-center">
                                {c.brand.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-white text-xs">{c.brand.name}</div>
                              <code className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-1 rounded">{c.code}</code>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 font-semibold text-[10px]">
                          <span className="bg-violet-500/15 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded">
                            {getTypeLabel(c.type, c.discountValue)}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                            c.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : c.status === "PENDING" ? "bg-amber-400" : "bg-gray-550"
                          }`} />
                          <span className="text-[11px] text-gray-400 capitalize">{c.status.toLowerCase()}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-gray-400">{fmt(c.clickCount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-t border-white/[0.04] pt-3 mt-4 text-[11px] text-gray-500">
              Showing top recent entries across registered global stores.
            </div>
          </div>

          {/* Right panel: Top Brands */}
          <div className="lg:col-span-2 bg-[#0F1117] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
              <h3 className="font-semibold text-white text-sm">Top Performance Brands</h3>
              <button onClick={() => setActiveTab("brands")} className="text-xs text-violet-400 hover:text-violet-300 font-medium transition">
                Manage
              </button>
            </div>
            <div className="space-y-3.5">
              {topBrands.map((b, i) => (
                <div key={b.id} className="flex items-center gap-3 hover:bg-white/[0.02] p-1.5 rounded transition">
                  <span className="text-xs font-mono text-gray-500 w-4 text-center">{i + 1}</span>
                  <div className="relative w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {b.logoUrl && (
                      <img
                        src={b.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                        onError={(e) => handleLogoError(e, b.name)}
                      />
                    )}
                    <div className="logo-fallback hidden absolute inset-0 bg-blue-600/20 text-blue-300 font-extrabold text-xs items-center justify-center">
                      {b.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{b.name}</h4>
                    <p className="text-[10px] text-gray-500">{b.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white block">{fmt(b.clickCount || 0)}</span>
                    <span className="text-[10px] text-gray-500 block">clicks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#0F1117] border border-white/[0.06] p-5 rounded-xl">
          <h4 className="text-sm font-semibold text-white mb-3">Quick Navigation Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => { setActiveTab("coupons"); setAddingCoupon(true); }}
              className="bg-violet-600/10 border border-violet-500/20 text-violet-300 rounded-xl p-4 hover:bg-violet-600/20 hover:border-violet-500/40 text-left transition flex flex-col justify-between h-24"
            >
              <div className="bg-violet-500/10 text-violet-400 p-2 rounded-lg w-fit"><Tag className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-white">+ Add New Coupon</span>
            </button>
            <button
              onClick={() => { setActiveTab("brands"); setAddingBrand(true); }}
              className="bg-blue-600/10 border border-blue-500/20 text-blue-300 rounded-xl p-4 hover:bg-blue-600/20 hover:border-blue-500/40 text-left transition flex flex-col justify-between h-24"
            >
              <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg w-fit"><Store className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-white">+ Add Partner Brand</span>
            </button>
            <button
              onClick={() => setActiveTab("moderation")}
              className="bg-amber-600/10 border border-amber-500/20 text-amber-300 rounded-xl p-4 hover:bg-amber-600/20 hover:border-amber-500/40 text-left transition flex flex-col justify-between h-24"
            >
              <div className="bg-amber-500/10 text-amber-400 p-2 rounded-lg w-fit"><Clock className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-white">Review Submissions</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 hover:bg-emerald-600/20 hover:border-emerald-500/40 text-left transition flex flex-col justify-between h-24"
            >
              <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg w-fit"><TrendingUp className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-white">View Full Analytics</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 2: COUPONS MANAGEMENT CATALOGUE
  // ==========================================
  const [couponSearch, setCouponSearch] = useState("");
  const [couponStatusTab, setCouponStatusTab] = useState<"ALL" | "ACTIVE" | "PENDING" | "EXPIRED" | "REJECTED">("ALL");
  const [couponBrandFilter, setCouponBrandFilter] = useState("");
  const [couponSelected, setCouponSelected] = useState<Set<string>>(new Set());
  const [addingCoupon, setAddingCoupon] = useState(false);
  
  // Filtering Logic
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        (c.code || "").toLowerCase().includes(couponSearch.toLowerCase()) ||
        (c.title || "").toLowerCase().includes(couponSearch.toLowerCase()) ||
        (c.brand?.name || "").toLowerCase().includes(couponSearch.toLowerCase());
      
      const matchStatus = couponStatusTab === "ALL" || c.status === couponStatusTab;
      
      const matchBrand = !couponBrandFilter || c.brandId === couponBrandFilter;

      return matchSearch && matchStatus && matchBrand;
    });
  }, [coupons, couponSearch, couponStatusTab, couponBrandFilter]);

  // Checkbox interactions
  const handleToggleSelectRow = (id: string) => {
    const next = new Set(couponSelected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCouponSelected(next);
  };

  const handleToggleSelectAll = () => {
    if (couponSelected.size === filteredCoupons.length) {
      setCouponSelected(new Set());
    } else {
      setCouponSelected(new Set(filteredCoupons.map((c) => c.id)));
    }
  };

  // Bulk status / delete action
  const handleBulkExpire = () => {
    setCoupons((prev) =>
      prev.map((c) => (couponSelected.has(c.id) ? { ...c, status: "EXPIRED" } : c))
    );
    setCouponSelected(new Set());
  };

  const handleBulkDelete = () => {
    setConfirmDelete({
      isOpen: true,
      type: "bulk_coupon",
      title: "Confirm Bulk Delete",
      message: `Are you sure you want to permanently delete these ${couponSelected.size} selected coupons? This action cannot be undone.`
    });
  };

  const handleDeleteCoupon = (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    const codeName = coupon ? `"${coupon.code || coupon.title}"` : "this coupon";
    setConfirmDelete({
      isOpen: true,
      type: "coupon",
      id,
      title: "Confirm Delete Coupon",
      message: `Are you sure you want to permanently delete ${codeName}? This action cannot be undone.`
    });
  };

  const renderCoupons = () => {
    return (
      <div className="space-y-5" id="admin-view-coupons">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1117] border border-white/[0.06] p-4 rounded-xl">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="flex items-center gap-2 bg-[#050608] border border-white/[0.08] px-3 py-2 rounded-lg text-xs tracking-wide text-gray-300 w-52 focus-within:border-violet-600/60 transition">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search code or store..."
                className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
              />
            </div>

            <select
              className="bg-[#050608] border border-white/[0.08] px-3 py-2 rounded-lg text-xs text-gray-300 outline-none hover:border-white/10"
              value={couponBrandFilter}
              onChange={(e) => setCouponBrandFilter(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {couponSelected.size > 0 && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <span className="text-xs text-gray-400 font-medium">{couponSelected.size} selected</span>
                <button
                  onClick={handleBulkExpire}
                  className="bg-amber-600/10 border border-amber-500/20 text-amber-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-500 hover:text-black transition flex items-center gap-1"
                >
                  Mark Expired
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600/15 border border-red-500/20 text-red-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500 hover:text-white transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setAddingCoupon(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 tracking-wide font-medium shadow-lg shadow-violet-600/15"
          >
            <Plus className="w-4 h-4" /> Add Coupon
          </button>
        </div>

        {/* Status Tab Filter Bar */}
        <div className="flex border-b border-white/[0.06] overflow-x-auto gap-2">
          {(["ALL", "ACTIVE", "PENDING", "EXPIRED", "REJECTED"] as const).map((tab) => {
            const count = tab === "ALL" ? coupons.length : coupons.filter((c) => c.status === tab).length;
            const isActive = couponStatusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setCouponStatusTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition shrink-0 ${
                  isActive
                    ? "border-violet-600 text-white bg-white/[0.02]"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]"
                }`}
              >
                {tab} <span className="ml-1 text-[10px] text-gray-500 font-bold bg-white/5 px-1.5 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Coupons Table */}
        <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-350">
              <thead>
                <tr className="border-b border-white/[0.06] text-gray-400 font-bold uppercase tracking-wider bg-white/[0.01]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-white/20 bg-transparent text-violet-600 focus:ring-0 focus:ring-offset-0 cursor-pointer w-4 h-4"
                      checked={filteredCoupons.length > 0 && couponSelected.size === filteredCoupons.length}
                      onChange={handleToggleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 text-[11px]">Brand / Code</th>
                  <th className="py-3 px-4 text-[11px]">Title</th>
                  <th className="py-3 px-4 text-[11px]">Type Badge</th>
                  <th className="py-3 px-4 text-[11px]">Status</th>
                  <th className="py-3 px-4 text-[11px]">Expires At</th>
                  <th className="py-3 px-4 text-[11px]">Success Rate</th>
                  <th className="py-3 px-4 text-right text-[11px]">Clicks</th>
                  <th className="py-3 px-4 text-right text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500 font-medium">
                      <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No coupons found matching filters or searches.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => {
                    const rowSelected = couponSelected.has(c.id);
                    const expiry = getExpiryInfo(c.expiresAt);

                    return (
                      <tr
                        key={c.id}
                        className={`hover:bg-white/[0.02] group transition-colors ${
                          rowSelected ? "bg-violet-600/[0.02] border-l-2 border-l-violet-600" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            className="rounded border-white/20 bg-transparent text-violet-600 focus:ring-0 cursor-pointer w-4 h-4"
                            checked={rowSelected}
                            onChange={() => handleToggleSelectRow(c.id)}
                          />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold">
                          <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 bg-white/5 border border-white/10 rounded overflow-hidden shrink-0">
                              {c.brand.logoUrl && (
                                <img
                                  src={c.brand.logoUrl}
                                  alt=""
                                  className="w-full h-full object-contain"
                                  onError={(e) => handleLogoError(e, c.brand.name)}
                                />
                              )}
                              <div className="logo-fallback hidden absolute inset-0 bg-violet-600/20 text-violet-300 font-extrabold text-[10px] items-center justify-center">
                                {c.brand.name.charAt(0)}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <span className="text-gray-300 text-xs block truncate">{c.brand.name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <code className="text-violet-400 font-mono text-[10px] bg-violet-500/10 px-1 rounded">
                                  {c.code}
                                </code>
                                {c.isFeatured && (
                                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded">
                                    Featured ⭐
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white max-w-[160px] truncate">{c.title}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block text-[10px] text-violet-300 bg-violet-500/15 border border-violet-500/20 px-2 py-0.5 rounded font-bold font-mono">
                            {getTypeLabel(c.type, c.discountValue)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full border ${
                            c.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : c.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : c.status === "EXPIRED"
                              ? "bg-gray-500/10 text-gray-400 border-gray-500/25"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 text-[11px] font-mono font-medium ${expiry.className}`}>
                          {expiry.text}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  c.successRate >= 75 ? "bg-emerald-500" : c.successRate >= 50 ? "bg-amber-500" : "bg-red-500"
                                }`}
                                style={{ width: `${c.successRate}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 font-bold">{c.successRate}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-gray-300 font-medium">
                          {fmt(c.clickCount)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 md:opacity-0 group-hover:opacity-100 transition duration-200">
                            <button
                              onClick={() => {
                                handleToggleFeatured(c.id);
                              }}
                              title="Toggle featured state"
                              className="p-1 px-1.5 hover:bg-white/15 h-7 rounded text-[10px] border border-white/5 hover:border-white/20 transition text-gray-400 hover:text-amber-400 flex items-center font-bold"
                            >
                              ⭐
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="p-1.5 hover:bg-red-600/10 rounded transition text-gray-500 hover:text-red-400 border border-transparent hover:border-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/[0.06] text-[11px] text-gray-500 flex items-center justify-between">
            <div>
              Showing {filteredCoupons.length} of {coupons.length} total coupons cataloged.
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1 px-2 hover:bg-white/5 rounded text-gray-400 hover:text-white border border-white/5 transition font-semibold text-[10px]">
                Previous
              </button>
              <button className="p-1 px-2.5 bg-violet-600 rounded text-white border border-violet-500/20 font-bold text-[10px]">
                1
              </button>
              <button className="p-1 px-2 hover:bg-white/5 rounded text-gray-400 hover:text-white border border-white/5 transition font-semibold text-[10px]">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleToggleFeatured = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isFeatured: !c.isFeatured } : c)));
  };

  // ==========================================
  // PAGE 3: BRANDS MANAGEMENT GRID
  // ==========================================
  const [brandSearch, setBrandSearch] = useState("");
  const [brandCatFilter, setBrandCatFilter] = useState("");
  const [addingBrand, setAddingBrand] = useState(false);

  const brandCategories = useMemo(() => {
    const list = new Set(brands.map((b) => b.category));
    return Array.from(list);
  }, [brands]);

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchSearch =
        (b.name || "").toLowerCase().includes(brandSearch.toLowerCase()) ||
        (b.domain || "").toLowerCase().includes(brandSearch.toLowerCase());
      
      const matchCat = !brandCatFilter || b.category === brandCatFilter;

      return matchSearch && matchCat;
    });
  }, [brands, brandSearch, brandCatFilter]);

  const handleDeleteBrand = (id: string) => {
    const brand = brands.find((b) => b.id === id);
    const brandName = brand ? `"${brand.name}"` : "this brand partner";
    setConfirmDelete({
      isOpen: true,
      type: "brand",
      id,
      title: "Confirm Delete Brand Partner",
      message: `Are you sure you want to permanently delete the partner brand ${brandName}? Deleting this brand will also permanently delete all associated active or scheduled coupons.`
    });
  };

  const renderBrands = () => {
    return (
      <div className="space-y-5" id="admin-view-brands">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1117] border border-white/[0.06] p-4 rounded-xl">
          <div className="flex flex-wrap items-center gap-3 flex-1 col-span-3">
            <div className="flex items-center gap-2 bg-[#050608] border border-white/[0.08] px-3 py-2 rounded-lg text-xs text-gray-300 w-52 focus-within:border-violet-600/60 transition">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search brands or domains..."
                className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>

            <select
              className="bg-[#050608] border border-white/[0.08] px-3 py-2 rounded-lg text-xs text-gray-300 outline-none hover:border-white/10"
              value={brandCatFilter}
              onChange={(e) => setBrandCatFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {brandCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setAddingBrand(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 tracking-wide shadow-lg shadow-blue-600/15"
          >
            <Plus className="w-4 h-4" /> Add Brand
          </button>
        </div>

        {/* Brand Card Grid */}
        {filteredBrands.length === 0 ? (
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl py-16 text-center text-gray-500 font-medium">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No brand entities found matching filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((b) => {
              const brandCouponsCount = coupons.filter((c) => c.brandId === b.id).length;
              const brandClicks = coupons
                .filter((c) => c.brandId === b.id)
                .reduce((sum, c) => sum + (c.clickCount || 0), 0);

              return (
                <div
                  key={b.id}
                  className="bg-[#0F1117] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 transition duration-200 group relative flex flex-col justify-between"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                          {b.logoUrl && (
                            <img
                              src={b.logoUrl}
                              alt=""
                              className="w-full h-full object-contain"
                              onError={(e) => handleLogoError(e, b.name)}
                            />
                          )}
                          <div className="logo-fallback hidden absolute inset-0 bg-blue-600/20 text-blue-300 font-bold text-sm items-center justify-center">
                            {b.name.charAt(0)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{b.name}</h4>
                          <a
                            href={`https://${b.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-gray-500 hover:text-violet-400 flex items-center gap-1 transition"
                          >
                            <Globe className="w-2.5 h-2.5 shrink-0" />
                            {b.domain}
                          </a>
                        </div>
                      </div>

                      <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold">
                        {b.category}
                      </span>
                    </div>

                    {/* Stats Box */}
                    <div className="grid grid-cols-2 gap-2 bg-[#050608]/40 border border-white/[0.03] rounded-lg px-3 py-2 mt-4 text-[11px] text-gray-400">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-semibold">Active Coupons</div>
                        <div className="font-mono text-white text-xs font-bold">{brandCouponsCount}</div>
                      </div>
                      <div className="border-l border-white/[0.04] pl-3">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-semibold">Accumulated Clicks</div>
                        <div className="font-mono text-white text-xs font-bold">{fmt(brandClicks || b.clickCount || 0)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="border-t border-white/[0.04] pt-3 mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${b.isActive ? "bg-emerald-500" : "bg-gray-500"}`} />
                      <span className="text-[11px] text-gray-400 font-medium">
                        {b.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setNewCouponBrand(b.id);
                          setAddingCoupon(true);
                        }}
                        className="text-[10px] font-bold text-violet-400 hover:text-violet-300 pointer-events-auto shrink-0 transition"
                      >
                        + Add Coupon
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(b.id)}
                        className="text-[10px] font-bold text-red-400/80 hover:text-red-400 border-l border-white/10 pl-2 shrink-0 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // PAGE 4: MODERATION QUEUE
  // ==========================================
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApproveSubmission = (item: Coupon) => {
    // 1. Change status to ACTIVE in main coupon list
    setCoupons((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, status: "ACTIVE", verifiedAt: new Date().toISOString() } : c))
    );
    // 2. Remove from queue list
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
  };

  const handleMergeVerifySubmission = (item: Coupon, originalCouponId: string) => {
    // Find already active coupon and increment actions
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === originalCouponId) {
          return {
            ...c,
            useCount: c.useCount + 1,
            verifiedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
    // Delete duplicate submission model and omit from queue
    setCoupons((prev) => prev.filter((c) => c.id !== item.id));
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
  };

  const handleOpenReject = (id: string) => {
    setRejectId(id);
    setRejectReason("");
  };

  const handleConfirmReject = () => {
    if (!rejectId) return;
    // 1. Set status as REJECTED in catalog list
    setCoupons((prev) =>
      prev.map((c) => (c.id === rejectId ? { ...c, status: "REJECTED" } : c))
    );
    // 2. Remove from active queue
    setQueue((prev) => prev.filter((q) => q.id !== rejectId));
    setRejectId(null);
  };

  const renderModeration = () => {
    return (
      <div className="space-y-5" id="admin-view-moderation">
        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-200">
          <div className="flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-white">Verification Moderation Policy</p>
              <p className="mt-1 opacity-80">
                Review coupon promo submissions. Codes approved go live immediately. Duplicate entries can be merged & verified statefully.
              </p>
            </div>
          </div>
        </div>

        {/* Empty status check */}
        {queue.length === 0 ? (
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl py-16 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-full" />
            <p className="font-bold text-white text-sm">Moderation Queue is Clean</p>
            <p className="text-xs text-gray-500 mt-1">All user-submitted codes have been processed. Excellent job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((item) => {
              // Custom duplicate check - check if a coupon with the SAME code on the SAME brand is already ACTIVE
              const duplicateCoupon = coupons.find(
                (c) => c.brandId === item.brandId && c.code === item.code && c.id !== item.id && c.status === "ACTIVE"
              );

              const submitterKarma = (item.submittedBy === "u_abc" ? 142 : item.submittedBy === "u_123" ? 540 : 25);
              const karmaLabel = submitterKarma >= 500 ? "Expert" : submitterKarma >= 100 ? "Member" : "Newbie";
              const karmaColor = submitterKarma >= 500 ? "text-violet-400 bg-violet-500/10" : submitterKarma >= 100 ? "text-blue-400 bg-blue-500/10" : "text-gray-400 bg-white/5";

              return (
                <div
                  key={item.id}
                  className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-4 p-5 space-y-4 relative"
                >
                  {/* Duplicate Status Pill */}
                  {duplicateCoupon && (
                    <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded-full text-[10px] animate-pulse">
                      ⚠️ Duplicate Entry Found
                    </div>
                  )}

                  {/* Section 1: Submitter Info */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center font-bold text-white text-xs">
                        {item.submittedBy === "u_abc" ? "S" : item.submittedBy === "u_123" ? "M" : "U"}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {item.submittedBy === "u_abc" ? "Sarah K." : item.submittedBy === "u_123" ? "Minh T." : `User ${item.submittedBy}`}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <span>{item.submittedBy === "u_abc" ? "sarah@example.com" : "minh@example.com"}</span>
                          <span>•</span>
                          <span className={`px-1 rounded text-[9px] font-bold uppercase ${karmaColor}`}>
                            {karmaLabel} ({submitterKarma} Karma)
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 shrink-0 font-medium">
                      Sub: {timeAgo(item.createdAt)}
                    </span>
                  </div>

                  {/* Section 2: Coupon Details card block */}
                  <div className="bg-[#050608]/50 border border-white/[0.04] rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 bg-white/5 border border-white/10 rounded flex items-center justify-center overflow-hidden shrink-0">
                        {item.brand.logoUrl && (
                          <img
                            src={item.brand.logoUrl}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => handleLogoError(e, item.brand.name)}
                          />
                        )}
                        <div className="logo-fallback hidden absolute inset-0 bg-violet-600/20 text-violet-300 font-extrabold text-xs items-center justify-center">
                          {item.brand.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{item.brand.name}</span>
                          <span className="text-[10px] text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded font-bold uppercase">
                            {getTypeLabel(item.type, item.discountValue)}
                          </span>
                        </div>
                        <p className="text-gray-300 font-medium text-xs mt-1">{item.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <code className="text-violet-400 font-mono text-xs bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded font-bold tracking-wider">
                        {item.code}
                      </code>
                      <span className="text-[11px] text-gray-500 font-medium font-mono">
                        Exp: {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "No Expiry"}
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Interactive moderation actions */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.04] pt-3">
                    {duplicateCoupon ? (
                      <button
                        onClick={() => handleMergeVerifySubmission(item, duplicateCoupon.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-md shadow-blue-500/10"
                      >
                        <Check className="w-3.5 h-3.5" /> Merge & Verify Submitter
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveSubmission(item)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-md shadow-emerald-500/10"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Code
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenReject(item.id)}
                      className="bg-red-600/10 border border-red-550/20 text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-bold transition hover:bg-red-600 hover:text-white"
                    >
                      Reject Submission
                    </button>

                    {/* Quick Rejection Form */}
                    {rejectId === item.id && (
                      <div className="w-full mt-3 bg-red-500/5 border border-red-500/10 p-3 rounded-lg space-y-2">
                        <label className="block text-[11px] uppercase tracking-wider text-red-400 font-bold">
                          Reason for Rejection *
                        </label>
                        <textarea
                          placeholder="e.g. This code is expired, invalid, or already exists in our database."
                          className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white outline-none focus:border-red-500/30 font-medium"
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleConfirmReject}
                            className="bg-red-600 text-white font-bold p-1 px-3 rounded text-[10px] hover:bg-red-500"
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => setRejectId(null)}
                            className="text-gray-400 font-semibold p-1 px-3 rounded text-[10px] hover:bg-white/5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // PAGE 5: ANALYTICS
  // ==========================================
  const [analyticsRange, setAnalyticsRange] = useState<"7d" | "30d" | "90d">("30d");
  const [activeHoverBar, setActiveHoverBar] = useState<number | null>(null);

  // Time-series mock definitions
  const daysList = ["Jun 8", "Jun 9", "Jun 10", "Jun 11", "Jun 12", "Jun 13", "Jun 14", "Jun 15", "Jun 16"];
  const clicksList = [920, 1080, 890, 1340, 1220, 1680, 1530, 1910, 1832];
  const maxClick = Math.max(...clicksList);

  const renderAnalytics = () => {
    return (
      <div className="space-y-6" id="admin-view-analytics">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Historical Traffic Metrics</h3>
          <div className="bg-[#0F1117] border border-white/[0.08] p-1 rounded-lg flex items-center shrink-0">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAnalyticsRange(r)}
                className={`px-3 py-1 text-xs rounded transition-all font-semibold ${
                  analyticsRange === r
                    ? "bg-white/[0.08] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sparkline SVG Stat Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <SparklineCard
            label="clicks (30 days)"
            value="47,209"
            trend="+12%"
            lineColor="#8B5CF6"
            points="5,23 15,18 25,25 35,16 45,19 55,10 65,14 75,5 80,7"
          />
          <SparklineCard
            label="Est. revenue"
            value="$2,140"
            trend="+8%"
            lineColor="#10B981"
            points="5,25 15,22 25,24 35,18 45,21 55,14 65,11 75,7 80,8"
          />
          <SparklineCard
            label="active coupons"
            value="893"
            trend="+4%"
            lineColor="#3B82F6"
            points="5,20 15,19 25,18 35,18 45,17 55,15 65,16 75,14 80,14"
          />
          <SparklineCard
            label="Conversion rate"
            value="3.4%"
            isNeg
            trend="-1%"
            lineColor="#EF4444"
            points="5,10 15,12 25,11 35,14 45,13 55,18 65,15 75,22 80,21"
          />
        </div>

        {/* Analytics Charts and Layout grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SVG Bar Chart */}
          <div className="lg:col-span-2 bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 select-none relative">
            <h4 className="font-semibold text-white text-sm mb-1">Daily Clicks — June 2026</h4>
            <p className="text-[10px] text-gray-500 mb-6">Interactive click analysis per tracked active domain promotion.</p>

            {/* SVG custom bar graph */}
            <div className="relative h-32 flex items-end justify-between px-2 gap-2 mt-4">
              {clicksList.map((val, idx) => {
                const pct = (val / maxClick) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end h-full relative"
                    onMouseEnter={() => setActiveHoverBar(idx)}
                    onMouseLeave={() => setActiveHoverBar(null)}
                  >
                    {/* Floating Tooltip wrapper */}
                    {activeHoverBar === idx && (
                      <div className="absolute -top-12 bg-gray-950 border border-white/15 px-2 py-1 rounded text-[10px] text-white z-25 whitespace-nowrap shadow-xl">
                        <span className="font-bold font-mono block">{val.toLocaleString()} clicks</span>
                        <span className="text-[8px] text-gray-500 block">{daysList[idx]}, 2026</span>
                      </div>
                    )}
                    {/* The bar visual block hook */}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        activeHoverBar === idx ? "bg-violet-500" : "bg-violet-600/75"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                    <span className="text-[10px] text-gray-600 font-semibold mt-3 font-mono hover:text-gray-300">
                      {daysList[idx].split(" ")[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traffic Source Horizontals */}
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 space-y-4">
            <div>
              <h4 className="font-semibold text-white text-sm">Traffic Acquisition Channels</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Where clicks originate from.</p>
            </div>

            <div className="space-y-3 pt-2">
              <AcquisitionProgress label="Organic Search" pct={60} val="28,400" color="bg-violet-500" />
              <AcquisitionProgress label="Direct Access" pct={22} val="10,600" color="bg-blue-500" />
              <AcquisitionProgress label="Partner Referral" pct={12} val="5,800" color="bg-emerald-500" />
              <AcquisitionProgress label="Social Campaigns" pct={5} val="2,400" color="bg-amber-500" />
            </div>

            <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between text-[10px] text-gray-500 font-bold">
              <span>ACTIVE AD-UTM ATTRIBUTION</span>
              <span className="text-white">CVR: 3.4%</span>
            </div>
          </div>
        </div>

        {/* Affiliate Revenue Breakdown Networks */}
        <div className="bg-[#0F1117] border border-white/[0.06] p-5 rounded-xl space-y-4.5">
          <div>
            <h4 className="text-sm font-semibold text-white">Affiliate Revenue Network Stats</h4>
            <p className="text-[10px] text-gray-500">Commissions accrued dynamically from registered affiliate engines.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <RevenueNetworkCard name="CJ Affiliate" rev={910} clicks={22100} conv={3.8} />
            <RevenueNetworkCard name="ShareASale" rev={640} clicks={11570} conv={3.2} />
            <RevenueNetworkCard name="Impact Network" rev={430} clicks={8190} conv={2.9} />
            <RevenueNetworkCard name="Direct Store Aff." rev={160} clicks={5349} conv={1.8} />
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // MODAL: QUICK ADD COUPON (2-Step AI Simulation)
  // ==========================================
  const [url, setUrl] = useState("");
  const [aiDetectState, setAiDetectState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [detectedBrand, setDetectedBrand] = useState<Brand | null>(null);
  const [quickAddStep, setQuickAddStep] = useState(1);

  // Quick addition fields
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponType, setNewCouponType] = useState<"PERCENT" | "FIXED" | "FREE_SHIPPING" | "BOGO">("PERCENT");
  const [newCouponVal, setNewCouponVal] = useState<number | "">("");
  const [newCouponExp, setNewCouponExp] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponFeatured, setNewCouponFeatured] = useState(false);
  const [newCouponBrand, setNewCouponBrand] = useState("");

  const handleSimulateAIDetect = () => {
    if (!url) return;
    setAiDetectState("loading");

    // Simulate response delay
    setTimeout(() => {
      const canonical = url.toLowerCase();
      let matched: Brand | null = null;

      if (canonical.includes("nike")) matched = brands.find((b) => b.id === "1") || null;
      else if (canonical.includes("adidas")) matched = brands.find((b) => b.id === "2") || null;
      else if (canonical.includes("udemy")) matched = brands.find((b) => b.id === "3") || null;
      else if (canonical.includes("sephora")) matched = brands.find((b) => b.id === "4") || null;
      else if (canonical.includes("booking")) {
        // Fallback or find
        matched = brands.find((b) => b.id === "3") || null; // demo fallback or create
      }

      if (matched) {
        setDetectedBrand(matched);
        setNewCouponBrand(matched.id);
        setAiDetectState("done");
        setQuickAddStep(2);
      } else {
        // Generic brand parsing
        try {
          const cleanHost = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0].split(":")[0];
          if (cleanHost.includes(".")) {
            const domainOnly = cleanHost;
            const nameCapitalized = cleanHost.split(".")[0].charAt(0).toUpperCase() + cleanHost.split(".")[0].slice(1);
            
            const generatedBrand: Brand = {
              id: String(brands.length + 1),
              name: nameCapitalized,
              slug: nameCapitalized.toLowerCase(),
              domain: domainOnly,
              logoUrl: `https://img.logo.dev/${domainOnly}?token=pk_test_placeholder`,
              affiliateUrl: url,
              category: "Other",
              description: `Community-submitted portal for ${nameCapitalized}.`,
              couponCount: 1,
              clickCount: 0,
              bestDiscount: 0,
              avgSuccess: 0,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            // Register this generated brand
            setBrands((prev) => [...prev, generatedBrand]);
            setDetectedBrand(generatedBrand);
            setNewCouponBrand(generatedBrand.id);
            setAiDetectState("done");
            setQuickAddStep(2);
          } else {
            setAiDetectState("error");
          }
        } catch {
          setAiDetectState("error");
        }
      }
    }, 1400);
  };

  const [savingCoupon, setSavingCoupon] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveCoupon = () => {
    if (!newCouponCode || !newCouponTitle || !newCouponBrand) return;
    setSavingCoupon(true);

    setTimeout(() => {
      const activeBrand = brands.find((b) => b.id === newCouponBrand);
      if (!activeBrand) {
        setSavingCoupon(false);
        return;
      }

      const generated: Coupon = {
        id: String(coupons.length + 1),
        brandId: newCouponBrand,
        brand: {
          id: activeBrand.id,
          name: activeBrand.name,
          slug: activeBrand.slug,
          logoUrl: activeBrand.logoUrl,
          domain: activeBrand.domain
        },
        code: newCouponCode.toUpperCase(),
        title: newCouponTitle,
        description: newCouponDesc || null,
        type: newCouponType,
        discountValue: newCouponVal === "" ? null : Number(newCouponVal),
        affiliateUrl: url || activeBrand.affiliateUrl || "",
        status: "ACTIVE",
        expiresAt: newCouponExp ? new Date(newCouponExp).toISOString() : null,
        successRate: 100,
        clickCount: 0,
        useCount: 0,
        upvotes: 0,
        downvotes: 0,
        isFeatured: newCouponFeatured,
        submittedBy: "ADMIN",
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCoupons((prev) => [generated, ...prev]);
      setSavingCoupon(false);
      setSaveSuccess(true);

      // Auto clear and close step modal
      setTimeout(() => {
        setAddingCoupon(false);
        setSaveSuccess(false);
        setUrl("");
        setNewCouponCode("");
        setNewCouponTitle("");
        setNewCouponVal("");
        setNewCouponExp("");
        setNewCouponDesc("");
        setNewCouponFeatured(false);
        setQuickAddStep(1);
        setAiDetectState("idle");
      }, 900);
    }, 850);
  };

  // ==========================================
  // MODAL: ADD BRAND (with Live logo preview)
  // ==========================================
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDomain, setNewBrandDomain] = useState("");
  const [newBrandAffURL, setNewBrandAffURL] = useState("");
  const [newBrandCat, setNewBrandCat] = useState("Fashion");
  const [newBrandDesc, setNewBrandDesc] = useState("");
  const [savingBrand, setSavingBrand] = useState(false);

  const handleCreateBrand = () => {
    if (!newBrandName || !newBrandDomain) return;
    setSavingBrand(true);

    setTimeout(() => {
      const generatedBrand: Brand = {
        id: String(brands.length + 1),
        name: newBrandName,
        slug: newBrandName.toLowerCase().replace(/[^a-z0-0]/g, ""),
        domain: newBrandDomain.toLowerCase().trim(),
        logoUrl: `https://img.logo.dev/${newBrandDomain.toLowerCase().trim()}?token=pk_test_placeholder`,
        affiliateUrl: newBrandAffURL || `https://${newBrandDomain}`,
        category: newBrandCat,
        description: newBrandDesc || undefined,
        couponCount: 0,
        clickCount: 0,
        bestDiscount: 0,
        avgSuccess: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setBrands((prev) => [generatedBrand, ...prev]);
      setSavingBrand(false);
      setAddingBrand(false);

      // Clear field
      setNewBrandName("");
      setNewBrandDomain("");
      setNewBrandAffURL("");
      setNewBrandCat("Fashion");
      setNewBrandDesc("");
    }, 700);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080B10] text-[#E2E8F0] flex flex-col justify-center items-center p-4 selection:bg-violet-600/30 font-sans relative overflow-hidden w-full h-full min-w-0">
        {/* Decorative background glow elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0F1117] border border-white/[0.06] rounded-2xl p-8 shadow-2xl relative z-10 transition animate-fade-in">
          {/* Logo brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-violet-600 p-3 rounded-2xl text-white shadow-lg shadow-violet-600/35 mb-3 flex items-center justify-center animate-bounce">
              <Sparkles className="w-6 h-6 shrink-0" />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> DealHunter Portal
            </h1>
            <p className="text-gray-400 text-xs mt-1.5">
              Cổng xác thực quản trị hệ thống Coupon & Deals
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block">
                Tài khoản
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nhập tài khoản (admin)"
                  disabled={isAuthenticating}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#050608] border border-white/[0.08] focus:border-violet-500/55 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block flex items-center justify-between">
                Mật khẩu
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu (admin123)"
                  disabled={isAuthenticating}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#050608] border border-white/[0.08] focus:border-violet-500/55 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 select-none">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="rounded border-white/20 bg-transparent text-violet-600 focus:ring-0 focus:ring-offset-0 cursor-pointer w-4 h-4"
                />
                <span>Duy trì đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/45 disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Đang xác thực bảo mật...</span>
                </>
              ) : (
                <span>Đăng Nhập Quản Trị Viên</span>
              )}
            </button>
          </form>

          {/* Quick info credentials */}
          <div className="border-t border-white/[0.04] mt-6 pt-4 text-center">
            <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1.5 uppercase font-medium tracking-wider">
              💡 Gợi ý tài khoản kiểm thử
            </p>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2 mt-2 inline-flex flex-col gap-1 text-[11px] text-left">
              <p className="text-gray-400 font-medium">Account: <span className="font-mono text-violet-400 font-semibold select-all bg-white/[0.04] px-1 rounded">admin</span></p>
              <p className="text-gray-400 font-medium font-vietnamese mt-1">Password: <span className="font-mono text-violet-400 font-semibold select-all bg-white/[0.04] px-1 rounded">admin123</span></p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 mt-6 font-medium uppercase tracking-wide">
          © 2026 DealHunter System. All rights reserved.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
      className="bg-[#080B10] text-[#E2E8F0] min-h-screen flex text-sm overflow-hidden select-text antialiased"
    >
      {/* Dynamic Collapsible Sidebar Layout */}
      <aside
        id="admin-sidebar"
        className={`flex flex-col bg-[#0F1117] border-r border-white/[0.06] transition-all duration-200 shrink-0 relative ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Sidebar Header Block */}
        <div className={`p-4 flex items-center gap-3 border-b border-white/[0.05] h-14 shrink-0 ${
          sidebarCollapsed ? "justify-center px-2" : ""
        }`}>
          <div className="bg-violet-600 p-1.5 rounded-lg text-white">
            <Sparkles className="w-4 h-4 shrink-0" />
          </div>
          {!sidebarCollapsed && <span className="font-extrabold text-white text-sm tracking-wide">DealHunter Admin</span>}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
          <SidebarNavBtn
            label="Dashboard"
            icon={<BarChart2 className="w-4 h-4 shrink-0" />}
            active={activeTab === "dashboard"}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarNavBtn
            label="Coupons Catalog"
            icon={<Tag className="w-4 h-4 shrink-0" />}
            active={activeTab === "coupons"}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab("coupons")}
          />
          <SidebarNavBtn
            label="Partner Brands"
            icon={<Store className="w-4 h-4 shrink-0" />}
            active={activeTab === "brands"}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab("brands")}
          />
          <SidebarNavBtn
            label="Moderation Queue"
            icon={<Inbox className="w-4 h-4 shrink-0" />}
            active={activeTab === "moderation"}
            collapsed={sidebarCollapsed}
            pendingBadge={pendingCount}
            onClick={() => setActiveTab("moderation")}
          />
          <SidebarNavBtn
            label="Performance"
            icon={<PieChart className="w-4 h-4 shrink-0" />}
            active={activeTab === "analytics"}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab("analytics")}
          />
        </nav>

        {/* Collapse toggle arrow */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute right-[-11px] top-4.5 bg-gray-900 border border-white/10 rounded-full w-5 h-5 flex items-center justify-center p-0 text-white shrink-0 hover:border-violet-500 z-30"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Sidebar Admin User Info at bottom */}
        <div className={`p-3 border-t border-white/[0.05] flex items-center justify-between gap-2 w-full ${
          sidebarCollapsed ? "flex-col justify-center px-1" : ""
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-violet-600/20 text-violet-400 font-bold rounded-full flex items-center justify-center text-xs shrink-0 select-none">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="font-semibold text-xs text-white block leading-tight truncate">Administrator</span>
                <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">Super User</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className={`p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/[0.04] transition-all shrink-0 ${
              sidebarCollapsed ? "mt-1" : ""
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Title and Topbar Banner indicators */}
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.05] h-14 bg-[#080B10] shrink-0 sticky top-0 z-10 select-none">
          <div>
            <h2 className="text-sm font-bold text-white capitalize flex items-center gap-2">
              🛠️ Portal / {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Fake Search indicator decoration */}
            <div className="hidden sm:flex items-center gap-2 bg-[#0F1117] border border-white/[0.08] px-2.5 py-1.5 rounded-lg text-xs text-gray-500 w-44">
              <Search className="w-3.5 h-3.5" />
              <span>Full search...</span>
            </div>

            {/* Bell Alert */}
            <button className="p-1 px-1.5 hover:bg-white/5 border border-transparent rounded-lg text-gray-400 hover:text-white transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-violet-500" />
            </button>
          </div>
        </header>

        {/* Scrollable Container Wrapper with safe spacing margins */}
        <main className="flex-1 p-6 relative">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "coupons" && renderCoupons()}
          {activeTab === "brands" && renderBrands()}
          {activeTab === "moderation" && renderModeration()}
          {activeTab === "analytics" && renderAnalytics()}
        </main>
      </div>

      {/* MODAL WINDOW: QUICK ADD COUPON AI */}
      {addingCoupon && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F1117] border border-white/[0.08] rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="h-14 border-b border-white/[0.05] px-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="font-bold text-white text-sm">Quick Add Coupon</span>
              </div>
              <button onClick={() => setAddingCoupon(false)} className="text-gray-500 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Content */}
            <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
              {/* Step indicator pills */}
              <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3 text-xs">
                <span className={`px-2.5 py-1 rounded font-bold ${quickAddStep === 1 ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400"}`}>
                  Step 1: AI Parse URL
                </span>
                <span className={`px-2.5 py-1 rounded font-bold ${quickAddStep === 2 ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400"}`}>
                  Step 2: Details & Confirm
                </span>
              </div>

              {quickAddStep === 1 && (
                <div className="space-y-3.5">
                  <div className="text-xs text-gray-400 font-medium">
                    Paste an affiliate Link. We will attempt to trace the domain name, matching brand category, and retrieve logos instantly. Try typing <code className="text-violet-400 font-mono">nike.com</code> or <code className="text-violet-400 font-mono">udemy.com</code>!
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Affiliate URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. https://www.udemy.com/sale"
                        className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none focus:border-violet-600 w-full font-medium"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <button
                        onClick={handleSimulateAIDetect}
                        disabled={!url || aiDetectState === "loading"}
                        className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition shrink-0 select-none block disabled:opacity-40"
                      >
                        {aiDetectState === "loading" ? "Scanning..." : "Scan & Trace"}
                      </button>
                    </div>
                  </div>

                  {aiDetectState === "loading" && (
                    <div className="bg-violet-600/5 border border-violet-500/10 rounded-xl p-4 text-center">
                      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span className="text-xs text-violet-400 font-semibold block">Detecting store metadata, logo assets, and categories...</span>
                    </div>
                  )}

                  {aiDetectState === "done" && detectedBrand && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block">Detected Brand : {detectedBrand.name}</span>
                          <span className="text-[10px] text-gray-500 block">Domain: {detectedBrand.domain} | Cat: {detectedBrand.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                        MATCHED ✓
                      </span>
                    </div>
                  )}

                  {aiDetectState === "error" && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3.5 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>Could not recognize brand automatically. Please ensure format includes dots (e.g. nike.com).</span>
                    </div>
                  )}
                </div>
              )}

              {quickAddStep === 2 && (
                <div className="space-y-4">
                  {detectedBrand && (
                    <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center overflow-hidden shrink-0">
                        {detectedBrand.logoUrl && (
                          <img
                            src={detectedBrand.logoUrl}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => handleLogoError(e, detectedBrand.name)}
                          />
                        )}
                        <div className="logo-fallback hidden absolute inset-0 bg-blue-600/20 text-blue-300 font-extrabold text-[10px] items-center justify-center">
                          {detectedBrand.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Campaign Brand Store: {detectedBrand.name}</span>
                        <span className="text-[10px] text-gray-500 block">Category: {detectedBrand.category}</span>
                      </div>
                    </div>
                  )}

                  <hr className="border-white/[0.04]" />

                  {/* Form fields */}
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Coupon Code *</label>
                        <input
                          type="text"
                          placeholder="e.g. GET20OFF"
                          className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none uppercase font-mono tracking-widest block w-full focus:border-violet-500 font-bold"
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Campaign title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Get 20% off all regular orders sitewide"
                          className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none block w-full focus:border-violet-500 font-medium"
                          value={newCouponTitle}
                          onChange={(e) => setNewCouponTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Discount Type</label>
                        <select
                          className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-gray-300 outline-none w-full focus:border-violet-500"
                          value={newCouponType}
                          onChange={(e) => setNewCouponType(e.target.value as any)}
                        >
                          <option value="PERCENT">Percent Off (%)</option>
                          <option value="FIXED">Fixed Amount ($)</option>
                          <option value="FREE_SHIPPING">Free Shipping</option>
                          <option value="BOGO">BOGO Deal</option>
                        </select>
                      </div>

                      {(newCouponType === "PERCENT" || newCouponType === "FIXED") && (
                        <div className="space-y-1.5">
                          <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Value</label>
                          <input
                            type="number"
                            placeholder="e.g. 20"
                            className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none block w-full focus:border-violet-500 font-medium"
                            value={newCouponVal}
                            onChange={(e) => setNewCouponVal(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </div>
                      )}

                      <div className="col-span-2 space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Expiration Date</label>
                        <input
                          type="date"
                          className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none block w-full focus:border-violet-500 font-medium"
                          value={newCouponExp}
                          onChange={(e) => setNewCouponExp(e.target.value)}
                        />
                      </div>

                      <div className="col-span-2 space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Brief Description</label>
                        <textarea
                          placeholder="Provide terms, conditions or exclusions..."
                          className="w-full bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white focus:border-violet-500 outline-none font-medium"
                          rows={2}
                          value={newCouponDesc}
                          onChange={(e) => setNewCouponDesc(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-semibold text-xs">
                      <input
                        type="checkbox"
                        id="featured-check"
                        className="rounded border-white/10 bg-transparent text-violet-600 focus:ring-0 cursor-pointer w-4 h-4"
                        checked={newCouponFeatured}
                        onChange={(e) => setNewCouponFeatured(e.target.checked)}
                      />
                      <label htmlFor="featured-check" className="text-gray-300 cursor-pointer select-none">
                        Promote and feature this campaign on store homepage
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer actions */}
            <div className="h-14 border-t border-white/[0.05] bg-white/[0.01] px-5 flex items-center justify-between">
              {quickAddStep === 2 ? (
                <button
                  onClick={() => setQuickAddStep(1)}
                  className="text-gray-400 hover:text-white font-bold text-xs p-2 transition outline-none"
                  disabled={savingCoupon || saveSuccess}
                >
                  Back to Step 1
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setAddingCoupon(false)}
                  className="text-gray-400 hover:text-white font-bold text-xs p-2.5 px-4 rounded-lg bg-transparent hover:bg-white/5 transition border border-transparent hover:border-white/10"
                  disabled={savingCoupon || saveSuccess}
                >
                  Cancel
                </button>

                {quickAddStep === 2 && (
                  <button
                    onClick={handleSaveCoupon}
                    disabled={!newCouponCode || !newCouponTitle || !newCouponBrand || savingCoupon || saveSuccess}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-lg select-none block ${
                      saveSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40"
                    }`}
                  >
                    {savingCoupon ? (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin block shrink-0" />
                    ) : saveSuccess ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : null}
                    {saveSuccess ? "Saved!" : "Save Coupon"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW: CREATE NEW BRAND */}
      {addingBrand && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F1117] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="h-14 border-b border-white/[0.05] px-5 flex items-center justify-between select-none">
              <span className="font-bold text-white text-sm">Add New Partner Brand</span>
              <button onClick={() => setAddingBrand(false)} className="text-gray-500 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body form */}
            <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Booking.com"
                    className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none w-full focus:border-violet-500 font-medium"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Domain Website *</label>
                  <input
                    type="text"
                    placeholder="e.g. booking.com"
                    className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none w-full focus:border-violet-500 font-medium font-mono"
                    value={newBrandDomain}
                    onChange={(e) => setNewBrandDomain(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Category</label>
                  <select
                    className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-gray-300 outline-none w-full focus:border-violet-500"
                    value={newBrandCat}
                    onChange={(e) => setNewBrandCat(e.target.value)}
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Travel">Travel</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Education">Education</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Software">Software</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Backup Affiliate Domain URL</label>
                  <input
                    type="text"
                    placeholder="e.g. https://booking.tp.st/..."
                    className="bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white outline-none w-full focus:border-violet-500 font-medium font-mono"
                    value={newBrandAffURL}
                    onChange={(e) => setNewBrandAffURL(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold">Description</label>
                  <textarea
                    placeholder="Brief details about store specialties..."
                    className="w-full bg-[#050608] border border-white/10 rounded-lg p-2 px-3 text-xs text-white focus:border-violet-500 outline-none font-medium"
                    rows={2}
                    value={newBrandDesc}
                    onChange={(e) => setNewBrandDesc(e.target.value)}
                  />
                </div>

                {/* Real-time logo preview fallback box */}
                {newBrandName && newBrandDomain.includes(".") && (
                  <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={`https://img.logo.dev/${newBrandDomain.toLowerCase().trim()}?token=pk_test_placeholder`}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => handleLogoError(e, newBrandName)}
                        />
                        <div className="logo-fallback hidden absolute inset-0 bg-blue-600/30 text-blue-300 font-bold text-xs items-center justify-center">
                          {newBrandName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-white block">{newBrandName} Preview</span>
                        <span className="text-[10px] text-gray-500 block font-mono">{newBrandDomain}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Auto-fetching</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer actions */}
            <div className="h-14 border-t border-white/[0.05] bg-white/[0.01] px-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setAddingBrand(false)}
                className="text-gray-400 hover:text-white font-bold text-xs p-2.5 px-4 rounded-lg bg-transparent hover:bg-white/5 transition border border-transparent hover:border-white/10"
                disabled={savingBrand}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBrand}
                disabled={!newBrandName || !newBrandDomain || savingBrand}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-500/15 font-bold outline-none disabled:opacity-40"
              >
                {savingBrand ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0 block" />
                ) : null}
                Save Brand Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE BRAND / COUPON / BULK */}
      {confirmDelete && confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F1117] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="h-14 border-b border-white/[0.05] px-5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold text-sm text-white">{confirmDelete.title}</span>
              </div>
              <button onClick={() => setConfirmDelete(null)} className="text-gray-500 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 text-xs text-gray-300 leading-relaxed">
              <p>{confirmDelete.message}</p>
            </div>

            {/* Footer */}
            <div className="h-14 border-t border-white/[0.05] bg-white/[0.01] px-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="text-gray-400 hover:text-white font-bold text-xs p-2.5 px-4 rounded-lg bg-transparent hover:bg-white/5 transition border border-transparent hover:border-white/10"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-500/15 font-bold outline-none"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPACT DUMB COMPONENTS & ASSISTANTS
// ==========================================

interface SidebarNavBtnProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  pendingBadge?: number;
  onClick: () => void;
}

function SidebarNavBtn({ label, icon, active, collapsed, pendingBadge, onClick }: SidebarNavBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs transition duration-150 outline-none border-l-2 select-none shrink-0 ${
        active
          ? "bg-violet-600/10 border-l-violet-500 text-violet-400 font-black"
          : "border-l-transparent text-gray-400 hover:text-white hover:bg-white/[0.03]"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <div className={`${active ? "text-violet-400" : "text-gray-500"}`}>{icon}</div>
      {!collapsed && <span className="flex-1 text-left font-semibold tracking-wide">{label}</span>}
      {!collapsed && pendingBadge !== undefined && pendingBadge > 0 && (
        <span className="bg-amber-500 text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-full min-w-4 text-center shrink-0">
          {pendingBadge}
        </span>
      )}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon?: React.ReactNode;
  accent: "violet" | "blue" | "green" | "amber";
  trend?: string;
}

function StatCard({ label, value, sub, icon, accent, trend }: StatCardProps) {
  const accentColors = {
    violet: "text-violet-400 bg-violet-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10"
  };

  return (
    <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.1] transition-all relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold block select-none">
            {label}
          </span>
          {icon && <div className={`p-2 rounded-lg shrink-0 ${accentColors[accent]}`}>{icon}</div>}
        </div>
        <div className="text-2xl font-black text-white tabular-nums">{value}</div>
        <span className="text-[11px] text-gray-500 block font-medium mt-1 select-none">{sub}</span>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 font-bold text-xs mt-3.5 text-emerald-400 font-mono select-none">
          <TrendingUp className="w-3 h-3 shrink-0" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

interface SparklineCardProps {
  label: string;
  value: string;
  trend: string;
  points: string;
  lineColor: string;
  isNeg?: boolean;
}

function SparklineCard({ label, value, trend, points, lineColor, isNeg }: SparklineCardProps) {
  return (
    <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-4.5 flex items-center justify-between">
      <div>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">{label}</span>
        <div className="text-xl font-bold text-white tracking-tight mt-1 tabular-nums">{value}</div>
        <span className={`text-[10px] font-bold tracking-wide mt-1.5 flex items-center gap-0.5 ${
          isNeg ? "text-red-400" : "text-emerald-400"
        }`}>
          {isNeg ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />} {trend}
        </span>
      </div>

      {/* SVG Sparkline Graph */}
      <div className="w-16 h-8 select-none">
        <svg viewBox="0 0 85 28" className="w-full h-full">
          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}

interface AcquisitionProgressProps {
  label: string;
  pct: number;
  val: string;
  color: string;
}

function AcquisitionProgress({ label, pct, val, color }: AcquisitionProgressProps) {
  return (
    <div className="space-y-1.5 text-xs text-gray-300">
      <div className="flex justify-between items-center text-[11px] font-medium leading-none">
        <span className="font-semibold text-white">{label}</span>
        <span className="font-mono text-gray-450 text-[10px]">{pct}% ({val})</span>
      </div>
      <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface RevenueNetworkCardProps {
  name: string;
  rev: number;
  clicks: number;
  conv: number;
}

function RevenueNetworkCard({ name, rev, clicks, conv }: RevenueNetworkCardProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between">
      <div>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold">{name}</span>
        <div className="text-lg font-black text-white mt-1 tabular-nums">${rev.toLocaleString()}</div>
      </div>
      <hr className="border-white/[0.04] my-2.5" />
      <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold leading-none">
        <span>Clicks: {fmt(clicks)}</span>
        <span>Conv: {conv}%</span>
      </div>
    </div>
  );
}
