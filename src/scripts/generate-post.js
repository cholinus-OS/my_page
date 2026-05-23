const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 중요 보관 폴더 경로 설정
const DISEASES_FILE = path.join(__dirname, "../content/diseases/data.json");
const POSTS_DIR = path.join(__dirname, "../content/posts");

// 환경 변수 검사 (Gemini API 키)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ 에러: GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
  console.log("로컬 테스트 시: export GEMINI_API_KEY='내키' 명령어를 입력하거나 빌드 시 주입해 주세요.");
  process.exit(1);
}

// 구글 Generative AI 초기화
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    console.log("🔄 1단계: 질환 정보 및 기존 포스트 목록 불러오는 중...");
    
    // 질환 데이터 로드
    if (!fs.existsSync(DISEASES_FILE)) {
      throw new Error(`질환 데이터 파일이 없습니다: ${DISEASES_FILE}`);
    }
    const diseases = JSON.parse(fs.readFileSync(DISEASES_FILE, "utf8"));

    // posts 폴더가 없으면 생성
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    // 기존 포스트 개수 확인하여 순서대로 오늘의 주제 선정 (매번 겹치지 않게 순환)
    const existingFiles = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith(".json"));
    const postCount = existingFiles.length;
    
    // 순차적으로 질환 선택 (인덱스 순환)
    const selectedDisease = diseases[postCount % diseases.length];
    console.log(`🎯 오늘의 선정 주제: ${selectedDisease.name} (부위: ${selectedDisease.partName})`);

    console.log("🤖 2단계: 구글 Gemini AI 모델에게 글쓰기 요청 중...");
    
    // Gemini 1.5 Flash 모델 설정 (속도가 빠르고 경제적임)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { 
        responseMimeType: "application/json" // 결과물을 깔끔한 JSON 포맷으로 고정
      }
    });

    const prompt = `
너는 척추 및 관절 통증으로 고통받는 환자들을 위한 친절한 전문 물리치료사이자 재활 전문가야.
오늘의 주제 질환은 "${selectedDisease.name}"이며, 부위는 "${selectedDisease.partName}"이야.

주제 질환의 정의, 왜 아픈지에 대한 원인 설명, 그리고 집에서 특별한 기구 없이 안전하게 따라 할 수 있는 자가 재활 운동 및 스트레칭 3가지 요령을 친절하게 알려주는 블로그 글을 작성해 줘.

[작성 조건]
1. 일반인(특히 아프신 어르신들 포함)도 쉽게 이해할 수 있도록 전문 의학 용어는 쉬운 일상어로 풀어 써줘.
2. 스트레칭 3가지는 '동작 방법', '주의 사항', '권장 횟수'를 나누어 구체적으로 묘사해 줘.
3. 본문 텍스트 내에서 문단을 구분할 때는 줄바꿈(\\n)을 활용하고, 제목 영역은 '### 제목명' 또는 '## 제목명' 기호를 사용하여 단락 구분이 확실히 되도록 해줘.
4. 마지막 부분에는 평소 바른 자세 및 관절 건강을 지키기 위해 키워드인 "${selectedDisease.keyword}"와 관련된 올바른 수면 베개나 의자 쿠션, 보호대 등을 가볍게 추천해 주는 멘트를 넣어줘.

반드시 아래 JSON 스키마 형식으로만 최종 응답을 반환해 줘:
{
  "title": "클릭률을 높일 수 있는 매력적이고 전문적인 블로그 글 제목",
  "summary": "글의 전체 흐름과 유익한 가치를 요약한 2줄 가량의 매끄러운 요약문",
  "content": "위의 가이드를 바탕으로 작성된 정성스럽고 친절한 1500자 내외의 본문 텍스트 (마크다운 제목기호 포함)"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log("✅ 3단계: AI 글 생성 완료! 파싱 진행 중...");
    const parsedData = JSON.parse(responseText);

    // 날짜 구하기 (한국 시간 기준 YYYY-MM-DD 형식)
    const now = new Date();
    const kstOffset = 9 * 60; // KST는 UTC+9
    const kstTime = new Date(now.getTime() + (kstOffset + now.getTimezoneOffset()) * 60000);
    const year = kstTime.getFullYear();
    const month = String(kstTime.getMonth() + 1).padStart(2, '0');
    const date = String(kstTime.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;

    // 고유 ID 생성 (예: post-2026-05-23-turtle-neck)
    const postId = `post-${formattedDate}-${selectedDisease.id}`;
    
    // 최종 포스트 JSON 객체 구성
    const newPost = {
      id: postId,
      title: parsedData.title,
      summary: parsedData.summary,
      content: parsedData.content,
      date: formattedDate,
      category: `${selectedDisease.partName} 재활`,
      keyword: selectedDisease.keyword
    };

    // 파일로 저장
    const outputFilePath = path.join(POSTS_DIR, `${postId}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(newPost, null, 2), "utf8");
    
    console.log(`🎉 4단계 최종 성공: 블로그 포스트 저장 완료!`);
    console.log(`💾 저장 경로: ${outputFilePath}`);
    console.log(`📝 제목: ${newPost.title}`);

  } catch (error) {
    console.error("❌ 포스트 자동 생성 실패:", error);
    process.exit(1);
  }
}

run();
