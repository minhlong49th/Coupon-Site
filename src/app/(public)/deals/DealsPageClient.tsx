"use client";

import React, { useState, useMemo } from "react";
import type { Coupon, Brand } from "@/types";
import { CouponCard } from "@/components/public/CouponCard";
import Link from "next/link";
import { ClientImage } from "@/components/public/ClientImage";

interface DealsPageClientProps {
  initialCoupons: Coupon[];
  initialBrands: Brand[];
}

export function DealsPageClient({ initialCoupons, initialBrands }: DealsPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "success" | "clicks" | "discount">("newest");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Category list dynamically built
  const categories = useMemo(() => {
    const list = new Set<string>();
    initialCoupons.forEach((c) => {
      if (c.brand?.category) {
        list.add(c.brand.category);
      }
    });
    initialBrands.forEach((b) => {
      if (b.category) {
        list.add(b.category);
      }
    });
    return ["ALL", ...Array.from(list)];
  }, [initialCoupons, initialBrands]);

  // Types list dynamically built
  const types = [
    { id: "ALL", label: "🏷️ All Deals" },
    { id: "PERCENT", label: "% Percentage Off" },
    { id: "FIXED", label: "$ Fixed Price Off" },
    { id: "FREE_SHIPPING", label: "✈️ Free Shipping" },
    { id: "BOGO", label: "🎁 Buy 1 Get 1" },
    { id: "OTHER", label: "➕ Others" },
  ];

  // Filtering Logic
  const filteredCoupons = useMemo(() => {
    return initialCoupons
      .filter((c) => {
        // Enforce ACTIVE status for public listings
        if (c.status !== "ACTIVE") return false;

        // Search Match
        const queryText = search.toLowerCase().trim();
        const matchesSearch =
          !queryText ||
          c.title.toLowerCase().includes(queryText) ||
          c.code?.toLowerCase().includes(queryText) ||
          c.description?.toLowerCase().includes(queryText) ||
          c.brand?.name.toLowerCase().includes(queryText);

        // Category Match
        const matchesCategory =
          selectedCategory === "ALL" ||
          c.brand?.category?.toLowerCase() === selectedCategory.toLowerCase();

        // Coupon Type Match
        const matchesType =
          selectedType === "ALL" ||
          c.type === selectedType;

        // Brand Match
        const matchesBrand =
          selectedBrandId === "ALL" ||
          c.brandId === selectedBrandId;

        return matchesSearch && matchesCategory && matchesType && matchesBrand;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        }
        if (sortBy === "success") {
          return (b.successRate || 0) - (a.successRate || 0);
        }
        if (sortBy === "clicks") {
          return (b.clickCount || 0) - (a.clickCount || 0);
        }
        if (sortBy === "discount") {
          const valA = a.discountValue || 0;
          const valB = b.discountValue || 0;
          return valB - valA;
        }
        return 0;
      });
  }, [initialCoupons, search, selectedCategory, selectedType, selectedBrandId, sortBy]);

  const visibleCoupons = useMemo(() => {
    return filteredCoupons.slice(0, visibleCount);
  }, [filteredCoupons, visibleCount]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedType("ALL");
    setSelectedBrandId("ALL");
    setSortBy("newest");
    setVisibleCount(12);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full min-w-0" id="all-deals-client-container">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">All Hot Deals</span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-lg shadow-violet-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur px-3 py-1 rounded-full text-violet-100 border border-white/10">
            Realtime verified discount vouchers
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            All Coupons & Promo Codes
          </h1>
          <p className="text-sm md:text-base text-violet-100 leading-relaxed max-w-lg">
            Discover thousands of active savings across fashion, gadgets, learning courses, beauty stores, and shipping offers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filter Sidebar Panel */}
        <div className="lg:col-span-1 space-y-6" id="deals-sidebar-filters">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 text-sm">Filters</span>
              {(search || selectedCategory !== "ALL" || selectedType !== "ALL" || selectedBrandId !== "ALL" || sortBy !== "newest") && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold transition"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* In-page Input searching */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Search</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter key, code, title..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 bg-gray-50/55 transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-gray-50/55 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "ALL" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Brands Partner selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Brand Store</label>
              <select
                value={selectedBrandId}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-gray-50/55 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              >
                <option value="ALL">All Store Partners</option>
                {initialBrands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.couponCount || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Discount types Filter selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Voucher Type</label>
              <div className="flex flex-col gap-1.5 pt-0.5">
                {types.map((ty) => (
                  <button
                    key={ty.id}
                    onClick={() => {
                      setSelectedType(ty.id);
                      setVisibleCount(12);
                    }}
                    className={`text-left text-xs font-semibold py-1.5 px-3 rounded-lg transition-all ${
                      selectedType === ty.id
                        ? "bg-violet-50 text-violet-700 border border-violet-100"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent"
                    }`}
                  >
                    {ty.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Listing & Sorting Options */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-gray-500">
              Showing <strong className="text-gray-950 font-bold">{Math.min(filteredCoupons.length, visibleCount)}</strong> of{" "}
              <strong className="text-gray-950 font-bold">{filteredCoupons.length}</strong> active offers
            </div>

            {/* Sorting bar */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <span className="text-xs font-bold text-gray-400 shrink-0 select-none">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-violet-400"
              >
                <option value="newest">🕒 Live Date (Newest)</option>
                <option value="success">🎯 Success Rate</option>
                <option value="clicks">🔥 Total Clicks</option>
                <option value="discount">💰 Best Discount</option>
              </select>
            </div>
          </div>

          {/* Grid list count */}
          {visibleCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="deals-grid-layout">
              {visibleCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-xs w-full" id="empty-deals-page">
              <div className="text-6xl mb-4">🍃</div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-1">No Promo Codes Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                We couldn&apos;t match any active discounts with your selected search queries or category filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-violet-600 hover:bg-violet-750 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm shadow-md shadow-violet-600/10"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Pagination Load More */}
          {visibleCount < filteredCoupons.length && (
            <div className="pt-6 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="border-2 border-violet-600 text-violet-600 hover:bg-violet-50 px-8 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none"
              >
                Load More Hot Deals ({visibleCoupons.length} / {filteredCoupons.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
