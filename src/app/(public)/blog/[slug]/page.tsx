import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Markdown from "react-markdown";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  }).catch(() => ({
    title: '10 cách tiết kiệm khi mua sắm online',
    seoTitle: '10 cách tiết kiệm khi mua sắm online hiệu quả nhất',
    seoDesc: 'Những bí kíp mua sắm online giúp bạn tiết kiệm đến 50%.',
    excerpt: 'Những bí kíp mua sắm online giúp bạn tiết kiệm đến 50%.',
    ogImage: null,
    thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop'
  }));

  if (!post) return { title: "Not Found" };

  return {
    title: post.seoTitle || `${post.title} — DealHunter Blog`,
    description: post.seoDesc || post.excerpt,
    openGraph: {
      images: post.ogImage || post.thumbnailUrl ? [post.ogImage || post.thumbnailUrl!] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      coupons: { include: { coupon: { include: { brand: true } } }, orderBy: { position: 'asc' } },
      brands: { include: { brand: true } },
    },
  }).catch(() => ({
    id: '1', title: '10 cách tiết kiệm khi mua sắm online', slug: '10-cach-tiet-kiem',
    excerpt: 'Những bí kíp mua sắm online giúp bạn tiết kiệm đến 50%.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    status: 'PUBLISHED', publishedAt: new Date(), contentType: 'MARKDOWN',
    content: { body: '# Hướng dẫn tiết kiệm\n\n1. Săn sale các dịp lễ lớn\n2. Sử dụng DealHunter để tìm mã giảm giá\n3. Gộp đơn hàng để được freeship' },
    categories: [{ categoryId: 'cat1', category: { name: 'Mẹo vặt' } }],
    tags: [{ tagId: 't1', tag: { name: 'tiết kiệm' } }, { tagId: 't2', tag: { name: 'mua sắm' } }],
    author: { username: 'Admin' },
    coupons: [
      {
        id: '1',
        coupon: { id: 'c1', title: 'Giảm 20% toàn sàn', affiliateUrl: '#', brand: { name: 'Shopee', logoUrl: 'https://img.logo.dev/shopee.vn?token=pk_test_placeholder' } },
        note: 'Mã độc quyền DealHunter'
      }
    ],
    readingTime: 5
  }));

  if (!post || (post.status !== 'PUBLISHED' && process.env.NODE_ENV === 'production')) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-16 w-full min-w-0" id={`post-${post.id}`}>
      {/* Header */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {post.categories.map(c => (
            <Link key={c.categoryId} href={`/blog?category=${c.categoryId}`} className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full hover:bg-violet-100 transition">
              {c.category.name}
            </Link>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-500 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase overflow-hidden">
              {post.author?.username?.charAt(0) || "A"}
            </div>
            <span className="font-medium text-gray-900">{post.author?.username || "Admin"}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMMM, yyyy', { locale: vi }) : "Draft"}
          </time>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{post.readingTime || 5} min read</span>
        </div>
      </header>

      {/* Featured Image */}
      {post.thumbnailUrl && (
        <div className="rounded-2xl overflow-hidden mb-12 shadow-sm border border-gray-100 bg-slate-50">
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg prose-violet max-w-3xl mx-auto">
        {post.contentType === 'MARKDOWN' ? (
          <Markdown>{typeof post.content === 'object' && post.content && 'body' in post.content ? String((post.content as any).body) : ""}</Markdown>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: extractHTMLFromTiptap(post.content) }} />
        )}
      </div>

      {/* Coupons */}
      {post.coupons.length > 0 && (
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-violet-50 rounded-2xl border border-violet-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Deals nhắc đến trong bài</h3>
          <div className="space-y-4">
            {post.coupons.map(pc => (
              <div key={pc.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 p-1">
                    <img src={pc.coupon.brand.logoUrl || ''} alt={pc.coupon.brand.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{pc.coupon.title}</h4>
                    {pc.note && <p className="text-sm text-gray-500 mt-1">{pc.note}</p>}
                  </div>
                </div>
                <a href={pc.coupon.affiliateUrl} target="_blank" rel="nofollow sponsored" className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-violet-700 transition">
                  Lấy Mã
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 flex items-center gap-2 flex-wrap pt-8 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-900 mr-2">Tags:</span>
          {post.tags.map(t => (
            <Link key={t.tagId} href={`/blog?tag=${t.tagId}`} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition">
              #{t.tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

function extractHTMLFromTiptap(json: any): string {
  if (!json || !json.content) return '';
  return json.content.map((node: any) => {
    if (node.type === 'paragraph') {
      return `<p>${node.content?.map((text: any) => text.text).join('') || ''}</p>`;
    }
    if (node.type === 'heading') {
      const tag = `h${node.attrs?.level || 2}`;
      return `<${tag}>${node.content?.map((text: any) => text.text).join('') || ''}</${tag}>`;
    }
    if (node.type === 'bulletList') {
      return `<ul>${node.content?.map((item: any) => `<li>${item.content?.[0]?.content?.map((t: any) => t.text).join('')}</li>`).join('')}</ul>`;
    }
    return '';
  }).join('');
}
