import Link from "next/link";
import fs from "fs";
import path from "path";
import AdSense from "@/components/AdSense";
import { BookOpen, Calendar, ArrowRight, ChevronRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  keyword: string;
}

// content/posts 내의 JSON 데이터들을 최신순으로 읽어오는 함수
function getSortedPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "src/content/posts");
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const data = JSON.parse(fileContents);
      return data as Post;
    });

  // 날짜 최신순 정렬
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function BlogListPage() {
  const posts = getSortedPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 상단 소개 헤더 */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-teal-600" />
          자가 재활 블로그
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          구글 Gemini AI가 척추 및 관절 건강을 위해 매일 아침 자동으로 발행하는 안전한 재활 및 건강 상식 리스트입니다.
        </p>
      </div>

      {/* 💰 구글 애드센스 상단 광고 */}
      <AdSense slot="5556667770" />

      {/* 포스트 카드 리스트 */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-teal-500/30"
            >
              <div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-1 font-semibold text-teal-700">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                
                <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-teal-600 transition">
                  <Link href={`/blog/${post.id}`} className="focus:outline-none">
                    {/* 카드 전체 클릭이 가능하도록 absolute 포지셔닝 링크 기법 적용 */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h2>
                
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {post.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end text-xs font-semibold text-teal-600">
                <span>글 읽기</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition duration-200" />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 bg-white">
          <p className="text-slate-500 font-medium">아직 발행된 블로그 글이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-2">AI가 곧 새로운 건강 소식을 배달할 예정이니 조금만 기다려주세요!</p>
        </div>
      )}

      {/* 💰 구글 애드센스 하단 광고 */}
      <AdSense slot="9998887770" />
    </div>
  );
}
