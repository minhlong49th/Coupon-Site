"use client";

import { useState } from "react";
import type { Brand } from "@/types";

interface SubmitFormContainerProps {
  brands: Omit<Brand, "createdAt" | "updatedAt">[];
}

export function SubmitFormContainer({ brands }: SubmitFormContainerProps) {
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
      if (form.code === "NIKE20" && form.brandId === "1") {
        setSubmitState("duplicate");
        localStorage.setItem('submit_count', (submits + 1).toString());
      } else {
        setSubmitState("success");
        localStorage.setItem('submit_count', (submits + 1).toString());
      }
    }, 800);
  };

  if (submitState === "success") {
    return (
      <div className="text-center py-10" id="submit-success-box">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you! Code Submitted</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">Your code is under review by our core moderators. You&apos;ll earn +10 karma points once approved and verified live.</p>
        <button 
          onClick={() => {
            setSubmitState("idle");
            setForm({ url: "", code: "", type: "PERCENT", discountValue: "", description: "", brandId: "" });
            setErrorMsg("");
          }} 
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          Submit Another Coupon
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="submit-form-container">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {errorMsg}
        </div>
      )}
      
      {submitState === "duplicate" && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-200">
          <strong>Duplicate code:</strong> This code already exists in our database — we&apos;ve bumped its priority for re-verification! You still earned +1 karma.
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Store / Brand *</label>
        <select 
          required 
          value={form.brandId} 
          onChange={e => setForm({ ...form, brandId: e.target.value })} 
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 bg-white"
        >
          <option value="">Select a store</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Coupon Code *</label>
        <input 
          required 
          type="text" 
          placeholder="e.g. SUMMER20" 
          value={form.code} 
          onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} 
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 font-mono focus:border-violet-500 text-gray-900 uppercase" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type</label>
            <select 
              value={form.type} 
              onChange={e => setForm({ ...form, type: e.target.value })} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 bg-white"
            >
               <option value="PERCENT">% Off</option>
               <option value="FIXED">$ Off</option>
               <option value="FREE_SHIPPING">Free Shipping</option>
               <option value="BOGO">BOGO</option>
            </select>
         </div>
         <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Value</label>
            <input 
              type="number" 
              placeholder="20" 
              value={form.discountValue} 
              onChange={e => setForm({ ...form, discountValue: e.target.value })} 
              disabled={form.type === 'FREE_SHIPPING' || form.type === 'BOGO'} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" 
            />
         </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Title & Description *</label>
        <textarea 
          required 
          placeholder="e.g. 20% off sitewide. Excludes sale items." 
          value={form.description} 
          onChange={e => setForm({ ...form, description: e.target.value })} 
          rows={3} 
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 resize-none"
        ></textarea>
      </div>
      
      {/* CAPTCHA Placeholder */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" id="captcha" />
           <label htmlFor="captcha" className="text-sm font-medium text-gray-700 cursor-pointer">I am human (Cloudflare Turnstile)</label>
         </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm text-violet-800">
         💜 You&apos;ll earn 10 karma points once approved.
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={submitState === 'submitting'}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl transition disabled:bg-violet-400"
        >
          {submitState === 'submitting' ? 'Submitting...' : 'Submit Coupon Code'}
        </button>
      </div>
    </form>
  );
}
