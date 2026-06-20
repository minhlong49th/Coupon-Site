"use client";
import { useState, useEffect } from "react";
import type { Coupon, Brand } from "@/types";

interface CouponModalProps {
  coupon?: Coupon | null;
  brands: Brand[];
  onClose: () => void;
  onSave: (coupon: Partial<Coupon>) => void;
}

export function CouponModal({ coupon, brands, onClose, onSave }: CouponModalProps) {
  const [form, setForm] = useState<Partial<Coupon>>({
    brandId: brands[0]?.id || "",
    code: "",
    title: "",
    description: "",
    type: "PERCENT",
    discountValue: 0,
    affiliateUrl: "",
    status: "ACTIVE",
    expiresAt: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (coupon) {
      setForm({
        ...coupon,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 16) : "",
      });
    }
  }, [coupon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      discountValue: form.discountValue ? Number(form.discountValue) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#1A1D26] border border-white/10 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">{coupon ? "Edit Coupon" : "Add Coupon"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="coupon-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Brand *</label>
                <select required value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white">
                  <option value="">Select a brand</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Code *</label>
                <input required type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full font-mono uppercase bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Title *</label>
              <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white">
                  <option value="PERCENT">% Off</option>
                  <option value="FIXED">$ Off</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                  <option value="BOGO">BOGO</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Discount Value</label>
                <input type="number" step="0.01" value={form.discountValue || ""} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white">
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Expires At</label>
                <input type="datetime-local" value={form.expiresAt || ""} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" style={{colorScheme: 'dark'}}/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Affiliate URL *</label>
              <input required type="url" value={form.affiliateUrl || ""} onChange={e => setForm({ ...form, affiliateUrl: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Description</label>
              <textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white resize-none"></textarea>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 rounded text-violet-600 bg-[#0F1117] border-white/10" />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-300">Featured Coupon</label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition">Cancel</button>
          <button form="coupon-form" type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-semibold transition">Save Coupon</button>
        </div>
      </div>
    </div>
  );
}
