import type { Metadata } from "next";
import Link from "next/link";
import { getMockBrands, getMockCoupons } from "@/lib/mock-data";
import { BrandCard } from "@/components/public/BrandCard";
import { CouponCard } from "@/components/public/CouponCard";
import { CouponListItem } from "@/components/public/CouponListItem";
import { HomeSearch } from "@/components/public/HomeSearch";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DealHunter — Best Coupon Codes & Promo Deals",
};

export default async function HomePage() {
  const [brands, coupons] = await Promise.all([getMockBrands(), getMockCoupons()]);
  
  const trendingBrands = [...brands].sort((a,b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 10);
  const featuredCoupons = [...coupons].filter(c => c.isFeatured).slice(0, 6);
  const recentCoupons = [...coupons].sort((a,b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()).slice(0, 8);

  const CATEGORIES = [
    { id: "fashion", name: "Fashion", emoji: "👗", count: 59 },
    { id: "electronics", name: "Electronics", emoji: "💻", count: 15 },
    { id: "travel", name: "Travel", emoji: "✈️", count: 19 },
    { id: "beauty", name: "Beauty", emoji: "💄", count: 45 },
    { id: "education", name: "Education", emoji: "📚", count: 24 },
    { id: "food", name: "Food & Dining", emoji: "🍔", count: 0 },
    { id: "home", name: "Home & Garden", emoji: "🏠", count: 0 },
    { id: "sports", name: "Sports", emoji: "⚽", count: 0 },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-50 via-white to-white py-16 px-4 text-center border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Find the Best Coupon Codes & Deals</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Save money with {fmt(coupons.length * 245)} verified promo codes from {fmt(brands.length * 40)} top brands</p>
        <HomeSearch brands={brands} />
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200 py-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center">
          <div><div className="text-3xl mb-2">🏷️</div><div className="text-2xl font-bold text-gray-900">1,247</div><div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Coupons</div></div>
          <div><div className="text-3xl mb-2">🏪</div><div className="text-2xl font-bold text-gray-900">284</div><div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Brands</div></div>
          <div><div className="text-3xl mb-2">👥</div><div className="text-2xl font-bold text-gray-900">12,400+</div><div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Verified Uses Today</div></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16 pb-16">
        
        {/* Featured Deals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🔥 Featured Deals Today</h2>
            <Link href="/deals" className="text-violet-600 hover:text-violet-700 font-medium text-sm">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <a key={cat.id} href={`/coupons/${cat.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-violet-300 hover:bg-violet-50 transition cursor-pointer flex items-center gap-4 group shadow-sm">
                 <div className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</div>
                 <div>
                    <div className="font-bold text-gray-900 group-hover:text-violet-700">{cat.name}</div>
                    <div className="text-xs text-gray-500">{cat.count} stores</div>
                 </div>
              </a>
            ))}
          </div>
        </section>

        {/* Trending Stores */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Stores</h2>
            <Link href="/stores" className="text-violet-600 hover:text-violet-700 font-medium text-sm">
              All stores →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {trendingBrands.map(b => (
              <div key={b.id} className="w-64 shrink-0"><BrandCard brand={b} /></div>
            ))}
          </div>
        </section>

        {/* Recent Coupons */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Coupons Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCoupons.map(c => <CouponListItem key={c.id} coupon={c} />)}
          </div>
        </section>

      </div>
    </div>
  );
}
