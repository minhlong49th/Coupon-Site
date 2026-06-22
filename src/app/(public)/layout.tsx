import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { CategoryNav } from "@/components/public/CategoryNav";
import { LayoutWrapper } from "@/components/public/LayoutWrapper";
import { getMockBrands } from "@/lib/mock-data";
import { Toaster } from "sonner";
import "@/app/globals.css";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const brands = await getMockBrands();

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }} className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <LayoutWrapper
        header={<SiteHeader brands={brands} />}
        categoryNav={<CategoryNav />}
        footer={<SiteFooter />}
      >
        {children}
      </LayoutWrapper>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
