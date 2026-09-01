const fs = require("fs");
const path = require("path");

function loadEnvApiKey() {
  const envPaths = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env")
  ];
  
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const lines = content.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("GEMINI_API_KEY=")) {
          const parts = line.split("=");
          parts.shift();
          return parts.join("=").trim().replace(/^['"]|['"]$/g, "");
        }
      }
    }
  }
  return null;
}

const chapters = [
  {
    number: 1,
    name: "스포츠 부상 예방",
    desc: "안전하게 스포츠를 즐기기 위한 필수 스트레칭과 각 관절 보호 요령을 배웁니다."
  },
  {
    number: 2,
    name: "일상 속 바른 자세",
    desc: "거북목, 라운드숄더 등 현대인의 고질병을 해결하는 매일 5분 자세 교정 루틴."
  },
  {
    number: 3,
    name: "생애주기별 관리",
    desc: "성장기 아이부터 관절염이 걱정되는 노년층까지 연령대별 노화 방지 솔루션."
  }
];

async function generateManuals() {
  const apiKey = process.env.GEMINI_API_KEY || loadEnvApiKey();
  if (!apiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.");
    process.exit(1);
  }

  const postsDir = path.join(process.cwd(), "src/content/posts");
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // Get past manual titles to avoid duplication
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
  const existingTitles = [];
  for (const file of postFiles) {
    const content = fs.readFileSync(path.join(postsDir, file), "utf8");
    const titleMatch = content.match(/title:\s*"(.*?)"/);
    if (titleMatch && titleMatch[1].includes("우리 몸 사용 설명서")) {
      existingTitles.push(titleMatch[1]);
    }
  }

  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const todayStr = kstDate.toISOString().split("T")[0];

  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest"
  ];

  for (const chapter of chapters) {
    console.log(`\n========================================`);
    console.log(`📝 Chapter ${chapter.number}: ${chapter.name} 생성 시작...`);
    
    const prompt = `# [System Role]
너는 15년 경력의 정형외과 전문의이자 베스트셀러 '우리 몸 사용 설명서'의 저자이다.
친절하고 신뢰감 있는 어조(~합니다, ~해보세요)로 독자들에게 유용한 의학/건강 정보를 제공한다.

# [Task Instructions]
다음 챕터 테마에 맞춰, 이번 주에 다룰 [특정 세부 주제]를 스스로 1개 선정하고 심층적인 블로그 포스트를 작성하라.
- 챕터 테마: Chapter ${chapter.number}. ${chapter.name} (${chapter.desc})

# [규칙 및 제약사항 (CRITICAL)]
1. 제목 형식: "[우리 몸 사용 설명서] Chapter ${chapter.number}. (여기에 훅이 들어간 세부 제목)"
2. 중복 방지: 아래 [기존에 작성된 제목 목록]을 참고하여, 기존에 다루지 않은 완전히 새롭고 구체적인 세부 주제를 하나 선정하라.
3. 마크다운 포맷 규칙:
   - 강조를 위해 글자 양옆에 물결표(~)를 절대 사용하지 마라. 숫자 범위는 하이픈(-)을 사용하라.
   - 강조 시 마크다운 볼드(**) 외에도 \`<u>밑줄</u>\` 이나 \`<mark>형광펜</mark>\` 태그를 적극 활용하라.
   - 표(Table) 작성 시 모바일 가독성을 위해 넓은 텍스트는 \`<br/>\`로 줄바꿈하고, 수치/기간 등 줄바꿈되면 안 되는 텍스트는 \`<span style="white-space: nowrap;">...</span>\` 처리하라.
4. 구성:
   - 프론트매터(Frontmatter) 필수 포함 (title, date, summary, category: "사용 설명서", tags)
   - 서론: 주제 선정 이유와 공감대 형성
   - 본론: 의학적 원인 분석 및 실생활 교정 팁 (스트레칭이나 생활수칙 3가지 이상)
   - 결론: 따뜻한 격려 및 면책 조항(디스클레이머) 포함
5. 분량: 공백 제외 1,500자 이상으로 매우 상세하게 작성할 것.

[기존에 작성된 제목 목록]
${existingTitles.join("\n")}

# [Output Format]
반드시 다음 구조만 정확히 출력하고, 불필요한 서론/결론 멘트는 제외하라.
[FILENAME]: ${todayStr}-chapter${chapter.number}-영문키워드.md
---
(프론트매터 및 본문 마크다운 내용)
`;

    let success = false;
    for (const modelName of candidateModels) {
      console.log(`- API 호출 시도 (${modelName})...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          if (responseText) {
            // 파싱: [FILENAME]: ... 부분 추출
            const filenameMatch = responseText.match(/\[FILENAME\]:\s*(.*?\.md)/);
            if (filenameMatch) {
              const filename = filenameMatch[1].trim();
              // 프론트매터 YAML 파싱 에러 방지: [ 대괄호로 시작하는 제목에 큰따옴표 자동 보정
              content = content.replace(/^title:\s*(\[[^"'\n\r]+.*)$/m, (match, p1) => {
                let clean = p1.trim();
                if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
                  return `title: ${clean}`;
                }
                return `title: "${clean.replace(/"/g, '\\"')}"`;
              });

              const filePath = path.join(postsDir, filename);
              fs.writeFileSync(filePath, content, "utf8");
              console.log(`✅ 작성 완료: ${filename}`);
              success = true;
              break;
            } else {
              console.warn("⚠️ 출력 포맷에서 파일명을 찾을 수 없습니다. 재시도...");
            }
          }
        }
      } catch (err) {
        console.warn(`- 에러 발생: ${err.message}`);
      }
      // Rate limit
      await new Promise(r => setTimeout(r, 2000));
    }
    
    if (!success) {
      console.error(`❌ Chapter ${chapter.number} 생성 실패.`);
    }
    await new Promise(r => setTimeout(r, 3000));
  }
}

generateManuals().catch(console.error);
