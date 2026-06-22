import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies Policy — DealHunter",
  description: "Find out how DealHunter uses cookies to customize, analyze, and optimize your coupon browsing experience.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full min-w-0" id="cookies-container">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">Experience & Technology</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight" id="cookies-heading">Cookies Policy</h1>
        <p className="text-gray-500 text-lg mt-3">Learn how cookies assist us in optimizing loading times and discovering relevant deals for you.</p>
      </div>

      <div className="prose prose-violet max-w-none text-gray-650 space-y-8 leading-relaxed text-base">

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-cookies-what">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🍪</span> 1. What Are Cookies?
          </h2>
          <p className="text-gray-600">
            A cookie is a small text file stored on your computer or mobile device by your browser when you visit a website. It allows the website to remember your actions, preferred settings, and viewing histories over a certain period. This way, you don&apos;t have to re-configure them every time you browse different promotional categories or switch brands.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-cookies-how">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🛠️</span> 2. Why We Use Cookies
          </h2>
          <p className="text-gray-600 mb-4">
            DealHunter applies cookies and local browser storage to accomplish a series of key functional tasks:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-500">
            <li>
              <strong className="text-gray-800">Essential Security & Session Checks:</strong> Maintaining authentication states for managing admin modules, preventing fraudulent requests, and protecting overall access credentials.
            </li>
            <li>
              <strong className="text-gray-800">Customized Preferences:</strong> Remembering custom selections, including recently viewed store filters or favorited brands, ensuring a highly responsive feed when you return.
            </li>
            <li>
              <strong className="text-gray-800">Analytics & Performance Metrics:</strong> Gathering anonymous data regarding user counts, popular coupon copy rates, and page speeds to continuously test, enhance, and debug our applet structures.
            </li>
            <li>
              <strong className="text-gray-800">Affiliate Tracking Cookies:</strong> Clicking on discount redirects (e.g. &quot;Go to Store&quot;) sets associated affiliate cookies. These track checkout completions, ensuring DealHunter gains promotional commissions that power our free platform.
            </li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-cookies-types">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> 3. Types of Cookies We Set
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-850 mb-1">- Session Cookies</h3>
              <p className="text-gray-600 pl-4">
                These are temporary cookies that expire and are automatically cleared from your device&apos;s active memory once you close your web browser entirely.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-850 mb-1">- Persistent Cookies</h3>
              <p className="text-gray-600 pl-4">
                These remain on your digital device even after closing the browser, until they reach their embedded expiration dates or are manually cleared through your browser settings.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-cookies-control">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> 4. Managing & Disabling Cookies
          </h2>
          <p className="text-gray-600 mb-3">
            Most desktop and mobile browsers (Google Chrome, Safari, Mozilla Firefox, Microsoft Edge, etc.) accept cookies automatically. If you prefer, you can easily configure your browser&apos;s privacy settings to reject secondary tracking cookies or alert you before a cookie is saved.
          </p>
          <p className="text-gray-600 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            ⚠️ <strong>Crucial Note:</strong> If you decide to disable cookies or block local storage engines completely, a minority of interactive components (such as favorited stores lists and administrative login persistency) might cease to work smoothly.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" id="sec-cookies-contact">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>✉️</span> 5. Contact & Support
          </h2>
          <p className="text-gray-650">
            For further queries regarding technical cookie usage across the DealHunter server network, contact us at: <br />
            <strong>Developer Contact:</strong> <span className="text-violet-600 font-semibold text-sm">developer@dealhunter.com</span>
          </p>
        </section>

      </div>
    </div>
  );
}
