import type { Metadata } from "next";
import { getMockBrands } from "@/lib/mock-data";
import { BrandGrid } from "@/components/admin/BrandGrid";

export const metadata: Metadata = { title: "Brands", robots: { index: false } };

export default async function BrandsPage() {
  const brands = await getMockBrands();
  return <BrandGrid brands={brands} />;
}
