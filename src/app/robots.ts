import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cholinus-exerciseismedicine.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: ["SemrushBot", "AhrefsBot", "MJ12bot", "DotBot", "Baiduspider", "YandexBot"],
        disallow: "/",
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
