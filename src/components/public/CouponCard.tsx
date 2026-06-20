"use client";

import { useCopyCode } from "@/hooks/useCopyCode";
import type { Coupon } from "@/types";
import { getExpiryInfo, getTypeLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const { copiedId, copyCode, openDeal } = useCopyCode();
  const [upvotes, setUpvotes] = useState(coupon.upvotes);
  const [downvotes, setDownvotes] = useState(coupon.downvotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const isCopied = copiedId === coupon.id;
  const expiry = getExpiryInfo(coupon.expiresAt);
  const typeBorder = coupon.type === "PERCENT" ? "border-l-violet-600" 
    : coupon.type === "FIXED" ? "border-l-emerald-600"
    : coupon.type === "FREE_SHIPPING" ? "border-l-blue-600"
    : "border-l-amber-600";

  const handleVote = (type: "up" | "down") => {
    if (voted === type) return;
    if (type === "up") {
      setUpvotes(p => p + 1);
      if (voted === "down") setDownvotes(p => Math.max(0, p - 1));
    } else {
      setDownvotes(p => p + 1);
      if (voted === "up") setUpvotes(p => Math.max(0, p - 1));
    }
    setVoted(type);
  };

  const isNoCode = coupon.type === "FREE_SHIPPING" || !coupon.code;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 shadow-sm transition border-l-4", typeBorder)}>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg border border-gray-100 shrink-0 hidden sm:flex bg-white p-1 items-center justify-center overflow-hidden">
          {coupon.brand.logoUrl ? (
            <img 
              src={coupon.brand.logoUrl} 
              alt={coupon.brand.name} 
              className="w-full h-full object-contain" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${coupon.brand.logoUrl ? 'hidden ' : ''}w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold rounded-lg text-lg`}>
            {coupon.brand.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500 mb-1">{coupon.brand.name}</div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">{coupon.title}</h3>
          {coupon.description && <p className="text-sm text-gray-500 mb-4">{coupon.description}</p>}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-700">
              {getTypeLabel(coupon.type, coupon.discountValue)}
            </span>
            {coupon.expiresAt && (
              <span suppressHydrationWarning className={cn("inline-flex items-center text-xs px-2 py-0.5 rounded font-medium", expiry.className)}>
                {expiry.text}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {isNoCode ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 flex-1 text-center w-full">
                No code needed — discount applies automatically
              </div>
            ) : (
              <div 
                onClick={() => copyCode(coupon.id, coupon.code, coupon.affiliateUrl)}
                className="bg-gray-50 border border-dashed border-gray-300 rounded-xl px-6 py-3 font-mono text-xl font-bold tracking-[0.15em] text-violet-700 text-center cursor-pointer hover:bg-violet-50 hover:border-violet-300 transition w-full sm:flex-1 select-all"
              >
                {coupon.code}
              </div>
            )}
            <div className="flex flex-col gap-1 w-full sm:w-auto items-center">
              {isNoCode ? (
                <button 
                  onClick={() => openDeal(coupon.id, coupon.affiliateUrl)}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg font-semibold text-sm transition-colors bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Activate Deal
                </button>
              ) : (
                <button 
                  onClick={() => copyCode(coupon.id, coupon.code, coupon.affiliateUrl)}
                  className={cn(
                    "w-full sm:w-auto px-5 py-3 rounded-lg font-semibold text-sm transition-colors",
                    isCopied ? "bg-emerald-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"
                  )}
                >
                  {isCopied ? "✓ Copied! Opening site..." : "Copy Code & Open Site"}
                </button>
              )}
              <a href={`/${coupon.brand.slug}-coupon-codes`} className="text-xs text-violet-600 hover:underline mt-1 font-medium">View brand page →</a>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
            <div className="flex items-center gap-1.5 font-medium">
              <span className={cn("inline-block w-2.5 h-2.5 rounded-full", coupon.successRate >= 75 ? "bg-emerald-500" : coupon.successRate >= 50 ? "bg-amber-500" : coupon.successRate > 0 ? "bg-red-400" : "bg-gray-300")}></span>
              <span className={coupon.successRate > 0 ? "text-emerald-700" : "text-gray-500"}>
                {coupon.successRate > 0 ? `${coupon.successRate}% success` : "New — not rated"}
              </span>
              {coupon.useCount > 0 && <span suppressHydrationWarning className="text-gray-500 ml-1 hidden sm:inline">({coupon.useCount.toLocaleString()} uses)</span>}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleVote('up')} className={cn("flex items-center gap-1 hover:text-emerald-600 transition", voted === 'up' ? "text-emerald-600 font-semibold" : "text-gray-500")}>👍 {upvotes}</button>
              <button onClick={() => handleVote('down')} className={cn("flex items-center gap-1 hover:text-red-600 transition", voted === 'down' ? "text-red-600 font-semibold" : "text-gray-500")}>👎 {downvotes}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
