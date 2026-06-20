import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { CategoryNav } from "@/components/public/CategoryNav";
import { getMockBrands } from "@/lib/mock-data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const brands = await getMockBrands();

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }} className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <SiteHeader brands={brands} />
      <CategoryNav />
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
