"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitModal } from "@/components/public/SubmitModal";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { SearchSuggestions } from "@/components/public/SearchSuggestions";
import type { Brand } from "@/types";

export function SiteHeader({ brands }: { brands: Omit<Brand, "createdAt" | "updatedAt">[] }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (currentQuery: string) => {
    if (currentQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(currentQuery.trim())}`);
    }
  };

  const {
    isOpen,
    setIsOpen,
    activeIndex,
    filteredBrands,
    filteredCategories,
    handleKeyDown,
    handleSelectBrand,
    handleSelectCategory,
  } = useSearchSuggestions({
    brands,
    searchQuery: search,
    setSearchQuery: setSearch,
    onSubmit: handleSearch,
  });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(search);
    setIsOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
          <Link href="/" className="text-violet-600 font-bold text-xl flex items-center gap-2">
            🏷️ DealHunter
          </Link>
          <div className="hidden md:block flex-1 max-w-xl mx-8 relative" id="header-search-wrapper">
            <form onSubmit={onFormSubmit} className="flex bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400 transition-all border border-transparent">
              <span className="text-gray-400 mr-2">🔍</span>
              <input 
                type="text" 
                placeholder="Search stores & coupons..." 
                className="bg-transparent border-none outline-none flex-1 text-sm text-gray-900"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  if (search.trim()) setIsOpen(true);
                }}
                onBlur={() => {
                  // Delay so click events register inside suggestions if clicked
                  setTimeout(() => setIsOpen(false), 200);
                }}
                onKeyDown={handleKeyDown}
                id="header-search-input"
              />
            </form>
            {isOpen && search.trim() && (
              <SearchSuggestions
                filteredBrands={filteredBrands}
                filteredCategories={filteredCategories}
                activeIndex={activeIndex}
                onSelectBrand={handleSelectBrand}
                onSelectCategory={handleSelectCategory}
                searchQuery={search}
              />
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-violet-600 font-medium text-sm hover:underline">Log in</Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-violet-700 transition"
            >
              Submit Coupon
            </button>
          </div>
        </div>
      </header>
      {isModalOpen && <SubmitModal onClose={() => setIsModalOpen(false)} brands={brands} />}
    </>
  );
}
