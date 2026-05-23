import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import AdSense from "@/components/AdSense";
import CoupangLink from "@/components/CoupangLink";
import { ArrowLeft, Calendar, User, Eye, Bookmark } from "lucide-react";

interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  keyword: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Next.js 정적 빌드를 돕는 함수
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "src/content/posts");
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => ({
      id: fileName.replace(/\.json$/, ""),
    }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const postsDirectory = path.join(process.cwd(), "src/content/posts");
  const filePath = path.join(postsDirectory, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const post = JSON.parse(fileContents) as Post;

  // 본문 텍스트를 문단과 제목으로 보기 좋게 렌더링해주는 초간단 헬퍼 함수
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        return <div key={index} className="h-4" />;
      }
      
      // 마크다운 h3 헤더 감지 (###)
      if (trimmedLine.startsWith("###")) {
        return (
          <h3 key={index} className="mt-8 mb-4 text-xl font-bold text-slate-900 border-l-4 border-teal-500 pl-3">
            {trimmedLine.replace(/^###\s*/, "")}
          </h3>
        );
      }
      
      // 마크다운 h2 헤더 감지 (##)
      if (trimmedLine.startsWith("##")) {
        return (
          <h2 key={index} className="mt-10 mb-6 text-2xl font-black text-slate-900 border-b border-slate-200 pb-2">
            {trimmedLine.replace(/^##\s*/, "")}
          </h2>
        );
      }

      // 구분선 감지 (---)
      if (trimmedLine === "---") {
        return <hr key={index} className="my-8 border-t border-slate-200" />;
      }

      // 굵은 텍스트 감지 (예: - **방법**)
      if (trimmedLine.startsWith("- **") || trimmedLine.startsWith("* **")) {
        const parts = trimmedLine.split("**");
        if (parts.length >= 3) {
          const prefix = parts[0].replace(/^[-*]\s*/, "");
          const boldText = parts[1];
          const restText = parts.slice(2).join("**");
          return (
            <li key={index} className="ml-4 list-disc text-slate-700 leading-relaxed my-2">
              {prefix}<strong>{boldText}</strong>{restText}
            </li>
          );
        }
      }

      // 일반 리스트 감지 (예: - 내용)
      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        return (
          <li key={index} className="ml-4 list-disc text-slate-700 leading-relaxed my-2">
            {trimmedLine.replace(/^[-*]\s*/, "")}
          </li>
        );
      }

      // 번호 리스트 감지 (예: 1. 내용)
      if (/^\d+\.\s+/.test(trimmedLine)) {
        return (
          <li key={index} className="ml-4 list-decimal text-slate-700 leading-relaxed my-2">
            {trimmedLine.replace(/^\d+\.\s+/, "")}
          </li>
        );
      }

      // 일반 본문 문단
      return (
        <p key={index} className="my-4 text-base leading-relaxed text-slate-700 text-justify">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* 1. 상단 돌아가기 네비게이션 */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        블로그 목록으로 돌아가기
      </Link>

      {/* 2. 글 헤더 영역 */}
      <header className="border-b border-slate-200 pb-6">
        <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
          {post.category}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        
        {/* 메타 정보 */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            바른관절 AI헬스봇
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            조회수 1,234 (실시간)
          </span>
        </div>
      </header>

      {/* 💰 구글 애드센스 상단 광고 */}
      <AdSense slot="1112223330" />

      {/* 요약박스 (카드 형태) */}
      <div className="my-8 rounded-2xl bg-teal-50/30 border border-teal-100/50 p-5 text-sm text-slate-600 leading-relaxed italic">
        <strong>요약:</strong> {post.summary}
      </div>

      {/* 3. 본문 렌더링 영역 */}
      <div className="mt-6">
        {renderContent(post.content)}
      </div>

      {/* 💰 쿠팡 파트너스 맥락형 상품 자동 매칭 */}
      <div className="mt-12">
        <CoupangLink keyword={post.keyword} />
      </div>

      {/* 💰 구글 애드센스 하단 광고 */}
      <AdSense slot="4445556660" />

      {/* YMYL 필수 의료 면책조항 */}
      <div className="mt-10 rounded-2xl bg-amber-50/50 border border-amber-100 p-5 text-xs text-amber-800 leading-relaxed">
        <h4 className="font-bold flex items-center gap-1 mb-1">
          ⚠️ 의학 정보 면책 조항
        </h4>
        <p>
          본 칼럼은 척추 및 관절 자가 건강 관리를 돕기 위해 구글 Gemini AI 모델이 수집한 의료 정보를 재구성하여 작성되었습니다. 
          질환의 원인이나 통증 증상은 개인별 골밀도, 근육 정렬 상태 등에 따라 다양하게 나타나므로 본문의 운동 치료나 팁이 개별적인 맞춤 처방이 될 수 없습니다. 
          심한 통증이나 저림 등의 증상이 지속될 경우에는 반드시 전문의의 정확한 진단과 지도를 받으시길 권고합니다.
        </p>
      </div>
    </article>
  );
}
