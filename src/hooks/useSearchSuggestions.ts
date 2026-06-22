"use client";

import { useState, useMemo, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { Brand } from "@/types";

export interface CategorySuggestion {
  id: string;
  name: string;
  emoji: string;
}

const CATEGORIES: CategorySuggestion[] = [
  { id: "fashion", name: "Fashion", emoji: "👗" },
  { id: "electronics", name: "Electronics", emoji: "💻" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "beauty", name: "Beauty", emoji: "💄" },
  { id: "education", name: "Education", emoji: "📚" },
  { id: "food", name: "Food & Dining", emoji: "🍔" },
  { id: "home", name: "Home & Garden", emoji: "🏠" },
  { id: "sports", name: "Sports", emoji: "⚽" },
];

export function useSearchSuggestions({
  brands,
  searchQuery,
  setSearchQuery,
  onSubmit,
}: {
  brands: Omit<Brand, "createdAt" | "updatedAt">[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSubmit: (currentQuery: string) => void;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const cleanQuery = searchQuery.toLowerCase().trim();

  // Filter Matching Brands (up to 5)
  const filteredBrands = useMemo(() => {
    if (!cleanQuery) return [];
    return brands
      .filter(
        (b) =>
          b.name.toLowerCase().includes(cleanQuery) ||
          (b.domain || "").toLowerCase().includes(cleanQuery)
      )
      .slice(0, 5);
  }, [brands, cleanQuery]);

  // Filter Matching Categories (up to 3)
  const filteredCategories = useMemo(() => {
    if (!cleanQuery) return [];
    return CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(cleanQuery)
    ).slice(0, 3);
  }, [cleanQuery]);

  // Combined List for Traversal
  const combinedItems = useMemo(() => {
    const items: (
      | { type: "brand"; data: Omit<Brand, "createdAt" | "updatedAt"> }
      | { type: "category"; data: CategorySuggestion }
    )[] = [];

    filteredBrands.forEach((b) => items.push({ type: "brand", data: b }));
    filteredCategories.forEach((c) => items.push({ type: "category", data: c }));

    return items;
  }, [filteredBrands, filteredCategories]);

  const handleSelectBrand = (brand: Omit<Brand, "createdAt" | "updatedAt">) => {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(`/${brand.slug}-coupon-codes`);
  };

  const handleSelectCategory = (category: CategorySuggestion) => {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(`/coupons/${category.id}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || combinedItems.length === 0) {
      if (e.key === "Enter") {
        onSubmit(searchQuery);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1 >= combinedItems.length ? 0 : prev + 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev - 1 < 0 ? combinedItems.length - 1 : prev - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < combinedItems.length) {
          const item = combinedItems[activeIndex];
          if (item.type === "brand") {
            handleSelectBrand(item.data);
          } else {
            handleSelectCategory(item.data);
          }
        } else {
          onSubmit(searchQuery);
          setIsOpen(false);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;

      default:
        break;
    }
  };

  return {
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    filteredBrands,
    filteredCategories,
    combinedItems,
    handleKeyDown,
    handleSelectBrand,
    handleSelectCategory,
  };
}
