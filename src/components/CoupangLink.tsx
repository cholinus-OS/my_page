import { ShoppingBag, ExternalLink } from "lucide-react";

// 키워드별 추천 상품 데이터베이스 (초보자도 관리하기 쉬운 단순한 구조)
const productDatabase: Record<string, { name: string; desc: string; url: string }> = {
  "거북목": {
    name: "경추 메모리폼 경추베개 (자세 교정용)",
    desc: "C자 목 커브를 유지해 주어 수면 중 목 and 어깨의 긴장을 풀어주는 인체공학적 경추베개입니다.",
    url: "https://link.coupang.com/a/sample-neck-pillow"
  },
  "허리디스크": {
    name: "기능성 허리 보호대 & 지지 벨트",
    desc: "앉아있거나 서있을 때 척추를 단단히 지지하여 요추 디스크 압박을 분산하고 통증을 완화합니다.",
    url: "https://link.coupang.com/a/sample-waist-support"
  },
  "어깨관절": {
    name: "어깨 통증 재활용 라텍스 운동 밴드",
    desc: "회전근개 파열 예방 및 유연성 회복에 적합한 물리치료사 추천 강도별 루프 저항 밴드 세트입니다.",
    url: "https://link.coupang.com/a/sample-shoulder-band"
  },
  "무릎관절": {
    name: "의료기기 인증 고신축 무릎 관절 보호대",
    desc: "연골 마찰을 줄이고 인대를 안정적으로 잡아주어 보행 시 시큰거림과 통증을 경감시킵니다.",
    url: "https://link.coupang.com/a/sample-knee-guard"
  },
  "손목터널": {
    name: "손목 지지용 인체공학 버티컬 마우스",
    desc: "손목이 비틀어지지 않는 각도로 장시간 컴퓨터 사용 시 발생하는 저림과 피로를 근본적으로 해결합니다.",
    url: "https://link.coupang.com/a/sample-vertical-mouse"
  },
  "고관절": {
    name: "골반 및 고관절 지지 압박 보호대 (좌우 공용)",
    desc: "허벅지와 엉덩이 깊은 곳 고관절 부위를 균형 있게 가압하여 마찰과 통증을 경감하고 골반을 안정시킵니다.",
    url: "https://link.coupang.com/a/sample-hip-support"
  },
  "팔꿈치": {
    name: "테니스 엘보 통증 방지 팔꿈치 압박 밴드 스트랩",
    desc: "외측 상과 힘줄 부위를 단단하게 압박 고정하여 힘이 가해질 때 팔꿈치 힘줄의 찢김과 통증을 예방합니다.",
    url: "https://link.coupang.com/a/sample-elbow-strap"
  },
  "발목": {
    name: "고탄력 8자 스트랩 발목 보호대 아대",
    desc: "발목 꺾임을 물리적으로 단단히 지탱해 주어 자주 접지르고 꺾이는 만성 발목 불안정증 환자의 보행을 돕습니다.",
    url: "https://link.coupang.com/a/sample-ankle-wrap"
  }
};

interface CoupangLinkProps {
  keyword: string;
}

export default function CoupangLink({ keyword }: CoupangLinkProps) {
  // 해당하는 상품 정보 매칭 (없으면 기본 손목 보호대로 추천)
  const product = productDatabase[keyword] || {
    name: "실리콘 손목 보호 마우스 손목 패드",
    desc: "컴퓨터 사용 시 가해지는 손목 압박을 분산시켜 저림과 통증을 완화하는 쿠션 패드입니다.",
    url: "https://link.coupang.com/a/sample-wrist-pad"
  };

  return (
    <div className="coupang-ad-box border-dashed">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg bg-teal-100 p-2 text-teal-600 sm:mt-0">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              추천 재활 파트너 상품
            </span>
            <h4 className="mt-1 text-base font-bold text-slate-900">{product.name}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{product.desc}</p>
          </div>
        </div>
        
        <a
          href={product.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/10 transition-all w-full sm:w-auto justify-center"
        >
          최저가 확인
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-[10px] text-slate-400 text-right">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
