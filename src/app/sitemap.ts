import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cholinus-exerciseismedicine.com";

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

  // 질환 사전 데이터 로드하여 URL 추가
  const diseasesFile = path.join(process.cwd(), "src/content/diseases/data.json");
  let diseaseUrls: MetadataRoute.Sitemap = [];
  if (fs.existsSync(diseasesFile)) {
    try {
      const diseases = JSON.parse(fs.readFileSync(diseasesFile, "utf8"));
      diseaseUrls = diseases.map((d: any) => {
        return {
          url: `${baseUrl}/disease/${d.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        };
      });
    } catch (e) {
      console.error("Error reading diseases data for sitemap:", e);
    }
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
    {
      url: `${baseUrl}/knee-story`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shoulder-story`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...diseaseUrls,
    ...postUrls,
  ];
}
