"use client";

import React from "react";
import Link from "next/link";

export function CategoryNav() {
  const CATEGORIES = [
    { id: "fashion", name: "Fashion", emoji: "👗" },
    { id: "electronics", name: "Electronics", emoji: "💻" },
    { id: "travel", name: "Travel", emoji: "✈️" },
    { id: "beauty", name: "Beauty", emoji: "💄" },
    { id: "education", name: "Education", emoji: "📚" },
    { id: "food", name: "Food & Dining", emoji: "🍔" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-20 overflow-x-auto whitespace-nowrap scrollbar-none" id="category-navigation-bar">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex gap-6 text-sm font-medium items-center">
        <Link
          href="/"
          className="text-gray-900 hover:text-violet-600 transition font-bold"
        >
          🏠 Home
        </Link>
        <span className="text-gray-300">|</span>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/coupons/${cat.id}`}
            className="text-gray-650 hover:text-violet-600 transition flex items-center gap-1.5"
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
