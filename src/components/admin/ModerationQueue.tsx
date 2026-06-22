"use client";
import type { Coupon } from "@/types";
import { useState } from "react";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

export function ModerationQueue({ initialPending, activeCoupons = [] }: { initialPending: Coupon[], activeCoupons?: Coupon[] }) {
  const [queue, setQueue] = useState(initialPending);

  const approve = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      if (res.ok) {
        setQueue(q => q.filter(c => c.id !== id));
        toast.success("Coupon approved successfully!");
      } else {
        toast.error("Failed to approve coupon.");
      }
    } catch (e) {
      toast.error("An error occurred.");
    }
  };

  const reject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      if (res.ok) {
        setQueue(q => q.filter(c => c.id !== id));
        toast.success("Coupon marked as rejected.");
      } else {
        toast.error("Failed to reject coupon.");
      }
    } catch (e) {
      toast.error("An error occurred.");
    }
  };

  const merge = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      if (res.ok) {
        setQueue(q => q.filter(c => c.id !== id));
        toast.success("Coupon merged and verified!");
      } else {
        toast.error("Failed to merge coupon.");
      }
    } catch (e) {
      toast.error("An error occurred.");
    }
  };

  // Check if a pending coupon already exists as ACTIVE for the same brand and code
  const isDuplicate = (coupon: Coupon) => {
    return activeCoupons.some(
      active => active.brandId === coupon.brandId && active.code === coupon.code
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full min-w-0">
       <div className="flex flex-col mb-6 gap-2">
           <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Moderation Queue</h1>
              <span className="bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-full text-sm">{queue.length} Pending</span>
           </div>
           
           <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm">
             <div className="text-blue-400 mt-0.5">ℹ️</div>
             <div className="text-blue-100/80 space-y-2">
               <p>
                 <strong>Moderation policy:</strong> Review user-submitted coupons before they go live.<br/>
                 Approve → live immediately. Reject → user notified with reason.
               </p>
               <p className="text-blue-200/50 text-xs">
                 <strong>Anti-spam note:</strong> Users are rate-limited to 5 submissions/hour, require login, and are protected by CAPTCHA (Cloudflare Turnstile) on the frontend. This queue is protected from bot floods, but be mindful of suspicious patterns.
               </p>
             </div>
           </div>
       </div>

       {queue.length === 0 ? (
          <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-12 text-center">
             <div className="text-4xl mb-4">🎉</div>
             <h2 className="text-xl font-bold text-white mb-2">Caught up!</h2>
             <p className="text-gray-500">The moderation queue is empty. Great work!</p>
          </div>
       ) : (
          <div className="space-y-4">
             {queue.map(c => {
               const duplicate = isDuplicate(c);
               const submitterCount = queue.filter(q => q.submittedBy === c.submittedBy).length;
               return (
                 <div key={c.id} className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 flex flex-col md:flex-row gap-6 relative">
                    {duplicate && (
                      <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-amber-400/20">
                        Duplicate — already exists
                      </div>
                    )}
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {c.brand.logoUrl ? (
                            <img src={c.brand.logoUrl} className="w-6 h-6 rounded bg-white p-0.5" />
                          ) : (
                            <div className="w-6 h-6 rounded bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-bold">
                              {c.brand.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-gray-300">{c.brand.name}</span>
                          <span className="text-gray-500 text-sm mx-1">•</span>
                          <span suppressHydrationWarning className="text-gray-500 text-xs text-nowrap">Submitted by {c.submittedBy} {timeAgo(c.createdAt)}</span>
                          {submitterCount > 10 && (
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold ml-2">
                              High volume submitter — review carefully
                            </span>
                          )}
                       </div>
                       <div className="font-mono text-xl text-violet-400 font-bold mb-1 tracking-wider">{c.code}</div>
                       <div className="font-medium text-white mb-1">{c.title}</div>
                       {c.description && <div className="text-sm text-gray-400">{c.description}</div>}
                    </div>
                    <div className="flex md:flex-col gap-2 shrink-0 md:w-40 items-end justify-center">
                       {duplicate ? (
                         <button onClick={() => merge(c.id)} className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Merge & Verify</button>
                       ) : (
                         <button onClick={() => approve(c.id)} className="w-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Approve</button>
                       )}
                       <button onClick={() => reject(c.id)} className="w-full bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-500/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Reject</button>
                    </div>
                 </div>
               );
             })}
          </div>
       )}
    </div>
  );
}
