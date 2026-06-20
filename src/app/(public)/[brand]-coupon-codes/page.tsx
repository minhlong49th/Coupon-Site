import type { Metadata } from "next";
import { getMockBrandBySlug, getMockCouponsByBrand, getMockBrands } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { CouponList } from "@/components/public/CouponList";
import { BrandCard } from "@/components/public/BrandCard";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ClientImage } from "@/components/public/ClientImage";

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
  const brandSlug = (await params).brand;
  const brand = await getMockBrandBySlug(brandSlug);
  if (!brand) return { title: "Not Found" };
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  return {
    title: `${brand.couponCount} ${brand.name} Coupon Codes — ${month}`,
    description: `Save with ${brand.couponCount} verified ${brand.name} promo codes. Best discount: ${brand.bestDiscount}% off. Updated ${month}.`,
    openGraph: {
      title: `${brand.name} Coupons & Promo Codes`,
      url: `https://dealhunter.com/${brand.slug}-coupon-codes`,
    },
  };
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  const brandSlug = (await params).brand;
  const brand = await getMockBrandBySlug(brandSlug);
  if (!brand) notFound();
  
  const coupons = await getMockCouponsByBrand(brand.id);
  const allBrands = await getMockBrands();
  const similarBrands = allBrands.filter(b => b.category === brand.category && b.id !== brand.id).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full min-w-0">
       <div className="text-xs text-gray-500 mb-4">
         Home / {brand.category} / <span className="text-gray-900 font-medium">{brand.name} Coupons</span>
       </div>

       <div className="bg-white border-b border-gray-200 py-8 px-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <ClientImage
            src={brand.logoUrl || ""}
            alt={brand.name}
            className="w-full h-full object-contain"
            containerClassName="w-20 h-20 rounded-2xl border border-gray-100 p-2 shadow-sm shrink-0 bg-white flex items-center justify-center overflow-hidden"
            fallbackClassName="w-full h-full bg-violet-50 text-violet-600 flex items-center justify-center text-3xl font-bold rounded-xl"
            fallbackText={brand.name.charAt(0).toUpperCase()}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {brand.name} Coupon Codes
              <span className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{brand.category}</span>
            </h1>
            <TrackedLink href={brand.affiliateUrl} brandId={brand.id} className="text-sm text-gray-500 hover:text-violet-600 mt-1 inline-block">
              {brand.domain}
            </TrackedLink>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto mt-4 md:mt-0 text-center md:text-left">
             <div><div className="text-xl font-bold text-gray-900">{coupons.length}</div><div className="text-xs text-gray-500 font-medium uppercase">Coupons</div></div>
             <div><div className="text-xl font-bold text-emerald-600">{brand.bestDiscount}% OFF</div><div className="text-xs text-gray-500 font-medium uppercase">Best Deal</div></div>
             <div><div className="text-xl font-bold text-gray-900">{brand.avgSuccess}%</div><div className="text-xs text-gray-500 font-medium uppercase">Avg Success</div></div>
             <div><div className="text-xl font-bold text-gray-900">Today</div><div className="text-xs text-gray-500 font-medium uppercase">Verified</div></div>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
             {/* Filter Tabs Mock */}
             <div className="hidden sm:flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg w-fit">
               <span className="bg-white shadow-sm font-medium px-4 py-1.5 rounded-md text-sm cursor-pointer border border-gray-200">All ({coupons.length})</span>
               <span className="text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-md text-sm cursor-pointer">% Off</span>
               <span className="text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-md text-sm cursor-pointer">$ Off</span>
               <span className="text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-md text-sm cursor-pointer">Free Shipping</span>
             </div>

             <CouponList initialCoupons={coupons} />

             {brand.description && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-8">
                   <h3 className="font-bold text-gray-900 mb-3 text-lg">About {brand.name}</h3>
                   <p className="text-gray-600 leading-relaxed text-sm mb-4">{brand.description}</p>
                   <TrackedLink href={brand.affiliateUrl} brandId={brand.id} className="text-violet-600 hover:text-violet-700 font-medium text-sm">
                     Visit {brand.name} →
                   </TrackedLink>
                </div>
             )}
          </div>

          <div className="lg:w-1/3 space-y-6">
             <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-violet-900 mb-2">Know a code for {brand.name}?</h3>
                <p className="text-violet-700 text-sm mb-4">Share it with our community and earn karma points for every working code.</p>
                <button className="w-full bg-violet-600 text-white rounded-lg py-2.5 font-bold hover:bg-violet-700 transition">Submit Code</button>
             </div>

             {similarBrands.length > 0 && (
               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-4">Similar Stores</h3>
                 <div className="flex flex-col gap-4">
                    {similarBrands.map(b => (
                       <a key={b.id} href={`/${b.slug}-coupon-codes`} className="flex items-center gap-3 group">
                         <ClientImage
                           src={b.logoUrl || ""}
                           alt={b.name}
                           className="w-full h-full object-contain"
                           containerClassName="w-10 h-10 rounded border p-1 group-hover:border-violet-300 transition bg-white flex items-center justify-center shrink-0 overflow-hidden"
                           fallbackClassName="w-full h-full flex items-center justify-center font-bold text-violet-600 bg-violet-50 text-sm"
                           fallbackText={b.name.charAt(0).toUpperCase()}
                         />
                         <div>
                            <div className="font-semibold text-sm text-gray-900 group-hover:text-violet-600 transition">{b.name}</div>
                            <div className="text-xs text-gray-500">{b.couponCount} coupons</div>
                         </div>
                       </a>
                    ))}
                 </div>
               </div>
             )}
          </div>
       </div>
    </div>
  );
}
