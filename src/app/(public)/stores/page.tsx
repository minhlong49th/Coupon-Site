import type { Metadata } from "next";
import { getMockBrands } from "@/lib/mock-data";
import { StoresPageClient } from "./StoresPageClient";

export const metadata: Metadata = {
  title: "All Brand Stores & Partners — DealHunter",
  description: "Browse our complete list of coupon code brands, retail stores, and online e-commerce partner shops offering hot deals.",
};

export default async function AllStoresPage() {
  const brands = await getMockBrands();

  return <StoresPageClient initialBrands={brands} />;
}
