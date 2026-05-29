const fs = require("fs");
const path = require("path");

async function generatePost() {
  const postsDir = path.join(process.cwd(), "src/content/posts");
  const diseasesFile = path.join(process.cwd(), "src/content/diseases/data.json");

  // 1. 질환 데이터 확인
  if (!fs.existsSync(diseasesFile)) {
    console.error("질환 데이터 파일이 존재하지 않습니다.");
    process.exit(1);
  }
  
  let diseases;
  try {
    diseases = JSON.parse(fs.readFileSync(diseasesFile, "utf8"));
  } catch (err) {
    console.error("질환 데이터 파일을 읽거나 파싱하는 중 오류가 발생했습니다:", err.message);
    process.exit(1);
  }

  if (!Array.isArray(diseases) || diseases.length === 0) {
    console.error("질환 데이터가 유효한 배열이 아니거나 비어 있습니다.");
    process.exit(1);
  }

  // 새로 추가된 최신 데이터(배열의 마지막 항목) 확인
  const latestDisease = diseases[diseases.length - 1];

  // 2. 기존 포스트 확인
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
  const existingPostContents = postFiles.map(file => {
    return fs.readFileSync(path.join(postsDir, file), "utf8");
  });

  // 이미 같은 name으로 글이 있는지 확인
  const isAlreadyWritten = existingPostContents.some(content => {
    return content.includes(latestDisease.name);
  });

  if (isAlreadyWritten) {
    console.log("이미 작성된 글입니다");
    process.exit(0);
  }

  // 3. Gemini API 설정
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.");
    process.exit(1);
  }

  // 한국 시간(KST) 기준으로 오늘 날짜 구하기 (UTC+9)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const todayStr = kstDate.toISOString().split("T")[0];

  const topic = `${latestDisease.name} - ${latestDisease.summary}`;

  // 프롬프트 조립
  const systemRole = `# [System Role]
너는 15년 경력의 메디컬 전문 콘텐츠 디렉터이자 네이버/구글 검색 알고리즘을 꿰뚫고 있는 SEO(검색엔진 최적화) 전문가이다. 
복잡하고 딱딱한 의학 지식을 일반 대중이 쉽게 이해하고 실생활에 즉시 적용할 수 있도록 친절하고 신뢰감 있는 어조로 글을 작성한다.
최신 Gemini 모델의 확장된 컨텍스트 이해력과 논리적 추론 능력을 바탕으로, 
근거 중심 의학(EBM)에 기반하여 정보의 왜곡 없이 구조적으로 완벽한 블로그 글을 생성해야 한다.`;

  const contextTopic = `# [Context & Topic]
- 핵심 주제: 척추 및 관절 건강 (예: 거북목 교정, 허리디스크 예방, 무릎 관절염 관리 등)
- 대상 독자: 잘못된 자세로 만성 통증을 겪는 현대인 또는 관절 기능 저하가 시작된 중장년층
- 어조(Tone & Voice): 전문적이면서도 다정한 의사 선생님 같은 어조 (~합니다, ~해보세요 체), 신뢰감과 안정감을 주는 문체`;

  const instructions = `# [Task Instructions]
Antigravity 자동화 프로그램을 통해 입력된 [주제어]를 바탕으로 다음 4단계 구조에 맞춰 블로그 글을 작성하라. 
각 단계는 소제목(##)으로 명확히 구분되어야 한다.

1. 서론 (Introduction):
   - 해당 척추/관절 질환(또는 통증)으로 인해 독자가 일상에서 겪을 법한 불편함에 깊이 공감하는 문장으로 시작.
   - 가벼운 통증이라고 방치했을 때 찾아오는 만성 질환으로의 발전 위험성을 경고하며,지금 관리를 시작해야 하는 이유(본문의 필요성)를 강력히 강조.

2. 본론 1 (Causes & Symptoms):
   - 질환의 발생 원인과 발달 과정을 해부학적·의학적 사실에 기반하여 일반인의 눈높이에 맞춰 명확하게 설명.
   - 독자가 병원에 가기 전 스스로 상태를 점검해 볼 수 있는 구체적인 '자가진단 체크리스트' 또는 대표적인 '전조증상 3~4가지'를 글머리 기호로 포함.

3. 본론 2 (Solutions & Exercises):
   - 일상생활(사무실, 집 등)에서 별도의 장비 없이 즉시 실천 가능한 바른 자세 유지법, 스트레칭 동작, 또는 생활 습관 개선 팁을 최소 3가지 이상 상세히 제시.
   - 잘못된 자세로 동작을 따라 했을 때 발생할 수 있는 부상을 방지하기 위해, '동작 수행 시 주의사항' 및 '이런 분들은 피하세요'라는 경고 문구를 반드시 포함.

4. 결론 (Conclusion):
   - 본문에서 강조한 핵심 관리법을 2~3줄로 깔끔하게 요약하고, 독자의 건강한 관절 수명을 응원하는 따뜻한 격려의 멘트로 마무리.
   - 문단의 맨 마지막에는 "※ 본 콘텐츠는 정보 제공을 목적으로 작성되었으며, 통증이 지속되거나 심해질 경우 반드시 전문의와 상담하여 정확한 진단을 받으셔야 합니다."라는 메디컬 디스클레이머(면책 조항)를 인용구(\`>\`) 형식을 활용하여 자연스럽게 포함.`;

  const constraints = `# [Constraints & SEO Rules]
- **분량 제어**: 공백 제외 최소 1,800자 이상, 2,500자 이하의 풍부하고 깊이 있는 정보량으로 작성할 것. (절대 수박 겉핥기식 정보로 분량을 채우지 말 것)
- **가독성(Scannability)**: 독자가 스마트폰으로 글을 빠르게 내리면서 읽어도 핵심이 눈에 들어오도록 소제목(##, ###)을 정교하게 나누고, 중요 키워드는 볼드 기호(**)를 사용해 강조할 것. 단락 간 공백을 여유 있게 둘 것.
- **의학적 신뢰성**: 검증되지 않은 민간요법이나 과학적 근거가 없는 정보는 절대 배제할 것. 정확한 의학 용어를 쓰되, 용어 뒤에 쉬운 설명이나 비유를 덧붙일 것.
- **AI 텍스트 필터링(금지어)**: 상투적이고 기계적인 표현(예: "현대 사회에서~", "첫째로, 둘째로, 마지막으로", "결론적으로 말하자면", "지구상에서~")은 절대 사용하지 말 것. 문장과 문장 사이는 인과관계와 흐름에 맞게 자연스러운 접속사로 연결할 것.`;

  const prompt = `${systemRole}

${contextTopic}

${instructions}

${constraints}

# [Input Variable]
- 세부 주제어: ${topic}

# [Output Format]
반드시 아래 정의된 템플릿 구조만 출력하고, 앞뒤로 "네, 알겠습니다" 등 AI의 불필요한 인사말이나 서론은 일절 제외하라.

[타이틀]: (독자의 클릭을 유도하는 직관적이고 매력적인 SEO 최적화 제목, 대괄호 제외)
---
(본문 시작 - 서론부터 결론까지 위 4단계 지시사항에 맞춰 마크다운 형식으로 작성)

FILENAME: ${todayStr}-keyword`;

  // 4. Gemini API 호출
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 호출 실패 (HTTP 상태 코드: ${response.status})`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      throw new Error("Gemini API가 비어있는 응답을 반환했습니다.");
    }
    
    const responseText = data.candidates[0].content.parts[0].text;

    // 파일명 추출
    const filenameMatch = responseText.match(/FILENAME:\s*([^\s\n]+)/i);
    let filename = `${todayStr}-${latestDisease.id || "post"}.md`;
    if (filenameMatch) {
      let matchedName = filenameMatch[1].trim().replace(/^['"]|['"]$/g, ""); // 따옴표 제거
      const safeFilenameRegex = /^[a-zA-Z0-9\.\-_]+$/;
      if (safeFilenameRegex.test(matchedName)) {
        if (!matchedName.endsWith(".md")) {
          matchedName += ".md";
        }
        filename = matchedName;
      }
    }

    // 타이틀 추출
    const titleMatch = responseText.match(/\[타이틀\]:\s*([^\n]+)/i);
    let title = latestDisease.name;
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/^\[|\]$/g, "");
    }

    // 본문 추출 및 가공
    let bodyContent = responseText;
    bodyContent = bodyContent.replace(/\[타이틀\]:\s*[^\n]+\n*/i, "");
    bodyContent = bodyContent.replace(/FILENAME:\s*[^\n]+/i, "");
    bodyContent = bodyContent.trim();

    // 마크다운 펜스(```markdown 및 ```) 제거
    bodyContent = bodyContent.replace(/^```markdown\n/i, "").replace(/\n```$/i, "");
    bodyContent = bodyContent.trim();

    if (bodyContent.startsWith("---")) {
      bodyContent = bodyContent.replace(/^---\n/, "").trim();
    }

    // Frontmatter 생성
    const tags = [latestDisease.partName, latestDisease.mainCategoryName, "재활", "통증", latestDisease.keyword].filter(Boolean);
    const finalContent = `---
title: ${title}
date: ${todayStr}
summary: ${latestDisease.summary}
category: 정보
tags: [${tags.join(", ")}]
---

${bodyContent}`;

    // 파일 생성
    const finalPath = path.join(postsDir, filename);
    fs.writeFileSync(finalPath, finalContent, "utf8");
    console.log("생성 완료");

  } catch (error) {
    console.error("블로그 글 생성 중 에러 발생:", error.message);
    process.exit(1);
  }
}

generatePost();
