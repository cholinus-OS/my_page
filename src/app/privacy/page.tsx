import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-wider uppercase">Privacy Policy</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl leading-tight">
          개인정보처리방침
        </h1>
        <p className="mt-4 text-slate-500 text-sm leading-relaxed">
          시행일자: 2026년 6월 22일 <br />
          바른관절 헬프센터(이하 '본 사이트')는 이용자의 개인정보를 보호하고 관련 법령을 준수하기 위해 다음과 같은 개인정보처리방침을 수립·공개합니다.
        </p>
      </div>

      {/* 본문 약관 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">1. 개인정보의 수집 항목 및 방법</h2>
        <p>
          본 사이트는 방문자들의 별도 회원가입 없이 이용할 수 있는 개방형 서비스로, **직접적인 개인정보(이름, 이메일, 전화번호 등)를 수집하거나 보관하지 않습니다.** 
          다만, 서비스 이용 과정에서 서비스 분석 및 광고 제공을 위해 아래와 같은 정보가 자동으로 생성되어 수집될 수 있습니다.
        </p>
        <ul>
          <li>수집 항목: 접속 IP 정보, 쿠키(Cookie), 방문 일시, 서비스 이용 기록, 기기 정보 및 웹 브라우저 종류</li>
          <li>수집 방법: 웹 브라우저 접속 시 생성되는 로그 분석 및 쿠키 기술 활용</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
        <p>
          자동 생성되는 정보는 다음의 목적을 위해 활용됩니다.
        </p>
        <ul>
          <li>**서비스 개선 및 통계 분석**: 구글 애널리틱스(Google Analytics)를 통해 이용자의 사이트 방문 통계, 머무른 시간, 유입 경로 등을 파악하여 양질의 건강 정보를 기획·보완하는 데 사용합니다.</li>
          <li>**맞춤형 광고 게재**: 구글 애드센스(Google AdSense)를 통한 타겟팅 광고 송출 및 노출 효율 측정에 활용됩니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 구글 애드센스(Google AdSense) 및 쿠키 사용 고지</h2>
        <p>
          본 사이트는 신뢰할 수 있는 제3자 광고 파트너인 구글(Google)의 광고 서비스를 사용하고 있습니다. 이와 관련하여 방문자는 다음의 사항을 인지해야 합니다.
        </p>
        <ul>
          <li>구글을 포함한 제3자 제공업체는 사용자의 이전 웹사이트 방문 정보를 기반으로 광고를 게재하기 위해 쿠키를 사용합니다.</li>
          <li>구글의 **DART 쿠키** 사용을 통해 사용자가 본 사이트 및 인터넷상의 다른 사이트를 방문한 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.</li>
          <li>사용자는 구글의 <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-semibold hover:underline">광고 설정</a> 페이지를 방문하여 맞춤설정 광고를 게재하지 않도록 차단할 수 있습니다.</li>
          <li>기타 쿠키 비활성화는 사용하는 브라우저 설정(Chrome 설정 - 개인정보 및 보안 - 쿠키 및 기타 사이트 데이터)에서 수집을 직접 거부할 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 개인정보의 보유 및 이용 기간</h2>
        <p>
          본 사이트는 이용자의 개인정보를 직접 보관하지 않으므로 파기 절차가 존재하지 않습니다. 다만 제3자 서비스(구글 애드센스 및 애널리틱스)를 통해 수집된 비식별화된 행동 통계 및 쿠키 정보는 해당 서비스 운영사인 구글의 데이터 보관 정책 및 표준 보유 기간을 따릅니다.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 의학 정보에 대한 면책 고지 (Medical Disclaimer)</h2>
        <p>
          본 사이트의 모든 건강 정보 및 블로그 콘텐츠는 정보 제공을 목적으로 자동 생성 및 작성되었습니다. 이는 전문의의 진단이나 처방을 결코 대신할 수 없으며, 본 정보를 기초로 실천한 행동으로 인해 발생할 수 있는 신체적 손해에 대해 본 사이트는 어떠한 법적 책임도 지지 않습니다. 통증이나 신체 이상이 지속될 경우에는 반드시 정형외과 등 전문 의료기관에 내원하시기 바랍니다.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. 개인정보 보호 책임자 및 문의</h2>
        <p>
          본 사이트의 개인정보보호 관련 문의 및 건의사항이 있으실 경우 아래의 메일로 연락해 주시면 성실히 답변해 드리겠습니다.
        </p>
        <ul>
          <li>운영 부서: 바른관절 헬프센터 지원팀</li>
          <li>이메일 연락처: <a href="mailto:cholinus@naver.com" className="text-teal-600 font-semibold hover:underline">cholinus@naver.com</a></li>
        </ul>
      </div>
    </div>
  );
}
