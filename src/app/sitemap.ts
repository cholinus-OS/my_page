import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = "force-static";

const STATIC_REVIEW_DATE = new Date("2026-11-24T00:00:00+09:00");
const DISEASE_REVIEW_DATE = new Date("2026-07-01T00:00:00+09:00");

function parsePostLastModified(filePath: string, fallback: Date): Date {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { data } = matter(content);
    const rawDate = data.dateModified || data.date;
    if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
      return rawDate;
    }
    if (typeof rawDate === "string" && rawDate.trim()) {
      const parsed = new Date(rawDate);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch {
    // Fallback to file mtime if frontmatter parsing fails
  }
  return fallback;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cholinus-exerciseismedicine.com";

  // 모든 블로그 글 URL 추가를 위해 content/posts 폴더 스캔
  const postsDir = path.join(process.cwd(), "src/content/posts");
  let postUrls: MetadataRoute.Sitemap = [];

  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
    postUrls = files.map((file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(postsDir, file);
      const stats = fs.statSync(filePath);
      return {
        url: `${baseUrl}/blog/${slug}/`,
        lastModified: parsePostLastModified(filePath, stats.mtime),
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
      diseaseUrls = diseases.map((d: { id: string }) => {
        return {
          url: `${baseUrl}/disease/${d.id}/`,
          lastModified: DISEASE_REVIEW_DATE,
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
      url: `${baseUrl}/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/disease/`,
      lastModified: DISEASE_REVIEW_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/manual/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knee-story/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shoulder-story/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: STATIC_REVIEW_DATE,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...diseaseUrls,
    ...postUrls,
  ];
}
