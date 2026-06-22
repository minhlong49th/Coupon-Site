"use client";
import { useState } from "react";

import type { Coupon } from "@/types";
import { useCopyCode } from "@/hooks/useCopyCode";
import { getTypeLabel } from "@/lib/utils";
import { ClientImage } from "@/components/public/ClientImage";

export function CouponListItem({ coupon }: { coupon: Coupon }) {
  const { copiedId, copyCode, openDeal } = useCopyCode();
  const [isRevealed, setIsRevealed] = useState(false);

  const isNoCode = coupon.type === "FREE_SHIPPING" || !coupon.code;
  const showCode = isRevealed || copiedId === coupon.id;

  const handleAction = () => {
    if (isNoCode) {
      openDeal(coupon.id, coupon.affiliateUrl);
    } else {
      setIsRevealed(true);
      copyCode(coupon.id, coupon.code || "", coupon.affiliateUrl);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition shadow-sm">
      <ClientImage
        src={coupon.brand.logoUrl || ""}
        alt={coupon.brand.name}
        className="w-full h-full object-contain"
        containerClassName="w-8 h-8 rounded border border-gray-100 p-0.5 shrink-0 hidden sm:flex bg-white items-center justify-center overflow-hidden"
        fallbackClassName="w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs select-none"
        fallbackText={coupon.brand.name.charAt(0).toUpperCase()}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{coupon.title}</h4>
        <div className="text-xs text-gray-500 truncate">{coupon.brand.name}</div>
      </div>
      <div className="shrink-0 flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
        <span className="md:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-50 text-violet-700">
          {getTypeLabel(coupon.type, coupon.discountValue)}
        </span>
        <div className="flex items-center gap-2">
           {!isNoCode && (
             <code className="font-mono text-xs md:text-sm font-bold text-violet-700 bg-gray-50 border border-gray-200 rounded px-2.5 py-1 select-none">
               {showCode ? coupon.code : "••••••••"}
             </code>
           )}
           <button 
             onClick={handleAction}
             className={`text-xs px-3 py-1.5 rounded font-semibold transition-colors ${copiedId === coupon.id ? "bg-emerald-600 text-white animate-pulse" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}
           >
             {isNoCode ? "Activate" : copiedId === coupon.id ? "Copied!" : "Reveal & Copy"}
           </button>
        </div>
      </div>
    </div>
  );
}
