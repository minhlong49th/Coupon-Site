import type { Metadata } from "next";
import { getMockBrands, getMockCoupons } from "@/lib/mock-data";
import { CouponCard } from "@/components/public/CouponCard";
import { BrandCard } from "@/components/public/BrandCard";

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = (await searchParams).q || "";
  return {
    title: query ? `Search Results for "${query}" — DealHunter` : "Search — DealHunter",
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (await searchParams).q || "";
  const allBrands = await getMockBrands();
  const allCoupons = await getMockCoupons();
  
  const q = query.toLowerCase().trim();

  const matchingBrands = allBrands.filter(b => b.name.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q));
  const matchingCoupons = allCoupons.filter(c => {
    return c.title.toLowerCase().includes(q) || 
           c.code.toLowerCase().includes(q) || 
           c.description?.toLowerCase().includes(q) ||
           (c.brand && c.brand.name.toLowerCase().includes(q));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full min-w-0">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Search Results for &quot;{query}&quot;</h1>
        <p className="text-gray-500 mt-2">Found {matchingBrands.length} stores and {matchingCoupons.length} coupons</p>
      </div>

      {matchingBrands.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Stores matching &quot;{query}&quot;</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             {matchingBrands.map(b => (
               <div key={b.id} className="w-64 shrink-0"><BrandCard brand={b} /></div>
             ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Coupons matching &quot;{query}&quot;</h2>
        {matchingCoupons.length > 0 ? (
          <div className="space-y-4 max-w-4xl">
            {matchingCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
          </div>
        ) : (
          <div className="bg-white border text-center shadow-sm max-w-4xl rounded-xl p-16">
             <div className="text-5xl mb-4">🔍</div>
             <h2 className="text-xl font-bold text-gray-900 mb-3">No coupons found for &apos;{query}&apos;</h2>
             <p className="text-gray-500 mb-6">Try searching for a different brand or checking out our categories.</p>
             <a href="/" className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 py-2.5 rounded-lg transition-colors">
               Return Home
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
