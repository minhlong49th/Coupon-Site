import React from "react";
import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | DealHunter",
  description: "Sorry, the page you are looking for does not exist on DealHunter.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center w-full grow" id="not-found-screen">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          The link you requested might be broken, or the brand coupon promotion has ended. Search our catalog for verified discount offers!
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl transition duration-150 inline-block text-sm"
          >
            🏠 Return Home
          </Link>
          <Link
            href="/submit"
            className="w-full bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl border border-gray-250 transition inline-block text-sm"
          >
            Submit a New Code ✨
          </Link>
        </div>
      </div>
    </div>
  );
}
