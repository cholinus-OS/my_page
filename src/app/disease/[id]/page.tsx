import Link from "next/link";
import { notFound } from "next/navigation";
import diseasesData from "@/content/diseases/data.json";
import CoupangLink from "@/components/CoupangLink";
import AdSense from "@/components/AdSense";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* 1. 상단 목록가기 링크 */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        통증 사전 홈으로 돌아가기
      </Link>

      {/* 2. 질환 기본 정보 헤더 */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            {disease.mainCategoryName} · {disease.partName} 관절
          </span>
          <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Activity className="h-3 w-3" /> 정밀 자가 진단
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
          {disease.name}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-600 text-justify">
          {disease.description}
        </p>
        {disease.id === "turtle-neck" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/straight-neck-detail.jpg" 
              alt="일자목 정렬 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/turtle-neck-detail.jpg" 
              alt="거북목 증후군 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
          </div>
        )}
        {disease.id === "cervical-herniation" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/cervical-radiculopathy.jpg" 
              alt="경추 신경근병증 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/cervical-herniation-detail.jpg" 
              alt="경추 디스크 탈출증 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
          </div>
        )}
        {disease.id === "lumbar-herniation" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/lumbar-herniation.jpg" 
              alt="디스크 팽윤 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/lumbar-herniation-detail.jpg" 
              alt="요추 디스크 탈출증 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
          </div>
        )}
        {disease.id === "opll" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/opll.jpg" 
              alt="후방인대골화증 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "spondylolisthesis" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/spondylolisthesis.jpg" 
              alt="척추전방전위증 및 척추분리증 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "spinal-stenosis" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/spinal-stenosis.jpg" 
              alt="척추간 협착증 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {/* 특정 질환 설명 하단에 해부학 일러스트 그림 삽입 */}
        {disease.id === "rotator-cuff-tear" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/rotator-cuff-tear.jpg" 
              alt="회전근개 파열 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "rotator-cuff-tendinitis" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/rotator-cuff-tendinitis.jpg" 
              alt="회전근개 건염 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "frozen-shoulder" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/frozen-shoulder.jpg" 
              alt="유착성 관절낭염 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "slap-tear" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/slap-tear.jpg" 
              alt="상관절와순 파열 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "shoulder-instability" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/shoulder-instability.jpg" 
              alt="다발성 어깨 불안정증 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "tennis-elbow" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/tennis-elbow-detail.jpg" 
              alt="외측 상과염 (테니스 엘보) 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/golf-elbow-detail.jpg" 
              alt="내측 상과염 (골프 엘보) 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
          </div>
        )}
        {disease.id === "cubital-tunnel" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/cubital-tunnel.jpg" 
              alt="팔꿈치 터널 증후군 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "golf-elbow" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/golf-elbow-detail.jpg" 
              alt="내측 상과염 (골프 엘보) 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/tennis-elbow-detail.jpg" 
              alt="외측 상과염 (테니스 엘보) 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
          </div>
        )}
        {disease.id === "carpal-tunnel" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/carpal-tunnel.jpg" 
              alt="손목 터널 증후군 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "trigger-finger" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/trigger-finger.jpg" 
              alt="방아쇠 손가락 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "hip-impingement" && (
          <div className="mt-6 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/hip-impingement.jpg" 
              alt="고관절 충돌 증후군 해부도" 
              className="w-full h-auto rounded-2xl border border-slate-200"
            />
          </div>
        )}
        {disease.id === "avn-hip" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/avn-hip-detail.jpg" 
              alt="대퇴골두 무혈성 괴사 혈액 공급 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/avn-hip-arthritis.jpg" 
              alt="고관절 관절염 해부도" 
              className="w-full sm:w-1/2 h-auto rounded-2xl border border-slate-200 object-cover"
            />
          </div>
        )}
      </div>

      {/* 💰 애드센스 상단 광고 */}
      <AdSense slot="1234567890" />

      {/* 3. 주요 증상 안내 (가독성을 극대화한 넓은 단일 카드 배치) */}
      <div className="mt-8 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          자가 체크 해보기 (현재 상태 점검)
        </h3>
        
        <ul className="space-y-4">
          {disease.symptoms.map((symptom, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-[11px] leading-relaxed text-slate-400">
            ※ 안내된 자가 체크 증상 중 <strong>2개 이상이 3주 이상 만성적으로 지속</strong>될 경우, 해당 관절 부위의 구조적 변형이나 힘줄/인대 손상이 심화되었을 가능성이 있습니다. 단순 근육통이 아니므로 통증 범위와 저림 부위를 확인해 보세요.
          </p>
        </div>
      </div>

      {/* 💰 쿠팡 파트너스 맞춤형 상품 매칭 */}
      <div className="mt-8">
        <CoupangLink keyword={disease.keyword} />
      </div>

      {/* 💰 애드센스 하단 광고 */}
      <AdSense slot="0987654321" />

      {/* 4. 의학 가이드 면책 조항 */}
      <div className="mt-8 rounded-2xl bg-amber-50/50 border border-amber-100 p-5 text-xs text-amber-800 leading-relaxed">
        <h4 className="font-bold flex items-center gap-1 mb-1">
          ⚠️ 꼭 기억해주세요! (의학 정보 면책 조항)
        </h4>
        <p>
          본 사이트의 자가진단 정보는 대중적인 일반 의학 가이드를 기반으로 구성되었으며, 정식 의사의 소견을 대신할 수 없습니다. 
          특히 사지 저림, 감각 무뎌짐, 관절 변형, 극심한 가동 범위 제한 등은 연골판 찢어짐이나 신경 괴사, 압박과 관련될 수 있으므로 통증이 지속될 경우 반드시 정형외과나 재활의학과 전문 의료인을 찾아 정확한 검진을 받으시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
