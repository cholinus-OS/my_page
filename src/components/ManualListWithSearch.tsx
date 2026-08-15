"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Search, X } from "lucide-react";

interface PostItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
}

interface ManualListWithSearchProps {
  initialPosts: PostItem[];
}

export default function ManualListWithSearch({ initialPosts }: ManualListWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("전체");

  const chapters = ["전체", "Chapter 1", "Chapter 2", "Chapter 3"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get("search") || "";
      if (queryParam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery(queryParam);
      }
    }
  }, []);

  const renderPostCard = (post: PostItem) => (
    <article 
      key={post.slug}
      className="group relative flex flex-col-reverse sm:flex-row justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-teal-500/30"
    >
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-1 font-semibold text-teal-700">
              {post.category?.replace(/"/g, "")}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-teal-600 transition">
            <Link href={`/blog/${post.slug}/`} className="focus:outline-none">
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2 sm:line-clamp-3">
            {post.summary}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 relative z-10">
              {Array.from(new Set(post.tags)).map((tag: string) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex items-center text-xs font-semibold text-teal-600 relative z-10">
          <span>설명서 읽기</span>
          <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition duration-200" />
        </div>
      </div>
      {post.thumbnail && (
        <div className="w-full sm:w-48 sm:h-32 aspect-[16/9] sm:aspect-auto rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative z-10 border border-slate-100/60 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt={`${post.title} 썸네일`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </article>
  );

  // 1. 필터 로직
  const filteredPosts = initialPosts.filter((post) => {
    // 챕터 매칭
    const matchesChapter = selectedChapter === "전체" || post.title.includes(selectedChapter);
    if (!matchesChapter) return false;

    // 검색어 매칭
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchTitle = post.title.toLowerCase().includes(query);
    const matchSummary = post.summary.toLowerCase().includes(query);
    const matchTags = post.tags && post.tags.some(tag => tag.toLowerCase().includes(query));

    return matchTitle || matchSummary || matchTags;
  });

  // 2. 그룹핑 로직
  const chapter1Posts = filteredPosts.filter(p => p.title.includes("Chapter 1"));
  const chapter2Posts = filteredPosts.filter(p => p.title.includes("Chapter 2"));
  const chapter3Posts = filteredPosts.filter(p => p.title.includes("Chapter 3"));

  return (
    <div className="space-y-12">
      {/* 🔍 프리미엄 검색창 및 필터 영역 */}
      <div className="space-y-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="찾으시는 부위나 증상을 검색해 보세요 (예: 거북목, 허리, 무릎)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 🏷️ 카테고리 필터 칩 */}
        <div className="flex flex-wrap gap-2 pt-2">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => setSelectedChapter(chapter)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedChapter === chapter
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {chapter}
            </button>
          ))}
        </div>
        
        {/* 실시간 필터링 결과 수 안내 */}
        {(searchQuery || selectedChapter !== "전체") && (
          <p className="text-xs text-slate-500 pl-1">
            총 <strong className="text-teal-600 font-semibold">{filteredPosts.length}개</strong>의 설명서가 검색되었습니다.
          </p>
        )}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 bg-white">
          <p className="text-slate-500 font-medium">검색 결과에 맞는 설명서가 없습니다.</p>
          <p className="text-xs text-slate-400 mt-2">다른 검색어로 다시 시도해 보세요.</p>
        </div>
      )}

      {/* 챕터별 섹션 렌더링 */}
      <div className="space-y-16">
        {(selectedChapter === "전체" || selectedChapter === "Chapter 1") && chapter1Posts.length > 0 && (
          <section id="chapter-1" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl shadow-sm border border-emerald-200/60">🏃</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Chapter 1. 스포츠 부상 예방</h2>
                <p className="text-sm text-slate-500 mt-1">안전하게 스포츠를 즐기기 위한 필수 스트레칭 및 관절 보호</p>
              </div>
            </div>
            <div className="space-y-6">
              {chapter1Posts.map(renderPostCard)}
            </div>
          </section>
        )}

        {(selectedChapter === "전체" || selectedChapter === "Chapter 2") && chapter2Posts.length > 0 && (
          <section id="chapter-2" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl shadow-sm border border-teal-200/60">🧘</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Chapter 2. 일상 속 바른 자세</h2>
                <p className="text-sm text-slate-500 mt-1">거북목, 라운드숄더 등 현대인의 고질병을 해결하는 자세 교정 루틴</p>
              </div>
            </div>
            <div className="space-y-6">
              {chapter2Posts.map(renderPostCard)}
            </div>
          </section>
        )}

        {(selectedChapter === "전체" || selectedChapter === "Chapter 3") && chapter3Posts.length > 0 && (
          <section id="chapter-3" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-2xl shadow-sm border border-rose-200/60">👨‍👩‍👧‍👦</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Chapter 3. 생애주기별 관리</h2>
                <p className="text-sm text-slate-500 mt-1">성장기부터 노년기까지, 관절염과 노화를 늦추는 방어적 가이드</p>
              </div>
            </div>
            <div className="space-y-6">
              {chapter3Posts.map(renderPostCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
