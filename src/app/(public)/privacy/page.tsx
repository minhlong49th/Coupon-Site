import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DealHunter",
  description: "Privacy Policy for DealHunter.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-violet max-w-none">
        <p>At DealHunter, we take your privacy seriously. This policy explains how we collect and use your data.</p>
        
        <h3 className="text-xl font-bold mt-8 mb-4">1. Data we collect</h3>
        <p>We may collect information such as your email address (if you subscribe to our newsletter), your IP address, and cookie data for analytics and affiliate tracking.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. Third parties</h3>
        <p>We use third-party services like Google Analytics to track site traffic, and affiliate networks which may use cookies to track purchases made through our links.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">3. Your Rights</h3>
        <p>You have the right to request deletion of your data and opt-out of non-essential cookies. Please contact us for any privacy-related concerns.</p>
      </div>
    </div>
  );
}
