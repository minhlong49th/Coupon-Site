import type { Metadata } from "next";
import { getMockCoupons } from "@/lib/mock-data";
import { ModerationQueue } from "@/components/admin/ModerationQueue";

export const metadata: Metadata = { title: "Moderation", robots: { index: false } };

export default async function ModerationPage() {
  const coupons = await getMockCoupons();
  const pendingCoupons = coupons.filter(c => c.status === "PENDING");
  const activeCoupons = coupons.filter(c => c.status === "ACTIVE");
  
  return <ModerationQueue initialPending={pendingCoupons} activeCoupons={activeCoupons} />;
}
