import Link from "next/link";
import { ChevronLeft, Info, Stethoscope, HeartPulse, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-600 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </div>

      {/* 헤더 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 mb-8">
        <div className="flex items-center gap-3 text-teal-600 mb-4">
          <Info className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-wider uppercase">About Us</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl leading-tight">
          바른관절 헬프센터 소개
        </h1>
        <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
          바른관절 헬프센터는 현대인들이 일상 속에서 빈번히 겪는 척추 및 관절 통증을 올바르게 인지하고, 
          안전하고 체계적인 재활 운동을 통해 신체 기능을 스스로 회복·관리할 수 있도록 돕는 전문 의학 가이드 플랫폼입니다.
        </p>
      </div>

      {/* 본문 소개 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <HeartPulse className="h-5 w-5 text-teal-600" />
            핵심 가치 및 미션 (Our Mission)
          </h2>
          <p>
            많은 현대인들이 원인 불명의 요통, 목 통증, 어깨 결림, 무릎 관절염 등으로 고통받고 있으나, 
            정확한 정보의 부재로 질환을 악화시키거나 방치하는 경우가 많습니다. 본 센터는 아래의 핵심 가치를 지향합니다.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>의학적 신뢰성</strong>: 최신 정형외과 및 재활의학과 임상 가이드라인을 분석하여 올바른 상식을 제공합니다.</li>
            <li><strong>시각적 인지 우선</strong>: 질환의 발생 위치와 해부학적 비교 일러스트를 최상단에 배치하여 직관적으로 상태를 이해하도록 돕습니다.</li>
            <li><strong>안전한 재활 지침</strong>: 집에서 누구나 무리 없이 따라 할 수 있는 단계별 스트레칭 및 근력 강화 동작을 구성하여 관절 손상을 방지합니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-teal-600" />
            E-E-A-T 기반의 전문 콘텐츠 관리
          </h2>
          <p>
            본 플랫폼의 콘텐츠는 구글의 <strong>E-E-A-T (전문성, 경험, 권위성, 신뢰성)</strong> 평가 가이드라인에 맞추어 제작되었습니다.
            정형외과 질환 및 재활 물리치료에 특화된 정보를 기획·교정하는 의료 정보 기획 분석팀과 운동 재활 조언을 제공하는 전문가들의 협력을 바탕으로 작성됩니다.
            또한, 본 정보는 대중 교육을 목적으로 구성되어 있어 전문의 대면 진료를 대신할 수는 없으며, 
            사용자가 오용하는 것을 예방하기 위해 모든 정보 하단에 <strong>의학적 면책 고지(Disclaimer)</strong>를 투명하게 운영하고 있습니다.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-teal-600" />
            운영팀 문의 및 제안 (Contact Us)
          </h2>
          <p>
            콘텐츠 오류 수정 요청, 정형외과 자문 협업 제안, 광고 및 제휴 관련 문의 사항은 아래의 공식 채널을 통해 전달해 주시기 바랍니다. 
            영업일 기준 24시간 이내에 성실하게 답변해 드립니다.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>기관명</strong>: 바른관절 헬프센터 운영팀</li>
              <li><strong>대표 운영자</strong>: 조형준</li>
              <li><strong>공식 이메일</strong>: <a href="mailto:cholinus@naver.com" className="text-teal-600 font-semibold hover:underline">cholinus@naver.com</a></li>
              <li><strong>대표 도메인</strong>: <Link href="/" className="text-teal-600 font-semibold hover:underline">cholinus-exerciseismedicine.com</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
