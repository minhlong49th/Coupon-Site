"use client";

import { motion } from "motion/react";
import type { Brand } from "@/types";
import { CategorySuggestion } from "@/hooks/useSearchSuggestions";
import { ClientImage } from "@/components/public/ClientImage";

interface SearchSuggestionsProps {
  filteredBrands: Omit<Brand, "createdAt" | "updatedAt">[];
  filteredCategories: CategorySuggestion[];
  activeIndex: number;
  onSelectBrand: (brand: Omit<Brand, "createdAt" | "updatedAt">) => void;
  onSelectCategory: (category: CategorySuggestion) => void;
  searchQuery: string;
}

export function SearchSuggestions({
  filteredBrands,
  filteredCategories,
  activeIndex,
  onSelectBrand,
  onSelectCategory,
  searchQuery,
}: SearchSuggestionsProps) {
  const hasBrands = filteredBrands.length > 0;
  const hasCategories = filteredCategories.length > 0;

  if (!hasBrands && !hasCategories) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.15 }}
        className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 text-center text-gray-500"
        id="search-suggestions-container-empty"
      >
        <span className="text-xl block mb-1">🔍</span>
        No results found for &quot;<span className="text-gray-800 font-semibold">{searchQuery}</span>&quot;
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
      id="search-suggestions-container"
    >
      {/* Brands Section */}
      {hasBrands && (
        <div className="border-b border-gray-100 last:border-0 p-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
            Suggested Stores
          </div>
          <div className="space-y-0.5">
            {filteredBrands.map((brand, bIndex) => {
              const isHighlighted = activeIndex === bIndex;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onMouseDown={(e) => {
                    // Prevent blur from closing suggestions before click events are executed
                    e.preventDefault();
                  }}
                  onClick={() => onSelectBrand(brand)}
                  className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isHighlighted
                      ? "bg-violet-50 text-violet-900 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  id={`suggest-brand-${brand.id}`}
                >
                  <div className="flex items-center gap-3">
                    <ClientImage
                      src={brand.logoUrl || `https://logo.clearbit.com/${brand.domain}`}
                      alt={brand.name}
                      containerClassName="w-7 h-7 bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center shrink-0"
                      className="w-full h-full object-contain"
                      fallbackClassName="w-7 h-7 bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center rounded-md"
                      fallbackText={brand.name.charAt(0)}
                    />
                    <div>
                      <div className="text-sm font-semibold">{brand.name}</div>
                      <div className="text-xs text-gray-400 leading-none mt-0.5">{brand.domain}</div>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                    {brand.couponCount} Coupon{brand.couponCount !== 1 ? "s" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {hasCategories && (
        <div className="p-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
            Product Categories
          </div>
          <div className="space-y-0.5">
            {filteredCategories.map((cat, cIndex) => {
              const itemIndex = filteredBrands.length + cIndex;
              const isHighlighted = activeIndex === itemIndex;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isHighlighted
                      ? "bg-violet-50 text-violet-900 font-medium"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  id={`suggest-category-${cat.id}`}
                >
                  <span className="text-base leading-none select-none">{cat.emoji}</span>
                  <span className="text-sm font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
