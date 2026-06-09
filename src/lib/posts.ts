import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
  thumbnail?: string;
}

// 날짜 포맷 YYYY-MM-DD 변환 함수
function formatDate(dateVal: any): string {
  if (dateVal instanceof Date) {
    const yyyy = dateVal.getFullYear();
    const mm = String(dateVal.getMonth() + 1).padStart(2, "0");
    const dd = String(dateVal.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof dateVal === "string") {
    return dateVal.split("T")[0];
  }
  return String(dateVal || "");
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const data = matterResult.data;

      return {
        slug,
        title: data.title || "제목 없음",
        date: formatDate(data.date),
        summary: data.summary || "",
        category: data.category || "일반",
        tags: Array.isArray(data.tags) ? data.tags : [],
        content: matterResult.content,
        thumbnail: data.thumbnail || "",
      };
    });

  // 날짜순(최신순) 정렬
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getPostData(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const data = matterResult.data;

  return {
    slug,
    title: data.title || "제목 없음",
    date: formatDate(data.date),
    summary: data.summary || "",
    category: data.category || "일반",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content: matterResult.content,
    thumbnail: data.thumbnail || "",
  };
}
