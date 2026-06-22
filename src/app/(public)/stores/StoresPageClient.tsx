"use client";

import React, { useState, useMemo } from "react";
import type { Brand } from "@/types";
import { BrandCard } from "@/components/public/BrandCard";
import Link from "next/link";

interface StoresPageClientProps {
  initialBrands: Brand[];
}

export function StoresPageClient({ initialBrands }: StoresPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "popularity" | "coupons">("popularity");

  // Get dynamic categories list
  const categories = useMemo(() => {
    const list = new Set<string>();
    initialBrands.forEach((b) => {
      if (b.category) {
        // Uniform casing for category matching
        list.add(b.category.charAt(0).toUpperCase() + b.category.slice(1).toLowerCase());
      }
    });
    return ["ALL", ...Array.from(list)];
  }, [initialBrands]);

  // Filtering Logic
  const filteredBrands = useMemo(() => {
    return initialBrands
      .filter((b) => {
        // Only active brand partners
        if (b.isActive === false) return false;

        // Search match
        const queryText = search.toLowerCase().trim();
        const matchesSearch =
          !queryText ||
          b.name.toLowerCase().includes(queryText) ||
          b.slug.toLowerCase().includes(queryText) ||
          (b.description && b.description.toLowerCase().includes(queryText)) ||
          (b.domain && b.domain.toLowerCase().includes(queryText));

        // Category match
        const matchesCategory =
          selectedCategory === "ALL" ||
          (b.category && b.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "popularity") {
          return (b.clickCount || 0) - (a.clickCount || 0);
        }
        if (sortBy === "coupons") {
          return (b.couponCount || 0) - (a.couponCount || 0);
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "name-desc") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
  }, [initialBrands, search, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSortBy("popularity");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full min-w-0" id="all-stores-client-container">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Store Directory</span>
      </div>

      {/* Hero Intro section description */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-lg shadow-violet-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur px-3 py-1 rounded-full text-violet-100 border border-white/10">
            Supportive Partner Brands
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Browse All Stores
          </h1>
          <p className="text-sm md:text-base text-violet-100 leading-relaxed max-w-lg">
            Find the perfect store to redeem coupons for. Browse by category, and enjoy savings on your orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Category Navigator and filter options */}
        <div className="lg:col-span-1 space-y-6" id="stores-sidebar-filters">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 text-sm">Filters</span>
              {(search || selectedCategory !== "ALL" || sortBy !== "popularity") && (
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Search Stores</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Nike, Adidas, Shopee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 bg-gray-50/55 transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Category selection list */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Store Categories</label>
              <div className="flex flex-col gap-1.5 pt-0.5">
                {categories.map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`text-left text-xs font-semibold py-1.5 px-3 rounded-lg transition-all ${
                      selectedCategory.toLowerCase() === catName.toLowerCase()
                        ? "bg-violet-50 text-violet-700 border border-violet-100"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent"
                    }`}
                  >
                    {catName === "ALL" ? "🏷️ All Categories" : catName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Stores listing section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-gray-500">
              Showing <strong className="text-gray-950 font-bold">{filteredBrands.length}</strong> active store partners
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <span className="text-xs font-bold text-gray-400 shrink-0 select-none">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-violet-400"
              >
                <option value="popularity">🔥 Hot stores (By clicks)</option>
                <option value="coupons">🏷️ Total Coupons</option>
                <option value="name-asc">🔤 Alphabetical (A-Z)</option>
                <option value="name-desc">🔤 Alphabetical (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Grid Layout listing */}
          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="stores-grid-layout">
              {filteredBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-xs w-full" id="empty-stores-page">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-1">No Brand Stores Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                We couldn&apos;t match any store partner with your specific search terms or category choices.
              </p>
              <button
                onClick={resetFilters}
                className="bg-violet-600 hover:bg-violet-750 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm shadow-md shadow-violet-600/10"
              >
                Reset Store Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
