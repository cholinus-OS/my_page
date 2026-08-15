import { getSortedPostsData } from "@/lib/posts";
import AdSense from "@/components/AdSense";
import { BookOpen } from "lucide-react";
import BlogListWithSearch from "@/components/BlogListWithSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자가 재활 블로그 | 재활 안내",
  description: "척추 및 관절 건강을 위해 업데이트되는 안전한 재활 및 건강 상식 리스트입니다.",
  alternates: {
    canonical: "/blog",
  },
};

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

      {/* 시각적 퀄리티를 높이는 히어로 배너 (애드센스 승인 전 빈 공간 방지) */}
      <div className="mb-8 w-full overflow-hidden rounded-3xl border border-slate-200/60 shadow-sm relative group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/images/blog_hero_banner.png" 
          alt="바른관절 헬프센터 재활 블로그 배너" 
          className="w-full h-auto object-cover object-center max-h-[300px] transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6 sm:p-8">
          <p className="text-white/90 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
            전문적인 의학 지식을 바탕으로 통증 없는 건강한 일상을 디자인합니다.
          </p>
        </div>
      </div>

      {/* 💰 구글 애드센스 상단 광고 (승인 전 빈 공간 이슈로 임시 비활성화) */}
      {/* <AdSense slot="5556667770" /> */}

      {/* 검색 기능이 추가된 포스트 리스트 */}
      <BlogListWithSearch initialPosts={posts} />

      {/* 💰 구글 애드센스 하단 광고 */}
      <AdSense slot="9998887770" />
    </div>
  );
}
