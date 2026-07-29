import { notFound } from "next/navigation";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import AdSense from "@/components/AdSense";
import { ChevronLeft, ChevronRight, Calendar, Tag, UserCheck, BookOpen, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import CoupangBanner from "@/components/CoupangBanner";

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
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `https://cholinus-exerciseismedicine.com/blog/${slug}`,
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

  // 관련 포스트 추출 (현재 포스트와 같은 카테고리이거나 태그가 겹치는 포스트)
  const allPosts = getSortedPostsData();
  const postCategory = post.category?.replace(/"/g, "") || "";
  const relatedPosts = allPosts
    .filter((p) => {
      if (p.slug === slug) return false;
      const pCategory = p.category?.replace(/"/g, "");
      const hasSameCategory = pCategory && pCategory === postCategory;
      const hasOverlappingTags = p.tags && post.tags && p.tags.some(tag => post.tags.includes(tag));
      return hasSameCategory || hasOverlappingTags;
    })
    .slice(0, 3);

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
      {/* 🧭 시각적 브레드크럼(Breadcrumb) 내비게이션 (구조적 SEO 강화) */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-teal-600 transition">홈</Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </li>
          <li>
            <Link href="/blog" className="hover:text-teal-600 transition">재활 블로그</Link>
          </li>
          {post.category && (
            <>
              <li>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </li>
              <li>
                <span className="text-slate-700 font-semibold">{post.category.replace(/"/g, "")}</span>
              </li>
            </>
          )}
        </ol>
      </nav>

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }: any) => {
                if (href && (href.includes("youtube.com") || href.includes("youtu.be"))) {
                  let videoId = "";
                  if (href.includes("youtu.be/")) {
                    videoId = href.split("youtu.be/")[1].split("?")[0];
                  } else if (href.includes("v=")) {
                    videoId = href.split("v=")[1].split("&")[0];
                  } else if (href.includes("embed/")) {
                    videoId = href.split("embed/")[1].split("?")[0];
                  }

                  if (videoId) {
                    return (
                      <div className="relative pb-[56.25%] h-0 my-6 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
                          title="YouTube video player"
                          style={{ border: 0 }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    );
                  }
                }
                return <a href={href} className="text-teal-600 hover:underline">{children}</a>;
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 🛍️ 쿠팡 파트너스 추천 배너 (애드센스 승인 심사를 위해 일시적 비활성화) */}
        {/* <CoupangBanner postCategory={post.category} postTags={post.tags} postSlug={post.slug} /> */}

        {/* ✍️ 에디터 프로필 영역 (E-E-A-T 신뢰성 보강) */}
        <div className="mt-12 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-sm font-bold text-slate-800">에디터 조형준</span>
              <span className="inline-flex max-w-max items-center rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                바른관절 헬프센터 대표
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              대학병원 정형외과 및 물리치료 임상 레퍼런스를 바탕으로 안전하고 효과적인 자가 재활 정보와 스트레칭 가이드를 제공합니다. 본 콘텐츠는 정형외과 전문 자문 위원단의 감수를 거쳐 작성되었습니다.
            </p>
          </div>
        </div>

        {/* ⚠️ 의학 정보 면책 조항 (E-E-A-T 신뢰성 보강) */}
        <div className="mt-6 rounded-2xl bg-amber-50/50 border border-amber-100 p-5 text-xs text-amber-800 leading-relaxed text-justify">
          <h4 className="font-bold flex items-center gap-1 mb-1">
            ⚠️ 꼭 기억해주세요! (의학 정보 면책 조항)
          </h4>
          <p>
            본 블로그의 재활 운동 및 자가 치료 정보는 일반적인 의학적 참고용으로 제작되었으며, 전문의의 개별 진단이나 진료를 대신할 수 없습니다. 
            특히 특정 동작 시 날카로운 통증이 있거나 저림이 번지는 증상이 지속된다면 질환의 심화(신경 압박, 연골 파열 등) 단계일 수 있으므로 즉시 운동을 중단하시고 전문 의료기관을 찾아 정밀 검진을 받으시기 바랍니다.
          </p>
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

      {/* 추천 관련 칼럼 영역 (구조적 고립 탈피 및 내부 링크 순환) */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 mb-8">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
            <BookOpen className="h-5 w-5 text-teal-600" />
            추천 관련 재활 칼럼
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-teal-500/50"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
                    <span className="font-semibold text-teal-600">
                      {relatedPost.category?.replace(/"/g, "") || "기타"}
                    </span>
                    <span>•</span>
                    <span>{relatedPost.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-teal-700 transition">
                    {relatedPost.title}
                  </h4>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition">
                  읽어보기 <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 💰 구글 애드센스 하단 광고 */}
      <AdSense slot="9998887770" />
    </div>
  );
}
