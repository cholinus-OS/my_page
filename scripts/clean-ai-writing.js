const fs = require("fs");
const path = require("path");

function cleanAIWriting() {
  const postsDir = path.join(process.cwd(), "src/content/posts");

  if (!fs.existsSync(postsDir)) {
    console.log("포스트 디렉토리가 존재하지 않습니다.");
    return;
  }

  const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  let updatedCount = 0;

  // AI 냄새가 짙게 나는 문장들의 정밀 필터링 치환 맵
  const replacementMap = [
    { target: /현대 사회에서 /g, replacement: "일상생활 속에서 " },
    { target: /바쁜 일상 속에서 /g, replacement: "하루를 보내며 " },
    { target: /현대인들에게 /g, replacement: "많은 분들에게 " },
    { target: /현대인들의 /g, replacement: "우리들의 " },
    { target: /결론적으로, /g, replacement: "" },
    { target: /결론적으로 /g, replacement: "" },
    { target: /요약하자면, /g, replacement: "간단히 정리하면 " },
    { target: /요약하자면 /g, replacement: "정리하자면 " },
    { target: /뗄래야 뗄 수 없는 /g, replacement: "자주 겪게 되는 " },
    { target: /송두리째 무너뜨릴 수 있는 /g, replacement: "크게 무너뜨릴 수 있는 " },
    { target: /이 글을 통해 /g, replacement: "아래 운동법을 통해 " },
    { target: /자신이 무지외반증인지 /g, replacement: "스스로 상태가 어떤지 " },
    { target: /생각하고 계시진 않으신가요\?/g, replacement: "걱정하고 계시진 않나요?" },
    { target: /걱정하고 계시진 않으신가요\?/g, replacement: "걱정이 되시진 않나요?" },
  ];

  postFiles.forEach((file) => {
    const fullPath = path.join(postsDir, file);
    let content = fs.readFileSync(fullPath, "utf8");
    let isModified = false;

    replacementMap.forEach(({ target, replacement }) => {
      if (target.test(content)) {
        content = content.replace(target, replacement);
        isModified = true;
      }
    });

    if (isModified) {
      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`[✓ Refined] ${file} 파일의 기계적 문장 정제 완료.`);
      updatedCount++;
    }
  });

  console.log("-----------------------------------------");
  console.log(`정제 완료! 총 ${updatedCount}개의 포스트 글이 자연스럽게 리터칭되었습니다.`);
  console.log("-----------------------------------------");
}

cleanAIWriting();
