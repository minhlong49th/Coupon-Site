"use client";

import { useState } from "react";
import type { Brand } from "@/types";

interface SubmitModalProps {
  onClose: () => void;
  brands: Omit<Brand, "createdAt" | "updatedAt">[];
}

export function SubmitModal({ onClose, brands }: SubmitModalProps) {
  const [form, setForm] = useState({
    url: "",
    code: "",
    type: "PERCENT",
    discountValue: "",
    description: "",
    brandId: ""
  });
  
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");

    // Simulate Rate Limit
    const submits = Number(localStorage.getItem('submit_count') || 0);
    if (submits >= 5) {
      setSubmitState("idle");
      setErrorMsg("Rate limit exceeded: You can only submit 5 coupons per hour. Please try again later.");
      return;
    }

    // Simulate Submission & Duplicate Detection
    setTimeout(() => {
      // Fake duplicate check (e.g. if code is NIKE20)
      if (form.code === "NIKE20" && form.brandId === "1") {
        setSubmitState("duplicate");
        localStorage.setItem('submit_count', (submits + 1).toString());
      } else {
        setSubmitState("success");
        localStorage.setItem('submit_count', (submits + 1).toString());
        setTimeout(() => onClose(), 2000);
      }
    }, 800);
  };

  if (submitState === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thanks for sharing!</h2>
          <p className="text-gray-600 mb-6">Your code is under review. You&apos;ll earn +10 karma points once verified.</p>
          <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg transition">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Submit a Coupon Code</h2>
            <p className="text-sm text-gray-500">Earn +10 karma for each working code you share.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="submit-form" onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {errorMsg}
              </div>
            )}
            
            {submitState === "duplicate" && (
              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-200">
                <strong>Duplicate code:</strong> This code already exists in our database — we&apos;ve bumped its priority for re-verification! You earned +1 karma.
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Store / Brand *</label>
              <select required value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900">
                <option value="">Select a store</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Coupon Code *</label>
              <input required type="text" placeholder="e.g. SUMMER20" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 font-mono focus:border-violet-500 text-gray-900 uppercase" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900">
                     <option value="PERCENT">% Off</option>
                     <option value="FIXED">$ Off</option>
                     <option value="FREE_SHIPPING">Free Shipping</option>
                     <option value="BOGO">BOGO</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Value</label>
                  <input type="number" placeholder="20" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} disabled={form.type === 'FREE_SHIPPING' || form.type === 'BOGO'} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" />
               </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title & Description *</label>
              <textarea required placeholder="e.g. 20% off sitewide. Excludes sale items." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 resize-none"></textarea>
            </div>
            
            {/* CAPTCHA Placeholder */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" id="captcha" />
                 <label htmlFor="captcha" className="text-sm font-medium text-gray-700 cursor-pointer">I am human (Cloudflare Turnstile)</label>
               </div>
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm text-violet-800">
               💜 You&apos;ll earn 10 karma points if this code is verified working
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} disabled={submitState === 'submitting'} className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition disabled:opacity-50">Cancel</button>
          <button form="submit-form" type="submit" disabled={submitState === 'submitting'} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center min-w-[140px]">
            {submitState === 'submitting' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Submit Code →'}
          </button>
        </div>
      </div>
    </div>
  );
}
