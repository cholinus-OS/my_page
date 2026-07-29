const fs = require("fs");
const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const content = fs.readFileSync("src/content/posts/2026-05-22-lumbar-disk-walking.md", "utf8");
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
const frontmatterStr = frontmatterMatch[1];
const bodyStr = content.slice(frontmatterMatch[0].length).trim();
const oldTitle = "허리 디스크 환자가 반드시 피해야 할 나쁜 앉기 자세와 걷기 운동법";
const oldCategory = "허리 재활";
const oldDate = "2026-05-22";
const oldThumbnail = "https://images.pexels.com/photos/4506113/pexels-photo-4506113.jpeg";

const prompt = `# [System Role]
너는 15년 경력의 메디컬 전문 콘텐츠 디렉터이자 네이버/구글 검색 알고리즘을 꿰뚫고 있는 SEO(검색엔진 최적화) 전문가이다. 

# [Task Description]
아래 제공된 [기존 마크다운 본문]을 바탕으로, 애드센스 승인과 상위 노출에 절대적으로 유리한 **'특정 상황과 특정 증상'에 맞춘 롱테일(Long-tail) 타겟팅 글**로 전면 재작성(Rewrite)하라. 기존 글을 복사 붙여넣기 하지 마라. 완전히 새로운 문장으로 새로 써야 한다.

# [Input Data]
- 기존 카테고리: ${oldCategory}
- 기존 제목: ${oldTitle}
- 기존 본문 내용 (참고용):
${bodyStr.slice(0, 1500)}...

# [Task Instructions]
1. 제목: 기존 제목을 버리고 "사무실 의자에서 일어날 때 오른쪽 허리 찌릿? 방치하면 디스크 터집니다" 처럼 **초구체적 상황(Long-tail) 묘사**로 완전히 새롭게 지어라.
2. 서론: 일반적 원인 대신 구체적인 상황 설정 및 공감, 방치 시 위험성 경고.
3. 본론 1: 설정한 특정 상황에서 질환이 발생하는 원인과 전조증상.
4. 본론 2: 즉시 실천 가능한 바른 자세 유지법, 스트레칭 동작.
5. 결론: 요약 및 메디컬 디스클레이머.

# [Constraints & SEO Rules]
- 기존 본문의 문장 구조를 그대로 쓰지 말고 100% 새롭게 재창조할 것.
- 태그(Tags)는 '의자허리통증', '오른쪽허리찌릿' 등 롱테일 검색어로 5개 이상 구성.

# [Output Format]
반드시 아래 템플릿 구조만 그대로 출력하라. (마크다운 코드블럭 \`\`\` 마크다운 기호도 포함하지 말고, 순수 텍스트로만 반환하라)

---
title: (새롭게 생성한 롱테일 후킹 제목)
date: ${oldDate}
summary: (새롭게 작성된 글의 핵심 요약 1~2줄)
category: ${oldCategory}
tags: [(새롭게 생성한 롱테일 태그 5개 이상 쉼표로 구분)]
thumbnail: ${oldThumbnail}
---

(새롭게 작성한 본문 텍스트 시작)
`;

async function run() {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9 } })
  });
  const data = await response.json();
  console.log(data.candidates[0].content.parts[0].text.slice(0, 500));
}
run();
