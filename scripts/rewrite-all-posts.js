const fs = require("fs");
const path = require("path");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.");
  process.exit(1);
}

const postsDir = path.join(process.cwd(), "src/content/posts");
const files = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));

async function rewritePost(filePath, filename) {
  const content = fs.readFileSync(filePath, "utf8");
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.warn(`[SKIP] Frontmatter를 찾을 수 없습니다: ${filename}`);
    return;
  }
  
  const frontmatterStr = frontmatterMatch[1];
  const bodyStr = content.slice(frontmatterMatch[0].length).trim();
  
  // Extract specific fields
  const titleMatch = frontmatterStr.match(/^title:\s*(.+)$/m);
  const dateMatch = frontmatterStr.match(/^date:\s*(.+)$/m);
  const categoryMatch = frontmatterStr.match(/^category:\s*(.+)$/m);
  const thumbnailMatch = frontmatterStr.match(/^thumbnail:\s*(.+)$/m);
  
  const oldTitle = titleMatch ? titleMatch[1].trim() : "";
  const oldCategory = categoryMatch ? categoryMatch[1].trim() : "";
  const oldDate = dateMatch ? dateMatch[1].trim() : "";
  const oldThumbnail = thumbnailMatch ? thumbnailMatch[1].trim() : "";

  console.log(`\n⏳ 재작성 중: ${filename}`);
  console.log(`기존 제목: ${oldTitle}`);

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  let success = false;
  let responseText = "";

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        responseText = data.candidates[0].content.parts[0].text;
        success = true;
        break;
      } else {
        console.warn(`API 호출 실패 (상태 코드: ${response.status})`);
      }
    } catch (err) {
      console.warn(`연결 실패: ${err.message}`);
    }
    
    if (attempt < 3) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  if (success) {
    // Strip markdown code block if present
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/^```(?:markdown)?\s*/i, '').replace(/```\s*$/, '').trim();

    if (!cleanText.startsWith("---")) {
      // 강제로 --- 를 붙여줌 (Gemini가 누락했을 경우 대비)
      cleanText = "---\n" + cleanText;
    }

    if (cleanText.startsWith("---")) {
      console.log("cleanText preview:", cleanText.substring(0, 100));
      // 덮어쓰기
      fs.writeFileSync(filePath, cleanText, "utf8");
      console.log(`✅ 성공적으로 재작성됨: ${filename}`);
    } else {
      console.error(`❌ 응답 포맷 오류 (---로 시작하지 않음): ${filename}`);
    }
  } else {
    console.error(`❌ API 호출 지속 실패: ${filename}`);
  }
}

async function run() {
  console.log(`총 ${files.length}개의 마크다운 파일을 재작성합니다...`);
  
  // 전체 55개 파일 실행
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 이미 재작성된 파일인지 간단히 체크 (제목에 ? 가 있는지 여부 등)
    const content = fs.readFileSync(path.join(postsDir, file), "utf8");
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    if (titleMatch && (titleMatch[1].includes("?") || titleMatch[1].includes("!"))) {
      console.log(`[SKIP] 이미 재작성된 것으로 보입니다: ${file}`);
      continue;
    }

    await rewritePost(path.join(postsDir, file), file);
    
    // API Rate Limit 방지를 위한 10초 대기
    if (i < files.length - 1) {
      console.log("...Rate Limit 방지를 위해 10초 대기 중...");
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log("\n🎉 지정된 파일들의 마이그레이션이 완료되었습니다.");
}

run();
