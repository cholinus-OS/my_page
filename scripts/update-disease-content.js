const fs = require("fs");
const path = require("path");

// .env 또는 .env.local 파일에서 GEMINI_API_KEY를 직접 읽어오는 헬퍼 함수
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
          parts.shift(); // GEMINI_API_KEY 제거
          const keyVal = parts.join("=").trim();
          return keyVal.replace(/^['"]|['"]$/g, ""); // 따옴표 제거
        }
      }
    }
  }
  return null;
}

async function updateDiseases() {
  const diseasesFile = path.join(process.cwd(), "src/content/diseases/data.json");
  
  if (!fs.existsSync(diseasesFile)) {
    console.error("질환 데이터 파일이 존재하지 않습니다.");
    process.exit(1);
  }

  let diseases;
  try {
    diseases = JSON.parse(fs.readFileSync(diseasesFile, "utf8"));
  } catch (err) {
    console.error("질환 데이터 파싱 오류:", err.message);
    process.exit(1);
  }

  // 환경변수가 없으면 .env/.env.local에서 로드 시도
  const apiKey = process.env.GEMINI_API_KEY || loadEnvApiKey();
  if (!apiKey) {
    console.error("GEMINI_API_KEY를 환경변수 또는 .env/.env.local 파일에서 찾을 수 없습니다.");
    process.exit(1);
  }

  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest"
  ];

  console.log(`총 ${diseases.length}개의 질환 데이터를 검토하고 보강을 시작합니다.`);

  for (let idx = 0; idx < diseases.length; idx++) {
    const disease = diseases[idx];
    const originalDesc = disease.description || "";
    
    // 이미 충분한 양의 콘텐츠가 존재하면 패스 (800자 이상)
    if (originalDesc.length >= 800) {
      console.log(`[${idx + 1}/${diseases.length}] '${disease.name}'는 이미 충분히 보강되어 있습니다. (${originalDesc.length}자) - 건너뜀`);
      continue;
    }

    console.log(`[${idx + 1}/${diseases.length}] '${disease.name}' 보강 생성 중... (현재: ${originalDesc.length}자)`);

    const prompt = `
너는 15년 경력의 정형외과 전문의이자 메디컬 콘텐츠 에디터이다.
다음 [질환 정보]를 바탕으로, 환자에게 상세하고 친절하게 설명하는 800자 이상의 풍부한 의학 가이드라인 콘텐츠를 작성하라.

[질환 정보]
- 질환명: ${disease.name}
- 부위: ${disease.partName}
- 요약: ${disease.summary}
- 기존 설명: ${originalDesc}

[작성 지침]
- 반드시 한국어로 작성하며, 전문적이면서도 따뜻하고 쉬운 어조(~합니다, ~하세요 체)를 유지하라.
- 분량은 공백 제외 최소 1,000자 이상으로 매우 상세하게 서술하라. (충분한 정보성 가치를 가져야 함)
- 마크다운(headings, bold, lists)을 적절히 활용하여 가독성을 극대화하라.
- 다음 구조를 반드시 준수하라:
  ## 1. 질환 개요 및 정의
  이 질환이 무엇인지 해부학적 관점에서 일반인이 알기 쉽게 설명하라.
  
  ## 2. 발생 원인
  왜 이 질환이 발생하는지 일상 속 잘못된 자세나 생활 습관, 퇴행성 요인 등과 결부하여 설명하라.
  
  ## 3. 대표적인 임상 증상
  환자가 직접 몸으로 느낄 수 있는 구체적인 통증 양상, 방사통, 감각 이상, 기능적 제한 등을 상세하게 서술하라.
  
  ## 4. 예방 및 관리를 위한 핵심 생활 습관
  병원 치료 전에 일상에서 스스로 실천할 수 있는 바른 자세 가이드 및 악화 방지 관리법을 제시하라.
  
  ## 5. 단계별 추천 재활 운동법
  관절 부하를 최소화하면서 집에서 안전하게 수행 가능한 스트레칭 및 근력 강화 운동법을 단계별로 설명하라.

[주의사항]
- 출력 결과에 '[질환 정보]', '[작성 지침]', 또는 '마크다운 코드블록' 같은 불필요한 메타 텍스트를 포함하지 말고, 순수한 콘텐츠 마크다운만 반환하라.
- 다른 질환과 혼동되지 않도록 해당 질환(${disease.name})의 특이적인 증상을 명확하게 짚어주어라.
`;

    let success = false;
    let responseText = "";

    for (const modelName of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      let attempts = 2;
      
      for (let attempt = 1; attempt <= attempts; attempt++) {
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

          if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
              responseText = data.candidates[0].content.parts[0].text;
              
              // 마크다운 코드 블록 마크 제거
              responseText = responseText.replace(/^```markdown\n/i, "").replace(/\n```$/i, "").trim();
              if (responseText.length >= 800) {
                success = true;
                break;
              }
            }
          } else {
            console.warn(`모델 ${modelName} - 시도 ${attempt} 실패 (상태: ${response.status})`);
          }
        } catch (err) {
          console.warn(`모델 ${modelName} - 시도 ${attempt} 예외 발생: ${err.message}`);
        }

        if (attempt < attempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (success) {
        break;
      }
    }

    if (success && responseText) {
      disease.description = responseText;
      console.log(`✅ '${disease.name}' 보강 성공! (글자 수: ${responseText.length}자)`);
      
      // 중간 저장 (에러 등으로 멈췄을 때의 안전장치)
      fs.writeFileSync(diseasesFile, JSON.stringify(diseases, null, 2), "utf8");
    } else {
      console.error(`❌ '${disease.name}' 보강 실패.`);
    }

    // Rate Limit 대책: 질환당 2.5초 간격 유지
    await new Promise(resolve => setTimeout(resolve, 2500));
  }

  console.log("모든 질환 데이터의 콘텐츠 보강 프로세스가 완료되었습니다.");
}

updateDiseases().catch(err => {
  console.error("실행 중 오류 발생:", err);
});
