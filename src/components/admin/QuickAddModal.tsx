"use client";

import React, { useState, useEffect } from "react";
import type { Brand, Coupon, CouponType } from "@/types";
import { X, Sparkles, Link as LinkIcon, AlertCircle, Info, ChevronRight, Save, Check } from "lucide-react";

interface QuickAddModalProps {
  brands: Brand[];
  onClose: () => void;
  onSave: (coupon: Partial<Coupon>) => void;
}

export function QuickAddModal({ brands, onClose, onSave }: QuickAddModalProps) {
  // Navigation tabs inside dialog for high control: AI Auto-fill vs Manual Full Form
  const [activeTab, setActiveTab] = useState<"AUTO" | "MANUAL">("AUTO");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState<string | null>(null);

  // Comprehensive coupon attributes representing FULL information mapping to frontend
  const [form, setForm] = useState({
    brandId: "",
    code: "",
    title: "",
    description: "",
    type: "PERCENT" as CouponType,
    discountValue: 20,
    affiliateUrl: "",
    status: "ACTIVE" as "ACTIVE" | "PENDING" | "EXPIRED" | "REJECTED",
    expiresAt: "",
    isFeatured: false,
    successRate: 100,
    useCount: 0,
    upvotes: 0,
    downvotes: 0,
  });

  // Pre-seed first brand as default
  useEffect(() => {
    if (brands.length > 0 && !form.brandId) {
      setForm((prev) => ({ ...prev, brandId: brands[0].id }));
    }
  }, [brands, form.brandId]);

  // Intelligent domain extraction & property suggestion simulation (behaves like quick smart AI extraction)
  const handleAutoFill = () => {
    if (!affiliateUrl) return;
    setIsDetecting(true);
    setDetectionSuccess(null);

    setTimeout(() => {
      let domain = "";
      try {
        const urlObj = new URL(affiliateUrl);
        domain = urlObj.hostname.replace("www.", "");
      } catch (e) {
        const cleanStr = affiliateUrl.replace(/^(https?:\/\/)?(www\.)?/, "");
        domain = cleanStr.split("/")[0];
      }

      const domainBase = domain.split(".")[0]?.toLowerCase() || "store";

      // Match against known brands
      const matchedBrand = brands.find((b) => {
        const bName = b.name.toLowerCase();
        const bSlug = b.slug.toLowerCase();
        const bDomain = b.domain?.toLowerCase() || "";
        return (
          bName.includes(domainBase) ||
          bSlug.includes(domainBase) ||
          bDomain.includes(domainBase) ||
          domainBase.includes(bName) ||
          bSlug.includes(domainBase)
        );
      });

      const finalBrandId = matchedBrand?.id || brands[0]?.id || "";
      const finalBrandName = matchedBrand?.name || domainBase;

      // Create realistic suggestions
      const randomValue = Math.random() > 0.5 ? 15 : 20;
      const discountType: CouponType = Math.random() > 0.4 ? "PERCENT" : "FIXED";
      const uppercaseBrand = finalBrandName.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const suggestedCode = `${uppercaseBrand}${randomValue}`;
      const capitalizedName = finalBrandName.charAt(0).toUpperCase() + finalBrandName.slice(1);
      const suggestedTitle = `${randomValue}${discountType === "PERCENT" ? "%" : "$"} Off Sitewide Coupon Code at ${capitalizedName}`;
      const suggestedDesc = `Get an extra ${randomValue}${discountType === "PERCENT" ? "%" : "$"} discount on all items online at ${capitalizedName}. Copy Coupon Code, visit the store, and check out now.`;

      // Future expiration date (30 days ahead)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const expiryString = futureDate.toISOString().substring(0, 16);

      setForm((prev) => ({
        ...prev,
        brandId: finalBrandId,
        code: suggestedCode,
        title: suggestedTitle,
        description: suggestedDesc,
        type: discountType,
        discountValue: randomValue,
        affiliateUrl: affiliateUrl,
        expiresAt: expiryString,
        successRate: 98,
        useCount: Math.floor(Math.random() * 50) + 20,
        upvotes: Math.floor(Math.random() * 12) + 4,
        downvotes: 0,
      }));

      setIsDetecting(false);
      setDetectionSuccess(`Matched with store "${capitalizedName}" and auto-filled full metadata successfully!`);
      // Shift tab to MANUAL to allow reviewing and customizing the auto-filled full information
      setActiveTab("MANUAL");
    }, 850);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    // Call save event to append coupon in state
    onSave({
      ...form,
      discountValue: form.type === "FREE_SHIPPING" ? undefined : Number(form.discountValue),
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      successRate: Number(form.successRate || 100),
      useCount: Number(form.useCount || 0),
      upvotes: Number(form.upvotes || 0),
      downvotes: Number(form.downvotes || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="quick-add-modal-container">
      {/* Background close trig */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main dialog box */}
      <div className="bg-[#1A1D26] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative z-10 transition-transform duration-200">
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1B1E27] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Quick Add Coupon</h2>
              <p className="text-xs text-gray-400">Generate a comprehensive coupon using URL or manually</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition"
            id="close-quickkey-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/[0.06] bg-[#141720] px-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("AUTO")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === "AUTO"
                ? "border-violet-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            1. Paste Affiliate Link (AI Autocomplete)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MANUAL")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === "MANUAL"
                ? "border-violet-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            2. Full Coupon Details
          </button>
        </div>

        {/* Scrollable form controls */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5" id="quick-add-form">
          
          {activeTab === "AUTO" && (
            <div className="space-y-4">
              <div className="bg-violet-950/20 border border-violet-850/40 rounded-xl p-4 text-sm text-violet-300">
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-white mb-0.5 text-sm">Smart Metadata Generation</h4>
                    <p className="text-xs leading-relaxed text-violet-300">
                      Paste the store or product affiliate URL below. Our system will extract the brand, recommend high-converting titles, match status attributes, and generate matching code setups.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-400 mb-1.5">STEP 1: Paste your affiliate link</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      placeholder="https://client-brand.com/special-affiliate-link"
                      value={affiliateUrl}
                      onChange={(e) => setAffiliateUrl(e.target.value)}
                      className="w-full bg-[#0F1117] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-violet-500 text-sm string text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={isDetecting || !affiliateUrl}
                    className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/40 disabled:text-white/40 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition shrink-0 active:scale-[0.98]"
                    id="auto-fill-btn"
                  >
                    {isDetecting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Auto-fill
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Example: https://nike.com/affiliate-promo</p>
              </div>

              {detectionSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3.5 flex gap-2 items-center text-sm text-emerald-400">
                  <Check className="w-5 h-5 shrink-0" />
                  <span>{detectionSuccess}</span>
                </div>
              )}

              {/* Quick info fallback banner */}
              <div className="bg-gray-900/50 border border-white/[0.04] rounded-lg p-4 flex gap-3 text-xs text-gray-400">
                <Info className="w-4 h-4 shrink-0 text-violet-400 mt-0.5" />
                <div>
                  <h5 className="font-bold text-gray-300 mb-0.5">Looking to fill manually?</h5>
                  <p className="leading-relaxed">You can switch to the &quot;Full Coupon Details&quot; tab above at any time to type custom information without using a pastable link.</p>
                </div>
              </div>

              {/* Action row when inside STEP 1 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06] shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!form.title}
                  onClick={() => setActiveTab("MANUAL")}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition"
                >
                  Configure Details 
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "MANUAL" && (
            <div className="space-y-4">
              
              {/* Alert reminder */}
              {!form.affiliateUrl && (
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 flex gap-2 text-amber-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>No affiliate URL entered yet. Be sure to provide one below so click metrics track correctly!</span>
                </div>
              )}

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Brand / Store */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Store / Brand *</label>
                  <select
                    required
                    value={form.brandId}
                    onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Coupon Code (Leave empty for Deal)</label>
                  <input
                    type="text"
                    placeholder="e.g. SALE20, FREEFALL"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm font-mono text-white placeholder:font-sans uppercase"
                  />
                </div>

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Coupon Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 20% Off All Sneaker Orders Sitewide"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                  <textarea
                    placeholder="e.g. Excludes sale items. Cannot be combined with other offers."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white resize-none"
                  />
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Discount Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  >
                    <option value="PERCENT">Percentage Off (%)</option>
                    <option value="FIXED">Fixed Amount Off ($)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                    <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    disabled={form.type === "FREE_SHIPPING" || form.type === "BOGO"}
                    value={form.type === "FREE_SHIPPING" || form.type === "BOGO" ? "" : form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white disabled:bg-gray-900/60 disabled:text-gray-500 disabled:border-transparent"
                  />
                </div>

                {/* Affiliate Link */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Affiliate Link / Destination URL *</label>
                  <input
                    required
                    type="url"
                    placeholder="e.g. https://brand.com/affiliate-tag-identifier"
                    value={form.affiliateUrl}
                    onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white font-mono"
                  />
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  >
                    <option value="ACTIVE">Active (Live on frontend)</option>
                    <option value="PENDING">Pending (Moderation Queue)</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {/* Expires At Date Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Expires At (Time & Date)</label>
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-gray-200"
                  />
                </div>

                {/* Secondary metadata group - Success rate & Views */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Initial Success Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 100"
                    value={form.successRate}
                    onChange={(e) => setForm({ ...form, successRate: Number(e.target.value) })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Initial Clicks Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 0"
                    value={form.useCount}
                    onChange={(e) => setForm({ ...form, useCount: Number(e.target.value) })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  />
                </div>

                {/* Upvotes & Downvotes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Upvotes count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={form.upvotes}
                    onChange={(e) => setForm({ ...form, upvotes: Number(e.target.value) })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Downvotes count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 0"
                    value={form.downvotes}
                    onChange={(e) => setForm({ ...form, downvotes: Number(e.target.value) })}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-violet-500 text-sm text-white"
                  />
                </div>

                {/* Featured Checkbox toggle on footer */}
                <div className="md:col-span-2 bg-[#0F1117] rounded-lg p-3.5 border border-white/[0.04] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase">Feature this coupon</span>
                    <span className="text-[11px] text-gray-500 leading-tight">Pins the coupon to home banner sections and recommended pages.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 text-violet-600 bg-black/40 focus:ring-violet-500 cursor-pointer"
                    id="checkbox-is-featured"
                  />
                </div>

              </div>

              {/* Step 2 Buttons footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06] shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("AUTO")}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!form.title || !form.affiliateUrl}
                  className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/40 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition active:scale-[0.98]"
                  id="save-quickkey-coupon"
                >
                  <Save className="w-4 h-4" />
                  Save Coupon
                </button>
              </div>

            </div>
          )}

        </form>
      </div>
    </div>
  );
}
