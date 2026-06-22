export type CouponType = "PERCENT" | "FIXED" | "FREE_SHIPPING" | "BOGO";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  couponCount?: number;
  clickCount?: number;
  category?: string;
  bestDiscount?: number;
  avgSuccess?: number;
  featured?: boolean;
  isActive?: boolean;
  affiliateUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code?: string;
  title: string;
  description?: string | null;
  type: CouponType;
  discountValue?: number | null;
  affiliateUrl: string;
  brandId: string;
  brand: Brand;
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "REJECTED";
  expiresAt?: string | null;
  isFeatured?: boolean;
  successRate: number;
  useCount: number;
  clickCount: number;
  upvotes: number;
  downvotes: number;
  submittedBy?: string;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  coupons: {
    total: number;
    active: number;
    expired: number;
    pending: number;
    addedToday: number;
  };
  brands: {
    total: number;
    active: number;
  };
  traffic: {
    clicksToday: number;
    clicksThisMonth: number;
    conversionRate: number;
  };
  revenue: {
    estimatedThisMonth: number;
  };
  moderation: {
    pendingCount: number;
  };
}
