import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — DealHunter",
  description: "Learn more about DealHunter and our mission to help shoppers save money with verified coupon codes.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full min-w-0" id="about-container">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">Our Mission</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight" id="about-heading">About DealHunter</h1>
        <p className="text-gray-500 text-lg mt-3">We believe saving money should be simple, effortless, and verified.</p>
      </div>

      <div className="prose prose-violet max-w-none text-gray-600 space-y-8 leading-relaxed text-base">
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-story">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📖</span> Our Story
          </h2>
          <p>
            DealHunter started in 2026 with a simple realization: online coupon websites are filled with broken, expired, and deceptive discount codes. Shoppers waste precious minutes copying and pasting codes only to find out they don&apos;t apply to their cart. We set out to build a platform where crowdsourced verification, sophisticated algorithmic rate detection, and premium data curation work together to deliver 100% functional coupon lists.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-how-works">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> How We Verifiy Deals
          </h2>
          <p className="mb-4">
            Our verification engine guarantees and updates active coupons through multiple layers of authentication:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4 text-gray-500">
            <li><strong className="text-gray-800">Community Moderation:</strong> Our dedicated core moderators check user-shared discount codes every single day.</li>
            <li><strong className="text-gray-800">Success Metrics:</strong> We measure live user click and code copy success rates directly to demote non-functional codes.</li>
            <li><strong className="text-gray-800">Direct Affiliate Partnerships:</strong> We coordinate with top stores like Nike, Adidas, Udemy, and Sephora to secure exclusive deals directly from the source.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-disclosure">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🤝</span> Affiliate Disclosure
          </h2>
          <p>
            When you purchase through coupon links on DealHunter, we may earn a small referral commission from the respective stores. This is completely free to you and keeps our verification infrastructure running cleanly. Learn more about how we process lists in our dedicated affiliate disclosure.
          </p>
        </section>
      </div>
    </div>
  );
}
