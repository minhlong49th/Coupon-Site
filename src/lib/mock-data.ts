import type { Brand, Coupon, DashboardStats } from "@/types";
import { query, isDatabaseConnected } from "./db";

let BRANDS_DATA: Brand[] = [
  { id:"1", name:"Nike",    slug:"nike",    domain:"nike.com",    logoUrl:"https://img.logo.dev/nike.com?token=pk_test_placeholder",    affiliateUrl:"https://nike.com?ref=demo", category:"Fashion",   description:"Nike is a global leader in athletic footwear.", couponCount:23, clickCount:8412,  bestDiscount:20, avgSuccess:82, isActive:true, createdAt:"2024-01-15T00:00:00Z", updatedAt:"2026-06-01T00:00:00Z" },
  { id:"2", name:"Adidas",  slug:"adidas",  domain:"adidas.com",  logoUrl:"https://img.logo.dev/adidas.com?token=pk_test_placeholder",  affiliateUrl:"https://adidas.com?ref=demo", category:"Fashion",   description:"Adidas designs sports and lifestyle products.", couponCount:17, clickCount:5891,  bestDiscount:30, avgSuccess:71, isActive:true, createdAt:"2024-01-20T00:00:00Z", updatedAt:"2026-06-01T00:00:00Z" },
  { id:"3", name:"Udemy",   slug:"udemy",   domain:"udemy.com",   logoUrl:"https://img.logo.dev/udemy.com?token=pk_test_placeholder",   affiliateUrl:"https://udemy.com?ref=demo", category:"Education", description:"Udemy is the world's largest online learning platform.", couponCount:12, clickCount:9100, bestDiscount:90, avgSuccess:91, isActive:true, createdAt:"2024-02-01T00:00:00Z", updatedAt:"2026-06-01T00:00:00Z" },
  { id:"4", name:"Sephora", slug:"sephora", domain:"sephora.com", logoUrl:"https://img.logo.dev/sephora.com?token=pk_test_placeholder", affiliateUrl:"https://sephora.com?ref=demo", category:"Beauty",   description:"Sephora is a prestige beauty retailer.", couponCount:31, clickCount:7230, bestDiscount:20, avgSuccess:74, isActive:true, createdAt:"2024-02-14T00:00:00Z", updatedAt:"2026-06-01T00:00:00Z" },
];

let COUPONS_DATA: Coupon[] = [
  { id:"1", brandId:"1", brand:{id:"1",name:"Nike",  slug:"nike",  logoUrl:"https://img.logo.dev/nike.com?token=pk_test_placeholder",   domain:"nike.com"},   code:"NIKE20",      title:"20% off sitewide",       description:"Valid on all regular-priced items.", type:"PERCENT",      discountValue:20,   affiliateUrl:"https://nike.com?ref=demo",   status:"ACTIVE",  expiresAt:"2026-07-31T23:59:59Z", successRate:87, useCount:1243, clickCount:3821, upvotes:342, downvotes:18, isFeatured:true,  submittedBy:"ADMIN", verifiedAt:"2026-06-10T00:00:00Z", createdAt:"2026-06-01T00:00:00Z", updatedAt:"2026-06-10T00:00:00Z" },
  { id:"2", brandId:"1", brand:{id:"1",name:"Nike",  slug:"nike",  logoUrl:"https://img.logo.dev/nike.com?token=pk_test_placeholder",   domain:"nike.com"},   code:"FREESHIPNIKE",title:"Free shipping on $75+",  description:null,                                type:"FREE_SHIPPING", discountValue:null, affiliateUrl:"https://nike.com?ref=demo",   status:"ACTIVE",  expiresAt:null,                   successRate:72, useCount:892,  clickCount:1204, upvotes:198, downvotes:32, isFeatured:false, submittedBy:"ADMIN", verifiedAt:"2026-06-05T00:00:00Z", createdAt:"2026-05-15T00:00:00Z", updatedAt:"2026-06-05T00:00:00Z" },
  { id:"3", brandId:"2", brand:{id:"2",name:"Adidas",slug:"adidas",logoUrl:"https://img.logo.dev/adidas.com?token=pk_test_placeholder", domain:"adidas.com"}, code:"ADICLUB30",   title:"30% off for members",    description:"Requires adiClub membership.",      type:"PERCENT",      discountValue:30,   affiliateUrl:"https://adidas.com?ref=demo", status:"ACTIVE",  expiresAt:"2026-06-30T23:59:59Z", successRate:61, useCount:445,  clickCount:2109, upvotes:145, downvotes:41, isFeatured:false, submittedBy:"ADMIN", verifiedAt:"2026-06-01T00:00:00Z", createdAt:"2026-06-01T00:00:00Z", updatedAt:"2026-06-01T00:00:00Z" },
  { id:"4", brandId:"3", brand:{id:"3",name:"Udemy", slug:"udemy", logoUrl:"https://img.logo.dev/udemy.com?token=pk_test_placeholder",  domain:"udemy.com"},  code:"LEARN12",     title:"Courses from $12.99",    description:"Limited time flash sale.",          type:"FIXED",        discountValue:12.99,affiliateUrl:"https://udemy.com?ref=demo",  status:"ACTIVE",  expiresAt:"2026-06-20T23:59:59Z", successRate:91, useCount:3401, clickCount:8102, upvotes:890, downvotes:45, isFeatured:true,  submittedBy:"ADMIN", verifiedAt:"2026-06-13T00:00:00Z", createdAt:"2026-06-13T00:00:00Z", updatedAt:"2026-06-13T00:00:00Z" },
  { id:"5", brandId:"4", brand:{id:"4",name:"Sephora",slug:"sephora",logoUrl:"https://img.logo.dev/sephora.com?token=pk_test_placeholder",domain:"sephora.com"},code:"SEPHY10",   title:"10% off orders $50+",    description:null,                                type:"PERCENT",      discountValue:10,   affiliateUrl:"https://sephora.com?ref=demo",status:"PENDING", expiresAt:"2026-08-15T23:59:59Z", successRate:0,  useCount:0,    clickCount:0,    upvotes:0,   downvotes:0,  isFeatured:false, submittedBy:"u_abc", verifiedAt:null,                   createdAt:"2026-06-14T00:00:00Z", updatedAt:"2026-06-14T00:00:00Z" },
  { id:"6", brandId:"1", brand:{id:"1",name:"Nike",  slug:"nike",  logoUrl:"https://img.logo.dev/nike.com?token=pk_test_placeholder",   domain:"nike.com"},   code:"NIKE20",      title:"Wait, this is 20% off!", description:"I found this on twitter",             type:"PERCENT",      discountValue:20,   affiliateUrl:"https://nike.com?ref=demo",   status:"PENDING", expiresAt:"2026-07-31T23:59:59Z", successRate:0,  useCount:0,    clickCount:0,    upvotes:0,   downvotes:0,  isFeatured:false, submittedBy:"u_123", verifiedAt:null,                   createdAt:"2026-06-15T00:00:00Z", updatedAt:"2026-06-15T00:00:00Z" },
];

let STATS_DATA: DashboardStats = {
  coupons:    { total:1247, active:893, expired:312, pending:42, addedToday:18 },
  brands:     { total:284, active:241 },
  traffic:    { clicksToday:1832, clicksThisMonth:47209, conversionRate:3.4 },
  revenue:    { estimatedThisMonth:2140 },
  moderation: { pendingCount:42 },
};

export async function trackEventClick(type: string, id: string) {
  if (isDatabaseConnected()) {
    try {
      if (type === 'coupon_click') {
        await query('UPDATE coupons SET click_count = click_count + 1 WHERE id = $1', [id]);
      } else if (type === 'visit_store') {
        await query('UPDATE brands SET click_count = click_count + 1 WHERE id = $1', [id]);
      }
      return;
    } catch (e) {
      console.error('Database query failed for trackEventClick, falling back to mock:', e);
    }
  }

  // Fallback to local memory mock
  if (type === 'coupon_click') {
    const idx = COUPONS_DATA.findIndex(c => c.id === id);
    if (idx !== -1) {
      COUPONS_DATA[idx].clickCount++;
      STATS_DATA.traffic.clicksToday++;
      STATS_DATA.traffic.clicksThisMonth++;
    }
  } else if (type === 'visit_store') {
    const idx = BRANDS_DATA.findIndex(b => b.id === id);
    if (idx !== -1) {
      BRANDS_DATA[idx].clickCount = (BRANDS_DATA[idx].clickCount || 0) + 1;
      STATS_DATA.traffic.clicksToday++;
      STATS_DATA.traffic.clicksThisMonth++;
    }
  }
}

export async function deleteMockBrand(brandId: string): Promise<boolean> {
  if (isDatabaseConnected()) {
    try {
      await query('DELETE FROM brands WHERE id = $1', [brandId]);
      return true;
    } catch (e) {
      console.error('Database query failed for deleteMockBrand, falling back to mock:', e);
    }
  }
  const initialLength = BRANDS_DATA.length;
  BRANDS_DATA = BRANDS_DATA.filter(b => b.id !== brandId);
  return BRANDS_DATA.length < initialLength;
}

export async function deleteMockCoupon(couponId: string): Promise<boolean> {
  if (isDatabaseConnected()) {
    try {
      await query('DELETE FROM coupons WHERE id = $1', [couponId]);
      return true;
    } catch (e) {
      console.error('Database query failed for deleteMockCoupon, falling back to mock:', e);
    }
  }
  const initialLength = COUPONS_DATA.length;
  COUPONS_DATA = COUPONS_DATA.filter(c => c.id !== couponId);
  return COUPONS_DATA.length < initialLength;
}

export async function updateMockCouponStatus(id: string, status: string): Promise<boolean> {
  if (isDatabaseConnected()) {
    try {
      const verifiedAt = status === 'ACTIVE' ? new Date() : null;
      await query('UPDATE coupons SET status = $1, verified_at = $2, updated_at = NOW() WHERE id = $3', [status, verifiedAt, id]);
      return true;
    } catch (e) {
      console.error('Database query failed for updateMockCouponStatus, falling back to mock:', e);
    }
  }
  const idx = COUPONS_DATA.findIndex(c => c.id === id);
  if (idx !== -1) {
    COUPONS_DATA[idx].status = status as any;
    if (status === 'ACTIVE') {
      COUPONS_DATA[idx].verifiedAt = new Date().toISOString();
    }
    COUPONS_DATA[idx].updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function getMockBrands(): Promise<Brand[]> {
  if (isDatabaseConnected()) {
    try {
      await ensureDatabaseSeeded();
      const rows = await query(`
        SELECT 
          b.id, b.name, b.slug, b.domain, 
          b.logo_url AS "logoUrl", b.affiliate_url AS "affiliateUrl", 
          b.category, b.description, b.is_active AS "isActive",
          b.created_at AS "createdAt", b.updated_at AS "updatedAt",
          COUNT(c.id)::int AS "couponCount",
          COALESCE(MAX(CASE WHEN c.type = 'PERCENT' THEN c.discount_value ELSE 0 END), 0)::int AS "bestDiscount",
          COALESCE(AVG(c.success_rate), 0)::int AS "avgSuccess",
          COALESCE(SUM(c.click_count), 0)::int AS "clickCount"
        FROM brands b
        LEFT JOIN coupons c ON b.id = c.brand_id
        GROUP BY b.id
        ORDER BY b.name ASC;
      `);
      if (rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          domain: r.domain,
          logoUrl: rewriteLogoToken(r.logoUrl || `https://img.logo.dev/${r.domain}`),
          affiliateUrl: r.affiliateUrl,
          category: r.category,
          description: r.description,
          isActive: r.isActive,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
          couponCount: r.couponCount || 0,
          clickCount: r.clickCount || 0,
          bestDiscount: r.bestDiscount || 0,
          avgSuccess: r.avgSuccess || 0,
        }));
      }
    } catch (e) {
      console.error('Database query failed for getMockBrands, falling back to mock:', e);
    }
  }

  // Fallback map logos
  return BRANDS_DATA.map(b => ({
    ...b,
    logoUrl: rewriteLogoToken(b.logoUrl || "")
  }));
}

async function ensureDatabaseSeeded() {
  try {
    const brandCountRes = await query('SELECT COUNT(*)::int AS count FROM brands');
    const count = brandCountRes[0]?.count ?? 0;
    if (count === 0) {
      console.log('Database connected but empty. Seeding with mock data...');
      // Insert brands first
      for (const b of BRANDS_DATA) {
        await query(`
          INSERT INTO brands (id, name, slug, domain, logo_url, affiliate_url, category, description, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING
        `, [
          b.id, b.name, b.slug, b.domain, b.logoUrl, b.affiliateUrl, b.category, b.description, b.isActive ?? true, 
          b.createdAt ? new Date(b.createdAt) : new Date(), b.updatedAt ? new Date(b.updatedAt) : new Date()
        ]);
      }
      // Insert coupons next
      for (const c of COUPONS_DATA) {
        const couponType = ['PERCENT', 'FIXED', 'FREE_SHIPPING', 'BOGO', 'OTHER'].includes(c.type) ? c.type : 'PERCENT';
        const couponStatus = ['ACTIVE', 'EXPIRED', 'PENDING', 'REJECTED'].includes(c.status) ? c.status : 'PENDING';
        await query(`
          INSERT INTO coupons (id, brand_id, code, title, description, type, discount_value, affiliate_url, status, expires_at, success_rate, use_count, click_count, upvotes, downvotes, is_featured, verified_at, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (brand_id, code) DO NOTHING
        `, [
          c.id, c.brandId, c.code, c.title, c.description, couponType, c.discountValue, c.affiliateUrl, couponStatus,
          c.expiresAt ? new Date(c.expiresAt) : null, c.successRate || 0, c.useCount || 0, c.clickCount || 0,
          c.upvotes || 0, c.downvotes || 0, c.isFeatured || false,
          c.verifiedAt ? new Date(c.verifiedAt) : null,
          c.createdAt ? new Date(c.createdAt) : new Date(),
          c.updatedAt ? new Date(c.updatedAt) : new Date()
        ]);
      }
      console.log('Database seeded successfully.');
    }
  } catch (e) {
    console.error('Error ensuring database is seeded:', e);
  }
}

export async function getMockCoupons(): Promise<Coupon[]> {
  if (isDatabaseConnected()) {
    try {
      const rows = await query(`
        SELECT 
          c.id, c.brand_id AS "brandId",
          c.code, c.title, c.description, c.type, 
          c.discount_value AS "discountValue", c.affiliate_url AS "affiliateUrl", 
          c.status, c.expires_at AS "expiresAt", c.success_rate AS "successRate", 
          c.use_count AS "useCount", c.click_count AS "clickCount", 
          c.upvotes, c.downvotes, c.is_featured AS "isFeatured", 
          COALESCE(u.username, 'ADMIN') AS "submittedBy", 
          c.verified_at AS "verifiedAt", c.created_at AS "createdAt", c.updated_at AS "updatedAt",
          b.name AS brand_name, b.slug AS brand_slug, b.logo_url AS brand_logo, b.domain AS brand_domain
        FROM coupons c
        INNER JOIN brands b ON c.brand_id = b.id
        LEFT JOIN users u ON c.submitter_id = u.id
        ORDER BY c.created_at DESC;
      `);
      if (rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          brandId: r.brandId,
          code: r.code,
          title: r.title,
          description: r.description,
          type: r.type,
          discountValue: r.discountValue,
          affiliateUrl: r.affiliateUrl,
          status: r.status,
          expiresAt: r.expiresAt ? new Date(r.expiresAt).toISOString() : null,
          successRate: r.successRate || 0,
          useCount: r.useCount || 0,
          clickCount: r.clickCount || 0,
          upvotes: r.upvotes || 0,
          downvotes: r.downvotes || 0,
          isFeatured: r.isFeatured || false,
          submittedBy: r.submittedBy,
          verifiedAt: r.verifiedAt ? new Date(r.verifiedAt).toISOString() : null,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
          brand: {
            id: r.brandId,
            name: r.brand_name,
            slug: r.brand_slug,
            logoUrl: rewriteLogoToken(r.brand_logo || `https://img.logo.dev/${r.brand_domain}`),
            domain: r.brand_domain,
          },
        }));
      }
    } catch (e) {
      console.error('Database query failed for getMockCoupons, falling back to mock:', e);
    }
  }

  // Fallback map logos
  return COUPONS_DATA.map(c => ({
    ...c,
    brand: {
      ...c.brand,
      logoUrl: rewriteLogoToken(c.brand.logoUrl || "")
    }
  }));
}

export async function getMockStats(): Promise<DashboardStats> {
  if (isDatabaseConnected()) {
    try {
      const cStats = await query(`
        SELECT COUNT(*)::int AS total,
               COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END)::int AS active,
               COUNT(CASE WHEN status = 'EXPIRED' THEN 1 END)::int AS expired,
               COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int AS pending,
               COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END)::int AS added_today
        FROM coupons;
      `);
      const bStats = await query(`
        SELECT COUNT(*)::int AS total,
               COUNT(CASE WHEN is_active = true THEN 1 END)::int AS active
        FROM brands;
      `);
      const trafficStats = await query(`
        SELECT COALESCE(SUM(click_count), 0)::int AS total_clicks
        FROM coupons;
      `);

      const c = cStats[0] || { total: 0, active: 0, expired: 0, pending: 0, added_today: 0 };
      const b = bStats[0] || { total: 0, active: 0 };
      const t = trafficStats[0] || { total_clicks: 0 };

      return {
        coupons: {
          total: c.total,
          active: c.active,
          expired: c.expired,
          pending: c.pending,
          addedToday: c.added_today,
        },
        brands: {
          total: b.total,
          active: b.active,
        },
        traffic: {
          clicksToday: Math.round(t.total_clicks * 0.05) || 12, // Estimated
          clicksThisMonth: t.total_clicks || 0,
          conversionRate: 3.5,
        },
        revenue: {
          estimatedThisMonth: Math.round(t.total_clicks * 0.15) || 0,
        },
        moderation: {
          pendingCount: c.pending,
        },
      };
    } catch (e) {
      console.error('Database query failed for getMockStats, falling back to mock:', e);
    }
  }
  return STATS_DATA;
}

export async function getMockCouponsByBrand(brandId: string): Promise<Coupon[]> {
  const coupons = await getMockCoupons();
  return coupons.filter(c => c.brandId === brandId);
}

export async function getMockBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await getMockBrands();
  return brands.find(b => b.slug === slug) ?? null;
}

// Utility function to inject user's Logo.dev token, or a proper fallback for local/public previews
function rewriteLogoToken(url: string | null): string {
  if (!url) return "";
  const token = process.env.NEXT_PUBLIC_LOGODEV_TOKEN || "pk_test_placeholder";
  return url.replace("token=pk_test_placeholder", `token=${token}`);
}

export const COUPON_CATEGORIES = [
  "Fashion","Electronics","Travel","Beauty","Education",
  "Food & Dining","Home & Garden","Sports","Software","Finance","Other",
];
