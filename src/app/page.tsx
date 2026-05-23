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
  ShieldCheck
} from "lucide-react";

// 신체 부위 탭 정보 정의 (신규 카테고리 추가)
const bodyParts = [
  { id: "all", label: "전체보기" },
  { id: "neck", label: "목 (거북목)" },
  { id: "waist", label: "허리 (디스크)" },
  { id: "shoulder", label: "어깨 (오십견)" },
  { id: "elbow", label: "팔꿈치 (엘보)" },
  { id: "wrist", label: "손목 (저림증)" },
  { id: "hip", label: "고관절 (사타구니)" },
  { id: "knee", label: "무릎 (관절염)" },
  { id: "ankle", label: "발목 (접지름)" }
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

  // 대표적이고 명확한 3열 배치 구성 분할 로직 (사용자 정렬 기준)
  // 1열: 목, 허리
  const col1Diseases = filteredDiseases.filter(d => d.part === "neck" || d.part === "waist");
  // 2열: 어깨, 팔꿈치, 손목
  const col2Diseases = filteredDiseases.filter(d => d.part === "shoulder" || d.part === "elbow" || d.part === "wrist");
  // 3열: 고관절, 무릎, 발목
  const col3Diseases = filteredDiseases.filter(d => d.part === "hip" || d.part === "knee" || d.part === "ankle");

  // 총 결과가 있는지 체크
  const hasResults = filteredDiseases.length > 0;

  // 임시 최신 블로그 목록 (AI 연동 전, 레이아웃 확인용 예시 데이터)
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

  // 카드 렌더링 헬퍼 함수
  const renderCard = (disease: typeof diseasesData[0]) => (
    <div
      key={disease.id}
      className="body-part-card flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            {disease.partName}
          </span>
          <span className="flex items-center text-[10px] text-slate-400 gap-1">
            <Flame className="h-3 w-3 text-red-500" /> 통증 완화 코스
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900">{disease.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">
          {disease.summary}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <Link
          href={`/disease/${disease.id}`}
          className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-slate-950 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          재활 운동법 보러 가기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* 1. 영웅(Hero) 섹션: 핵심 가치 제안 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(13,148,136,0.15),transparent)] pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
            <Sparkles className="h-3 w-3" />
            100% 무료 맞춤형 홈 재활 운동 가이드
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            하루 한 동작, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">통증 없는 건강한 관절</span> 만들기
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            물리치료사와 대학병원의 검증된 자료를 기반으로 개발된 안전한 스트레칭과 재활 꿀팁을 지금 확인하세요.
          </p>

          {/* 간편 검색바 */}
          <div className="mx-auto mt-10 max-w-md">
            <div className="relative flex items-center rounded-xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-300">
              <Search className="ml-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="어디가 아프신가요? (예: 고관절, 허리, 발목)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 pl-2 pr-4 text-sm text-white placeholder-slate-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 자가진단 및 관절별 검색 카테고리 (이원화 타겟 여정 반영) */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-teal-600" />
              관절별 통증 사전
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              현재 통증이나 이상을 느끼는 부위를 눌러 관련 질환과 재활법을 알아보세요.
            </p>
          </div>
          
          {/* 타겟 안내 배너 */}
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
            <ShieldCheck className="h-4 w-4" />
            <span>기초 체력 증진 및 예방을 위한 운동도 준비되어 있어요!</span>
          </div>
        </div>

        {/* 신체 부위 선택 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {bodyParts.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition duration-200 ${
                selectedPart === part.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {part.label}
            </button>
          ))}
        </div>

        {/* 질환 목록 3열 그리드 (강제 열 배치) */}
        {hasResults ? (
          <div className="grid gap-6 md:grid-cols-3">
            {/* 1열: 목, 허리 */}
            <div className="flex flex-col gap-6">
              {col1Diseases.map((d) => renderCard(d))}
            </div>

            {/* 2열: 어깨, 팔꿈치, 손목 */}
            <div className="flex flex-col gap-6">
              {col2Diseases.map((d) => renderCard(d))}
            </div>

            {/* 3열: 고관절, 무릎, 발목 */}
            <div className="flex flex-col gap-6">
              {col3Diseases.map((d) => renderCard(d))}
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
                    <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {blog.summary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/blog/${blog.id}`}
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
    </div>
  );
}
