import type { Metadata } from "next";
import { getMockBrands } from "@/lib/mock-data";
import { SubmitFormContainer } from "@/components/public/SubmitFormContainer";

export const metadata: Metadata = {
  title: "Submit a Coupon Code — DealHunter",
  description: "Share working promo codes and discount deals with our shopping community and earn karma points.",
};

export default async function SubmitPage() {
  const brands = await getMockBrands();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 w-full min-w-0" id="submit-page-container">
      <div className="text-center mb-10">
        <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">Share & Earn</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight" id="submit-page-heading">Share a Coupon Code</h1>
        <p className="text-gray-500 mt-2">Help community members save money and scale your shopping karma!</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <SubmitFormContainer brands={brands} />
      </div>
    </div>
  );
}
