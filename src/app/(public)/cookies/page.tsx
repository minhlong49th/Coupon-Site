import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | DealHunter",
  description: "Cookie Policy for DealHunter.",
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      <div className="prose prose-violet max-w-none">
        <p>This Cookie policy explains how DealHunter uses cookies and similar technologies.</p>
        
        <h3 className="text-xl font-bold mt-8 mb-4">1. What are cookies?</h3>
        <p>Cookies are small text files stored on your device that help websites work properly and provide analytics.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. Types of cookies we use</h3>
        <ul className="list-disc pl-5 mt-2">
            <li><strong>Essential Cookies:</strong> Required for the basic functioning of our website.</li>
            <li><strong>Analytics Cookies:</strong> We use tools like Google Analytics to understand how visitors interact with our site.</li>
            <li><strong>Affiliate Cookies:</strong> When you click on a deal, our affiliate partners may place a cookie on your device to track the sale and award us a commission.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-4">3. Managing cookies</h3>
        <p>You can use the Cookie Consent banner at the bottom of the page to decline non-essential cookies. You can also disable cookies directly in your browser settings.</p>
      </div>
    </div>
  );
}
