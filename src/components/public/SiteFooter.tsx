"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) setShowConsent(true);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShowConsent(false);
  };

  return (
    <>
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <div className="bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-white font-semibold text-lg">Get the best deals in your inbox</h3>
              <p className="text-sm text-gray-500">Weekly roundup, no spam.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none w-full md:w-64 focus:border-violet-500" 
              />
              <button 
                type="submit" 
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                {subscribed ? "✓ Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-xl flex items-center gap-2 mb-4">🏷️ DealHunter</div>
            <p className="text-sm border-t border-gray-800 pt-4">© 2026 DealHunter</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Popular Stores</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nike-coupon-codes" className="hover:text-white transition-colors">Nike</Link></li>
              <li><Link href="/adidas-coupon-codes" className="hover:text-white transition-colors">Adidas</Link></li>
              <li><Link href="/udemy-coupon-codes" className="hover:text-white transition-colors">Udemy</Link></li>
              <li><Link href="/sephora-coupon-codes" className="hover:text-white transition-colors">Sephora</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/coupons/fashion" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link href="/coupons/electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/coupons/travel" className="hover:text-white transition-colors">Travel</Link></li>
              <li><Link href="/coupons/beauty" className="hover:text-white transition-colors">Beauty</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit Coupon</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-600 text-center border-t border-gray-800 pt-6">
          We may earn a commission when you click on affiliate links. This doesn&apos;t affect our editorial integrity. <Link href="/affiliate-disclosure" className="underline hover:text-gray-400">See our Affiliate Disclosure</Link>.
        </div>
      </footer>

      {showConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300 text-center sm:text-left">
              We use cookies for analytics and affiliate tracking. <Link href="/cookies" className="underline hover:text-white">See our Cookie Policy</Link>.
            </p>
            <div className="flex gap-2 shrink-0">
              <button onClick={declineCookies} className="px-4 py-2 border border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-400 transition">
                Decline non-essential
              </button>
              <button onClick={acceptCookies} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
