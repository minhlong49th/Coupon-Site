"use client";

import { useState, useEffect } from "react";
import { ClientImage } from "@/components/public/ClientImage";
import { SimilarStoresSkeleton } from "@/components/public/SkeletonLoaders";
import type { Brand } from "@/types";

export function SimilarStores({ similarBrands }: { similarBrands: Brand[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <SimilarStoresSkeleton count={similarBrands.length || 5} />;
  }

  if (similarBrands.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Similar Stores</h3>
      <div className="flex flex-col gap-4">
        {similarBrands.map((b) => (
          <a
            key={b.id}
            href={`/${b.slug}-coupon-codes`}
            className="flex items-center gap-3 group"
          >
            <ClientImage
              src={b.logoUrl || ""}
              alt={b.name}
              className="w-full h-full object-contain"
              containerClassName="w-10 h-10 rounded border p-1 group-hover:border-violet-300 transition bg-white flex items-center justify-center shrink-0 overflow-hidden"
              fallbackClassName="w-full h-full flex items-center justify-center font-bold text-violet-600 bg-violet-50 text-sm"
              fallbackText={b.name.charAt(0).toUpperCase()}
            />
            <div>
              <div className="font-semibold text-sm text-gray-900 group-hover:text-violet-600 transition">
                {b.name}
              </div>
              <div className="text-xs text-gray-500">
                {b.couponCount} coupons
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
