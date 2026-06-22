"use client";

import { cn } from "@/lib/utils";

export function CouponCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 border-l-[5px] border-l-gray-200/80 flex flex-col justify-between h-full min-h-[260px] animate-pulse">
      <div className="space-y-4">
        {/* Header: Logo, Store & Title */}
        <div className="flex items-start gap-3.5">
          {/* Logo container skeleton */}
          <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
          
          {/* Brand & Title skeleton */}
          <div className="flex-1 space-y-2 py-0.5">
            <div className="w-16 h-3 bg-gray-100 rounded" />
            <div className="w-4/5 h-5 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Badges & Description skeleton */}
        <div className="space-y-3 pt-1">
          <div className="space-y-2">
            <div className="w-full h-3.5 bg-gray-100 rounded" />
            <div className="w-11/12 h-3.5 bg-gray-100 rounded" />
          </div>

          <div className="flex gap-2">
            <div className="w-16 h-6 bg-gray-100 rounded" />
            <div className="w-20 h-6 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* Button & Footer info skeleton */}
      <div className="space-y-4 pt-4 border-t border-gray-50/80">
        <div className="w-full h-11 bg-gray-100 rounded-xl" />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <div className="w-12 h-3.5 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-3.5 bg-gray-100 rounded" />
            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
              <div className="w-8 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CouponListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Skeleton Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg w-fit animate-pulse">
        <div className="w-16 h-8 bg-gray-200/60 rounded-md" />
        <div className="w-20 h-8 bg-gray-200/60 rounded-md" />
        <div className="w-20 h-8 bg-gray-200/60 rounded-md" />
        <div className="w-28 h-8 bg-gray-200/60 rounded-md" />
      </div>

      {/* Skeleton Cards Wrapper */}
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <CouponCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CouponListItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white rounded-lg border border-gray-250/60 px-4 py-3 shadow-sm animate-pulse">
      {/* Brand logo skeleton */}
      <div className="w-8 h-8 rounded bg-gray-100 shrink-0 hidden sm:block" />

      {/* Title & Brand Name */}
      <div className="flex-1 space-y-2 py-0.5">
        <div className="w-2/3 h-4 bg-gray-100 rounded" />
        <div className="w-24 h-3 bg-gray-100 rounded" />
      </div>

      {/* Badges & Button */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
        <div className="w-14 h-6 bg-gray-100 rounded" />
        <div className="flex items-center gap-2">
          <div className="w-20 h-7 bg-gray-100 rounded" />
          <div className="w-24 h-7.5 bg-gray-200/80 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CouponListItemListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CouponListItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function SimilarStoreSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 rounded border border-gray-100 bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-1.5 py-0.5">
        <div className="w-24 h-3.5 bg-gray-100 rounded" />
        <div className="w-16 h-3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function SimilarStoresSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="w-32 h-5 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SimilarStoreSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
