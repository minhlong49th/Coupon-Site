export type CouponStatus = "ACTIVE" | "EXPIRED" | "PENDING" | "REJECTED";
export type CouponType = "PERCENT" | "FIXED" | "FREE_SHIPPING" | "BOGO" | "OTHER";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logoUrl: string | null;
  affiliateUrl: string;
  category: string;
  description: string | null;
  couponCount: number;
  clickCount: number;
  bestDiscount: number;
  avgSuccess: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  brandId: string;
  brand: Pick<Brand, "id" | "name" | "slug" | "logoUrl" | "domain">;
  code: string;
  title: string;
  description: string | null;
  type: CouponType;
  discountValue: number | null;
  affiliateUrl: string;
  status: CouponStatus;
  expiresAt: string | null;
  successRate: number;
  useCount: number;
  clickCount: number;
  upvotes: number;
  downvotes: number;
  isFeatured: boolean;
  submittedBy: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
