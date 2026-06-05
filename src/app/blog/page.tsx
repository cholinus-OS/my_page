import { getSortedPostsData } from "@/lib/posts";
import AdSense from "@/components/AdSense";
import { BookOpen } from "lucide-react";
import BlogListWithSearch from "@/components/BlogListWithSearch";

export default function BlogListPage() {
  const posts = getSortedPostsData();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 상단 소개 헤더 */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-teal-600" />
          자가 재활 블로그
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          척추 및 관절 건강을 위해 업데이트되는 안전한 재활 및 건강 상식 리스트입니다.
        </p>
      </div>

      {/* 💰 구글 애드센스 상단 광고 */}
      <AdSense slot="5556667770" />

      {/* 검색 기능이 추가된 포스트 리스트 */}
      <BlogListWithSearch initialPosts={posts} />

      {/* 💰 구글 애드센스 하단 광고 */}
      <AdSense slot="9998887770" />
    </div>
  );
}
