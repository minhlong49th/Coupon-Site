import React from "react";
import { getMockStats, getMockCoupons, getMockBrands } from "@/lib/mock-data";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard — DealHunter",
  description: "Manager panel for brand discount promotions, coupon statuses, and pending community submissions.",
};

export default async function AdminPage() {
  const [stats, coupons, brands] = await Promise.all([
    getMockStats(),
    getMockCoupons(),
    getMockBrands(),
  ]);

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialCoupons={coupons}
      initialBrands={brands}
    />
  );
}

