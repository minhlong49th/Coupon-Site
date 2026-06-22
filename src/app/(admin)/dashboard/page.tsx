import type { Metadata } from "next";
import { StatCard } from "@/components/admin/StatCard";
import { getMockStats, getMockCoupons, getMockBrands } from "@/lib/mock-data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const [stats, coupons, brands] = await Promise.all([
    getMockStats(),
    getMockCoupons(),
    getMockBrands(),
  ]);

  const recentCoupons = coupons.slice(0, 5);
  const topBrands = brands.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {stats.moderation.pendingCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3.5">
          <span className="text-amber-400 text-sm font-semibold">
            {stats.moderation.pendingCount} coupons waiting for review
          </span>
          <Link href="/moderation" className="ml-auto text-xs bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] px-3 py-1.5 rounded-lg transition-all">
            Review now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active coupons"  value={stats.coupons.active}              sub={`+${stats.coupons.addedToday} today`} accent="violet" trend={{ value: 12, label: "vs last week" }}/>
        <StatCard label="Total brands"    value={stats.brands.total}                sub={`${stats.brands.active} active`}      accent="blue"/>
        <StatCard label="Clicks today"    value={stats.traffic.clicksToday}         sub={`${stats.traffic.conversionRate}% CVR`} accent="green" trend={{ value: 8, label: "vs yesterday" }}/>
        <StatCard label="Est. revenue"    value={`$${stats.revenue.estimatedThisMonth.toLocaleString()}`} sub="This month" accent="amber"/>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-[#0F1117] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold">Recent coupons</h2>
            <Link href="/coupons" className="text-xs text-gray-400 hover:text-white">View all</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Brand / Code","Type","Status","Clicks"].map((h, i) => (
                  <th key={h} className={`py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-white/[0.06] ${i === 3 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCoupons.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      {c.brand.logoUrl && <img src={c.brand.logoUrl} alt="" className="w-5 h-5 rounded object-contain bg-white/5 flex-shrink-0"/>}
                      <div>
                        <p className="text-xs text-gray-400">{c.brand.name}</p>
                        <code className="text-xs text-violet-400 font-mono font-semibold">{c.code}</code>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-white/[0.04]">
                    <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20">
                      {c.discountValue ? `${c.discountValue}${c.type === "PERCENT" ? "%" : "$"} OFF` : c.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-white/[0.04]">
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${c.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : c.status === "PENDING" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "bg-gray-500/15 text-gray-400 border-gray-500/20"}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-white/[0.04] text-right">
                    <span className="text-xs text-gray-300 tabular-nums">{c.clickCount.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-2 bg-[#0F1117] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold">Top brands</h2>
            <Link href="/brands" className="text-xs text-gray-400 hover:text-white">View all</Link>
          </div>
          <div className="p-2">
            {topBrands.map((b, i) => (
              <div key={b.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03]">
                <span className="text-xs text-gray-600 w-4 text-right">{i + 1}</span>
                {b.logoUrl && <img src={b.logoUrl} alt="" className="w-7 h-7 rounded-lg object-contain bg-white/5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.couponCount} coupons</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-300">{(b.clickCount || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
