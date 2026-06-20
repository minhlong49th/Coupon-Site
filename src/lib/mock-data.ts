import type { Brand, Coupon, DashboardStats } from "@/types";

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
      BRANDS_DATA[idx].clickCount++;
      STATS_DATA.traffic.clicksToday++;
      STATS_DATA.traffic.clicksThisMonth++;
    }
  }
}

export async function deleteMockBrand(brandId: string): Promise<boolean> {
  const initialLength = BRANDS_DATA.length;
  BRANDS_DATA = BRANDS_DATA.filter(b => b.id !== brandId);
  return BRANDS_DATA.length < initialLength;
}

export async function deleteMockCoupon(couponId: string): Promise<boolean> {
  const initialLength = COUPONS_DATA.length;
  COUPONS_DATA = COUPONS_DATA.filter(c => c.id !== couponId);
  return COUPONS_DATA.length < initialLength;
}

export async function getMockBrands(): Promise<Brand[]> { return BRANDS_DATA; }
export async function getMockCoupons(): Promise<Coupon[]> { return COUPONS_DATA; }
export async function getMockStats(): Promise<DashboardStats> { return STATS_DATA; }

export async function getMockCouponsByBrand(brandId: string): Promise<Coupon[]> {
  return COUPONS_DATA.filter(c => c.brandId === brandId);
}

export async function getMockBrandBySlug(slug: string): Promise<Brand | null> {
  return BRANDS_DATA.find(b => b.slug === slug) ?? null;
}

export const COUPON_CATEGORIES = [
  "Fashion","Electronics","Travel","Beauty","Education",
  "Food & Dining","Home & Garden","Sports","Software","Finance","Other",
];
