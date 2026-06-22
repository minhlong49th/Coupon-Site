import type { Metadata } from "next";
import { getMockBrands, getMockCoupons } from "@/lib/mock-data";
import { CouponList } from "@/components/public/CouponList";
import { ClientImage } from "@/components/public/ClientImage";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";

interface CategoryMeta {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const CATEGORIES_METADATA: Record<string, CategoryMeta> = {
  fashion: {
    id: "fashion",
    name: "Fashion & Apparel",
    emoji: "👗",
    description: "Get discount coupon codes for clothing, trends, activewear, luxury shoes, and modern styling solutions."
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Tech",
    emoji: "💻",
    description: "Save big on smart gadgets, computing hardware, coding laptops, mobile phones, and audio accessories."
  },
  travel: {
    id: "travel",
    name: "Travel & Hotels",
    emoji: "✈️",
    description: "Unlock premium promotional offers on hotel stays, flight bookings, car rentals, and vacation adventures."
  },
  beauty: {
    id: "beauty",
    name: "Beauty & Health",
    emoji: "💄",
    description: "Discover cosmetics promos, luxurious skincare deals, fragrances discounts, and personal grooming deals."
  },
  education: {
    id: "education",
    name: "Education & Learning",
    emoji: "📚",
    description: "Find online lesson coupons, technical course certifications, expert bootcamps, and digital textbooks."
  },
  food: {
    id: "food",
    name: "Food & Dining",
    emoji: "🍔",
    description: "Save on dining reservations, home food deliveries, weekly grocery kits, and premium restaurant vouchers."
  },
  home: {
    id: "home",
    name: "Home & Garden",
    emoji: "🏠",
    description: "Get verified deals on beautiful furniture, gardening gear, kitchen utilities, and interior decor."
  },
  sports: {
    id: "sports",
    name: "Sports & Fitness",
    emoji: "⚽",
    description: "Equip your training with discounts on fitness gear, sports uniforms, athletic shoes, and gym memberships."
  }
};

function getCategoryMeta(id: string): CategoryMeta | null {
  const normalizedId = id.toLowerCase().trim();
  if (CATEGORIES_METADATA[normalizedId]) {
    return CATEGORIES_METADATA[normalizedId];
  }
  // Fallback for custom labels
  const match = Object.values(CATEGORIES_METADATA).find(
    c => c.name.toLowerCase().includes(normalizedId)
  );
  if (match) return match;
  return null;
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryParam = params.category;
  const meta = getCategoryMeta(categoryParam);
  if (!meta) {
    return { title: "Coupons Catalog — DealHunter" };
  }
  return {
    title: `${meta.emoji} ${meta.name} coupons & promo codes — DealHunter`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryParam = params.category;
  const meta = getCategoryMeta(categoryParam);
  if (!meta) {
    notFound();
  }

  const [brands, coupons] = await Promise.all([getMockBrands(), getMockCoupons()]);

  // Filter brands by this category tag
  const matchingBrands = brands.filter(
    b => b.category?.toLowerCase() === meta.id || b.category?.toLowerCase() === meta.name.toLowerCase()
  );
  
  const brandIds = new Set(matchingBrands.map(b => b.id));

  // Filter coupons belonging to these matching brands
  const categoryCoupons = coupons.filter(
    c => brandIds.has(c.brandId) && c.status === "ACTIVE"
  );

  const totalCouponsCount = categoryCoupons.length;
  const activeStoresCount = matchingBrands.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full min-w-0" id="category-page-container">
      {/* Breadcrumb block */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span>/</span>
        <span className="text-gray-400">Coupons</span>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{meta.name}</span>
      </div>

      {/* Hero Category Header Banner */}
      <div className="bg-gradient-to-br from-violet-500/5 via-violet-600/5 to-transparent border border-violet-500/10 rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl">{meta.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {meta.name} Promo Codes
            </h1>
          </div>
          <p className="text-sm text-gray-650 leading-relaxed max-w-xl">
            {meta.description} Find all verified discounts, promo codes, and affiliate shipping deals updated today.
          </p>
        </div>
        <div className="flex gap-4 md:gap-8 bg-white/70 backdrop-blur border border-white/60 py-4 px-6 rounded-2xl shrink-0 self-start md:self-auto shadow-xs">
          <div className="text-center md:text-left">
            <div className="text-2xl font-black text-gray-900">{totalCouponsCount}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Active Codes</div>
          </div>
          <div className="border-r border-gray-200" />
          <div className="text-center md:text-left">
            <div className="text-2xl font-black text-violet-600">{activeStoresCount}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Partner Stores</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - List of Coupons */}
        <div className="lg:w-2/3 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎟️</span> Best Coupons in this Category
          </h2>

          {categoryCoupons.length > 0 ? (
            <CouponList initialCoupons={categoryCoupons} />
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-xs">
              <div className="text-5xl mb-4">🍃</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">No Active Codes Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                All discount promotions for {meta.name} have expired or are currently under moderation. Check back soon or submit a code!
              </p>
              <Link 
                href="/submit" 
                className="inline-block bg-violet-600 hover:bg-violet-750 text-white font-bold py-2.5 px-5 rounded-xl transition text-sm shadow-sm"
              >
                Submit a Coupon ✨
              </Link>
            </div>
          )}
        </div>

        {/* Right Column - Brand directory and side links */}
        <div className="lg:w-1/3 space-y-6">
          {/* Top Brands Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
              <span>🏪</span> Top {meta.name} Stores
            </h3>
            {matchingBrands.length > 0 ? (
              <div className="flex flex-col gap-4">
                {matchingBrands.map(b => (
                  <Link key={b.id} href={`/${b.slug}-coupon-codes`} className="flex items-center gap-3 group">
                    <ClientImage
                      src={b.logoUrl || ""}
                      alt={b.name}
                      className="w-full h-full object-contain"
                      containerClassName="w-10 h-10 rounded-xl border border-gray-150 p-1 group-hover:border-violet-300 transition bg-white flex items-center justify-center shrink-0 overflow-hidden"
                      fallbackClassName="w-full h-full flex items-center justify-center font-bold text-violet-600 bg-violet-50 text-sm rounded-lg"
                      fallbackText={b.name.charAt(0).toUpperCase()}
                    />
                    <div>
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-violet-600 transition">
                        {b.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {b.couponCount || 0} active offers • {b.domain}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No partner brands found in this category.</p>
            )}
          </div>

          {/* Quick links to alternative categories */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150 shadow-xs">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Other Categories</h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(CATEGORIES_METADATA)
                .filter(c => c.id !== meta.id)
                .map(cat => (
                  <Link
                    key={cat.id}
                    href={`/coupons/${cat.id}`}
                    className="bg-white hover:bg-violet-50 hover:border-violet-300 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
