"use client";

import { useState } from "react";
import Link from "next/link";
import diseasesData from "@/content/diseases/data.json";
import { 
  Flame, 
  ChevronRight, 
  Activity, 
  Sparkles, 
  Search, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Youtube,
  BookOpen,
  Hand,
  Footprints
} from "lucide-react";

// 신체 부위 소분류 탭 정보 정의
const bodyParts = [
  { id: "all", label: "전체보기" },
  { id: "neck", label: "목 (거북목·디스크)" },
  { id: "waist", label: "허리 (디스크·협착증·전위증)" },
  { id: "shoulder", label: "어깨 (회전근개·오십견)" },
  { id: "elbow", label: "팔꿈치 (엘보·터널)" },
  { id: "wrist", label: "손목 (터널·손가락)" },
  { id: "hip", label: "고관절 (충돌·괴사)" },
  { id: "knee", label: "무릎 (관절염·인대)" },
  { id: "ankle", label: "발목 (염좌·불안정증)" }
];

// 추천 유튜브 채널 정보 정의
const youtubeChannels = [
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
  const [selectedPart, setSelectedPart] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 필터링된 질환 목록
  const filteredDiseases = diseasesData.filter((d) => {
    const matchesPart = selectedPart === "all" || d.part === selectedPart;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPart && matchesSearch;
  });

  // 대분류 3열 구성 분할 로직 (척추 / 상지 / 하지)
  const col1Diseases = filteredDiseases.filter(d => d.mainCategory === "spine");
  const col2Diseases = filteredDiseases.filter(d => d.mainCategory === "upper");
  const col3Diseases = filteredDiseases.filter(d => d.mainCategory === "lower");

  const hasResults = filteredDiseases.length > 0;

  // 임시 최신 블로그 목록
  const sampleBlogs = [
    {
      id: "sample-1",
      title: "매일 아침 3분, 거북목 탈출을 돕는 필수 스트레칭 3가지",
      summary: "하루 종일 컴퓨터 모니터를 보며 굳어버린 목과 어깨 근육을 단 3분 만에 부드럽게 풀어주는 안전한 재활 스트레칭 방법을 소개합니다.",
      date: "2026.05.23",
      category: "목 재활"
    },
    {
      id: "sample-2",
      title: "허리 디스크 환자가 반드시 피해야 할 나쁜 앉기 자세와 걷기 운동법",
      summary: "허리에 가장 부담이 큰 앉기 자세를 수정하고, 요추 디스크의 C자 곡선을 지키면서 척추 기립근을 기르는 안전한 보행 전략을 배웁니다.",
      date: "2026.05.22",
      category: "허리 재활"
    }
  ];

  const renderCard = (disease: typeof diseasesData[0]) => (
    <div
      key={disease.id}
      className="body-part-card flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-500/20"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            {disease.partName}
          </span>
          <span className="flex items-center text-[10px] text-slate-400 gap-1">
            <Flame className="h-3 w-3 text-red-500" /> 자가 체크
          </span>
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 leading-tight">{disease.name}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
          {disease.summary}
        </p>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100">
        <Link
          href={`/disease/${disease.id}`}
          className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-slate-950 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-700"
        >
          원인 및 자가 체크 알아보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* 1. 영웅(Hero) 섹션 */}
      <section 
        className="relative overflow-hidden py-20 text-white sm:py-28 bg-cover bg-center" 
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
            <Sparkles className="h-3 w-3" />
            100% 무료 맞춤형 홈 재활 자가진단 사전
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            하루 한 동작, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">통증 없는 건강한 관절</span> 만들기
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            관절 통증으로 병원을 찾기 전, 부위별 세부 질환의 정확한 원인과 나도 해당되는지 체크할 수 있는 증상 진단 가이드를 확인하세요.
          </p>

          {/* 간편 검색바 */}
          <div className="mx-auto mt-10 max-w-md">
            <div className="relative flex items-center rounded-xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-300">
              <Search className="ml-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="관절 통증이나 질환명을 입력하세요 (예: 목디스크)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 pl-2 pr-4 text-sm text-white placeholder-slate-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 자가진단 및 관절별 검색 카테고리 */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-teal-600" />
              관절별 통증 사전
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              통증이나 이상을 느끼는 부위를 소분류 탭에서 선택하시면, 대분류(척추·상지·하지) 열에서 정밀 매칭됩니다.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
            <ShieldCheck className="h-4 w-4" />
            <span>25가지 척추 및 주요 관절 부위 자가체크 가이드가 제공됩니다.</span>
          </div>
        </div>

        {/* 신체 부위 소분류 선택 탭 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {bodyParts.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition duration-200 ${
                selectedPart === part.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {part.label}
            </button>
          ))}
        </div>

        {/* 24종 질환 목록 3열 대분류 구조화 렌더링 */}
        {hasResults ? (
          <div className="grid gap-8 md:grid-cols-3">
            {/* 1열: 척추 (목, 허리) */}
            <div className="flex flex-col gap-6 rounded-2xl bg-slate-100/50 p-4 border border-slate-200/50">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-2 px-1">
                <div className="rounded-lg bg-indigo-100 p-1.5 text-indigo-700">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">척추 관절</h3>
                  <p className="text-[10px] text-slate-500">목 뼈 · 등 · 허리 요추 정렬 관련 질환</p>
                </div>
              </div>
              
              {col1Diseases.length > 0 ? (
                col1Diseases.map((d) => renderCard(d))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">해당 없음</div>
              )}
            </div>

            {/* 2열: 상지 관절 (어깨, 팔꿈치, 손목) */}
            <div className="flex flex-col gap-6 rounded-2xl bg-slate-100/50 p-4 border border-slate-200/50">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-2 px-1">
                <div className="rounded-lg bg-teal-100 p-1.5 text-teal-700">
                  <Hand className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">상지 관절</h3>
                  <p className="text-[10px] text-slate-500">어깨 견관절 · 엘보 팔꿈치 · 손목 및 손가락</p>
                </div>
              </div>
              
              {col2Diseases.length > 0 ? (
                col2Diseases.map((d) => renderCard(d))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">해당 없음</div>
              )}
            </div>

            {/* 3열: 하지 관절 (고관절, 무릎, 발목) */}
            <div className="flex flex-col gap-6 rounded-2xl bg-slate-100/50 p-4 border border-slate-200/50">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-2 px-1">
                <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
                  <Footprints className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">하지 관절</h3>
                  <p className="text-[10px] text-slate-500">고관절 · 무릎 슬관절 · 발목 인대 및 족부</p>
                </div>
              </div>
              
              {col3Diseases.length > 0 ? (
                col3Diseases.map((d) => renderCard(d))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">해당 없음</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-slate-100/50">
            <p className="text-slate-500 text-sm">해당 검색어 또는 조건에 맞는 질환 정보가 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">다른 관절 부위를 선택하거나 검색어를 변경해 보세요.</p>
          </div>
        )}
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
                AI 의사가 추천하는 일상 속 바른 관절 스트레칭 및 자가 관리 비법
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sampleBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span className="text-teal-600 font-medium">{blog.category}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 hover:text-teal-600 transition">
                    <Link href="/blog">{blog.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {blog.summary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                  >
                    자세히 읽기 <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
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
                  웹사이트 운영자가 직접 수집하고 기록하는 깊이 있는 건강 관련 지식과 일상 속 자세 교정 꿀팁, 일지들을 네이버 블로그에서 만나보세요.
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
