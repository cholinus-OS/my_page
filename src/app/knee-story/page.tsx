import Link from "next/link";
import diseasesData from "@/content/diseases/data.json";
import { getSortedPostsData } from "@/lib/posts";
import { ChevronRight, ArrowLeft, BookOpen, Activity, HeartPulse, Award } from "lucide-react";

export default function KneeStoryPage() {
  // 무릎 부위 질환 필터링
  const kneeDiseases = diseasesData.filter((d) => d.part === "knee");

  // 무릎 관련 블로그 포스트 필터링
  const allPosts = getSortedPostsData();
  const kneePosts = allPosts.filter(
    (post) =>
      post.tags?.some((tag) => tag.includes("무릎") || tag.includes("관절염")) ||
      post.title.includes("무릎") ||
      kneeDiseases.some((d) => post.slug.includes(d.id))
  ).slice(0, 5); // 최신 5개 포스트

  // 센터장 브리핑 in Knee 관련 포스트 필터링 (카테고리가 '브리핑'이고 무릎 키워드 포함)
  const kneeBriefings = allPosts.filter(
    (post) =>
      post.category === "브리핑" &&
      (post.tags?.some((tag) => tag.includes("무릎") || tag.includes("관절염")) ||
        post.title.includes("무릎"))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 뒤로가기 링크 */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        메인 홈으로 돌아가기
      </Link>

      {/* 헤더 섹션 */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-teal-500 p-6 sm:p-8 text-white shadow-md mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white">
          <HeartPulse className="h-3.5 w-3.5" />
          Knee Story
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">무릎 이야기</h1>
        <p className="mt-3 max-w-2xl text-base text-blue-50/90 leading-relaxed">
          우리 몸의 충격을 흡수하고 보행을 가능하게 하는 핵심 관절, 무릎! 퇴행성 관절염부터 십자인대 파열까지 무릎 관절 관련 상세 질환과 운동 재활법을 한 곳에 모았습니다.
        </p>
      </div>

      {/* 0. 센터장 브리핑 in Knee 섹션 */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
          <Award className="h-5 w-5 text-teal-600" />
          센터장 브리핑 in Knee
        </h2>
        {kneeBriefings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {kneeBriefings.map((post) => (
              <article 
                key={post.slug}
                className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-teal-100 p-5 shadow-xs hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                      공식 브리핑
                    </span>
                    <span className="text-[11px] text-slate-400">{post.date.replace(/-/g, ".")}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0 z-0" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end relative z-10">
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-600 hover:underline">
                    브리핑 읽기 <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/20 p-6 text-center">
            <p className="text-sm font-semibold text-teal-850">
              ✍️ 센터장 전문 브리핑 준비 중
            </p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              센터장이 직접 작성하고 해설하는 무릎 관절 임상 정보 및 재활 칼럼이 준비 중에 있습니다.<br />
              직접 작성하신 브리핑 글(카테고리: 브리핑)이 이곳에 실시간으로 업데이트될 예정입니다.
            </p>
          </div>
        )}
      </div>

      {/* 1. 무릎 관련 질병 사전 */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
          <Activity className="h-5 w-5 text-teal-600" />
          무릎 관절 주요 질환 사전
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {kneeDiseases.map((disease) => (
            <div key={disease.id} className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition duration-200">
              <div>
                <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                  {disease.partName} 관절
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{disease.name}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {disease.summary}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <Link 
                  href={`/disease/${disease.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                >
                  상세 증상 및 진단 가이드 <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 최신 무릎 재활 가이드 블로그 */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
          <BookOpen className="h-5 w-5 text-teal-600" />
          최신 무릎 재활 운동 & 건강 가이드
        </h2>
        {kneePosts.length > 0 ? (
          <div className="space-y-4">
            {kneePosts.map((post) => (
              <article 
                key={post.slug}
                className="group relative flex flex-col sm:flex-row justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 hover:shadow-md transition duration-200"
              >
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400">{post.date.replace(/-/g, ".")}</span>
                    <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0 z-0" aria-hidden="true" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end relative z-10">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-600">
                      글 읽기 <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                {post.thumbnail && (
                  <div className="w-full sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 relative z-10 border border-slate-100 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
            아직 관련 포스트가 등록되지 않았습니다.
          </div>
        )}
      </div>
    </div>
  );
}
