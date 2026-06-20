"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitModal } from "@/components/public/SubmitModal";
import type { Brand } from "@/types";

export function SiteHeader({ brands }: { brands: Omit<Brand, "createdAt" | "updatedAt">[] }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
          <Link href="/" className="text-violet-600 font-bold text-xl flex items-center gap-2">
            🏷️ DealHunter
          </Link>
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400 transition-all border border-transparent">
            <span className="text-gray-400 mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search stores & coupons..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-violet-600 font-medium text-sm hover:underline">Log in</Link>
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
