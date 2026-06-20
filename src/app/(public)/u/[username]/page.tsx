import type { Metadata } from "next";
import { getMockCoupons } from "@/lib/mock-data";
import { CouponListItem } from "@/components/public/CouponListItem";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const username = (await params).username;
  return {
    title: `${username}'s Profile — DealHunter`,
    description: `Check out ${username}'s submitted coupons and karma points on DealHunter.`,
    openGraph: {
      title: `${username}'s DealHunter Profile`,
      url: `https://dealhunter.com/u/${username}`,
    },
  };
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const username = (await params).username;
  const allCoupons = await getMockCoupons();
  const userCoupons = allCoupons.slice(0, 3); // mock submitted coupons

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full min-w-0">
       <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm mb-8 text-center md:text-left">
         <div className="w-24 h-24 bg-violet-600 rounded-full text-white flex items-center justify-center text-4xl font-bold shadow-md shrink-0">
           {username.charAt(0).toUpperCase()}
         </div>
         <div className="flex-1">
           <h1 className="text-3xl font-bold text-gray-900 mb-1">@{username}</h1>
           <div className="text-gray-500 text-sm mb-3">Member since 2026</div>
         </div>
         <div className="flex flex-col items-center md:items-end">
            <div className="text-4xl font-bold text-violet-600">420</div>
            <div className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Karma</div>
            <span className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Member</span>
         </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
             <div className="text-3xl font-bold text-gray-900 mb-1">{userCoupons.length}</div>
             <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Coupons Submitted</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
             <div className="text-3xl font-bold text-emerald-600 mb-1">2</div>
             <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Working Codes</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
             <div className="text-3xl font-bold text-violet-600 mb-1">420</div>
             <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Karma Points</div>
          </div>
       </div>

       <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submitted Coupons</h2>
          <div className="space-y-4">
             {userCoupons.map(c => (
                <div key={c.id} className="relative">
                   <CouponListItem coupon={c} />
                   <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Verified</div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
