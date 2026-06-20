import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | DealHunter",
  description: "Affiliate Disclosure for DealHunter.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Affiliate Disclosure</h1>
      <div className="prose prose-violet max-w-none">
        <p>In compliance with FTC guidelines, please assume that any links leading you to products or services are affiliate links that we will receive compensation from.</p>
        
        <h3 className="text-xl font-bold mt-8 mb-4">How it works</h3>
        <p>When you click on our links and make a purchase, it can result in a commission that is credited to DealHunter. This helps keep our website running and allows us to continue bringing you the best deals for free.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">Editorial Integrity</h3>
        <p>Our editorial content is not influenced by affiliate partnerships. We prioritize listing the best deals for our users regardless of commission structures.</p>
      </div>
    </div>
  );
}
