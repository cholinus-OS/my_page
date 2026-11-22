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

const ALL_JOINT_PARTS = ["목", "허리", "어깨", "팔꿈치", "손목", "고관절", "무릎", "발목", "전신"];

const PART_TO_TOPIC_KEY = {
  "목": "neck",
  "허리": "waist",
  "어깨": "shoulder",
  "팔꿈치": "elbow",
  "손목": "wrist",
  "고관절": "hip",
  "무릎": "knee",
  "발목": "ankle",
  "전신": "systemic"
};

const TOPIC_FALLBACK_THUMB = {
  neck: "/images/thumbnails/thumb_neck.jpg",
  waist: "/images/thumbnails/thumb_spine.jpg",
  shoulder: "/images/thumbnails/thumb_shoulder.jpg",
  elbow: "/images/thumbnails/thumb_elbow.jpg",
  wrist: "/images/thumbnails/thumb_elbow.jpg",
  hip: "/images/thumbnails/thumb_spine.jpg",
  knee: "/images/thumbnails/thumb_knee.jpg",
  ankle: "/images/thumbnails/thumb_ankle.jpg",
  systemic: "/images/thumbnails/thumb_exercise.jpg",
  chapter1: "/images/thumbnails/thumb_exercise.jpg",
  chapter2: "/images/thumbnails/thumb_neck.jpg",
  chapter3: "/images/thumbnails/thumb_senior.jpg"
};

function matchBodyPartText(text) {
  if (!text) return null;
  if (/무릎|십자인대|연골판|슬개|반월상|러너스|오스굿|슬관절|knee/.test(text)) return "무릎";
  if (/발목|아킬레스|족저|발바닥|뒤꿈치|평발|무지외반|종아리|ankle|foot/.test(text)) return "발목";
  if (/어깨|회전근개|오십견|라운드숄더|견갑|익상|충돌증후군|견관절|shoulder/.test(text)) return "어깨";
  if (/목|경추|거북목|일자목|텍스트\s*넥|두통|neck|cervical/.test(text)) return "목";
  if (/팔꿈치|엘보|상과염|elbow/.test(text)) return "팔꿈치";
  if (/손목|수근관|방아쇠|tfcc|손가락|건초염|터널증후군|wrist|finger/.test(text)) return "손목";
  if (/고관절|서혜부|둔근|엉덩이|사타구니|이상근|내전근|햄스트링|허벅지|hip/.test(text)) return "고관절";
  if (/허리|요추|골반|척추|허리디스크|협착|측만증|코어|요통|spine|lumbar/.test(text)) return "허리";
  return null;
}

function detectBodyPart(title, summary, tags) {
  const titleText = String(title || "").toLowerCase();
  const fromTitle = matchBodyPartText(titleText);
  if (fromTitle) return fromTitle;
  const fallbackText = `${summary || ""} ${(Array.isArray(tags) ? tags.join(" ") : "")}`.toLowerCase();
  return matchBodyPartText(fallbackText) || "전신";
}

function normalizeDateStr(val) {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === "string") return val.slice(0, 10);
  return "2026-01-01";
}

function analyzeExistingPosts(postsDir) {
  const emptyCounts = Object.fromEntries(ALL_JOINT_PARTS.map(p => [p, 0]));
  if (!fs.existsSync(postsDir)) {
    return {
      allTitles: [],
      chapterHistories: { 1: [], 2: [], 3: [] },
      recentSiteParts: [],
      sitePartCounts: emptyCounts,
      lowFreqParts: [...ALL_JOINT_PARTS],
      thumbnailUsage: {}
    };
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
  const allTitles = [];
  const chapterHistories = { 1: [], 2: [], 3: [] };
  const sitePartCounts = { ...emptyCounts };
  const recentPostsAll = [];
  const thumbnailUsage = {};

  const nowMs = Date.now();
  const threeWeeksMs = 21 * 24 * 60 * 60 * 1000;

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(raw);
      const dateStr = normalizeDateStr(data.date);
      const cleanTitle = (data.title || "").replace(/<[^>]+>/g, "").replace(/["']/g, "").trim();
      const bodyPart = detectBodyPart(cleanTitle, data.summary, data.tags);

      // 1) 전체 사이트(사용설명서 + 니숄더이야기 브리핑 + 재활 블로그) 통합 부위 집계
      sitePartCounts[bodyPart] = (sitePartCounts[bodyPart] || 0) + 1;

      const postMs = Date.parse(dateStr);
      if (!Number.isNaN(postMs) && (nowMs - postMs) <= threeWeeksMs) {
        recentPostsAll.push({ date: dateStr, bodyPart, category: data.category || "", title: cleanTitle });
      }

      // 2) 전체 썸네일 사용 빈도 및 마지막 사용일 집계 (라운드 로빈 순환용)
      if (data.thumbnail && typeof data.thumbnail === "string") {
        const thumb = data.thumbnail.trim();
        if (!thumbnailUsage[thumb]) {
          thumbnailUsage[thumb] = { count: 0, lastDate: "1970-01-01" };
        }
        thumbnailUsage[thumb].count += 1;
        if (dateStr > thumbnailUsage[thumb].lastDate) {
          thumbnailUsage[thumb].lastDate = dateStr;
        }
      }

      const isManual = data.category === "사용 설명서" ||
                       file.includes("chapter") ||
                       (cleanTitle && (cleanTitle.includes("사용 설명서") || cleanTitle.includes("Chapter")));

      if (isManual && cleanTitle) {
        allTitles.push(cleanTitle);
        let chNum = 0;
        if (file.includes("chapter1") || file.includes("chapter-1") || cleanTitle.includes("Chapter 1") || cleanTitle.includes("스포츠")) chNum = 1;
        else if (file.includes("chapter2") || file.includes("chapter-2") || cleanTitle.includes("Chapter 2") || cleanTitle.includes("자세")) chNum = 2;
        else if (file.includes("chapter3") || file.includes("chapter-3") || cleanTitle.includes("Chapter 3") || cleanTitle.includes("생애") || cleanTitle.includes("노화")) chNum = 3;

        if (chNum > 0) {
          chapterHistories[chNum].push({ file, title: cleanTitle, date: dateStr, bodyPart, chNum });
        }
      }
    } catch (e) {
      // skip unparseable
    }
  }

  recentPostsAll.sort((a, b) => b.date.localeCompare(a.date));
  const recentSiteParts = [...new Set(recentPostsAll.map(p => p.bodyPart))];

  // 누적 편수가 적은 부위 우선 정렬 (최근 3주에 니숄더이야기/블로그에서 다룬 부위는 뒤로 배치)
  const lowFreqParts = [...ALL_JOINT_PARTS].sort((a, b) => {
    const aRecent = recentSiteParts.includes(a) ? 1 : 0;
    const bRecent = recentSiteParts.includes(b) ? 1 : 0;
    if (aRecent !== bRecent) return aRecent - bRecent;
    return (sitePartCounts[a] || 0) - (sitePartCounts[b] || 0);
  });

  return { allTitles, chapterHistories, recentSiteParts, sitePartCounts, lowFreqParts, thumbnailUsage };
}

function pickNextThumbnail(topicKey, chapterNum, thumbnailUsage, todayStr) {
  const tryTopics = [topicKey];
  if (topicKey === "systemic" && chapterNum >= 1 && chapterNum <= 3) {
    tryTopics.unshift(`chapter${chapterNum}`);
  } else if (chapterNum >= 1 && chapterNum <= 3) {
    tryTopics.push(`chapter${chapterNum}`);
  }

  for (const key of tryTopics) {
    const folder = path.join(process.cwd(), "public/images/thumbnails", key);
    if (fs.existsSync(folder)) {
      const imgs = fs.readdirSync(folder)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()
        .map(f => `/images/thumbnails/${key}/${f}`);
      if (imgs.length > 0) {
        imgs.sort((a, b) => {
          const uA = thumbnailUsage[a] || { count: 0, lastDate: "1970-01-01" };
          const uB = thumbnailUsage[b] || { count: 0, lastDate: "1970-01-01" };
          if (uA.count !== uB.count) return uA.count - uB.count;
          if (uA.lastDate !== uB.lastDate) return uA.lastDate.localeCompare(uB.lastDate);
          return a.localeCompare(b);
        });
        const chosen = imgs[0];
        thumbnailUsage[chosen] = {
          count: ((thumbnailUsage[chosen] && thumbnailUsage[chosen].count) || 0) + 1,
          lastDate: todayStr
        };
        return chosen;
      }
    }
  }

  return TOPIC_FALLBACK_THUMB[topicKey] || TOPIC_FALLBACK_THUMB[`chapter${chapterNum}`] || "/images/thumbnails/thumb_exercise.jpg";
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

  const {
    allTitles,
    chapterHistories,
    recentSiteParts,
    sitePartCounts,
    lowFreqParts,
    thumbnailUsage
  } = analyzeExistingPosts(postsDir);

  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const todayStr = kstDate.toISOString().split("T")[0];

  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-2.5-pro"
  ];

  const generatedThisBatch = [];
  const generatedPartsThisBatch = [];
  const failedChapters = [];

  for (const chapter of chapters) {
    console.log(`\n========================================`);
    console.log(`📝 Chapter ${chapter.number}: ${chapter.name} 검사 및 생성 시작...`);

    // 오늘 날짜로 이미 작성된 해당 챕터가 있는지 확인
    const existingToday = fs.readdirSync(postsDir).find(f => 
      f.startsWith(todayStr) && 
      (f.includes(`chapter${chapter.number}`) || f.includes(`chapter-${chapter.number}`))
    );

    if (existingToday) {
      console.log(`⏩ Chapter ${chapter.number}는 오늘(${todayStr}) 이미 작성되어 있습니다: ${existingToday}`);
      try {
        const raw = fs.readFileSync(path.join(postsDir, existingToday), "utf8");
        const { data } = matter(raw);
        if (data.title) {
          generatedThisBatch.push(data.title);
          generatedPartsThisBatch.push(detectBodyPart(data.title, data.summary, data.tags));
        }
      } catch (e) {}
      continue;
    }

    const allExistingTitlesStr = allTitles.map(t => `- ${t}`).join("\n");
    const recentPartsList = [...new Set([...recentSiteParts, ...generatedPartsThisBatch])].join(", ");
    const priorityLowFreqList = lowFreqParts
      .filter(p => !generatedPartsThisBatch.includes(p))
      .slice(0, 5)
      .map(p => `${p}(누적 ${sitePartCounts[p] || 0}편)`)
      .join(", ");
    const highFreqPartsList = [...ALL_JOINT_PARTS]
      .sort((a, b) => (sitePartCounts[b] || 0) - (sitePartCounts[a] || 0))
      .slice(0, 3)
      .map(p => `${p}(누적 ${sitePartCounts[p] || 0}편)`)
      .join(", ");
    const thisBatchTitlesStr = generatedThisBatch.map(t => `- [이번 주 타 챕터에서 이미 선정된 주제]: ${t}`).join("\n");

    const prompt = `# [System Role]
너는 15년 경력의 정형외과 전문의이자 바른관절 헬프센터 센터장 '조형준 원장'이며, 베스트셀러 '우리 몸 사용 설명서'의 대표 저자이다. 가상의 다른 이름(예: 박선생 등)을 일절 사용하지 말고, 항상 정형외과 전문의 조형준 원장으로서 풍부한 진료실 임상 경험을 바탕으로 글을 작성하라.
전문적이면서도 독자의 눈높이에 맞춘 다정하고 신뢰감 있는 어조(~합니다, ~해보세요)로 유용한 건강 솔루션을 제공한다.

# [Task Instructions]
다음 챕터 대주제에 맞춰, **이번 주에 다룰 [특정 세부 주제]를 스스로 1개 선정**하고 심층적인 블로그 글을 작성하라.
- 챕터 대주제: Chapter ${chapter.number}. ${chapter.name} (${chapter.desc})

# [관절 부위 풀(Body Parts Pool) - 참고용]
${chapter.bodyPartsPool.map(p => `- ${p}`).join("\n")}

# [⚠️ 핵심 편집 지침: 전체 사이트 저빈도 우선 & 부위 쿨다운 원칙 (영구 기본 설정)]
1. **저빈도 관절 부위 최우선 선정 (니숄더이야기·재활 블로그 통합 분석):**
   - 현재 사이트 전체(사용설명서 + 니숄더이야기 + 재활 블로그) 기준 **가장 비중이 낮은 최우선 추천 부위**: **[ ${priorityLowFreqList || "손목, 고관절, 발목, 팔꿈치, 목"} ]**
   - 현재 이미 글이 매우 많은 고빈도 부위(자동 생성 억제 대상): **[ ${highFreqPartsList} ]**
   - 최근 3주 내 니숄더이야기(무릎·어깨 브리핑), 재활 블로그, 사용 설명서에서 이미 다룬 부위: **[ ${recentPartsList || "없음"} ]**
   - **필수 지침:** 니숄더이야기에서 무릎과 어깨를 자주 다루므로, 이번 주 자동 생성에서는 **반드시 위 [최우선 추천 저빈도 부위] 중에서 챕터 성격에 맞는 부위를 가장 먼저 선택**하라. 최근 3주 이내에 다룬 부위나 이번 주 타 챕터에서 이미 선택한 부위는 겹치지 않게 피하라!
2. **동일 관절 재방문 시 100% 차별화 원칙:**
   - 충분한 쿨다운 후 기존 부위를 다시 다룰 때는 이전 글의 주제와 운동법을 단순 반복하지 말고, **타겟 세부 구조물, 손상 메커니즘, 운동 처방이 완전히 다른 새로운 각도**로 작성하라.
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
  1. 프론트매터(Frontmatter): title, date, summary, category: "사용 설명서", tags (태그는 JSON 배열 형식: ["태그1", "태그2", "우리몸사용설명서"]), thumbnail (시스템이 12개 주제 × 7장 공식 3D 풀에서 자동 순환 배정하므로 기본값 "/images/thumbnails/thumb_exercise.jpg" 기입)
  2. 서론: 일상 속 특정 통증/부상 상황 공감 및 주제 선정 이유 (정형외과 전문의 조형준 원장 인사)
  3. 본론: 해부학적 발생 원인 분석 및 실생활에서 즉시 따라 할 수 있는 자가 운동/스트레칭 3가지 이상 상세 설명
  4. 결론: 요약, 따뜻한 응원 멘트 및 의학적 면책 조항(디스클레이머)
- 분량: 공백 제외 1,800자 이상으로 매우 상세하고 알차게 작성할 것.

# [Output Format]
반드시 다음 구조만 출력하고 앞뒤 잡담은 일절 배제하라.
[FILENAME]: ${todayStr}-chapter${chapter.number}-영문키워드.md
---
title: ...
date: ...
summary: ...
category: "사용 설명서"
tags: ...
thumbnail: "/images/thumbnails/thumb_exercise.jpg"
---
(본론 마크다운 내용)
`;

    let success = false;
    for (let pass = 1; pass <= 2 && !success; pass++) {
      if (pass > 1) {
        console.log(`\n🔄 Chapter ${chapter.number} 재시도 (2차 패스)... 8초 대기 중`);
        await new Promise(r => setTimeout(r, 8000));
      }

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
              let filename = null;
              const filenameMatch = responseText.match(/(?:\[FILENAME\]|\*\*\[FILENAME\]\*\*|FILENAME:)\s*([a-zA-Z0-9_\-\.]+\.md)/i);
              if (filenameMatch) {
                filename = filenameMatch[1].trim();
              } else {
                filename = `${todayStr}-chapter${chapter.number}-guide.md`;
              }

              let content = responseText
                .replace(/^(?:\[FILENAME\]|\*\*\[FILENAME\]\*\*|FILENAME:).*?\n/gim, "")
                .trim();
              content = content.replace(/^```markdown\s*\n/i, "").replace(/\n```$/i, "").trim();

              // 1. 제목 순수 텍스트 정제 및 큰따옴표 보정 (따옴표 중첩 YAML 파싱 오류 방지)
              content = content.replace(/^title:\s*(.*)$/m, (match, p1) => {
                let clean = p1.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/~~/g, '').replace(/`/g, '').trim();
                if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
                  clean = clean.slice(1, -1).trim();
                }
                clean = clean.replace(/\\"/g, "'").replace(/"/g, "'");
                return `title: "${clean}"`;
              });

              // 2. 날짜 큰따옴표 보정 및 시간 찌꺼기 완벽 제거
              content = content.replace(/^date:\s*["']?(\d{4}-\d{2}-\d{2}).*$/m, `date: "$1"`);

              // 3. summary 큰따옴표 보정 (따옴표 중첩 YAML 파싱 오류 방지)
              content = content.replace(/^summary:\s*(.*)$/m, (match, p1) => {
                let clean = p1.trim();
                if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
                  clean = clean.slice(1, -1).trim();
                }
                clean = clean.replace(/\\"/g, "'").replace(/"/g, "'");
                return `summary: "${clean}"`;
              });

              // 4. 카테고리 보정
              if (!content.includes('category: "사용 설명서"') && !content.includes("category: '사용 설명서'")) {
                content = content.replace(/^category:\s*.*$/m, 'category: "사용 설명서"');
              }

              // 5. 썸네일 자동 순환 배정 (12개 주제 × 7장 공식 3D 풀에서 최소 사용·최장 미사용 순으로 자동 선택)
              let parsedMeta = {};
              try {
                parsedMeta = matter(content).data || {};
              } catch (e) {}
              const bodyPart = detectBodyPart(
                parsedMeta.title || filename,
                parsedMeta.summary || "",
                Array.isArray(parsedMeta.tags) ? parsedMeta.tags : []
              );
              const topicKey = PART_TO_TOPIC_KEY[bodyPart] || `chapter${chapter.number}`;
              const assignedThumb = pickNextThumbnail(topicKey, chapter.number, thumbnailUsage, todayStr);
              generatedPartsThisBatch.push(bodyPart);
              sitePartCounts[bodyPart] = (sitePartCounts[bodyPart] || 0) + 1;

              // 기존 image_prompt 제거 및 확실한 공식 썸네일 배정
              if (content.includes("image_prompt:")) {
                content = content.replace(/^image_prompt:\s*.*$/m, `thumbnail: "${assignedThumb}"`);
              } else if (!content.includes("thumbnail:")) {
                content = content.replace(/^(category:\s*.*)$/m, `$1\nthumbnail: "${assignedThumb}"`);
              } else {
                content = content.replace(/^thumbnail:\s*.*$/m, `thumbnail: "${assignedThumb}"`);
              }

              // 6. 플레이스홀더 더미 이미지 자동 제거
              content = content.replace(/\*\*?<img[^>]*via\.placeholder\.com[^>]*>\*\*?/gi, "");
              content = content.replace(/!\[.*?\]\(https?:\/\/via\.placeholder\.com\/.*?\)/gi, "");

              // 7. 물결표(~) 자동 치환 (하이픈 -)
              content = content.replace(/(\d+)\s*~\s*(\d+)/g, "$1-$2");

              // 8. 태그에 "우리몸사용설명서" 보장
              if (content.includes("tags:")) {
                if (!content.includes('"우리몸사용설명서"') && !content.includes("'우리몸사용설명서'")) {
                  content = content.replace(/^tags:\s*\[(.*?)\]/m, (match, p1) => {
                    const items = p1.trim() ? `${p1.trim()}, "우리몸사용설명서"` : `"우리몸사용설명서"`;
                    return `tags: [${items}]`;
                  });
                }
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
              console.warn(`- API 응답 텍스트가 비어있음 (${modelName}), finishReason: ${data.candidates?.[0]?.finishReason}`);
            }
          } else {
            const errText = await response.text();
            console.warn(`- API 호출 실패 [${modelName}] (${response.status} ${response.statusText}): ${errText.slice(0, 150)}`);
            if (response.status === 429 || response.status === 503) {
              console.log(`- 할당량/서버 부하 감지: 5초 대기 후 다음 모델 시도...`);
              await new Promise(r => setTimeout(r, 5000));
            }
          }
        } catch (err) {
          console.warn(`- 에러 발생: ${err.message}`);
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    if (!success) {
      console.error(`❌ Chapter ${chapter.number} 생성 실패.`);
      failedChapters.push(chapter.number);
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  if (failedChapters.length > 0) {
    console.error(`\n⚠️ 최종 미완료 챕터 목록: Chapter ${failedChapters.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log(`\n🎉 모든 챕터가 완벽하게 준비되었습니다!`);
  }
}

generateManuals().catch(console.error);
