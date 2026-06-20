"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", name: "All Categories", path: "/" },
  { id: "fashion", name: "Fashion", emoji: "👗", path: "/coupons/fashion" },
  { id: "electronics", name: "Electronics", emoji: "💻", path: "/coupons/electronics" },
  { id: "travel", name: "Travel", emoji: "✈️", path: "/coupons/travel" },
  { id: "beauty", name: "Beauty", emoji: "💄", path: "/coupons/beauty" },
  { id: "education", name: "Education", emoji: "📚", path: "/coupons/education" },
  { id: "food", name: "Food & Dining", emoji: "🍔", path: "/coupons/food" },
  { id: "home", name: "Home & Garden", emoji: "🏠", path: "/coupons/home" },
];

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-100 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="max-w-7xl mx-auto px-4 flex gap-1 h-11 items-center">
        {CATEGORIES.map(cat => {
          const isActive = pathname === cat.path;
          return (
            <Link
              key={cat.id}
              href={cat.path}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                isActive ? "bg-violet-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {cat.emoji && <span className="mr-1.5">{cat.emoji}</span>}
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
