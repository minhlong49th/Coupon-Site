"use client";
import { useState } from "react";
import type { Coupon, Brand } from "@/types";
import { StatusBadge, TypeBadge } from "@/components/ui/badge";
import { CouponModal } from "./CouponModal";
import { ConfirmModal } from "./ConfirmModal";
import { QuickAddModal } from "./QuickAddModal";

export function CouponTable({ initialCoupons, brands }: { initialCoupons: Coupon[], brands: Brand[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null | undefined>(undefined);
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);

  const handleSave = (couponData: Partial<Coupon>) => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, ...couponData } as Coupon : c));
      setEditingCoupon(undefined);
    } else {
      const newCoupon: Coupon = {
        ...couponData,
        id: Math.random().toString(36).substring(7),
        brand: couponData.brand || brands.find(b => b.id === couponData.brandId) || brands[0],
        successRate: 0,
        useCount: 0,
        clickCount: 0,
        upvotes: 0,
        downvotes: 0,
        submittedBy: "ADMIN",
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any as Coupon;
      setCoupons([newCoupon, ...coupons]);
      setAddingCoupon(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingCouponId) return;
    try {
      await fetch(`/api/admin/coupons/${deletingCouponId}`, { method: 'DELETE' });
      setCoupons(prev => prev.filter(c => c.id !== deletingCouponId));
    } catch (err) {
      console.error("Failed to delete coupon", err);
    } finally {
      setDeletingCouponId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full min-w-0">
       <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Coupons</h1>
          <button onClick={() => setAddingCoupon(true)} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition">+ Add Coupon</button>
       </div>
       
       <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left text-gray-300">
             <thead className="bg-[#1A1D26] text-xs uppercase text-gray-500 border-b border-white/[0.06]">
               <tr>
                 <th className="px-5 py-3">Code</th>
                 <th className="px-5 py-3">Store</th>
                 <th className="px-5 py-3">Type</th>
                 <th className="px-5 py-3">Discount</th>
                 <th className="px-5 py-3 text-center">Status</th>
                 <th className="px-5 py-3 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/[0.04]">
               {coupons.map(c => {
                 const brand = brands.find(b => b.id === c.brandId) || c.brand;
                 return (
                   <tr key={c.id} className="hover:bg-white/[0.02]">
                     <td className="px-5 py-4 font-mono font-bold text-white">{c.code}</td>
                     <td className="px-5 py-4">
                       <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                           {brand?.logoUrl ? (
                             <img 
                               src={brand.logoUrl} 
                               className="w-full h-full object-contain p-0.5 bg-white" 
                               onError={(e) => {
                                 (e.target as HTMLImageElement).style.display = 'none';
                                 (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                               }}
                             />
                           ) : null}
                           <div className={`${brand?.logoUrl ? 'hidden ' : ''}w-full h-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-bold`}>
                             {brand?.name.charAt(0).toUpperCase()}
                           </div>
                         </div>
                         <span className="font-medium text-gray-200">{brand?.name}</span>
                       </div>
                     </td>
                     <td className="px-5 py-4 text-xs text-gray-400">{c.type}</td>
                     <td className="px-5 py-4"><TypeBadge type={c.type} value={c.discountValue} /></td>
                     <td className="px-5 py-4 text-center"><StatusBadge status={c.status} /></td>
                     <td className="px-5 py-4 text-right">
                       <button onClick={() => setEditingCoupon(c)} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/[0.05] mr-2">Edit</button>
                       <button onClick={() => setDeletingCouponId(c.id)} className="text-xs text-red-500 hover:text-white px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 mr-2">Delete</button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
         </div>
       </div>

       {addingCoupon && (
         <QuickAddModal 
           brands={brands}
           onClose={() => setAddingCoupon(false)} 
           onSave={handleSave} 
         />
       )}

       {editingCoupon && (
         <CouponModal 
           coupon={editingCoupon} 
           brands={brands}
           onClose={() => setEditingCoupon(undefined)} 
           onSave={handleSave} 
         />
       )}

       {deletingCouponId && (
         <ConfirmModal
           title="Delete Coupon"
           message="Are you sure you want to delete this coupon? This action cannot be undone."
           confirmLabel="Delete"
           onConfirm={confirmDelete}
           onCancel={() => setDeletingCouponId(null)}
         />
       )}
    </div>
  );
}
