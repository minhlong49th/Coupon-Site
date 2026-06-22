"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { SearchSuggestions } from "@/components/public/SearchSuggestions";
import type { Brand } from "@/types";

interface HomeSearchProps {
  brands?: Omit<Brand, "createdAt" | "updatedAt">[];
}

export function HomeSearch({ brands = [] }: HomeSearchProps) {
  const [search, setSearch] = useState("");
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
    <div className="max-w-2xl mx-auto relative" id="home-search-wrapper">
      <form onSubmit={onFormSubmit} className="flex flex-col md:flex-row gap-2" id="home-search-form">
        <input 
          type="text" 
          placeholder="Search stores, brands, or categories..." 
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-gray-900 bg-white" 
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
          id="home-search-input"
        />
        <button 
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-bold transition whitespace-nowrap"
          id="home-search-button"
        >
          Search
        </button>
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
  );
}
