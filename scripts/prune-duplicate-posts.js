const fs = require("fs");
const path = require("path");

function prune() {
  const postsDir = path.join(process.cwd(), "src/content/posts");
  const diseasesFile = path.join(process.cwd(), "src/content/diseases/data.json");

  if (!fs.existsSync(diseasesFile)) {
    console.error("질환 데이터 파일이 존재하지 않습니다.");
    process.exit(1);
  }

  let diseases;
  try {
    diseases = JSON.parse(fs.readFileSync(diseasesFile, "utf8"));
  } catch (err) {
    console.error("질환 데이터 파싱 에러:", err.message);
    process.exit(1);
  }

  if (!fs.existsSync(postsDir)) {
    console.log("포스트 디렉토리가 존재하지 않습니다.");
    return;
  }

  const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));

  // 1. 질환별 매칭되는 포스트 수집
  const diseaseFilesMap = {};
  diseases.forEach((d) => {
    diseaseFilesMap[d.id] = [];
  });

  // 기타 매칭되지 않는 파일 수집 (수동 작성 파일 등 유지 목적)
  const unmatchedFiles = [];

  postFiles.forEach((file) => {
    let matched = false;
    for (const d of diseases) {
      if (file.includes(d.id)) {
        diseaseFilesMap[d.id].push(file);
        matched = true;
        break;
      }
    }
    if (!matched) {
      unmatchedFiles.push(file);
    }
  });

  console.log("-----------------------------------------");
  console.log(`총 파일 수: ${postFiles.length}`);
  console.log(`매칭되지 않은 수동/특수 파일 수 (유지): ${unmatchedFiles.length} (${unmatchedFiles.join(", ")})`);
  console.log("-----------------------------------------");

  let deletedCount = 0;

  // 2. 각 질환별 파일 정렬 및 중복 삭제
  Object.keys(diseaseFilesMap).forEach((diseaseId) => {
    const files = diseaseFilesMap[diseaseId];
    if (files.length > 1) {
      // 파일명 오름차순 정렬 후 최신 순으로 뒤집기 (날짜 YYYY-MM-DD 기준)
      const sorted = [...files].sort().reverse();
      const keepFile = sorted[0]; // 가장 최근 발행된 파일 유지
      const deleteFiles = sorted.slice(1); // 과거 중복 파일들

      console.log(`[🎯 ${diseaseId}] 유지: ${keepFile} | 삭제할 대상: ${deleteFiles.length}개`);
      
      deleteFiles.forEach((file) => {
        const fullPath = path.join(postsDir, file);
        try {
          fs.unlinkSync(fullPath);
          deletedCount++;
        } catch (e) {
          console.error(`파일 삭제 실패 (${file}):`, e.message);
        }
      });
    } else if (files.length === 1) {
      console.log(`[✓ ${diseaseId}] 고유 포스트 1개만 존재하여 유지: ${files[0]}`);
    } else {
      console.log(`[⚠️ ${diseaseId}] 아직 작성된 포스트가 없습니다.`);
    }
  });

  console.log("-----------------------------------------");
  console.log(`정리 완료! 총 ${deletedCount}개의 중복 포스트가 삭제되었습니다.`);
  console.log("-----------------------------------------");
}

prune();
