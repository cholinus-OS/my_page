import diseasesData from "@/content/diseases/data.json";
import DiseaseDictionary from "@/components/DiseaseDictionary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "질환 사전 | 재활 안내",
  description: "척추, 상지, 하지 등 관절별 통증 원인과 주요 질환에 대한 자가진단 및 전문 지식을 제공합니다.",
  alternates: {
    canonical: "/disease",
  },
};

export default function DiseaseDictionaryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* 1. 상단 타이틀 영역 */}
      <div className="border-b border-slate-200 pb-6 mb-8 text-center sm:text-left">
        <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 mb-3 border border-teal-100">
          Exercise Is Medicine
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          질환 사전
        </h1>
        <p className="mt-3 text-base text-slate-500 max-w-2xl">
          척추 및 주요 관절 부위의 통증 원인과 대표적인 질환들을 한눈에 확인하세요. 전문적인 의학 정보를 바탕으로 정확한 자가 체크 가이드를 제공합니다.
        </p>
      </div>

      {/* 2. 클라이언트 컴포넌트 호출 (통증 사전) */}
      <DiseaseDictionary diseases={diseasesData} />
    </div>
  );
}
