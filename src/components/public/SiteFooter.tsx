"use client";

import React from "react";
import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto" id="main-site-footer">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>🎯</span>
              <span>DealHunter</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Find and submit the latest, fully verified coupon codes, discount offers, and affiliate retail promos online today. Saving money done simple.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-650 hover:text-violet-650 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-650 hover:text-violet-650 transition">
                  Expert Blog
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-violet-600 font-semibold hover:text-violet-750 transition flex items-center gap-1">
                  Submit a Code <span>✨</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-650 hover:text-violet-650 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-650 hover:text-violet-650 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-650 hover:text-violet-650 transition">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright declaration */}
        <div className="border-t border-gray-150 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            &copy; {currentYear} DealHunter Inc. All rights reserved. Affiliate disclosure: we may earn a small commission when you purchase through our links.
          </div>
        </div>
      </div>
    </footer>
  );
}
