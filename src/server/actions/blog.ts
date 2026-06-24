'use server';

import { prisma } from '@/lib/prisma';
import { PostStatus, ContentType } from '@prisma/client';
import slugify from 'slugify';
import readingTime from 'reading-time';

function extractTiptapText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.content) return node.content.map(extractTiptapText).join(' ')
  return ''
}

function calcReadingTime(content: any, contentType: ContentType): number {
  let text = ''
  if (contentType === 'MARKDOWN') {
    text = typeof content?.body === 'string' ? content.body : ''
  } else {
    text = extractTiptapText(content)
  }
  return Math.ceil(readingTime(text).minutes)
}

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, locale: 'vi' })
}

export async function listPosts(page = 1, limit = 20, status?: PostStatus, search?: string, categoryId?: string) {
  try {
    const skip = (page - 1) * limit
    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ]
      }),
      ...(categoryId && {
        categories: { some: { categoryId } }
      }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          _count: { select: { coupons: true } },
        },
      }),
      prisma.post.count({ where }),
    ])

    return { posts, total, pages: Math.ceil(total / limit) }
  } catch (e) {
    console.error(e);
    // Return dummy data for UI testing
    return {
      posts: [
        {
          id: '1', title: '10 cách tiết kiệm khi mua sắm online', slug: '10-cach-tiet-kiem',
          excerpt: 'Những bí kíp mua sắm online giúp bạn tiết kiệm đến 50%.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
          status: 'PUBLISHED', publishedAt: new Date(), contentType: 'RICH_TEXT',
          categories: [{ categoryId: 'cat1', category: { name: 'Mẹo vặt' } }],
          tags: [], _count: { coupons: 2 }, createdAt: new Date()
        },
        {
          id: '2', title: 'Review tai nghe Sony WH-1000XM5', slug: 'review-sony-wh-1000xm5',
          excerpt: 'Đánh giá chi tiết tai nghe chống ồn tốt nhất hiện nay.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
          status: 'DRAFT', publishedAt: null, contentType: 'MARKDOWN',
          categories: [{ categoryId: 'cat2', category: { name: 'Review' } }],
          tags: [], _count: { coupons: 0 }, createdAt: new Date()
        }
      ],
      total: 2,
      pages: 1
    };
  }
}

export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        coupons: {
          include: { coupon: true },
          orderBy: { position: 'asc' },
        },
        brands: { include: { brand: true } },
      },
    })
  } catch (e) {
    return null;
  }
}

export async function publishPostAction(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function deletePostAction(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function createPostAction(input: any) {
  try {
    const slug = input.slug || generateSlug(input.title)
    const rt = calcReadingTime(input.content, input.contentType)

    // For now, assume author is the first user or mock
    const firstUser = await prisma.user.findFirst();
    let authorId = firstUser?.id;
    
    if (!authorId) {
      const newUser = await prisma.user.create({
        data: { clerkId: 'mock_clerk', username: 'mock_user', email: 'mock@mock.com' }
      });
      authorId = newUser.id;
    }

    const post = await prisma.post.create({
      data: {
        title: input.title,
        slug,
        content: input.content || {},
        contentType: input.contentType,
        excerpt: input.excerpt,
        thumbnailUrl: input.thumbnailUrl,
        status: input.status,
        publishedAt: input.status === 'PUBLISHED'
          ? (input.publishedAt ? new Date(input.publishedAt) : new Date())
          : input.publishedAt ? new Date(input.publishedAt) : null,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        seoTitle: input.seoTitle,
        seoDesc: input.seoDesc,
        ogImage: input.ogImage,
        readingTime: rt,
        authorId,
        categories: {
          create: (input.categoryIds || []).map((categoryId: string) => ({ categoryId }))
        },
        tags: {
          create: (input.tagIds || []).map((tagId: string) => ({ tagId }))
        },
        coupons: {
          create: (input.couponIds || []).map(({ couponId, position, note }: any) => ({
            couponId, position, note
          }))
        },
        brands: {
          create: (input.brandIds || []).map(({ brandId, isPrimary }: any) => ({
            brandId, isPrimary
          }))
        },
      },
    });
    return { success: true, post };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function updatePostAction(input: any) {
  try {
    const { id, categoryIds, tagIds, couponIds, brandIds, ...data } = input
    const rt = data.content
      ? calcReadingTime(data.content, data.contentType || 'RICH_TEXT')
      : undefined

    await prisma.$transaction(async (tx) => {
      if (categoryIds !== undefined) await tx.categoriesOnPosts.deleteMany({ where: { postId: id } })
      if (tagIds !== undefined) await tx.tagsOnPosts.deleteMany({ where: { postId: id } })
      if (couponIds !== undefined) await tx.postCoupon.deleteMany({ where: { postId: id } })
      if (brandIds !== undefined) await tx.postBrand.deleteMany({ where: { postId: id } })

      await tx.post.update({
        where: { id },
        data: {
          ...data,
          ...(rt && { readingTime: rt }),
          ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
          ...(categoryIds && {
            categories: { create: categoryIds.map((categoryId: string) => ({ categoryId })) }
          }),
          ...(tagIds && {
            tags: { create: tagIds.map((tagId: string) => ({ tagId })) }
          }),
          ...(couponIds && {
            coupons: {
              create: couponIds.map(({ couponId, position, note }: any) => ({
                couponId, position, note
              }))
            }
          }),
          ...(brandIds && {
            brands: {
              create: brandIds.map(({ brandId, isPrimary }: any) => ({
                brandId, isPrimary
              }))
            }
          }),
        },
      })
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function listCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  } catch (e) {
    return [];
  }
}

export async function listTags() {
  try {
    return await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  } catch (e) {
    return [];
  }
}
