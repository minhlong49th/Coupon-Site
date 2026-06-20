import { MetadataRoute } from "next";
import { getMockBrands } from "@/lib/mock-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dealhunter.com";
  const brands = await getMockBrands();

  const brandUrls = brands.map((brand) => ({
    url: `${baseUrl}/${brand.slug}-coupon-codes`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categories = [
    "fashion",
    "electronics",
    "travel",
    "beauty",
    "education",
    "food",
    "home",
    "sports",
  ];

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/coupons/${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...brandUrls, ...categoryUrls];
}
