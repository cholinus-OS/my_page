import { notFound } from "next/navigation";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import AdSense from "@/components/AdSense";
import { ChevronLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "placeholder") {
    return {
      title: "블로그 준비 중 | 재활 안내",
      description: "새로운 재활 소식이 곧 등록될 예정입니다."
    };
  }
  
  const post = getPostData(slug);
  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 재활 안내",
      description: "요청하신 글이 존재하지 않습니다."
    };
  }

  return {
    title: `${post.title} | 재활 안내`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `https://cholinus-exerciseismedicine.dev/blog/${slug}`,
    }
  };
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  if (posts.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  if (slug === "placeholder") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-600 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            목록으로 돌아가기
          </Link>
        </div>
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 bg-white">
          <p className="text-slate-500 font-medium">블로그 글이 아직 발행되지 않았습니다.</p>
          <p className="text-xs text-slate-400 mt-2">새로운 건강 상식을 열심히 준비 중이니 조금만 기다려주세요!</p>
        </div>
      </div>
    );
  }

  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "description": post.summary,
    "author": {
      "@type": "Organization",
      "name": "바른관절 헬프센터"
    },
    "publisher": {
      "@type": "Organization",
      "name": "바른관절 헬프센터"
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-600 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Link>
      </div>

      {/* 💰 구글 애드센스 상단 광고 */}
      <AdSense slot="5556667770" />

      {/* 본문 콘텐츠 카드 */}
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {/* 헤더 영역 */}
        <header className="border-b border-slate-100 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
            <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-2.5 py-1 font-semibold text-teal-700">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl leading-tight">
            {post.title}
          </h1>
        </header>

        {/* 마크다운 렌더링 영역 */}
        <div className="prose max-w-none text-sm sm:text-base leading-relaxed text-slate-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 태그 영역 */}
        {post.tags.length > 0 && (
          <footer className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </footer>
        )}
      </article>

      {/* 💰 구글 애드센스 하단 광고 */}
      <AdSense slot="9998887770" />
    </div>
  );
}
