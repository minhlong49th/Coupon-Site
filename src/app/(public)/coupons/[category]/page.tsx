import type { Metadata } from "next";
import { getMockBrands, getMockCoupons } from "@/lib/mock-data";
import { CouponList } from "@/components/public/CouponList";
import { BrandCard } from "@/components/public/BrandCard";

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryStr = (await params).category;
  const Cat = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  return {
    title: `Best ${Cat} Coupons & Promo Codes — ${month}`,
    description: `Find the latest working ${Cat} promo codes, discounts, and deals verified for ${month}. Save money on your next purchase.`,
    openGraph: {
      title: `${Cat} Coupons & Deals`,
      url: `https://dealhunter.com/coupons/${categoryStr}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryStr = (await params).category;

  const allBrands = await getMockBrands();
  const allCoupons = await getMockCoupons();
  
  const brands = allBrands.filter(b => b.category.toLowerCase() === categoryStr.toLowerCase());
  const coupons = allCoupons.filter(c => {
    const b = allBrands.find(br => br.id === c.brandId);
    return b && b.category.toLowerCase() === categoryStr.toLowerCase();
  });

  const CatName = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full min-w-0">
      <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-2xl border border-violet-100 mb-10 text-center shadow-sm">
        <div className="text-5xl mb-4">✨</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{CatName} Coupons & Deals</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover {coupons.length} coupon codes from {brands.length} top {categoryStr} stores.</p>
      </div>

      {brands.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Popular {CatName} Stores</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             {brands.map(b => (
               <div key={b.id} className="w-64 shrink-0"><BrandCard brand={b} /></div>
             ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">All {CatName} Coupons</h2>
        <div className="max-w-4xl">
           <CouponList initialCoupons={coupons} />
        </div>
      </div>
    </div>
  );
}
