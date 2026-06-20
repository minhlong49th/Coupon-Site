import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DealHunter",
  description: "Terms of Service for DealHunter.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-violet max-w-none">
        <p>By using DealHunter, you agree to these terms of service.</p>
        
        <h3 className="text-xl font-bold mt-8 mb-4">1. Coupon Accuracy</h3>
        <p>We strive to provide accurate coupon codes, but retailers may change or expire codes without notice. We are not responsible for invalid or expired codes.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. Community Submissions</h3>
        <p>When submitting a coupon code, you agree that you have the right to share it and that it does not violate any retailer terms. We reserve the right to remove any submissions.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">3. Voting System</h3>
        <p>You agree not to manipulate or abuse the voting and karma system.</p>
      </div>
    </div>
  );
}
