import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import diseasesData from "@/content/diseases/data.json";
import { getSortedPostsData } from "@/lib/posts";
import { DIAGNOSIS_PARTS, getDiagnosisPartInfo } from "@/lib/diagnosis";
import SelfDiagnosis from "@/components/SelfDiagnosis";
import MedicalReferences from "@/components/MedicalReferences";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
} from "lucide-react";

interface DiagnosisPartPageProps {
  params: Promise<{ part: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return DIAGNOSIS_PARTS.map((item) => ({
    part: item.part,
  }));
}

export async function generateMetadata({ params }: DiagnosisPartPageProps): Promise<Metadata> {
  const { part } = await params;
  const info = getDiagnosisPartInfo(part);
  if (!info) {
    return {
      title: "자가진단 페이지를 찾을 수 없습니다 | 바른관절 헬프센터",
    };
  }
  return {
    title: `${info.seoTitle} | 바른관절 헬프센터 · 조형준 정형외과 전문의(cholinus)`,
    description: info.seoDescription,
    alternates: {
      canonical: `/diagnosis/${part}/`,
    },
    openGraph: {
      title: `${info.seoTitle} | 바른관절 헬프센터`,
      description: info.seoDescription,
      type: "website",
      url: `https://cholinus-exerciseismedicine.com/diagnosis/${part}/`,
    },
  };
}

export default async function DiagnosisPartPage({ params }: DiagnosisPartPageProps) {
  const { part } = await params;
  const info = getDiagnosisPartInfo(part);

  if (!info) {
    notFound();
  }

  const partDiseases = diseasesData.filter((d) => d.part === part);
  const allPosts = getSortedPostsData();
  const relatedPosts = allPosts
    .filter((post) => {
      const text = `${post.title} ${post.summary} ${(post.tags || []).join(" ")}`.toLowerCase();
      return info.blogKeywords.some((kw) => text.includes(kw.toLowerCase()));
    })
    .slice(0, 4);

  const pageUrl = `https://cholinus-exerciseismedicine.com/diagnosis/${part}/`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": info.seoTitle,
      "headline": info.seoTitle,
      "url": pageUrl,
      "description": info.seoDescription,
      "specialty": "Orthopedic",
      "aspect": ["Diagnosis", "Symptoms"],
      "lastReviewed": "2026-11-24",
      "reviewedBy": {
        "@type": "Person",
        "name": "조형준",
        "alternateName": "cholinus",
        "jobTitle": "정형외과 전문의",
        "url": "https://cholinus-exerciseismedicine.com/about/"
      },
      "isBasedOn": [
        "https://health.kdca.go.kr",
        "https://pubmed.ncbi.nlm.nih.gov",
        "https://www.koa.or.kr"
      ],
      "audience": {
        "@type": "MedicalAudience",
        "audienceType": "Patients"
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${info.partName} 자가진단`,
          "item": pageUrl
        }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
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
            <Link href="/diagnosis/" className="hover:text-teal-600 transition">자가진단</Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </li>
          <li>
            <span className="text-slate-700 font-semibold">{info.partName} 자가진단</span>
          </li>
        </ol>
      </nav>

      {/* 상단 부위별 안내 헤더 */}
      <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            <Activity className="h-3.5 w-3.5" />
            {info.partName} 관절 · 1분 자가진단
          </span>
          <span className="text-xs text-slate-400">
            확인 가능 질환 {partDiseases.length}종
          </span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {info.seoTitle}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          {info.seoDescription}
        </p>

        <div className="mt-4 flex flex-col gap-1 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            <span>
              의학적 감수: 2026. 11. ·{" "}
              <Link href="/about/" className="text-teal-700 font-bold hover:underline">
                조형준 정형외과 전문의 (cholinus)
              </Link>
            </span>
          </div>
          <p className="pl-6 text-[11px] text-slate-500">
            경희의료원 정형외과학 석·박사 · 슬관절외과 전임의 · 경희대 의대 외래교수 · 대한정형외과학회 등 4대 학회 정회원
          </p>
        </div>
      </header>

      {/* 인터랙티브 자가진단 테스트 (해당 부위 기본 선택됨) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xs mb-8">
        <SelfDiagnosis
          diseases={diseasesData}
          initialPart={part}
          shareUrl={pageUrl}
        />
      </div>

      {/* 검색 로봇·방문자를 위한 정적 질환 목록 */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs mb-8">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
          <Stethoscope className="h-5 w-5 text-teal-600" />
          {info.partName} 부위에서 흔히 의심되는 주요 질환 ({partDiseases.length}종)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {partDiseases.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900">{d.name}</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {d.summary}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-500 list-disc pl-4">
                  {d.symptoms.slice(0, 2).map((sym, i) => (
                    <li key={i}>{sym}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/70">
                <Link
                  href={`/disease/${d.id}/`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
                >
                  {d.name} 상세 정보·재활법 보기
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 전문의 레드플래그 경고 */}
      <section className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 mb-8">
        <h2 className="text-base sm:text-lg font-extrabold text-rose-900 flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
          이럴 때는 자가진단에 의존하지 말고 바로 정형외과 진료를 받으세요
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-rose-900/90 list-disc pl-5">
          {info.redFlags.map((flag, idx) => (
            <li key={idx}>{flag}</li>
          ))}
        </ul>
      </section>

      {/* 관련 재활 블로그 칼럼 */}
      {relatedPosts.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-teal-600" />
            {info.partName} 통증 관리에 도움 되는 재활 칼럼
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:bg-teal-50/30 transition"
              >
                <span className="text-[11px] font-semibold text-teal-700">{post.category}</span>
                <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2">{post.title}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{post.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 다른 부위 자가진단 바로가기 */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-800 mb-3">다른 부위 자가진단 바로가기</h2>
        <div className="flex flex-wrap gap-2">
          {DIAGNOSIS_PARTS.map((item) => (
            <Link
              key={item.part}
              href={`/diagnosis/${item.part}/`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                item.part === part
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {item.partName} 자가진단
            </Link>
          ))}
        </div>
      </section>

      <MedicalReferences partName={info.partName} title={info.seoTitle} />
    </div>
  );
}
