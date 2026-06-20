"use client";
import { useState } from "react";
import type { Coupon } from "@/types";
import { CouponCard } from "@/components/public/CouponCard";

export function CouponList({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleCoupons = initialCoupons.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {visibleCoupons.length > 0 ? visibleCoupons.map(c => (
        <CouponCard key={c.id} coupon={c} />
      )) : (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500 shadow-sm">
          No coupons found.
        </div>
      )}
      
      {visibleCount < initialCoupons.length && (
        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="border-2 border-violet-600 text-violet-600 hover:bg-violet-50 px-6 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            Load more coupons ({visibleCount}/{initialCoupons.length})
          </button>
        </div>
      )}
    </div>
  );
}
