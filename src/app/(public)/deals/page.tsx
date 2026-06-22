import type { Metadata } from "next";
import { getMockBrands, getMockCoupons } from "@/lib/mock-data";
import { DealsPageClient } from "./DealsPageClient";

export const metadata: Metadata = {
  title: "All Promo Codes, Coupons & Hot Deals — DealHunter",
  description: "Browse thousands of live and verified discount coupon codes, online hot deals, free shipping vouchers, and limited-time retail promotion codes.",
};

export default async function AllDealsPage() {
  // Parallel fetch coupons and brands
  const [brands, coupons] = await Promise.all([getMockBrands(), getMockCoupons()]);

  // Pass to the interactive directory component
  return <DealsPageClient initialCoupons={coupons} initialBrands={brands} />;
}
