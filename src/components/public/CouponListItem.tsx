"use client";

import type { Coupon } from "@/types";
import { useCopyCode } from "@/hooks/useCopyCode";
import { getTypeLabel } from "@/lib/utils";

export function CouponListItem({ coupon }: { coupon: Coupon }) {
  const { copiedId, copyCode, openDeal } = useCopyCode();

  const isNoCode = coupon.type === "FREE_SHIPPING" || !coupon.code;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition shadow-sm">
      <div className="w-8 h-8 rounded border border-gray-100 p-0.5 shrink-0 hidden sm:flex bg-white items-center justify-center overflow-hidden">
        {coupon.brand.logoUrl ? (
          <img 
            src={coupon.brand.logoUrl} 
            className="w-full h-full object-contain" 
            alt={coupon.brand.name} 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${coupon.brand.logoUrl ? 'hidden ' : ''}w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs`}>
          {coupon.brand.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{coupon.title}</h4>
        <div className="text-xs text-gray-500 truncate">{coupon.brand.name}</div>
      </div>
      <div className="shrink-0 flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
        <span className="md:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-50 text-violet-700">
          {getTypeLabel(coupon.type, coupon.discountValue)}
        </span>
        <div className="flex items-center gap-2">
           {!isNoCode && <code className="font-mono text-sm font-bold text-violet-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 select-all">{coupon.code}</code>}
           <button 
             onClick={() => isNoCode ? openDeal(coupon.id, coupon.affiliateUrl) : copyCode(coupon.id, coupon.code, coupon.affiliateUrl)}
             className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${copiedId === coupon.id ? "bg-emerald-600 text-white" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}
           >
             {isNoCode ? "Activate" : copiedId === coupon.id ? "Copied" : "Copy"}
           </button>
        </div>
      </div>
    </div>
  );
}
