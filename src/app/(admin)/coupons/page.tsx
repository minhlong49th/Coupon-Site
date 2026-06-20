import type { Metadata } from "next";
import { getMockCoupons, getMockBrands } from "@/lib/mock-data";
import { CouponTable } from "@/components/admin/CouponTable";

export const metadata: Metadata = { title: "Coupons", robots: { index: false } };

export default async function CouponsPage() {
  const [coupons, brands] = await Promise.all([getMockCoupons(), getMockBrands()]);
  return <CouponTable initialCoupons={coupons} brands={brands} />;
}
