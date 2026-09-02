const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

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
    desc: "안전하게 스포츠를 즐기기 위한 필수 스트레칭과 각 관절 보호 요령을 배웁니다.",
    bodyPartsPool: [
      "어깨 (회전근개 손상, 어깨 충돌증후군, 야구/수영 손상)",
      "무릎 (전방십자인대 파열, 반월상연골판 손상, 러너스 니/장경인대)",
      "팔꿈치 (테니스 엘보, 골프 엘보, 배드민턴/골프 손상)",
      "허리/코어 (급성 요추 염좌, 웨이트 트레이닝 허리 부상)",
      "허벅지/햄스트링 (햄스트링 근육 파열, 내전근 좌상, 축구/육상)",
      "손목/손가락 (손목 염좌, 삼각섬유연골복합체 TFCC, 클라이밍/헬스)",
      "종아리/아킬레스 (비복근 파열/테니스 레그, 아킬레스건염)",
      "고관절/골반 (고관절 충돌증후군, 서혜부 통증, 러닝/필라테스)"
    ]
  },
  {
    number: 2,
    name: "일상 속 바른 자세",
    desc: "거북목, 라운드숄더 등 현대인의 고질병을 해결하는 매일 5분 자세 교정 루틴.",
    bodyPartsPool: [
      "목/경추 (거북목 증후군, 일자목, 스마트폰 목 통증)",
      "어깨/등 (라운드숄더, 굽은 등, 견갑골 비대칭/익상견갑)",
      "허리/골반 (골반 틀어짐, 짝다리/다리꼬기, 의자 요통, 골반 전방경사)",
      "손목/손가락 (마우스 손목터널증후군, 스마트폰 방아쇠수지, 건초염)",
      "발/보행 (팔자걸음, 안짱다리, 평발 보행 피로, 뒤꿈치 통증)",
      "턱관절/두통 (턱관절 장애, 자세성 긴장성 두통)",
      "전신/수면 (수면 자세, 베개 높이, 체형 불균형 리셋)"
    ]
  },
  {
    number: 3,
    name: "생애주기별 관리",
    desc: "성장기 아이부터 관절염이 걱정되는 노년층까지 연령대별 노화 방지 솔루션.",
    bodyPartsPool: [
      "10대 성장기 (청소년 척추측만증, 오스굿씨병, 성장통, 바른 책상 자세)",
      "20~30대 청년기 (초기 디스크 예방, 직장인 관절 기초체력, 스포츠 손상 복구)",
      "40~50대 중년기 (오십견/유착성관절낭염, 조기 퇴행성관절염, 폐경기 골밀도)",
      "60대 이상 노년기 (퇴행성 무릎관절염, 척추관협착증, 낙상 예방/균형감각, 근감소증 방지)",
      "생애 전반 (관절 연골 영양학, 뼈 건강 영양소, 항노화 관절 습관)"
    ]
  }
];

function analyzeExistingManuals(postsDir) {
  if (!fs.existsSync(postsDir)) return { allTitles: [], chapterHistories: { 1: [], 2: [], 3: [] } };

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
  const allTitles = [];
  const chapterHistories = { 1: [], 2: [], 3: [] };

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(raw);
      const isManual = data.category === "사용 설명서" || 
                       file.includes("chapter") || 
                       (data.title && (data.title.includes("사용 설명서") || data.title.includes("Chapter")));

      if (isManual && data.title) {
        const cleanTitle = data.title.replace(/<[^>]+>/g, '').replace(/["']/g, '').trim();
        allTitles.push(cleanTitle);

        // Determine which chapter it belongs to
        let chNum = 0;
        if (file.includes("chapter1") || file.includes("chapter-1") || cleanTitle.includes("Chapter 1") || cleanTitle.includes("스포츠")) chNum = 1;
        else if (file.includes("chapter2") || file.includes("chapter-2") || cleanTitle.includes("Chapter 2") || cleanTitle.includes("자세")) chNum = 2;
        else if (file.includes("chapter3") || file.includes("chapter-3") || cleanTitle.includes("Chapter 3") || cleanTitle.includes("생애") || cleanTitle.includes("노화")) chNum = 3;

        if (chNum > 0) {
          chapterHistories[chNum].push({
            file,
            title: cleanTitle,
            summary: data.summary || "",
            tags: data.tags || []
          });
        }
      }
    } catch (e) {
      // skip unparseable
    }
  }

  return { allTitles, chapterHistories };
}

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

  const { allTitles, chapterHistories } = analyzeExistingManuals(postsDir);

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

  const generatedThisBatch = [];

  for (const chapter of chapters) {
    console.log(`\n========================================`);
    console.log(`📝 Chapter ${chapter.number}: ${chapter.name} 신규 주제 선정 및 생성 시작...`);

    const pastItems = chapterHistories[chapter.number] || [];
    const pastChapterTitles = pastItems.map(item => `- ${item.title}`).join("\n");
    const allExistingTitlesStr = allTitles.map(t => `- ${t}`).join("\n");
    const thisBatchTitlesStr = generatedThisBatch.map(t => `- [이번 주 타 챕터에서 이미 선정된 주제]: ${t}`).join("\n");

    const prompt = `# [System Role]
너는 15년 경력의 정형외과 전문의이자 베스트셀러 '우리 몸 사용 설명서'의 대표 저자이다.
전문적이면서도 독자의 눈높이에 맞춘 다정하고 신뢰감 있는 어조(~합니다, ~해보세요)로 유용한 건강 솔루션을 제공한다.

# [Task Instructions]
다음 챕터 대주제에 맞춰, **기존에 다루지 않은 완전히 새로운 관절 부위 및 세부 질환/상황**을 스스로 1개 선정하여 깊이 있는 블로그 글을 작성하라.
- 챕터 대주제: Chapter ${chapter.number}. ${chapter.name} (${chapter.desc})

# [관절 부위 풀(Body Parts Pool) - 참고용]
${chapter.bodyPartsPool.map(p => `- ${p}`).join("\n")}

# [⚠️ 중복 방지 및 주제 다양성 원칙 (기본 설정 - MANDATORY)]
1. 아래 [기존에 이미 다룬 주제 목록]을 철저히 분석하라.
2. **이미 다룬 관절 부위(예: 최근에 작성된 부위)나 세부 상황은 절대로 다시 작성하지 마라.**
3. 이번 주 같은 주차에 작성된 다른 챕터의 신체 부위와도 겹치지 않게 완전히 다른 부위를 선정하라!
4. 관절 부위와 대상 운동/상황이 기존 글들과 완전히 겹치지 않는 **새로운 신체 부위 및 새로운 주제**를 선정하라!
5. 제목(title) 규칙:
   - 형식: "[우리 몸 사용 설명서] Chapter ${chapter.number}. (여기에 훅이 들어간 매력적인 세부 제목)"
   - **중요: 제목(title)에는 <mark>, <u>, <b>, ** 등의 HTML 태그나 마크다운 서식을 절대 넣지 말고 오직 순수 텍스트(Plain Text)로만 작성하라.**

[기존에 이미 다룬 주제 목록 (중복 절대 엄금)]
${allExistingTitlesStr || "(아직 작성된 이전 글 없음)"}
${thisBatchTitlesStr ? `\n[이번 주차에 이미 선정된 부위/주제 (중복 금지)]\n${thisBatchTitlesStr}` : ""}

# [마크다운 및 본문 작성 규칙]
- 강조를 위해 글자 양옆에 물결표(~)를 절대 사용하지 마라. 숫자 범위는 하이픈(-)을 사용하라 (예: 4-5kg, 2-3회).
- 본문 내 강조 시에는 마크다운 볼드(**) 외에도 <u>밑줄</u> 이나 <mark>형광펜</mark> 태그를 적극 활용하여 가독성을 높여라.
- 표(Table) 작성 시 모바일 가독성을 위해 항목명은 <br/>로 두 줄 줄바꿈하고, 수치/기간 등 줄바꿈되면 안 되는 텍스트는 <span style="white-space: nowrap;">...</span> 처리하라.
- 구성:
  1. 프론트매터(Frontmatter): title, date, summary, category: "사용 설명서", tags (태그는 JSON 배열 형식: ["태그1", "태그2"])
  2. 서론: 일상 속 특정 통증/부상 상황 공감 및 주제 선정 이유
  3. 본론: 해부학적 발생 원인 분석 및 실생활에서 즉시 따라 할 수 있는 자가 운동/스트레칭 3가지 이상 상세 설명
  4. 결론: 요약, 따뜻한 응원 멘트 및 의학적 면책 조항(디스클레이머)
- 분량: 공백 제외 1,800자 이상으로 매우 상세하고 알차게 작성할 것.

# [Output Format]
반드시 다음 구조만 출력하고 앞뒤 잡담은 일절 배제하라.
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
            const filenameMatch = responseText.match(/\[FILENAME\]:\s*(.*?\.md)/);
            if (filenameMatch) {
              const filename = filenameMatch[1].trim();
              let content = responseText.replace(/\[FILENAME\]:.*?\n/i, "").trim();
              content = content.replace(/^```markdown\n/i, "").replace(/\n```$/i, "").trim();

              // 1. 제목 순수 텍스트 정제 및 큰따옴표 보정
              content = content.replace(/^title:\s*(.*)$/m, (match, p1) => {
                let clean = p1.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/~~/g, '').replace(/`/g, '').trim();
                if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
                  clean = clean.slice(1, -1).trim();
                }
                return `title: "${clean.replace(/"/g, '\\"')}"`;
              });

              // 2. 카테고리 보정
              if (!content.includes('category: "사용 설명서"') && !content.includes("category: '사용 설명서'")) {
                content = content.replace(/^category:\s*.*$/m, 'category: "사용 설명서"');
              }

              const filePath = path.join(postsDir, filename);
              fs.writeFileSync(filePath, content, "utf8");
              console.log(`✅ 작성 완료: ${filename}`);

              const savedTitleMatch = content.match(/^title:\s*"?(.*?)"?$/m);
              if (savedTitleMatch) {
                generatedThisBatch.push(savedTitleMatch[1]);
                allTitles.push(savedTitleMatch[1]);
              }

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
      await new Promise(r => setTimeout(r, 2000));
    }
    
    if (!success) {
      console.error(`❌ Chapter ${chapter.number} 생성 실패.`);
    }
    await new Promise(r => setTimeout(r, 3000));
  }
}

generateManuals().catch(console.error);
