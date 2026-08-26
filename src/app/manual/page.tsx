import { getSortedPostsData } from "@/lib/posts";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import ManualListWithSearch from "@/components/ManualListWithSearch";

export const metadata: Metadata = {
  title: "우리 몸 사용 설명서 | 바른관절 헬프센터",
  description: "요람에서 무덤까지, 내 몸을 가장 완벽하게 쓰는 생애주기별 건강 관리 가이드입니다.",
  alternates: {
    canonical: "/manual",
  },
};

export default function ManualPage() {
  const allPosts = getSortedPostsData();
  const manualPosts = allPosts.filter(post => {
    const cat = post.category?.replace(/"/g, "").trim();
    return cat === "사용 설명서" || (post.tags && post.tags.includes("우리몸사용설명서"));
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* 상단 소개 헤더 */}
      <div className="border-b border-slate-200 pb-8 mb-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-600 border border-teal-500/20 mb-4">
          <BookOpen className="h-4 w-4" />
          The Body Manual
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          우리 몸 사용 설명서
        </h1>
        <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
          스포츠 부상 예방부터 일상 속 바른 자세, 그리고 노화 방지까지. 요람에서 무덤까지 이어지는 생애주기별 자기 관리 가이드를 챕터별로 확인하세요.
        </p>
      </div>

      <ManualListWithSearch initialPosts={manualPosts} />
    </div>
  );
}
