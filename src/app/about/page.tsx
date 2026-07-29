import Link from "next/link";
import { ChevronLeft, Info, Stethoscope, HeartPulse, Mail, UserCheck, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "바른관절 헬프센터 소개 | 재활 안내",
  description: "정형외과 전문의가 대표 에디터로 검수하는 신뢰성 높은 관절 및 척추 재활 의학 가이드 플랫폼입니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "바른관절 헬프센터 소개",
    "description": "정형외과 전문의 조형준 대표가 운영 및 감수하는 안전하고 체계적인 관절 재활 운동 가이드.",
    "url": "https://cholinus-exerciseismedicine.com/about",
    "aspect": [
      "Rehabilitation",
      "Orthopedics",
      "Physical Therapy"
    ],
    "mainEntity": {
      "@type": "MedicalCondition",
      "name": "Musculoskeletal Disorders"
    },
    "audience": {
      "@type": "MedicalAudience",
      "audienceType": "Patients seeking joint rehabilitation"
    },
    "author": {
      "@type": "Person",
      "name": "조형준",
      "jobTitle": "정형외과 전문의"
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageJsonLd) }}
      />
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

      {/* ✍️ 대표 에디터 & 의료진 프로필 카드 (E-E-A-T 통과를 위한 핵심 신뢰성 블록) */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50/60 via-white to-white p-8 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <UserCheck className="h-6 w-6 text-teal-600" />
          대표 에디터 및 감수자 소개
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* 아바타 영역 */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-150 border-2 border-teal-200 text-teal-600">
            <span className="text-xl font-black">조형준</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <span className="text-lg font-extrabold text-slate-800">조형준 대표 에디터</span>
              <span className="inline-flex max-w-max items-center rounded-full bg-teal-600 px-3 py-0.5 text-xs font-semibold text-white">
                정형외과 전문의 (Orthopedic Specialist)
              </span>
            </div>
            
            <div className="mt-4 grid gap-3 text-xs sm:text-sm text-slate-600 md:grid-cols-2">
              <div className="space-y-1.5">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5 justify-center md:justify-start">
                  <Award className="h-4 w-4 text-teal-600 shrink-0" /> 자격 및 면허
                </p>
                <ul className="list-disc pl-5 text-slate-500 space-y-1 text-left">
                  <li>보건복지부 공인 정형외과 전문의 자격 취득</li>
                  <li>경희대학교 의과대학 졸업</li>
                  <li>경희의료원 정형외과학 석사</li>
                  <li>경희의료원 정형외과학 박사</li>
                </ul>
              </div>
              
              <div className="space-y-1.5">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5 justify-center md:justify-start">
                  <Award className="h-4 w-4 text-teal-600 shrink-0" /> 주요 소속 및 활동
                </p>
                <ul className="list-disc pl-5 text-slate-500 space-y-1 text-left">
                  <li>경희의료원 정형외과 레지던트 수료</li>
                  <li>경희의료원 정형외과 슬관절외과 전임의</li>
                  <li>경희대학교 의과대학 외래교수</li>
                  <li>대한정형외과학회 정회원</li>
                  <li>대한스포츠의학회 정회원</li>
                  <li>대한슬관절학회 & 대한견주관절학회 정회원</li>
                  <li>네이버 지식iN 공식 의료 상담 답변 의사</li>
                </ul>
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-500 leading-relaxed text-justify border-t border-slate-100 pt-4">
              &ldquo;관절 환자들이 극심한 손상을 겪고 수술대에 오르기 전, 일상 속에서 자신에게 맞는 올바른 재활 스트레칭과 근력 강화 동작을 인지하고 꾸준히 실천하는 것만으로도 대부분의 척추 및 관절 만성 통증을 예방할 수 있습니다. 바른관절 헬프센터의 모든 콘텐츠는 전문 학술 문헌과 대학병원 임상 재활 프로토콜에 근거하여 환자 친화적인 언어로 정제되어 작성됩니다.&rdquo;
            </p>
          </div>
        </div>
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
