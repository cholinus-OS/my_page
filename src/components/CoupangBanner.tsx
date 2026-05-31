"use client";

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;

  if (!partnerId) {
    return null;
  }

  return (
    <div className="my-8 rounded-2xl border border-orange-100 bg-orange-50/30 p-6 text-center shadow-sm">
      <p className="mb-3 text-[10px] text-red-500 font-semibold">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
      </p>
      <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold text-orange-600">
        쿠팡 파트너스 추천
      </span>
      <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 leading-tight">
        관절 및 척추 관리에 도움을 주는 자문단 선정 추천 기기 및 보호대
      </h3>
      <div className="mt-4">
        <a
          href={`https://link.coupang.com/a/${partnerId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-2.5 text-xs font-bold text-white transition shadow-md shadow-orange-500/10"
        >
          쿠팡 최저가 상품 보러가기
        </a>
      </div>
    </div>
  );
}
