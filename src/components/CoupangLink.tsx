import { ShoppingBag, ExternalLink } from "lucide-react";
import { partnerProducts } from "@/content/coupangProducts";

interface CoupangLinkProps {
  keyword: string;
  diseaseId?: string;
}

export default function CoupangLink({ keyword, diseaseId }: CoupangLinkProps) {
  // 1. 키워드 또는 질환 ID 매칭 시도
  let product = partnerProducts.find(p => 
    (keyword && p.keywords.includes(keyword)) || 
    (diseaseId && p.keywords.includes(diseaseId))
  );

  // 2. 주제에 맞는 것이 없다면 빈도가 적은 것을 우선으로 (해시 값 기반의 균등 분배)
  if (!product) {
    const fallbackId = diseaseId || keyword || "default";
    let sum = 0;
    for (let i = 0; i < fallbackId.length; i++) {
      sum += fallbackId.charCodeAt(i);
    }
    const index = sum % partnerProducts.length;
    product = partnerProducts[index];
  }

  return (
    <div className="coupang-ad-box border-dashed">
      <p className="mb-3 text-[10px] text-red-500 font-semibold">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
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
          href={`https://link.coupang.com/a/${product.id}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-3 text-white shadow-md shadow-amber-500/10 transition-all shrink-0 min-w-[110px] h-[72px] text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-black tracking-tighter leading-none">최저가</span>
            <span className="text-sm font-black tracking-[0.5em] pl-[0.5em] mt-1.5 leading-none">확인</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
}
