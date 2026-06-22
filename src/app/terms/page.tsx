import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
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
          <FileText className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-wider uppercase">Terms of Service</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl leading-tight">
          이용약관
        </h1>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          시행일자: 2026년 6월 22일 <br />
          바른관절 헬프센터(이하 '본 사이트')를 이용해 주셔서 감사합니다. 본 약관은 본 사이트가 제공하는 모든 정보 및 서비스의 이용 조건과 규칙을 규정합니다.
        </p>
      </div>

      {/* 본문 약관 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">제 1 조 (목적)</h2>
        <p>
          본 약관은 '바른관절 헬프센터'가 온라인으로 제공하는 건강, 척추, 관절 및 홈트레이닝 재활 정보 서비스(이하 '서비스')를 이용함에 있어, 본 사이트와 이용자 간의 기본적인 권리, 의무 및 책임 사항을 규정하는 것을 목적으로 합니다.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제 2 조 (용어의 정의)</h2>
        <ul>
          <li>**이용자**: 본 사이트에 접속하여 본 사이트가 제공하는 정보와 콘텐츠를 열람하고 이용하는 모든 방문자를 의미합니다.</li>
          <li>**콘텐츠**: 본 사이트가 작성하고 배포하는 텍스트, 이미지, 자가진단 사전, 분석 자료, 동영상 가이드 등의 정보 자산을 의미합니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제 3 조 (의학적 면책 고지 및 책임 제한 - 중요)</h2>
        <p className="font-semibold text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
          ⚠️ 중요: 본 사이트에서 제공하는 모든 건강 상담, 자가진단 사전, 재활 운동 추천 등의 콘텐츠는 일반적인 교육 목적 및 상식 제공을 위해 기획되었습니다. 의사의 대면 진료, 의학적 소견, 정밀 진단 및 전문적인 치료법을 절대 대신할 수 없습니다. 
        </p>
        <ul>
          <li>이용자가 본 사이트에 수록된 정보 혹은 제안된 스트레칭 및 자세 교정 동작을 무리하게 실천하다가 발생한 근육통, 부상 등의 직·간접적 신체 손해에 대해 본 사이트는 어떠한 민·형사상 법적 책임도 지지 않습니다.</li>
          <li>특정 관절 부위의 심한 통증, 부종, 마비 또는 이상 증세가 관찰되는 경우에는 자가 관리를 중단하고, 즉시 정형외과나 재활의학과 등 전문 의료기관의 전문의와 상담하여 올바른 진단과 처방을 받으셔야 합니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제 4 조 (콘텐츠 저작권 및 이용제한)</h2>
        <ul>
          <li>본 사이트가 자체적으로 생성하거나 가공하여 게시한 모든 텍스트, 이미지, UI 등의 저작권은 본 사이트에 귀속됩니다.</li>
          <li>이용자는 본 사이트의 서면 동의 없이 콘텐츠를 무단 전재, 영리 목적으로 복제, 배포, 양도, 크롤링하여 상업적으로 이용할 수 없습니다. 비상업적 목적의 공유 시에는 반드시 출처(바른관절 헬프센터 주소)를 명확히 표기해야 합니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제 5 조 (제3자 서비스 및 광고 제공)</h2>
        <ul>
          <li>본 사이트는 안정적인 무료 서비스 유지를 위해 구글 애드센스(Google AdSense) 광고를 송출하며, 쿠팡 파트너스 등의 제휴 마케팅 링크를 포함할 수 있습니다.</li>
          <li>이용자가 광고 링크나 파트너스 배너를 통해 연결된 제3자 사이트에서 상품을 구매하거나 계약을 체결하여 발생하는 모든 손실과 책임은 전적으로 거래 당사자(이용자와 제3자 쇼핑몰 등) 간에 존재하며, 본 사이트는 중개 행위에 따르는 어떠한 보증 책임도 지지 않습니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">제 6 조 (관할 법원 및 준거법)</h2>
        <p>
          본 약관의 해석 및 이용자와의 분쟁 발생 시에는 대한민국 법령을 준거법으로 하며, 소송이 제기될 경우 민사소송법상의 관할법원을 전합적 합의 관할 법원으로 합니다.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">부칙</h2>
        <p>본 약관은 2026년 6월 22일부터 적용됩니다.</p>
      </div>
    </div>
  );
}
