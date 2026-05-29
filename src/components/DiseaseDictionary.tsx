"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight, Activity, Hand, Footprints, Search, ShieldCheck } from "lucide-react";

interface Disease {
  id: string;
  name: string;
  part: string;
  partName: string;
  mainCategory: string;
  mainCategoryName: string;
  summary: string;
  description: string;
  symptoms: string[];
  keyword: string;
}

interface DiseaseDictionaryProps {
  diseases: Disease[];
}

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

export default function DiseaseDictionary({ diseases }: DiseaseDictionaryProps) {
  const [selectedPart, setSelectedPart] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiseases = diseases.filter((d) => {
    const matchesPart = selectedPart === "all" || d.part === selectedPart;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPart && matchesSearch;
  });

  const col1Diseases = filteredDiseases.filter(d => d.mainCategory === "spine");
  const col2Diseases = filteredDiseases.filter(d => d.mainCategory === "upper");
  const col3Diseases = filteredDiseases.filter(d => d.mainCategory === "lower");

  const hasResults = filteredDiseases.length > 0;

  const renderCard = (disease: Disease) => (
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
          <span>{diseases.length}가지 척추 및 주요 관절 부위 자가체크 가이드가 제공됩니다.</span>
        </div>
      </div>

      {/* 간편 검색바 */}
      <div className="mx-auto mb-8 max-w-md">
        <div className="relative flex items-center rounded-xl bg-slate-100 p-1.5 border border-slate-200 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-300">
          <Search className="ml-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="관절 통증이나 질환명을 입력하세요 (예: 목디스크)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-2 pl-2 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
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

      {/* 25종 질환 목록 3열 대분류 구조화 렌더링 */}
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
  );
}
