import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog — DealHunter",
  description: "Read our latest articles on saving money, shopping smartly, and more.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { categories: { include: { category: true } } },
    take: 20,
  }).catch(() => [
    {
      id: '1', title: '10 cách tiết kiệm khi mua sắm online', slug: '10-cach-tiet-kiem',
      excerpt: 'Những bí kíp mua sắm online giúp bạn tiết kiệm đến 50%.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
      status: 'PUBLISHED', publishedAt: new Date(),
      categories: [{ categoryId: 'cat1', category: { name: 'Mẹo vặt' } }],
      readingTime: 5
    }
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 w-full min-w-0" id="blog-container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Our Blog</h1>
        <p className="text-xl text-gray-500">Tips, tricks, and strategies to save your hard-earned money.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="blog-grid">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-violet-300 hover:shadow-md transition duration-300">
            {post.thumbnailUrl ? (
              <div className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-48 bg-slate-50 flex items-center justify-center text-violet-300">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {post.categories.slice(0,1).map(c => (
                  <span key={c.categoryId} className="text-xs font-bold text-violet-600 uppercase tracking-widest">{c.category.name}</span>
                ))}
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3 line-clamp-2 hover:text-violet-600 transition">
                  {post.title}
                </h3>
                {post.excerpt && <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
                <span>{post.publishedAt ? format(new Date(post.publishedAt), 'dd MMM, yyyy') : ''}</span>
                <span>{post.readingTime || 5} min read</span>
              </div>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No posts published yet.
          </div>
        )}
      </div>
    </div>
  );
}
