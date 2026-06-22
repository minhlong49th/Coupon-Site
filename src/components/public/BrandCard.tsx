"use client";
import Link from "next/link";
import { ClientImage } from "@/components/public/ClientImage";
import type { Brand } from "@/types";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/${brand.slug}-coupon-codes`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-violet-300 hover:shadow-md transition">
      <ClientImage
        src={brand.logoUrl || ""}
        alt={brand.name}
        className="w-full h-full object-contain"
        containerClassName="w-14 h-14 rounded-xl border border-gray-100 shrink-0 mb-3 bg-white flex items-center justify-center overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-violet-500 shadow-sm"
        fallbackClassName="w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center text-xl font-bold rounded-lg select-none"
        fallbackText={brand.name.charAt(0).toUpperCase()}
      />
      <h3 className="font-semibold text-gray-900 text-[15px] truncate">{brand.name}</h3>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-gray-500">{brand.couponCount} coupons</span>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded">{brand.category}</span>
      </div>
      {brand.bestDiscount !== undefined && brand.bestDiscount > 0 && <div className="mt-2 text-xs font-medium text-emerald-600">Up to {brand.bestDiscount}% OFF</div>}
    </Link>
  );
}
