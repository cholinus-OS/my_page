import Link from "next/link";
import diseasesData from "@/content/diseases/data.json";
import NewsletterForm from "@/components/NewsletterForm";
import SelfDiagnosis from "@/components/SelfDiagnosis";
import { getSortedPostsData } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};
import { 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Youtube,
  BookOpen
} from "lucide-react";

// 추천 유튜브 채널 정보 정의
const youtubeChannels = [
  {
    name: "정형외과 김진구 교수",
    description: "대한민국 정형외과 무릎 치료의 명의, 스포츠 의학 및 무릎 관절염 예방·재활의 최고 권위자 공식 채널",
    url: "https://www.youtube.com/@Dr_KimJinGoo"
  },
  {
    name: "문쌤의 물리치료실",
    description: "현직 물리치료사가 알려주는 과학적인 관절 스트레칭 및 디스크 재활 전문 채널",
    url: "https://www.youtube.com/@moonssem/videos"
  },
  {
    name: "힙으뜸",
    description: "필라테스 기반의 홈트레이닝, 골반 교정 및 코어 강화 운동의 대명사 채널",
    url: "https://www.youtube.com/@euddeume"
  },
  {
    name: "모멘트핏 록샘",
    description: "바른 자세 유지와 기초 체력 증진, 부상 없는 데일리 다이어트 운동 가이드",
    url: "https://www.youtube.com/@momentfit"
  },
  {
    name: "데스런",
    description: "맨몸 운동의 교본으로 관절에 부담을 주지 않으면서 정교한 바디 정렬을 돕는 트레이닝 채널",
    url: "https://www.youtube.com/@deslun_yoonhyunyong"
  },
  {
    name: "마선호",
    description: "바른 자세 웨이트 트레이닝과 유쾌하게 배우는 부위별 근력 강화 요령 채널",
    url: "https://www.youtube.com/@Masunho"
  }
];

export default function Home() {
  // 실제 마크다운 데이터베이스에서 최신 글 가져오기
  const allPosts = getSortedPostsData();
  const latestPosts = allPosts.slice(0, 2);
  
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "관절 척추 바른자세 재활 세미나",
    "startDate": "2026-06-15T19:00:00+09:00",
    "endDate": "2026-06-15T21:00:00+09:00",
    "location": {
      "@type": "Place",
      "name": "온라인 생중계 (바른관절 헬프센터)"
    },
    "description": "허리디스크 및 무릎 관절염 예방을 위한 올바른 홈 스트레칭 강좌"
  };

  const govServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "노인 무릎 인공관절 수술비 지원",
    "description": "저소득층 어르신의 무릎 관절염 치료 지원을 위한 보건복지부 인공관절 수술비 지원 혜택",
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "보건복지부"
    }
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(govServiceJsonLd) }}
      />
      {/* 1. 영웅(Hero) 섹션 */}
      <section 
        className="relative overflow-hidden py-20 text-white sm:py-28 bg-cover bg-center" 
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
            <Sparkles className="h-3 w-3" />
            100% 무료 맞춤형 홈 재활 & 바른 자세 가이드
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            내 몸을 가장 완벽하게 쓰는 법,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">우리 몸 사용 설명서</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            스포츠 부상 예방부터 일상 속 바른 자세, 그리고 노화 방지까지. 요람에서 무덤까지 이어지는 생애주기별 자기 관리 가이드입니다.
          </p>
        </div>
      </section>

      {/* 2. 우리 몸 사용 설명서 (핵심 카테고리 안내) */}
      <section className="bg-white py-16" id="manual-categories">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              우리가 알아야 할 <span className="text-teal-600">몸의 사용법</span>
            </h2>
            <p className="mt-4 text-slate-500">
              통증 예방부터 삶의 질을 높이는 자세 교정까지, 목적에 맞는 가이드를 확인하세요.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* 카테고리 1 */}
            <Link href="/manual#chapter-1" className="block rounded-2xl bg-slate-50 p-8 text-center border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏃</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">스포츠 부상 예방</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                안전하게 스포츠를 즐기기 위한 필수 스트레칭과 각 관절 보호 요령을 배웁니다.
              </p>
            </Link>
            {/* 카테고리 2 */}
            <Link href="/manual#chapter-2" className="block rounded-2xl bg-slate-50 p-8 text-center border border-slate-100 hover:shadow-lg hover:border-teal-200 transition-all duration-300 group">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🧘</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">일상 속 바른 자세</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                거북목, 라운드숄더 등 현대인의 고질병을 해결하는 매일 5분 자세 교정 루틴.
              </p>
            </Link>
            {/* 카테고리 3 */}
            <Link href="/manual#chapter-3" className="block rounded-2xl bg-slate-50 p-8 text-center border border-slate-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300 group">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-700 transition-colors">생애주기별 관리</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                성장기 아이부터 관절염이 걱정되는 노년층까지 연령대별 노화 방지 솔루션.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 맞춤형 큐레이션 미니 퀴즈 (UI) */}
      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">나에게 맞는 &apos;사용 설명서&apos; 찾기</h2>
          <p className="text-slate-400 mb-8 text-sm">현재 당신의 고민은 무엇인가요?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/manual?search=Chapter 1"
              className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-teal-600 hover:border-teal-500 transition-colors text-sm font-medium"
            >
              🏃 운동 전후 부상이 걱정돼요
            </Link>
            <Link 
              href="/manual?search=Chapter 2"
              className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-teal-600 hover:border-teal-500 transition-colors text-sm font-medium"
            >
              💻 굽은 등과 목을 펴고 싶어요
            </Link>
            <Link 
              href="/blog?category=니숄더이야기"
              className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-rose-600 hover:border-rose-500 transition-colors text-sm font-medium"
            >
              🤕 이미 통증이 있고 수술을 했어요
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 1분 스마트 자가진단 테스트 (인터랙티브 컴포넌트) */}
      <SelfDiagnosis diseases={diseasesData} />

      {/* 5. 관절별 질환 사전 바로가기 (Shortcut) */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              관절별 <span className="text-teal-600">통증 사전</span>
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              통증 부위에 맞는 질환 정보를 빠르고 정확하게 찾아보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {/* 전체보기 */}
            <Link href="/disease" className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
              <div className="aspect-square w-full overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/disease_all.png" alt="전체 질환 사전" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-300 transition-colors">전체 질환 보기</h3>
                <span className="mt-1 inline-flex items-center text-[10px] sm:text-xs text-white/80 group-hover:text-white transition">바로가기 <ChevronRight className="ml-0.5 h-3 w-3" /></span>
              </div>
            </Link>

            {/* 척추 및 전신질환 */}
            <Link href="/disease#spine" className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
              <div className="aspect-square w-full overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/disease_spine.png" alt="척추 및 전신 질환" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-300 transition-colors">척추 및 전신질환</h3>
                <span className="mt-1 inline-flex items-center text-[10px] sm:text-xs text-white/80 group-hover:text-white transition">바로가기 <ChevronRight className="ml-0.5 h-3 w-3" /></span>
              </div>
            </Link>

            {/* 상지 관절 */}
            <Link href="/disease#upper" className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
              <div className="aspect-square w-full overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/disease_upper.png" alt="상지 관절 질환" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-300 transition-colors">상지 관절</h3>
                <span className="mt-1 inline-flex items-center text-[10px] sm:text-xs text-white/80 group-hover:text-white transition">바로가기 <ChevronRight className="ml-0.5 h-3 w-3" /></span>
              </div>
            </Link>

            {/* 하지 관절 */}
            <Link href="/disease#lower" className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
              <div className="aspect-square w-full overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/disease_lower.png" alt="하지 관절 질환" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-300 transition-colors">하지 관절</h3>
                <span className="mt-1 inline-flex items-center text-[10px] sm:text-xs text-white/80 group-hover:text-white transition">바로가기 <ChevronRight className="ml-0.5 h-3 w-3" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 최근 AI 재활 블로그 목록 섹션 */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                실시간 업데이트 재활 블로그
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                의학 정보를 바탕으로 추천하는 일상 속 바른 관절 스트레칭 및 자가 관리 비법
              </p>
            </div>
            <Link
              href="/blog/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {latestPosts.length > 0 ? (
              latestPosts.map((blog) => (
                <article
                  key={blog.slug}
                  className="group relative flex flex-col-reverse sm:flex-row justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-200"
                >
                  {/* 왼쪽 텍스트 설명 영역 */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{blog.date.replace(/-/g, ".")}</span>
                        <span>•</span>
                        <span className="text-teal-600 font-medium">{blog.category}</span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                        <Link href={`/blog/${blog.slug}/`} className="focus:outline-none">
                          <span className="absolute inset-0 z-0" aria-hidden="true" />
                          {blog.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                        {blog.summary}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end relative z-10">
                      <Link 
                        href={`/blog/${blog.slug}/`}
                        className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-600"
                      >
                        자세히 읽기 <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* 오른쪽 썸네일 이미지 영역 (모바일은 상단, PC는 우측 정렬) */}
                  {blog.thumbnail && (
                    <div className="w-full sm:w-32 sm:h-24 aspect-[16/9] sm:aspect-auto rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 relative z-10 border border-slate-100/60 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.thumbnail}
                        alt={`${blog.title} 썸네일`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
                새로운 재활 소식이 곧 등록될 예정입니다!
              </div>
            )}
          </div>

          {/* 🎯 니 숄더 이야기 홍보 배너 */}
          <div id="knee-shoulder-banner" className="scroll-mt-28 relative mx-auto mt-12 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/knee-shoulder-banner.png" alt="니 숄더 이야기 배너" className="w-full h-auto object-cover" />
            
            {/* 무릎 이야기 버튼 */}
            <Link 
              href="/knee-story/" 
              className="absolute left-[6.5%] top-[13%] w-[32%] h-[75%] rounded-full cursor-pointer transition-all duration-300 border border-dashed border-teal-400/40 bg-teal-500/5 hover:scale-[1.03] hover:border-solid hover:border-teal-400 hover:bg-teal-500/20 hover:shadow-[0_0_30px_10px_rgba(20,184,166,0.6)] focus:outline-none flex items-center justify-center group"
              aria-label="무릎 이야기 페이지로 이동"
            >
              <span className="relative flex h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-teal-600 border border-white items-center justify-center shadow-md">
                  <span className="text-[9px] font-extrabold text-white tracking-tighter">GO</span>
                </span>
              </span>
            </Link>

            {/* 어깨 이야기 버튼 */}
            <Link 
              href="/shoulder-story/" 
              className="absolute right-[6.5%] top-[13%] w-[32%] h-[75%] rounded-full cursor-pointer transition-all duration-300 border border-dashed border-orange-400/40 bg-orange-500/5 hover:scale-[1.03] hover:border-solid hover:border-orange-400 hover:bg-orange-500/20 hover:shadow-[0_0_30px_10px_rgba(249,115,22,0.6)] focus:outline-none flex items-center justify-center group"
              aria-label="어깨 이야기 페이지로 이동"
            >
              <span className="relative flex h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-orange-600 border border-white items-center justify-center shadow-md">
                  <span className="text-[9px] font-extrabold text-white tracking-tighter">GO</span>
                </span>
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. 추천 사이트 및 공식 유튜브 채널 추천 영역 */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 공식 운영 네이버 블로그 카드 */}
            <div className="lg:col-span-1 flex flex-col justify-between rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Naver Blog
                  </span>
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">cholinus 공식 블로그</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  웹사이트 운영자가 직접 수집하고 기록하는 깊이 있는 건강 관련 지식과 일상 속 자세 교정 꿀팁을 공유합니다.
                </p>
                <div className="my-4 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/blog-banner.jpg" 
                    alt="cholinus 공식 블로그 배너 일러스트" 
                    className="w-full h-auto rounded-2xl border border-slate-200"
                  />
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                  재활에 도움이 되는 다양한 운동 일지들과 유용한 노하우들을 공식 네이버 블로그에서 생생하게 만나보세요.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="https://blog.naver.com/cholinus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-semibold text-white transition shadow-md shadow-emerald-600/10"
                >
                  공식 블로그 방문하기
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* 추천 유튜브 채널 리스트 */}
            <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  물리치료 & 재활 추천 유튜브 채널
                </h3>
                <span className="text-[10px] text-slate-400">※ 무단 복제가 아닌 공식 큐레이션 채널입니다.</span>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {youtubeChannels.map((channel, index) => (
                  <a
                    key={index}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition duration-200 group"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition flex items-center gap-1.5">
                        {channel.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-1">
                        {channel.description}
                      </p>
                    </div>
                    <span className="text-slate-400 group-hover:text-red-500 transition">
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </span>
                  </a>
                ))}
              </div>

              {/* 🚂 Exercise Is Medicine. 기차 흐름 애니메이션 추가 */}
              <div className="mt-6 overflow-hidden w-full relative whitespace-nowrap bg-slate-50 py-4 rounded-2xl border border-slate-100/60 select-none">
                <style>{`
                  @keyframes trainMarquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                  }
                `}</style>
                <div 
                  className="inline-block text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-500 via-purple-600 to-teal-500 bg-clip-text text-transparent tracking-widest"
                  style={{
                    animation: 'trainMarquee 15s linear infinite',
                  }}
                >
                  Exercise Is Medicine.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 주간 뉴스레터 구독 섹션 */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              가장 빠른 <span className="text-teal-400">건강 소식</span> 받아보기
            </h2>
            <p className="mt-4 text-slate-400">
              바쁜 일상 속, 단 5분 투자로 관절 건강을 지키는 비법을 매주 배달해 드립니다.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
