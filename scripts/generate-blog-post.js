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

  // 2. 기존 포스트 확인
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
  const existingPostContents = postFiles.map(file => {
    return fs.readFileSync(path.join(postsDir, file), "utf8");
  });

  // 아직 작성되지 않은 첫 번째 질환 데이터 찾기
  let targetDisease = null;
  for (const disease of diseases) {
    const isAlreadyWritten = existingPostContents.some(content => {
      return content.includes(disease.name);
    });
    if (!isAlreadyWritten) {
      targetDisease = disease;
      break;
    }
  }

  // [미배포 방지 대비책]: 모든 질환이 소진되면, 가장 오래된 포스트의 질환을 새로운 각도에서 재작성(리라이팅)하도록 순환합니다.
  if (!targetDisease) {
    console.log("모든 질환에 대한 블로그 글이 작성되었습니다. 미발행 일을 방지하기 위해 순환 리라이팅을 진행합니다.");
    const postDates = postFiles.map(file => {
      const datePart = file.substring(0, 10);
      return { file, date: new Date(datePart) };
    }).sort((a, b) => a.date - b.date);

    if (postDates.length > 0) {
      const oldestContent = fs.readFileSync(path.join(postsDir, postDates[0].file), "utf8");
      for (const disease of diseases) {
        if (oldestContent.includes(disease.name)) {
          targetDisease = { ...disease, isRewriting: true };
          break;
        }
      }
    }
    if (!targetDisease) {
      targetDisease = { ...diseases[0], isRewriting: true };
    }
  }

  const latestDisease = targetDisease;

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
근거 중심 의학(EBM)에 기반하여 정보의 왜곡 없이 구조적으로 완벽한 블로그 글을 생성해야 한다.
대원칙: 이전에 작성된 블로그 내용과 절대 중복되는 문장이나 내용을 재사용하지 마라. 항상 완전히 새로운 컨셉과 최신 트렌드를 반영하여 독창적으로 작성해야 한다.`;

  const contextTopic = `# [Context & Topic]
- 핵심 주제: 척추 및 관절 건강 (예: 거북목 교정, 허리디스크 예방, 무릎 관절염 관리 등)
- 대상 독자: 잘못된 자세로 만성 통증을 겪는 현대인 또는 관절 기능 저하가 시작된 중장년층
- 어조(Tone & Voice): 전문적이면서도 다정한 의사 선생님 같은 어조 (~합니다, ~해보세요 체), 신뢰감과 안정감을 주는 문체
- 주요 레퍼런스(유튜브 채널): 정형외과 김진구 교수, 문쌤의 물리치료실, 힙으뜸, 모멘트핏 록샘, 데스런, 마선호 (해당 채널들을 핵심 참고 자료로 활용하여 관절별 다양한 재활 운동법을 소개할 것)`;

  const instructions = `# [Task Instructions]
Antigravity 자동화 프로그램을 통해 입력된 [주제어]를 바탕으로 다음 4단계 구조에 맞춰 블로그 글을 작성하라. 
각 단계는 소제목(##)으로 명확히 구분되어야 한다.

1. 서론 (Introduction):
   - 해당 척추/관절 질환(또는 통증)으로 인해 독자가 일상에서 겪을 법한 불편함에 깊이 공감하는 문장으로 시작.
   - 가벼운 통증이라고 방치했을 때 찾아오는 만성 질환으로의 발전 위험성을 경고하며,지금 관리를 시작해야 하는 이유(본문의 필요성)를 강력히 강조.
   - 재활에 대한 최신 트렌드와 최근 많이 검색되는 관련 검색어를 자연스럽게 활용하여 도입부를 매력적으로 작성.

2. 본론 1 (Causes & Symptoms):
   - 질환의 발생 원인과 발달 과정을 해부학적·의학적 사실에 기반하여 일반인의 눈높이에 맞춰 명확하게 설명.
   - 독자가 병원에 가기 전 스스로 상태를 점검해 볼 수 있는 구체적인 '자가진단 체크리스트' 또는 대표적인 '전조증상 3~4가지'를 글머리 기호로 포함.

3. 본론 2 (Solutions & Exercises):
   - 일상생활(사무실, 집 등)에서 별도의 장비 없이 즉시 실천 가능한 바른 자세 유지법, 스트레칭 동작, 또는 생활 습관 개선 팁을 최소 3가지 이상 상세히 제시.
   - **특히, 추천 유튜브 채널(정형외과 김진구 교수, 문쌤의 물리치료실, 힙으뜸, 모멘트핏 록샘, 데스런, 마선호)의 특성과 운동법을 적극적으로 인용 및 활용하여, 관절별로 안전하고 효과적인 재활 방법을 다양하게 소개하라.**
   - 잘못된 자세로 동작을 따라 했을 때 발생할 수 있는 부상을 방지하기 위해, '동작 수행 시 주의사항' 및 '이런 분들은 피하세요'라는 경고 문구를 반드시 포함.

4. 결론 (Conclusion):
   - 본문에서 강조한 핵심 관리법을 2~3줄로 깔끔하게 요약하고, 독자의 건강한 관절 수명을 응원하는 따뜻한 격려의 멘트로 마무리.
   - 문단의 맨 마지막에는 "※ 본 콘텐츠는 정보 제공을 목적으로 작성되었으며, 통증이 지속되거나 심해질 경우 반드시 전문의와 상담하여 정확한 진단을 받으셔야 합니다."라는 메디컬 디스클레이머(면책 조항)를 인용구(\`>\`) 형식을 활용하여 자연스럽게 포함.`;

  const constraints = `# [Constraints & SEO Rules]
- **분량 제어**: 공백 제외 최소 1,800자 이상, 2,500자 이하의 풍부하고 깊이 있는 정보량으로 작성할 것. (절대 수박 겉핥기식 정보로 분량을 채우지 말 것)
- **가독성(Scannability)**: 독자가 스마트폰으로 글을 빠르게 내리면서 읽어도 핵심이 눈에 들어오도록 소제목(##, ###)을 정교하게 나누고, 중요 키워드는 볼드 기호(**)를 사용해 강조할 것. 단락 간 공백을 여유 있게 둘 것.
- **의학적 신뢰성**: 검증되지 않은 민간요법이나 과학적 근거가 없는 정보는 절대 배제할 것. 정확한 의학 용어를 쓰되, 용어 뒤에 쉬운 설명이나 비유를 덧붙일 것.
- **AI 텍스트 필터링(금지어)**: 상투적이고 기계적인 표현(예: "현대 사회에서~", "첫째로, 둘째로, 마지막으로", "결론적으로 말하자면", "지구상에서~")은 절대 사용하지 말 것. 문장과 문장 사이는 인과관계와 흐름에 맞게 자연스러운 접속사로 연결할 것.
- **콘텐츠 중복 절대 금지**: 기존 블로그 내용이나 문장 구조를 재사용하는 것은 엄격히 금지된다. 비슷한 주제라도 기존과 구성을 완전히 다른 컨셉으로 변경하여 작성할 것.
- **후킹 타이틀**: 블로그 제목을 선정할 때는 클릭을 유도하는 강력한 후킹 기법을 반드시 사용할 것. (예시: "무심코 한 이 자세? 방치했다간…'거북목 될 확률 30% 뛴다'" 와 같은 강력하고 자극적인 스타일의 제목을 생성)\`;

  const prompt = \`\${systemRole}

\${contextTopic}

\${instructions}

\${constraints}

# [Input Variable]
- 세부 주제어: \${topic}
\${latestDisease.isRewriting ? "- 특이사항: 이 질환에 대해 이전에 작성된 이력이 있습니다. 기존 글과 내용이 겹치지 않게, 이번에는 홈트레이닝 재활 가이드나 실생활 속 예방법 위주의 새로운 관점으로 완벽히 다르게 작성해 주세요." : ""}

# [Output Format]
반드시 아래 정의된 템플릿 구조만 출력하고, 앞뒤로 "네, 알겠습니다" 등 AI의 불필요한 인사말이나 서론은 일절 제외하라.

[타이틀]: (독자의 클릭을 유도하는 강력한 후킹 기법이 들어간 매력적인 SEO 최적화 제목, 대괄호 제외)
---
(본문 시작 - 서론부터 결론까지 위 4단계 지시사항에 맞춰 마크다운 형식으로 작성)

FILENAME: \${todayStr}-keyword\`;

  // 4. Gemini API 호출 (간헐적 네트워크 장애 대비 3회 자동 재시도 로직 탑재)
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`;

  let response;
  let attempts = 3;
  let success = false;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      response = await fetch(url, {
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

      if (response.ok) {
        success = true;
        break;
      }
      const errText = await response.text();
      console.warn(\`Gemini API attempt \${attempt} failed with status: \${response.status}. Response: \${errText}\`);
    } catch (err) {
      console.warn(\`Gemini API attempt \${attempt} connection failed: \${err.message}\`);
    }

    if (attempt < attempts) {
      console.log("3초 후 API 재시도를 진행합니다...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  try {
    if (!success || !response) {
      throw new Error(\`Gemini API 호출 실패 (최대 \${attempts}회 시도 실패)\`);
    }

    const data = await response.json();
    
    // 안전 필터(Safety Filter)에 걸린 경우 로깅
    if (data.promptFeedback && data.promptFeedback.blockReason) {
      throw new Error(\`Gemini API 프롬프트가 안전 필터에 의해 차단되었습니다: \${data.promptFeedback.blockReason}\`);
    }
    if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === 'SAFETY') {
      throw new Error("Gemini API 출력이 안전 필터(SAFETY)에 의해 차단되었습니다.");
    }

    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      throw new Error("Gemini API가 비어있는 응답을 반환했습니다. 응답 데이터: " + JSON.stringify(data));
    }
    
    const responseText = data.candidates[0].content.parts[0].text;

    // 파일명 지정 (질환 ID 기반으로 일관되게 생성)
    let filename = `${todayStr}-${latestDisease.id || "post"}.md`;

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

    // Pexels 이미지 실시간 조회 (질환의 키워드 및 해당 부위(part)로 검색)
    const pexelsPhotos = await getPexelsImages(latestDisease.keyword || latestDisease.name, latestDisease.part);

    // 본문 내용 중간에 이미지 자동 삽입
    const updatedBodyContent = insertImagesIntoMarkdown(bodyContent, pexelsPhotos, latestDisease.name);

    // 썸네일로 쓸 첫 번째 이미지 URL 추출
    const thumbnailVal = pexelsPhotos.length > 0 ? pexelsPhotos[0].url : "";

    // Frontmatter 생성
    const tags = [latestDisease.partName, latestDisease.mainCategoryName, "재활", "통증", latestDisease.keyword]
      .filter(Boolean)
      .map(tag => `"${tag}"`);
    const finalContent = `---
title: ${title}
date: ${todayStr}
summary: ${latestDisease.summary}
category: 정보
tags: [${tags.join(", ")}]
thumbnail: "${thumbnailVal}"
---

${updatedBodyContent}`;


    // 파일 생성
    const finalPath = path.join(postsDir, filename);
    fs.writeFileSync(finalPath, finalContent, "utf8");
    console.log("생성 완료");

  } catch (error) {
    console.error("블로그 글 생성 중 에러 발생:", error.message);
    process.exit(1);
  }
}

/**
 * 기존 작성된 모든 글의 썸네일 이미지 주소를 모아서 중복 방지용 집합을 반환합니다.
 */
function getUsedThumbnails() {
  const postsDir = path.join(process.cwd(), "src/content/posts");
  const used = new Set();
  if (!fs.existsSync(postsDir)) return used;

  try {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(postsDir, file), "utf8");
      const match = content.match(/thumbnail:\s*"([^"]+)"/);
      if (match) {
        used.add(match[1]);
      }
    }
  } catch (e) {
    console.warn("기존 썸네일 주소 모음 수집 중 오류:", e.message);
  }
  return used;
}

/**
 * Pexels API로부터 키워드와 연관된 고화질 이미지를 중복 없이 가져오는 함수입니다.
 */
async function getPexelsImages(keyword, part) {
  const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  if (!pexelsKey || pexelsKey === "YOUR_PEXELS_API_KEY_HERE") {
    console.error("에러: Pexels API Key가 누락되었거나 설정되지 않았습니다. 썸네일 및 이미지 삽입은 필수 사항이므로 글 생성 작업을 중단합니다.");
    process.exit(1);
  }

  // 1. 이미 사용 중인 썸네일 URL 리스트 수집
  const usedImages = getUsedThumbnails();

  // 2. 한글 검색 품질 극대화를 위한 영어 매핑 딕셔너리
  const krEnMap = {
    "거북목": "neck stretching computer laptop",
    "목디스크": "neck pain stretch therapy",
    "허리디스크": "back stretch core exercise yoga",
    "무릎": "knee joint exercise stretch",
    "어깨": "shoulder stretch physical therapy",
    "팔꿈치": "elbow massage rehabilitation stretch",
    "발목": "ankle physical therapy brace",
    "고관절": "hip joint stretch pelvic exercise",
    "고관절보호대": "hip joint rehab pelvis support",
    "골밀도": "elderly health exercise doctor",
    "폼롤러": "foam roller stretching massage roll",
    "필라테스": "pilates core spine stretch yoga",
    "자세교정": "good standing posture spine align",
    "안벅지": "thigh fitness stretching workout",
    "필라테스 호흡법": "pilates breathing yoga mat trainer",
    "무릎통증": "knee joint exercise stretch",
    "자세교정": "good standing posture spine align",
    "척추중립": "pilates core spine stretch yoga",
    "척추": "back spine core physical therapy",
    "목": "neck posture laptop check",
    "허리": "back stretch core exercise yoga",
    "목운동": "pilates exercise yoga back stretching",
    "기능성운동": "functional fitness training workout"
  };

  // 3. 1차 번역 검색어 선정 (개별 매핑어 우선)
  let englishQuery = krEnMap[keyword];

  // 4. 개별 매핑어가 없을 경우, 질환 부위(part)별로 적절한 부위 운동 사진 매핑 (대체 안전장치)
  if (!englishQuery && part) {
    const partMap = {
      "neck": "neck stretching therapy",
      "waist": "back pain core stretch exercise",
      "shoulder": "shoulder stretch physical therapy",
      "elbow": "elbow massage arm stretch",
      "wrist": "wrist hand finger massage stretch",
      "hip": "hip pelvic joint stretch exercise",
      "knee": "knee joint stretch physical therapy",
      "ankle": "ankle foot physical therapy massage",
      "systemic": "elderly active physical exercise health"
    };
    englishQuery = partMap[part];
  }

  // 5. 부위별 매핑조차 없다면 키워드 자체를 영어 쿼리로 사용
  if (!englishQuery) {
    englishQuery = keyword;
  }

  const searchQueries = [englishQuery, "stretching exercise", "physical therapy"];

  for (const query of searchQueries) {
    try {
      console.log(`Pexels 이미지 검색 시도 중... (검색어: ${query})`);
      // 중복 방지를 위해 10장 넉넉하게 불러와 대조합니다.
      const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`;
      
      const res = await fetch(searchUrl, {
        headers: {
          Authorization: pexelsKey
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          const matchedPhotos = [];
          for (const p of data.photos) {
            const cleanUrl = p.src.large.split('?')[0];
            // 다른 글에서 사용된 적이 없는 고유 이미지인 경우만 추출
            if (!usedImages.has(cleanUrl)) {
              matchedPhotos.push({
                url: cleanUrl,
                photographer: p.photographer,
                photographerUrl: p.photographer_url,
                alt: p.alt || `${keyword} 관련 재활 이미지`
              });
              // 글 하나당 1장의 대표 이미지(썸네일 겸 본문 삽입용)를 가져옵니다.
              if (matchedPhotos.length >= 1) break;
            }
          }

          if (matchedPhotos.length > 0) {
            console.log(`Pexels에서 성공적으로 중복 없는 '${query}' 관련 이미지를 ${matchedPhotos.length}장 확보했습니다.`);
            return matchedPhotos;
          }
        }
      } else {
        console.warn(`Pexels API 응답 지연. 상태 코드: ${res.status}`);
      }
    } catch (err) {
      console.warn(`Pexels API 조회 실패 (검색어: ${query}):`, err.message);
    }
  }

  console.log("Pexels에서 중복되지 않은 이미지를 찾지 못했습니다.");
  return [];
}

/**
 * 마크다운 본문 내용의 ## 소제목 밑에 사진들을 순서대로 배치하는 헬퍼 함수입니다.
 */
function insertImagesIntoMarkdown(body, photos, keyword) {
  if (!photos || photos.length === 0) return body;

  const lines = body.split('\n');
  let photoIndex = 0;
  const resultLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    resultLines.push(line);

    // '## ' 소제목을 만났고 아직 끼워 넣을 사진이 남았을 경우 그 아랫줄에 삽입
    if (line.startsWith('## ') && photoIndex < photos.length) {
      const photo = photos[photoIndex];
      const imageMarkdown = `\n![${photo.alt}](${photo.url})\n*(출처: Pexels / 사진 제공: [${photo.photographer}](${photo.photographerUrl}))*\n`;
      resultLines.push(imageMarkdown);
      photoIndex++;
    }
  }

  // 본문에 소제목이 아예 없어서 단 1장도 삽입되지 않은 특수한 경우, 본문 첫 머리에 1번째 대표 이미지를 주입해 줍니다.
  if (photoIndex === 0 && photos.length > 0) {
    const photo = photos[0];
    const imageMarkdown = `\n![${photo.alt}](${photo.url})\n*(출처: Pexels / 사진 제공: [${photo.photographer}](${photo.photographerUrl}))*\n`;
    resultLines.unshift(imageMarkdown);
    photoIndex++;
  }

  // 소제목 개수가 부족해 아직 주입되지 못하고 남은 이미지가 있는 경우(예: 소제목이 1개뿐일 때의 2번째 이미지 등),
  // 남은 이미지와 출처를 본문 가장 하단에 추가하여 누락을 완벽히 방지합니다.
  while (photoIndex < photos.length) {
    const photo = photos[photoIndex];
    const imageMarkdown = `\n\n![${photo.alt}](${photo.url})\n*(출처: Pexels / 사진 제공: [${photo.photographer}](${photo.photographerUrl}))*\n`;
    resultLines.push(imageMarkdown);
    photoIndex++;
  }

  return resultLines.join('\n');
}

generatePost();

