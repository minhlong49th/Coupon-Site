"use client";
import { useState, useEffect } from "react";
import type { Brand } from "@/types";

interface BrandModalProps {
  brand?: Brand | null;
  onClose: () => void;
  onSave: (brand: Partial<Brand>) => void;
}

export function BrandModal({ brand, onClose, onSave }: BrandModalProps) {
  const [form, setForm] = useState<Partial<Brand>>({
    name: "",
    slug: "",
    domain: "",
    logoUrl: "",
    affiliateUrl: "",
    category: "Fashion",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (brand) {
      setForm(brand);
    }
  }, [brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#1A1D26] border border-white/10 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">{brand ? "Edit Brand" : "Add Brand"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="brand-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Name *</label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Slug *</label>
                <input required type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Domain</label>
                <input type="text" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value, logoUrl: e.target.value.includes('.') ? `https://img.logo.dev/${e.target.value}?token=pk_test_placeholder` : form.logoUrl })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white appearance-none">
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Travel">Travel</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Education">Education</option>
                  <option value="Food">Food</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Software">Software</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {form.domain && form.domain.includes('.') && form.name && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={`https://img.logo.dev/${form.domain}?token=${process.env.NEXT_PUBLIC_LOGODEV_TOKEN || 'pk_test_placeholder'}`} 
                    alt={form.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold">
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{form.name}</div>
                  <div className="text-xs text-gray-400">{form.domain}</div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Logo URL (Auto-filled but editable)</label>
              <input type="url" value={form.logoUrl || ""} onChange={e => setForm({ ...form, logoUrl: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Affiliate URL *</label>
              <input required type="url" value={form.affiliateUrl} onChange={e => setForm({ ...form, affiliateUrl: e.target.value })} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Description</label>
              <textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-violet-500 text-white resize-none"></textarea>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded text-violet-600 bg-[#0F1117] border-white/10" />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-300">Is Active</label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition">Cancel</button>
          <button form="brand-form" type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-semibold transition">Save Brand</button>
        </div>
      </div>
    </div>
  );
}
