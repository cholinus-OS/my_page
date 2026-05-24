import { ShoppingBag, ExternalLink } from "lucide-react";

// 24종 개편 질환에 최적화된 키워드별 추천 상품 데이터베이스
const productDatabase: Record<string, { name: string; desc: string; url: string }> = {
  "거북목": {
    name: "C자 정렬 유도 메모리폼 경추베개 (자세 교정용)",
    desc: "잠자는 동안 일자로 펴진 목뼈(경추)의 자연스러운 C자 곡선을 회복하게 돕는 인체공학적 경추베개입니다.",
    url: "https://link.coupang.com/a/sample-neck-pillow"
  },
  "목디스크": {
    name: "가정용 에어 리프트 목 수동 견인기",
    desc: "공기 압력을 통해 좁아진 목뼈 사이를 부드럽게 늘려주어 신경 압박과 디스크 통증 완화를 돕는 1등급 의료기기 견인기입니다.",
    url: "https://link.coupang.com/a/sample-neck-traction"
  },
  "경추보호대": {
    name: "에어 매쉬 타입 통기성 넥 칼라 경추보호대",
    desc: "목 움직임을 제한하고 고정 지탱하여 척추 신경 압박(OPLL 등) 증상 악화를 방지하는 폭신하고 안전한 목 보호대입니다.",
    url: "https://link.coupang.com/a/sample-cervical-collar"
  },
  "허리디스크": {
    name: "더블 풀리 와이어 척추 지지 기능성 허리보호대",
    desc: "양쪽 와이어가 허리를 감싸 척추 뼈 사이의 수직 압력을 고르게 분산하여 요추 디스크의 무리를 덜어주는 특허 보호대입니다.",
    url: "https://link.coupang.com/a/sample-waist-spine-belt"
  },
  "허리보호대": {
    name: "인체공학적 허리 전만 요추 등받이 쿠션",
    desc: "의자에 앉았을 때 요추의 S자 정렬이 앞으로 밀려나거나(전방전위증 등) 무너지지 않도록 지탱하는 물리치료사 추천 등받이입니다.",
    url: "https://link.coupang.com/a/sample-lumbar-cushion"
  },
  "어깨관절": {
    name: "회전근개 보호 및 가동 고정 어깨 관절 아대",
    desc: "어깨 힘줄 파열 시 관절의 불필요한 흔들림을 제한하고 압박 밀착하여 통증을 누그러뜨리는 안정성 보호대입니다.",
    url: "https://link.coupang.com/a/sample-shoulder-brace"
  },
  "어깨스트레칭밴드": {
    name: "어깨 재활 전용 단계별 루프 저항 밴드 세트",
    desc: "회전근개 건염, 석회성건염, 슬랩 파열 후 어깨 속근육 유연성과 기초 회복 운동을 돕는 치료용 탄성 라텍스 밴드입니다.",
    url: "https://link.coupang.com/a/sample-resistance-bands"
  },
  "어깨보호대": {
    name: "이중 압박 스트랩 네오프렌 탈구 방지 어깨 아대",
    desc: "관절 주머니가 굳은 오십견이나 헐거운 다발성 불안정증 환자의 어깨뼈가 소켓 밖으로 어긋나지 않도록 잡아주는 밀착 아대입니다.",
    url: "https://link.coupang.com/a/sample-shoulder-support"
  },
  "테니스엘보": {
    name: "외측상과 건염 전용 압박 패드 엘보 스트랩",
    desc: "팔꿈치 바깥쪽 힘줄 시작점에 물리적인 가압을 주어 손가락이나 손목 사용 시 팔꿈치 뼈가 당기는 충격을 완화합니다.",
    url: "https://link.coupang.com/a/sample-tennis-elbow-strap"
  },
  "팔꿈치보호대": {
    name: "프리미엄 니트 컴프레션 팔꿈치 보호대 (슬리브)",
    desc: "팔꿈치 전체를 감싸 온열 효과와 적절한 압박을 주어 내측상과염(골프엘보) 관절 뻐근함과 염증 통증을 가라앉힙니다.",
    url: "https://link.coupang.com/a/sample-elbow-sleeve"
  },
  "엘보스트랩": {
    name: "팔꿈치 터널 증후군 방지 수면 고정 부목 아대",
    desc: "수면 중 나도 모르게 팔꿈치를 90도 이상 굽히는 습관을 막아 척골신경이 찝히거나 압박받는 것을 물리적으로 고정 차단합니다.",
    url: "https://link.coupang.com/a/sample-elbow-night-splint"
  },
  "손목터널": {
    name: "57도 각도 인체공학 무선 버티컬 마우스",
    desc: "손목 터널 증후군을 유발하는 손목의 비틀림(회내)을 원천 차단하여 정중신경의 압박을 줄여주는 직장인 필수 건강 마우스입니다.",
    url: "https://link.coupang.com/a/sample-vertical-mouse"
  },
  "손가락보호대": {
    name: "방아쇠 손가락 알루미늄 내장 지지 보조기 (아대)",
    desc: "딸깍거리는 마찰이 유발되는 손가락 마디의 과도한 움직임을 제어하여 건초염 힘줄이 자연스럽게 아물도록 돕는 깁스형 보조기입니다.",
    url: "https://link.coupang.com/a/sample-trigger-finger-splint"
  },
  "고관절": {
    name: "골반 및 사타구니 서혜부 지지 압박 보호대 (좌우 공용)",
    desc: "양반다리 시 찝히는 통증(고관절 충돌)을 경감하고, 고관절 뼈가 부딪히는 동작을 물리적으로 완충해 주는 벨트형 보호막입니다.",
    url: "https://link.coupang.com/a/sample-hip-thigh-brace"
  },
  "고관절보호대": {
    name: "대퇴골두 무혈성 괴사 가압 및 온열 찜질 벨트",
    desc: "허벅지 뼈머리 부위의 짓눌림과 모세 혈류 부족 통증을 분산하고, 골반 온열로 고관절 강직 및 혈류 순환을 촉진하는 아대입니다.",
    url: "https://link.coupang.com/a/sample-hip-heat-wrap"
  },
  "무릎관절": {
    name: "초밀착형 연골 마찰 완충 의료용 무릎 관절 보호대",
    desc: "닳아 얇아진 무릎 연골의 뼈끼리 부딪히는 압력을 감소시키고 걸을 때 시큰거림을 억제해 주는 기능성 특허 보호대입니다.",
    url: "https://link.coupang.com/a/sample-knee-arthritis-guard"
  },
  "무릎보호대": {
    name: "좌우 카본 지지대 힌지형 십자인대 무릎 보호대",
    desc: "연골판 파열, 십자인대 부상 시 종아리 뼈가 앞뒤로 덜컹거리거나 어긋나 흔들리는 관절 불안정성을 카본 기둥이 잡아줍니다.",
    url: "https://link.coupang.com/a/sample-hinged-knee-brace"
  },
  "폼롤러": {
    name: "자가근막 이완 고밀도 EVA 폼롤러 (원형 90cm)",
    desc: "무릎 연골 결손 후 주변 허벅지 대퇴사두근과 장경인대 강직을 풀어주어 무릎 슬개골 압박을 덜어주는 재활 폼롤러입니다.",
    url: "https://link.coupang.com/a/sample-foam-roller"
  },
  "발목보호대": {
    name: "8자 크로스 고탄성 발목 압박 보호 밴드",
    desc: "발목을 삔 부상 초기에 바깥쪽 복사뼈 인대가 늘어나거나 움직이지 않도록 8자 스트랩이 단단히 동여매 고정하는 아대입니다.",
    url: "https://link.coupang.com/a/sample-ankle-straps"
  },
  "발목아대": {
    name: "만성 발목 불안정증 지지용 테이핑형 발목 가드",
    desc: "평지 보행 중 발목이 툭 덜거덕거리며 힘없이 꺾이는 흔들림 증세를 막기 위해 아치를 잡아 고정하는 스포츠 밀착 아대입니다.",
    url: "https://link.coupang.com/a/sample-ankle-active-guard"
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
            <h4 className="mt-1 text-base font-bold text-slate-900 leading-tight">{product.name}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{product.desc}</p>
          </div>
        </div>
        
        <a
          href={product.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-3 text-white shadow-md shadow-amber-500/10 transition-all shrink-0 min-w-[110px] h-[72px] text-center"
        >
          <div className="flex flex-col items-center justify-center">
            {/* 최저가 (3글자, 자간 좁게) */}
            <span className="text-xs font-black tracking-tighter leading-none">최저가</span>
            {/* 확인 (2글자, 자간을 0.5em 넓혀서 3글자 폭과 시각적 길이를 정밀하게 맞춤) */}
            <span className="text-xs font-black tracking-[0.5em] pl-[0.5em] mt-1.5 leading-none">확인</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
      <p className="mt-3 text-[10px] text-slate-400 text-right">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
