import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — DealHunter",
  description: "Learn how DealHunter collects, uses, and safeguards your personal data when using our platform.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full min-w-0" id="privacy-container">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">Legal & safety</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight" id="privacy-heading">Privacy Policy</h1>
        <p className="text-gray-500 text-lg mt-3">Our commitment to protecting your personal information and online experience.</p>
      </div>

      <div className="prose prose-violet max-w-none text-gray-650 space-y-8 leading-relaxed text-base">
        
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-privacy-intro">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛡️</span> 1. Introduction
          </h2>
          <p className="text-gray-600">
            Welcome to <strong>DealHunter</strong>. We deeply respect your privacy and are committed to protecting it. This Privacy Policy outlines how we collect, process, store, and secure your personal data when you visit and interact with our money-saving services, promotional codes, and deals platform.
          </p>
          <p className="text-gray-600 mt-2">
            By utilizing any DealHunter service, you express your understanding and agreement to the terms defined in this policy.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-privacy-collect">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> 2. Information We Collect
          </h2>
          <p className="text-gray-600 mb-4">
            In order to provide you with the most optimal, reliable, and tailored coupon search experiences, we collect the following types of data:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-500">
            <li>
              <strong className="text-gray-800">Basic Device Information:</strong> IP address, browser type and version, operating system details, and system display language preferences.
            </li>
            <li>
              <strong className="text-gray-800">Interaction & Usage Logs:</strong> Coupon code search histories, lists of brands or stores you show interest in, and stats surrounding coupon codes you copy or mark as worked/failed.
            </li>
            <li>
              <strong className="text-gray-800">Voluntary Information:</strong> Your email address if you opt to sign up for our weekly Deals Newsletter, or when you actively submit found coupon codes to our community database.
            </li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-privacy-usage">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚡</span> 3. How We Use Information
          </h2>
          <p className="text-gray-600 mb-3">
            The collected information is solely used to fulfill specific and standard business objectives:
          </p>
          <ul className="list-decimal list-inside space-y-2 pl-4 text-gray-500">
            <li>Ensuring accurate rendering of coupons and promotional lists tailored to selected brands.</li>
            <li>Calculating coupon success ratios in real-time, allowing the most reliable deals to be prioritized automatically for everyone.</li>
            <li>Sending the hottest deals and curated promotions of the week to registered newsletter emails (which can be un-subscribed from with a single click).</li>
            <li>Mitigating spam, fraudulent automated crawls, and maintaining safety across the developer workspace.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-privacy-sharing">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🤝</span> 4. Sharing Information with Third Parties
          </h2>
          <p className="text-gray-600">
            DealHunter <strong>does not and will never</strong> sell, trade, or rent your personal identification information to any third parties. We collaborate strictly with trusted Affiliate Networks to redirect links and award code discounts. When clicking on deals, partner tracking cookies may momentarily check your conversion activity to credit our platform with a small sales commission.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-privacy-security">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔑</span> 5. Security Measures
          </h2>
          <p className="text-gray-600">
            Our DealHunter platform is deployed on securely configured, resilient cloud-native frameworks utilizing fully encrypted SSL/HTTPS data protocols. We maintain systematic technical safeguards designed to prevent any unauthorized database structures or disclosure of user history metrics.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-privacy-updates">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span> 6. Policy Adjustments & Contact Details
          </h2>
          <p className="text-gray-600">
            This Privacy Policy is active for our 2026 operations and is subject to routine revisions to match upcoming features. Changes will be posted instantly on this public page.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            For inquiries or requesting absolute deletion of your registered data records, please contact the DealHunter Support Team at: <br />
            <strong>Primary Contact:</strong> <span className="text-violet-600 font-semibold">support@dealhunter.com</span>
          </p>
        </section>
        
      </div>
    </div>
  );
}
