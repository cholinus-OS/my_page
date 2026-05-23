import Link from "next/link";
import { notFound } from "next/navigation";
import diseasesData from "@/content/diseases/data.json";
import CoupangLink from "@/components/CoupangLink";
import AdSense from "@/components/AdSense";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Tv, 
  ShieldAlert, 
  Bookmark,
  Activity
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Next.js 정적 빌드를 돕는 함수
export async function generateStaticParams() {
  return diseasesData.map((d) => ({
    id: d.id,
  }));
}

export default async function DiseasePage({ params }: PageProps) {
  const { id } = await params;

  // 데이터 찾기
  const disease = diseasesData.find((d) => d.id === id);

  if (!disease) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 1. 상단 목록가기 링크 */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        질환 사전 홈으로 돌아가기
      </Link>

      {/* 2. 질환 기본 정보 헤더 */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            {disease.partName} 관절 질환
          </span>
          <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Activity className="h-3 w-3" /> 추천 강도: 하(Safe)
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
          {disease.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          {disease.description}
        </p>
      </div>

      {/* 💰 애드센스 상단 광고 */}
      <AdSense slot="1234567890" />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* 3. 주요 증상 안내 */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              나도 혹시? 자가 체크 증상
            </h3>
            <ul className="mt-4 space-y-3">
              {disease.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-[11px] leading-relaxed text-slate-400">
              ※ 증상이 2개 이상 지속되거나 팔/다리에 감각 저하 또는 마비 현상이 보일 경우 정밀 검사가 필요합니다.
            </p>
          </div>
        </div>

        {/* 4. 추천 재활 스트레칭 동영상 */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tv className="h-5 w-5 text-teal-600" />
            안전한 재활 동영상 가이드
          </h3>
          
          {/* 유튜브 16:9 반응형 플레이어 */}
          <div className="mt-4 overflow-hidden rounded-xl bg-slate-100 aspect-video relative shadow-sm border border-slate-200">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${disease.youtubeId}`}
              title={`${disease.name} 재활 운동 영상`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            물리치료사 및 의료인이 검증한 가장 기본적이고 안전한 스트레칭 영상입니다. 통증이 느껴지기 직전 범위까지만 천천히 따라 해보세요.
          </p>
        </div>
      </div>

      {/* 💰 쿠팡 파트너스 맞춤형 상품 매칭 */}
      <div className="mt-8">
        <CoupangLink keyword={disease.keyword} />
      </div>

      {/* 💰 애드센스 하단 광고 */}
      <AdSense slot="0987654321" />

      {/* 5. 의학 가이드 면책 조항 */}
      <div className="mt-8 rounded-2xl bg-amber-50/50 border border-amber-100 p-5 text-xs text-amber-800 leading-relaxed">
        <h4 className="font-bold flex items-center gap-1 mb-1">
          ⚠️ 꼭 기억해주세요! (의학 정보 면책 조항)
        </h4>
        <p>
          본 서비스에서 제공되는 자가진단 증상 및 재활 운동 가이드는 대중적인 일반 정보를 기반으로 작성되었습니다.
          개인마다 관절의 상태, 염증 진행 단계, 기저 질환이 모두 다르므로 통증이 점점 심해지거나 호전되지 않을 경우에는 즉시 전문 정형외과/신경외과 등 전문 의료기관의 정밀 진단(X-ray, MRI 등)을 받으시길 권장합니다.
        </p>
      </div>
    </div>
  );
}
