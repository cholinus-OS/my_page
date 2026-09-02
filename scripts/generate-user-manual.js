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
      "어깨 (회전근개 손상, 어깨 충돌증후군, 수영/야구/배드민턴 손상)",
      "무릎 (전방십자인대 파열, 반월상연골판 손상, 러너스 니/장경인대 마찰)",
      "팔꿈치 (테니스 엘보, 골프 엘보, 내/외측 상과염)",
      "허리/코어 (급성 요추 염좌, 웨이트 트레이닝 요통 방지)",
      "허벅지/햄스트링 (햄스트링 근육 파열, 내전근 좌상, 축구/육상)",
      "손목/손가락 (손목 염좌, 삼각섬유연골복합체 TFCC, 클라이밍/골프)",
      "종아리/아킬레스 (비복근 파열/테니스 레그, 아킬레스건병증)",
      "고관절/골반 (고관절 충돌증후군, 서혜부 통증, 러닝/필라테스)"
    ]
  },
  {
    number: 2,
    name: "일상 속 바른 자세",
    desc: "거북목, 라운드숄더 등 현대인의 고질병을 해결하는 매일 5분 자세 교정 루틴.",
    bodyPartsPool: [
      "목/경추 (거북목 증후군, 일자목, 스마트폰 목 디스크 예방)",
      "어깨/등 (라운드숄더, 굽은 등/흉추 후만, 견갑골 비대칭/익상견갑)",
      "허리/골반 (골반 틀어짐, 짝다리/다리꼬기, 의자 요통, 골반 전방경사)",
      "손목/손가락 (마우스 손목터널증후군, 스마트폰 방아쇠수지, 드퀘르벵 건초염)",
      "발/보행 (팔자걸음, 안짱다리, 평발 보행 피로, 뒤꿈치 족저근막 통증)",
      "턱관절/두통 (턱관절 장애, 자세성 긴장성 두통)",
      "전신/수면 (수면 자세, 베개 높이, 체형 불균형 리셋)"
    ]
  },
  {
    number: 3,
    name: "생애주기별 관리",
    desc: "성장기 아이부터 관절염이 걱정되는 노년층까지 연령대별 노화 방지 솔루션.",
    bodyPartsPool: [
      "10대 성장기 (청소년 척추측만증, 오스굿씨병, 성장통 완화, 바른 책상 자세)",
      "20~30대 청년기 (초기 디스크 예방, 직장인 관절 기초체력, 스포츠 손상 복구)",
      "40~50대 중년기 (오십견/동결견, 조기 퇴행성관절염, 폐경기 골밀도/골감소증)",
      "60대 이상 노년기 (퇴행성 무릎관절염 완충, 척추관협착증 보행 요령, 낙상 예방/균형감각, 근감소증 방지)",
      "생애 전반 (관절 연골 영양학, 뼈 건강 영양소, 평생 쓰는 항노화 관절 습관)"
    ]
  }
];

function detectBodyPart(title, summary, tags) {
  const text = `${title} ${summary} ${(tags || []).join(" ")}`;
  if (/무릎|십자인대|연골판|슬개|반월상|러너스/.test(text)) return "무릎";
  if (/발목|아킬레스|족저|발바닥|뒤꿈치/.test(text)) return "발목/발";
  if (/어깨|회전근개|오십견|라운드숄더|견갑|익상/.test(text)) return "어깨/등";
  if (/목|경추|거북목|일자목/.test(text)) return "목/경추";
  if (/허리|요추|골반|척추|디스크|측만증/.test(text)) return "허리/척추/골반";
  if (/팔꿈치|엘보|손목|수근관|방아쇠|TFCC/.test(text)) return "팔꿈치/손목";
  if (/고관절|서혜부|둔근/.test(text)) return "고관절/골반";
  if (/햄스트링|허벅지|대퇴|내전근/.test(text)) return "허벅지/햄스트링";
  return "기타/전신";
}

function analyzeExistingManuals(postsDir) {
  if (!fs.existsSync(postsDir)) return { allTitles: [], chapterHistories: { 1: [], 2: [], 3: [] }, recentPosts: [] };

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
  const allTitles = [];
  const chapterHistories = { 1: [], 2: [], 3: [] };
  const allManualPosts = [];

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

        const bodyPart = detectBodyPart(cleanTitle, data.summary, data.tags);

        // Determine which chapter it belongs to
        let chNum = 0;
        if (file.includes("chapter1") || file.includes("chapter-1") || cleanTitle.includes("Chapter 1") || cleanTitle.includes("스포츠")) chNum = 1;
        else if (file.includes("chapter2") || file.includes("chapter-2") || cleanTitle.includes("Chapter 2") || cleanTitle.includes("자세")) chNum = 2;
        else if (file.includes("chapter3") || file.includes("chapter-3") || cleanTitle.includes("Chapter 3") || cleanTitle.includes("생애") || cleanTitle.includes("노화")) chNum = 3;

        const postObj = {
          file,
          title: cleanTitle,
          date: data.date || "2026-08-01",
          summary: data.summary || "",
          tags: data.tags || [],
          bodyPart,
          chNum
        };

        allManualPosts.push(postObj);

        if (chNum > 0) {
          chapterHistories[chNum].push(postObj);
        }
      }
    } catch (e) {
      // skip unparseable
    }
  }

  // 날짜 내림차순 정렬
  allManualPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentPosts = allManualPosts.slice(0, 6); // 최근 6개 글 (약 최근 2주 분량)

  return { allTitles, chapterHistories, recentPosts };
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

  const { allTitles, chapterHistories, recentPosts } = analyzeExistingManuals(postsDir);

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
    const pastChapterTitles = pastItems.map(item => `- ${item.title} (부위: ${item.bodyPart})`).join("\n");
    const allExistingTitlesStr = allTitles.map(t => `- ${t}`).join("\n");
    const recentPartsList = [...new Set(recentPosts.map(p => p.bodyPart))].join(", ");
    const thisBatchTitlesStr = generatedThisBatch.map(t => `- [이번 주 타 챕터에서 이미 선정된 주제]: ${t}`).join("\n");

    const prompt = `# [System Role]
너는 15년 경력의 정형외과 전문의이자 베스트셀러 '우리 몸 사용 설명서'의 대표 저자이다.
전문적이면서도 독자의 눈높이에 맞춘 다정하고 신뢰감 있는 어조(~합니다, ~해보세요)로 유용한 건강 솔루션을 제공한다.

# [Task Instructions]
다음 챕터 대주제에 맞춰, **이번 주에 다룰 [특정 세부 주제]를 스스로 1개 선정**하고 심층적인 블로그 글을 작성하라.
- 챕터 대주제: Chapter ${chapter.number}. ${chapter.name} (${chapter.desc})

# [관절 부위 풀(Body Parts Pool) - 참고용]
${chapter.bodyPartsPool.map(p => `- ${p}`).join("\n")}

# [⚠️ 핵심 편집 지침: 관절 부위 쿨다운 & 재활 내용 차별화 원칙 (기본 설정)]
1. **단기간 빈번 출현 방지 (쿨다운 원칙):**
   - 최근 2~3주 내에 이미 다룬 관절 부위: **[ ${recentPartsList || "없음"} ]**
   - 위 부위들은 짧은 시간에 너무 자주 연달아 나오는 것을 방지하기 위해, 이번 주에는 **가급적 최근에 다루지 않은 다른 관절 부위를 우선 선정**하라.
   - 또한, 이번 주 같은 주차에 작성된 다른 챕터의 부위와도 겹치지 않게 완전히 다른 신체 부위를 선정하라!
2. **동일 관절 재방문 시 100% 차별화 원칙:**
   - 관절이 같은 부위(예: 무릎, 어깨 등)라 하더라도, 충분한 시간 간격(쿨다운)을 둔 후 **재활의 내용, 타겟 세부 구조물, 손상 메커니즘, 운동 처방(신장성 수축, 고유수용성 감각, 관절 가동성 등)이 완전히 다르다면 언제든 훌륭한 설명서가 될 수 있다.**
   - 단, 같은 부위를 다룰 때는 이전 글의 주제와 운동법을 절대 단순 반복하지 말고, **완전히 새로운 각도와 실천 팁**으로 접근해야 한다!
3. 제목(title) 규칙:
   - 형식: "[우리 몸 사용 설명서] Chapter ${chapter.number}. (여기에 훅이 들어간 매력적인 세부 제목)"
   - **중요: 제목(title)에는 <mark>, <u>, <b>, ** 등의 HTML 태그나 마크다운 서식을 절대 넣지 말고 오직 순수 텍스트(Plain Text)로만 작성하라.**

[기존에 이미 다룬 전체 주제 목록 (참고 및 차별화용)]
${allExistingTitlesStr || "(아직 작성된 이전 글 없음)"}
${thisBatchTitlesStr ? `\n[이번 주차에 이미 선정된 부위/주제 (동주차 중복 금지)]\n${thisBatchTitlesStr}` : ""}

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
