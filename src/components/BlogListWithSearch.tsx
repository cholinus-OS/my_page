"use client";

import { useState } from "react";
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

interface BlogListWithSearchProps {
  initialPosts: PostItem[];
}

export default function BlogListWithSearch({ initialPosts }: BlogListWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 실시간 필터링 로직
  const filteredPosts = initialPosts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchTitle = post.title.toLowerCase().includes(query);
    const matchSummary = post.summary.toLowerCase().includes(query);
    const matchTags = post.tags && post.tags.some(tag => tag.toLowerCase().includes(query));
    const matchCategory = post.category && post.category.toLowerCase().includes(query);

    return matchTitle || matchSummary || matchTags || matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* 🔍 프리미엄 검색창 영역 */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="관심 있는 재활 운동이나 통증 부위를 검색해 보세요 (예: 거북목, 허리, 무릎)"
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

      {/* 실시간 필터링 결과 수 안내 */}
      {searchQuery && (
        <p className="text-xs text-slate-500 pl-1">
          총 <strong className="text-teal-600 font-semibold">{filteredPosts.length}개</strong>의 글이 검색되었습니다.
        </p>
      )}

      {/* 포스트 카드 리스트 */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article 
              key={post.slug}
              className="group relative flex flex-col-reverse sm:flex-row justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-teal-500/30"
            >
              {/* 왼쪽 텍스트 설명 영역 */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-1 font-semibold text-teal-700">
                        {post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-teal-600 transition">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0 z-0" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2 sm:line-clamp-3">
                    {post.summary}
                  </p>
  
                  {/* 태그 리스트 */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 relative z-10">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-2xs font-medium text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
  
                <div className="mt-6 flex items-center text-xs font-semibold text-teal-600 relative z-10">
                  <span>글 읽기</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition duration-200" />
                </div>
              </div>

              {/* 오른쪽 썸네일 이미지 영역 (모바일은 상단, PC는 우측 정렬) */}
              {post.thumbnail && (
                <div className="w-full sm:w-48 sm:h-32 aspect-[16/9] sm:aspect-auto rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative z-10 border border-slate-100/60 shadow-2xs">
                  <img
                    src={post.thumbnail}
                    alt={`${post.title} 썸네일`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 bg-white">
          <p className="text-slate-500 font-medium">검색 결과에 맞는 블로그 글이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-2">다른 검색어로 다시 시도해 보시거나, 철자를 확인해 보세요!</p>
        </div>
      )}
    </div>
  );
}
