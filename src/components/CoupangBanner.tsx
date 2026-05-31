"use client";

import { partnerProducts } from "@/content/coupangProducts";

interface CoupangBannerProps {
  postCategory?: string;
  postTags?: string[];
  postSlug?: string;
}

export default function CoupangBanner({ postCategory, postTags, postSlug }: CoupangBannerProps) {
  // 1. 카테고리, 태그, 슬러그 매칭 시도
  let product = partnerProducts.find(p => {
    const hasCategoryMatch = postCategory && p.keywords.some(k => postCategory.includes(k) || k.includes(postCategory));
    const hasTagMatch = postTags && postTags.some(tag => p.keywords.some(k => tag.includes(k) || k.includes(tag)));
    const hasSlugMatch = postSlug && p.keywords.some(k => postSlug.includes(k) || k.includes(postSlug));
    return hasCategoryMatch || hasTagMatch || hasSlugMatch;
  });

  // 2. 주제에 맞는 것이 없다면 빈도가 적은 것을 우선으로 (해시 값 기반의 균등 분배)
  if (!product) {
    const fallbackId = postSlug || postCategory || "default";
    let sum = 0;
    for (let i = 0; i < fallbackId.length; i++) {
      sum += fallbackId.charCodeAt(i);
    }
    const index = sum % partnerProducts.length;
    product = partnerProducts[index];
  }

  return (
    <div className="my-8 rounded-2xl border border-orange-100 bg-orange-50/30 p-6 text-center shadow-sm">
      <p className="mb-4 text-[10px] text-red-500 font-semibold">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
      </p>
      <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold text-orange-600">
        쿠팡 파트너스 추천 상품
      </span>
      <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 leading-tight">
        {product.name}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-lg mx-auto">
        {product.desc}
      </p>
      <div className="mt-5">
        <a
          href={`https://link.coupang.com/a/${product.id}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3 text-xs font-bold text-white transition shadow-md shadow-orange-500/10"
        >
          쿠팡 최저가 상품 보러가기
        </a>
      </div>
    </div>
  );
}
