"use client";
import { useState } from "react";
import type { Coupon, Brand } from "@/types";

interface QuickAddModalProps {
  brands: Brand[];
  onClose: () => void;
  onSave: (coupon: Partial<Coupon>) => void;
}

export function QuickAddModal({ brands, onClose, onSave }: QuickAddModalProps) {
  const [url, setUrl] = useState("");
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [detectedBrand, setDetectedBrand] = useState<Brand | null>(null);
  
  const [form, setForm] = useState({
    code: "",
    title: "",
    type: "PERCENT",
    discountValue: "",
    expiresAt: "",
    description: "",
    isFeatured: false,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const simulateAiDetect = async () => {
    if (!url) return;
    setAiState("loading");
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1400));
    
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domainParts = urlObj.hostname.replace('www.', '').split('.');
      const mainDomain = domainParts.length > 1 ? `${domainParts[domainParts.length-2]}.${domainParts[domainParts.length-1]}` : urlObj.hostname;
      
      const matchedBrand = brands.find(b => b.domain === mainDomain);
      
      if (matchedBrand) {
         setDetectedBrand(matchedBrand);
         setAiState("done");
      } else if (mainDomain.includes('.')) {
         // Fallback to capitalizing domain name
         const name = domainParts[domainParts.length-2].charAt(0).toUpperCase() + domainParts[domainParts.length-2].slice(1);
         const token = process.env.NEXT_PUBLIC_LOGODEV_TOKEN || 'pk_test_placeholder';
         
         const newBrand = {
           id: "temp_" + Date.now(),
           name,
           domain: mainDomain,
           logoUrl: `https://img.logo.dev/${mainDomain}?token=${token}`,
           category: "Other"
         } as Brand;
         setDetectedBrand(newBrand);
         setAiState("done");
      } else {
         setAiState("error");
      }
    } catch (e) {
      setAiState("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && aiState !== 'done') {
      e.preventDefault();
      simulateAiDetect();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedBrand) return;
    setSaving(true);
    
    // Wait a bit fully to show saving state
    await new Promise(r => setTimeout(r, 600));
    
    onSave({
      brandId: detectedBrand.id,
      brand: detectedBrand,
      affiliateUrl: url,
      code: form.code.toUpperCase(),
      title: form.title,
      type: form.type as any,
      discountValue: form.discountValue ? Number(form.discountValue) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      description: form.description,
      isFeatured: form.isFeatured,
      status: "ACTIVE"
    });
    
    setSaved(true);
    setTimeout(() => onClose(), 900);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[#0F1117] border border-white/[0.08] rounded-2xl flex flex-col max-h-[90vh] shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <span className="text-xl">🪄</span>
             <div>
                <h2 className="text-lg font-bold text-white">Quick Add Coupon</h2>
                <p className="text-xs text-gray-400">Paste affiliate URL → AI detects brand automatically</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 transition">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1 */}
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <span className="bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Step 1</span>
                <span className="font-medium text-white text-sm">Paste your affiliate link</span>
             </div>
             <div className="flex gap-2">
                <div className="relative flex-1">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">🔗</div>
                   <input 
                     type="url" 
                     value={url}
                     onChange={e => {
                        setUrl(e.target.value);
                        if (aiState === 'done') setAiState('idle');
                     }}
                     onKeyDown={handleKeyDown}
                     disabled={aiState === 'loading'}
                     placeholder="https://brand.com/affiliate-link" 
                     className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-violet-500 text-white text-sm transition"
                   />
                </div>
                <button 
                  type="button"
                  onClick={simulateAiDetect}
                  disabled={aiState === 'loading' || !url}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  Auto-fill
                </button>
             </div>

             {aiState === 'loading' && (
               <div className="flex items-center gap-2 text-violet-400 text-sm py-2">
                 <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                 Detecting brand, logo, and category...
               </div>
             )}

             {aiState === 'error' && (
               <div className="text-red-400 text-sm py-2 px-3 bg-red-500/10 rounded-lg border border-red-500/20">
                 Could not detect brand — try typing a brand domain like nike.com
               </div>
             )}

             {aiState === 'done' && detectedBrand && (
               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
                 <div className="text-emerald-400 text-lg">✓</div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                    {detectedBrand.logoUrl ? (
                      <img 
                        src={detectedBrand.logoUrl} 
                        alt={detectedBrand.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${detectedBrand.logoUrl ? 'hidden' : ''} w-full h-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold`}>
                      {detectedBrand.name.charAt(0).toUpperCase()}
                    </div>
                 </div>
                 <div>
                    <div className="font-bold text-emerald-400 text-sm">{detectedBrand.name} <span className="text-xs text-emerald-500/70 font-normal ml-1">Detected ✓</span></div>
                    <div className="text-xs text-emerald-500/70">{detectedBrand.domain} • {detectedBrand.category}</div>
                 </div>
               </div>
             )}
          </div>

          {/* STEP 2 */}
          {aiState === 'done' && (
            <div className="pt-6 border-t border-white/[0.08] space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center gap-2 mb-2">
                  <span className="bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Step 2</span>
                  <span className="font-medium text-white text-sm">Fill in coupon details</span>
               </div>
               
               <form id="quick-add-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Coupon code *</label>
                    <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-violet-500 text-white font-mono uppercase tracking-widest text-lg" />
                 </div>
                 
                 <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Title *</label>
                    <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. 20% off all sneakers" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-violet-500 text-white text-sm" />
                 </div>

                 <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-violet-500 text-white appearance-none text-sm">
                      <option value="PERCENT">Percent off (%)</option>
                      <option value="FIXED">Fixed amount ($)</option>
                      <option value="FREE_SHIPPING">Free shipping</option>
                      <option value="BOGO">Buy one get one</option>
                    </select>
                 </div>

                 {['PERCENT', 'FIXED'].includes(form.type) && (
                   <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Discount value</label>
                      <input type="number" step="0.01" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} placeholder="e.g. 20" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-violet-500 text-white text-sm" />
                   </div>
                 )}

                 <div className={['PERCENT', 'FIXED'].includes(form.type) ? "col-span-2" : "col-span-1"}>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Expires (min = today)</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-violet-500 text-white text-sm appearance-none" style={{colorScheme: 'dark'}} />
                 </div>

                 <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Description (optional)</label>
                    <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-violet-500 text-white text-sm resize-none" placeholder="Add terms and conditions..."></textarea>
                 </div>

                 <div className="col-span-2 flex items-center gap-2 mt-1">
                    <button 
                      type="button" 
                      onClick={() => setForm({...form, isFeatured: !form.isFeatured})}
                      className={`w-10 h-6 flex items-center rounded-full transition-colors ${form.isFeatured ? 'bg-violet-600' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${form.isFeatured ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-xs font-medium text-gray-300">Feature on homepage</span>
                 </div>
               </form>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-black/20 shrink-0">
           <button onClick={onClose} disabled={saving} className="px-4 py-2 font-medium text-sm text-gray-400 hover:text-white transition disabled:opacity-50">Cancel</button>
           {saved ? (
             <button disabled className="bg-emerald-600 text-white px-5 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition">
               <span>✓</span> Saved!
             </button>
           ) : (
             <button 
               form="quick-add-form" 
               type="submit" 
               disabled={!form.code || !form.title || aiState !== 'done' || saving}
               className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 flex items-center justify-center min-w-[120px] rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:hover:bg-violet-600"
             >
               {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save coupon'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
