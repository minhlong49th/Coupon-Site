import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — DealHunter",
  description: "Read the latest saving tips, financial habits, and shopping secrets to maximize your purchase value.",
};

const POSTS = [
  {
    id: "1",
    title: "5 Hidden Ways to Secure Nike Coupons & Back-to-school Discounts",
    excerpt: "Learn how to combine retail discounts with secret member codes for the absolute maximum savings.",
    date: "June 18, 2026",
    readTime: "4 min read",
    category: "Fashion",
    icon: "👟"
  },
  {
    id: "2",
    title: "How We Automated Coupon Code Validity Checks in 2026",
    excerpt: "An inside look at our newly built community telemetry pipeline designed to prevent deal rot.",
    date: "June 15, 2026",
    readTime: "6 min read",
    category: "Tech",
    icon: "🤖"
  },
  {
    id: "3",
    title: "The Smart Shopper's Guide to Booking Online Courses on Udemy",
    excerpt: "Udemy prices fluctuate constantly. Understand the pricing algorithm to get courses at 90% off every single time.",
    date: "June 12, 2026",
    readTime: "5 min read",
    category: "Education",
    icon: "🎓"
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 w-full min-w-0" id="blog-container">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold tracking-wider text-violet-600 uppercase bg-violet-50 px-3 py-1 rounded-full">Guides & News</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight" id="blog-heading">The DealHunter Blog</h1>
        <p className="text-gray-500 text-lg mt-3">Curated buying guides, retail insights, and code-hunting masterclasses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="blog-grid">
        {POSTS.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-violet-300 hover:shadow-md transition duration-300" id={`post-${post.id}`}>
            <div className="h-48 bg-slate-50 flex items-center justify-center text-6xl select-none">
              {post.icon}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">{post.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3 line-clamp-2 hover:text-violet-600 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
