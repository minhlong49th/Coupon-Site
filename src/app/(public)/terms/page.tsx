import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — DealHunter",
  description: "Terms and conditions of service for using the DealHunter coupon and promotion platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full min-w-0" id="terms-container">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">Legal & Contract</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight" id="terms-heading">Terms of Service</h1>
        <p className="text-gray-500 text-lg mt-3">The rules, conditions, and legal regulations regarding your use of DealHunter.</p>
      </div>

      <div className="prose prose-violet max-w-none text-gray-650 space-y-8 leading-relaxed text-base">

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-terms-acceptance">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📜</span> 1. Acceptance of Terms
          </h2>
          <p className="text-gray-600">
            Welcome to <strong>DealHunter</strong>. By accessing our platform, viewing discount information, or submitting promotional coupons, you signify your agreement to comply with and be bound by the terms and conditions outlined below, alongside our Privacy Policy. If you do not agree with any portion of these specifications, please immediately discontinue using our services.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-terms-services">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> 2. Purpose & Scope of Services
          </h2>
          <p className="text-gray-600 mb-3">
            DealHunter is a free digital directory that helps consumers find public promotional codes, events, and discounts contributed both voluntarily by our user community and compiled directly by our content moderation panel.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-gray-500">
            <li>Discount rates, success indicators, and coupon descriptions are referenced for informational purposes only.</li>
            <li>We reserve the absolute right to modify, restrict, suspend, or terminate the delivery of any coupon or store listings at any time without prior notice.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-terms-user-conduct">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>✍️</span> 3. Submission Rules & Guidelines
          </h2>
          <p className="text-gray-600 mb-3">
            If you utilize our &apos;Submit a Coupon&apos; interface to add a newly discovered promo code, you solemnly agree that:
          </p>
          <ul className="list-decimal list-inside space-y-2 pl-4 text-gray-500">
            <li>The submitted data parameters are accurate, valid, active, and absolutely free of misleading components.</li>
            <li>You will not upload or inject hyperlinks containing malicious content, computer viruses, phishing portals, or redirects pointing of unauthorized content.</li>
            <li>You will not upload copyrighted materials, trade secrets, or trademark layouts violating the permissions of any enterprise.</li>
            <li>We retain absolute discretion to review, screen, decline, hide, or permanently remove any coupon submissions without presenting specific justifications.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-terms-disclaimer">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚠️</span> 4. Comprehensive Liability Disclaimer
          </h2>
          <p className="text-gray-600 mb-3">
            DealHunter puts utmost effort into ensuring the accuracy of all registered, validated vouchers. However, we declare the following limitations of liability:
          </p>
          <p className="text-gray-600 mb-3">
            - <strong className="text-gray-800">No Availability Guarantee:</strong> Affiliate brands and retail stores may adjust coupon terms, reduce promotional budgets, or cancel events without our knowledge, causing a code to become invalid before its recorded expiry date.
          </p>
          <p className="text-gray-600">
            - <strong className="text-gray-800">No Transaction Mediation:</strong> DealHunter does not process, handle, or fulfill any payments, deliveries, purchases, or product refunds. Any inquiries or disputes regarding your shopping cart must be resolved strictly with the corresponding retail merchant.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-terms-intellectual">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛡️</span> 5. Intellectual Property
          </h2>
          <p className="text-gray-655">
            All registered trademarks, logos, commercial headers, and trade names of brands published on DealHunter (such as Shopee, Lazada, Nike, Adidas, etc.) are the sole exclusive properties of their respective trademark holders. We reference them purely for identification, descriptive, and informational reasons.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-terms-amendments">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📧</span> 6. Terms Modifications & Direct Contact
          </h2>
          <p className="text-gray-660">
            We reserve the right to append or revise these Terms of Service at any time. Changes take immediate effect when published publicly. Continuing to browse the site signals your legal agreement to any applied updates.
          </p>
          <p className="text-gray-660 mt-4">
            Direct your legal queries and guidelines compliance inquiries to: <strong className="text-violet-600">legal@dealhunter.com</strong>
          </p>
        </section>

      </div>
    </div>
  );
}
