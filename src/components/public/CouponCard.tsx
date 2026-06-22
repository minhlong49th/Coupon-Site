"use client";

import { useCopyCode } from "@/hooks/useCopyCode";
import type { Coupon } from "@/types";
import { getExpiryInfo, getTypeLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ClientImage } from "@/components/public/ClientImage";

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const { copiedId, copyCode, openDeal } = useCopyCode();
  const [upvotes, setUpvotes] = useState(coupon.upvotes);
  const [downvotes, setDownvotes] = useState(coupon.downvotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const isCopied = copiedId === coupon.id;
  const showCode = isRevealed || isCopied;
  const expiry = getExpiryInfo(coupon.expiresAt);
  const typeBorder = coupon.type === "PERCENT" ? "border-l-violet-500" 
    : coupon.type === "FIXED" ? "border-l-emerald-500"
    : coupon.type === "FREE_SHIPPING" ? "border-l-blue-500"
    : "border-l-amber-500";

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
    <div className={cn(
      "bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 border-l-[5px] flex flex-col justify-between h-full min-h-[260px]", 
      typeBorder
    )}>
      <div className="space-y-4">
        {/* Header: Logo, Store & Title */}
        <div className="flex items-start gap-3.5">
          {/* Brand Logo */}
          <ClientImage
            src={coupon.brand.logoUrl || ""}
            alt={coupon.brand.name}
            className="w-full h-full object-contain"
            containerClassName="w-12 h-12 rounded-xl border border-gray-100 shrink-0 flex bg-white p-1 items-center justify-center overflow-hidden shadow-sm"
            fallbackClassName="w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold rounded-lg text-lg select-none"
            fallbackText={coupon.brand.name.charAt(0).toUpperCase()}
          />

          {/* Title & Brand Name */}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-0.5">{coupon.brand.name}</span>
            <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug tracking-tight line-clamp-2 hover:text-violet-600 transition-colors">
              {coupon.title}
            </h3>
          </div>
        </div>

        {/* Badges & Description */}
        <div className="space-y-3">
          {coupon.description && (
            <p className="text-xs md:text-sm text-gray-650 line-clamp-2 leading-relaxed">
              {coupon.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="inline-flex items-center text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100/50">
              {getTypeLabel(coupon.type, coupon.discountValue)}
            </span>
            {coupon.expiresAt && (
              <span suppressHydrationWarning className={cn("inline-flex items-center text-[10px] px-2.5 py-1 rounded-md font-semibold tracking-wide uppercase", expiry.className)}>
                ⏱️ {expiry.text}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Copy Code box or activation trigger */}
      <div className="mt-5 pt-4 border-t border-gray-100 space-y-3.5">
        {isNoCode ? (
          <button 
            onClick={() => openDeal(coupon.id, coupon.affiliateUrl)}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer text-center group flex items-center justify-center gap-1.5"
          >
            <span>Shop Deal & Activate</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        ) : (
          <div 
            onClick={() => {
              setIsRevealed(true);
              copyCode(coupon.id, coupon.code || "", coupon.affiliateUrl);
            }}
            className="relative flex items-center justify-between bg-violet-50/20 hover:bg-violet-50/60 border border-dashed border-violet-300 rounded-xl p-0.5 px-1 transition-all cursor-pointer group text-left w-full overflow-hidden"
          >
            <div className="pl-3 py-2 truncate max-w-[60%] flex items-center gap-2 select-none">
              {showCode ? (
                <span className="font-mono font-bold text-sm md:text-base tracking-widest text-violet-800">
                  {coupon.code}
                </span>
              ) : (
                <span className="font-sans text-xs md:text-sm font-semibold text-violet-750 flex items-center gap-1.5">
                  <span className="text-violet-500">🔒</span>
                  <span>Click to reveal code</span>
                </span>
              )}
            </div>
            <div className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap text-center",
              isCopied 
                ? "bg-emerald-600 text-white" 
                : "bg-violet-600 text-white hover:bg-violet-700 group-hover:scale-[1.02] active:scale-[0.98]"
            )}>
              {isCopied ? "✓ Copied" : "Reveal & Copy"}
            </div>
          </div>
        )}

        {/* Footer info stats & visual utilities */}
        <div className="flex flex-row items-center justify-between gap-2.5 pt-1">
          {/* Success Rate metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={cn("inline-block w-20 w-2 h-2 rounded-full", coupon.successRate >= 75 ? "bg-emerald-500" : coupon.successRate >= 50 ? "bg-amber-500" : coupon.successRate > 0 ? "bg-red-400" : "bg-gray-300")}></span>
            <span className={coupon.successRate > 0 ? "text-emerald-700 font-semibold" : "text-gray-500"}>
              {coupon.successRate > 0 ? `${coupon.successRate}%` : "New"}
            </span>
            {coupon.useCount > 0 && <span suppressHydrationWarning className="text-gray-400 shrink-0 hidden sm:inline">({coupon.useCount.toLocaleString()} views)</span>}
          </div>

          {/* Direct triggers & social upvotes */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a 
              href={`/${coupon.brand.slug}-coupon-codes`} 
              className="text-xs text-violet-600 hover:text-violet-800 transition hover:underline font-bold"
            >
              Store →
            </a>
            
            <div className="flex items-center gap-1.5 border-l border-gray-150 pl-2.5">
              <button 
                onClick={(e) => { e.stopPropagation(); handleVote("up"); }} 
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded transition text-xs", 
                  voted === "up" 
                    ? "bg-emerald-50 text-emerald-600 font-extrabold" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )}
                title="This deal works!"
              >
                👍 {upvotes}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleVote("down"); }} 
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded transition text-xs", 
                  voted === "down" 
                    ? "bg-red-50 text-red-600 font-extrabold" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )}
                title="This deal expired or failed"
              >
                👎 {downvotes}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
