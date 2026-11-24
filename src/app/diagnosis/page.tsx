import Link from "next/link";
import type { Metadata } from "next";
import diseasesData from "@/content/diseases/data.json";
import { DIAGNOSIS_PARTS } from "@/lib/diagnosis";
import { Activity, ChevronRight, Stethoscope, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "부위별 1분 관절 자가진단 | 바른관절 헬프센터 · 조형준 정형외과 전문의(cholinus)",
  description: "목, 허리, 어깨, 팔꿈치, 손목, 고관절, 무릎, 발목, 전신 질환까지 통증 부위별 1분 자가진단 테스트를 바로 이용해 보세요.",
  alternates: {
    canonical: "/diagnosis/",
  },
};

export default function DiagnosisIndexPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "부위별 1분 관절 자가진단",
      "url": "https://cholinus-exerciseismedicine.com/diagnosis/",
      "description": "목, 허리, 어깨, 팔꿈치, 손목, 고관절, 무릎, 발목, 전신 질환별 1분 자가진단 안내 페이지",
      "specialty": "Orthopedic",
      "lastReviewed": "2026-11-24",
      "reviewedBy": {
        "@type": "Person",
        "name": "조형준",
        "alternateName": "cholinus",
        "jobTitle": "정형외과 전문의",
        "url": "https://cholinus-exerciseismedicine.com/about/"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": "https://cholinus-exerciseismedicine.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "자가진단",
          "item": "https://cholinus-exerciseismedicine.com/diagnosis/"
        }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-teal-600 transition">홈</Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </li>
          <li>
            <span className="text-slate-700 font-semibold">부위별 자가진단</span>
          </li>
        </ol>
      </nav>

      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 border border-teal-100">
          <Activity className="h-3.5 w-3.5" />
          정형외과 전문의 검수 · 1분 자가진단
        </span>
        <h1 className="mt-4 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          통증 부위별 1분 스마트 자가진단
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          지금 불편한 관절이나 신체 부위를 선택하시면, 해당 부위의 대표 증상 체크리스트를 통해 의심되는 질환과 맞춤 재활 가이드를 바로 확인하실 수 있습니다.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIAGNOSIS_PARTS.map((info) => {
          const partDiseases = diseasesData.filter((d) => d.part === info.part);
          return (
            <Link
              key={info.part}
              href={`/diagnosis/${info.part}/`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    <Stethoscope className="h-3.5 w-3.5" />
                    {info.partName} 자가진단
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    질환 {partDiseases.length}종
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition">
                  {info.partName} 통증 증상 체크
                </h2>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {partDiseases.map((d) => d.name).join(" · ")}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                <span>1분 테스트 시작하기</span>
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">의학적 면책 고지</p>
          <p>
            본 자가진단 테스트는 일반적인 의학 정보 제공 및 참고용이며, 정형외과 전문의의 대면 진찰과 영상 검사를 대신할 수 없습니다. 통증이 지속되거나 팔다리 저림·힘 빠짐 등 신경 증상이 동반된다면 즉시 의료기관을 방문하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
