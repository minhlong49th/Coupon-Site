"use client";
import { useState, useMemo, useEffect } from "react";
import type { Coupon, CouponType } from "@/types";
import { CouponCard } from "@/components/public/CouponCard";
import { CouponListSkeleton, CouponCardSkeleton } from "@/components/public/SkeletonLoaders";

type TabType = "ALL" | CouponType;

export function CouponList({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [visibleCount, setVisibleCount] = useState(10);
  const [mounted, setMounted] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  // Calculate matching counts dynamically matching the tabs
  const counts = useMemo(() => {
    return {
      ALL: initialCoupons.length,
      PERCENT: initialCoupons.filter(c => c.type === "PERCENT").length,
      FIXED: initialCoupons.filter(c => c.type === "FIXED").length,
      FREE_SHIPPING: initialCoupons.filter(c => c.type === "FREE_SHIPPING").length,
    };
  }, [initialCoupons]);

  // Filter coupons list dynamically based on the selection
  const filteredCoupons = useMemo(() => {
    if (activeTab === "ALL") return initialCoupons;
    return initialCoupons.filter(c => c.type === activeTab);
  }, [initialCoupons, activeTab]);

  const visibleCoupons = filteredCoupons.slice(0, visibleCount);

  const handleTabChange = (tab: TabType) => {
    setIsTabLoading(true);
    setActiveTab(tab);
    setVisibleCount(10);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 400);
  };

  if (!mounted) {
    return <CouponListSkeleton count={Math.min(initialCoupons.length || 3, 3)} />;
  }

  return (
    <div className="space-y-6" id="coupon-list-container">
      {/* Interactive Filter Tabs bar */}
      <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg w-fit" id="coupon-filter-tabs">
        <button
          onClick={() => handleTabChange("ALL")}
          className={`font-medium px-4 py-1.5 rounded-md text-sm transition cursor-pointer select-none border border-transparent ${
            activeTab === "ALL"
              ? "bg-white shadow-sm border-gray-200 text-gray-900"
              : "text-gray-600 hover:text-gray-910 hover:bg-gray-200/50"
          }`}
          id="filter-tab-all"
        >
          All ({counts.ALL})
        </button>
        <button
          onClick={() => handleTabChange("PERCENT")}
          className={`font-medium px-4 py-1.5 rounded-md text-sm transition cursor-pointer select-none border border-transparent ${
            activeTab === "PERCENT"
              ? "bg-white shadow-sm border-gray-200 text-gray-900"
              : "text-gray-600 hover:text-gray-910 hover:bg-gray-200/50"
          }`}
          id="filter-tab-percent"
        >
          % Off ({counts.PERCENT})
        </button>
        <button
          onClick={() => handleTabChange("FIXED")}
          className={`font-medium px-4 py-1.5 rounded-md text-sm transition cursor-pointer select-none border border-transparent ${
            activeTab === "FIXED"
              ? "bg-white shadow-sm border-gray-200 text-gray-900"
              : "text-gray-600 hover:text-gray-910 hover:bg-gray-200/50"
          }`}
          id="filter-tab-fixed"
        >
          $ Off ({counts.FIXED})
        </button>
        <button
          onClick={() => handleTabChange("FREE_SHIPPING")}
          className={`font-medium px-4 py-1.5 rounded-md text-sm transition cursor-pointer select-none border border-transparent ${
            activeTab === "FREE_SHIPPING"
              ? "bg-white shadow-sm border-gray-200 text-gray-900"
              : "text-gray-600 hover:text-gray-910 hover:bg-gray-200/50"
          }`}
          id="filter-tab-free-shipping"
        >
          Free Shipping ({counts.FREE_SHIPPING})
        </button>
      </div>

      <div className="space-y-4" id="coupon-cards-wrapper">
        {isTabLoading ? (
          Array.from({ length: Math.min(visibleCoupons.length || 3, 3) }).map((_, i) => (
            <CouponCardSkeleton key={i} />
          ))
        ) : visibleCoupons.length > 0 ? (
          visibleCoupons.map(c => (
            <CouponCard key={c.id} coupon={c} />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm" id="no-coupons-found">
            <span className="text-2xl block mb-2">🏷️</span>
            No coupons available for this filter.
          </div>
        )}
      </div>
      
      {visibleCount < filteredCoupons.length && (
        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="border-2 border-violet-600 text-violet-600 hover:bg-violet-50 px-6 py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer"
            id="button-load-more"
          >
            Load more coupons ({visibleCount}/{filteredCoupons.length})
          </button>
        </div>
      )}
    </div>
  );
}
