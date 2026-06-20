"use client";
import { useState } from "react";
import type { Brand } from "@/types";
import { BrandModal } from "./BrandModal";
import { ConfirmModal } from "./ConfirmModal";

export function BrandGrid({ brands: initialBrands }: { brands: Brand[] }) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [editingBrand, setEditingBrand] = useState<Brand | null | undefined>(undefined);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

  const handleSave = (brandData: Partial<Brand>) => {
    if (editingBrand) {
      setBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...b, ...brandData } as Brand : b));
    } else {
      const newBrand: Brand = {
        ...brandData,
        id: Math.random().toString(36).substring(7),
        couponCount: 0,
        clickCount: 0,
        bestDiscount: 0,
        avgSuccess: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Brand;
      setBrands([newBrand, ...brands]);
    }
    setEditingBrand(undefined);
  };

  const confirmDelete = async () => {
    if (!deletingBrandId) return;
    try {
      await fetch(`/api/admin/brands/${deletingBrandId}`, { method: 'DELETE' });
      setBrands(prev => prev.filter(b => b.id !== deletingBrandId));
    } catch (err) {
      console.error("Failed to delete brand", err);
    } finally {
      setDeletingBrandId(null);
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingBrandId(id);
  };

  return (
    <div className="max-w-7xl mx-auto w-full min-w-0">
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-bold text-white">Brands</h1>
         <button onClick={() => setEditingBrand(null)} className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition">+ Add Brand</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map(b => (
          <div key={b.id} onClick={() => setEditingBrand(b)} className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-4 hover:border-white/10 transition group flex items-start gap-4 cursor-pointer relative">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
              {b.logoUrl ? (
                <img 
                  src={b.logoUrl} 
                  className="w-full h-full object-contain p-1 bg-white" 
                  alt={b.name} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${b.logoUrl ? 'hidden ' : ''}w-full h-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-lg font-bold`}>
                {b.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white truncate">{b.name}</h3>
                  <button onClick={(e) => handleDeleteClick(b.id, e)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition text-sm">Delete</button>
               </div>
               <p className="text-xs text-gray-500 truncate mb-2">{b.domain}</p>
               <span className="text-[10px] font-bold tracking-wider uppercase bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded">{b.category}</span>
            </div>
          </div>
        ))}
      </div>

      {editingBrand !== undefined && (
        <BrandModal 
          brand={editingBrand} 
          onClose={() => setEditingBrand(undefined)} 
          onSave={handleSave} 
        />
      )}

      {deletingBrandId && (
        <ConfirmModal
          title="Delete Brand"
          message="Are you sure you want to delete this brand? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingBrandId(null)}
        />
      )}
    </div>
  );
}
