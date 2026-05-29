import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cholinus-exerciseismedicine.dev";

  // 모든 블로그 글 URL 추가를 위해 content/posts 폴더 스캔
  const postsDir = path.join(process.cwd(), "src/content/posts");
  let postUrls: MetadataRoute.Sitemap = [];

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
    postUrls = files.map((file) => {
      const slug = file.replace(/\.md$/, "");
      const stats = fs.statSync(path.join(postsDir, file));
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: stats.mtime,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...postUrls,
  ];
}
