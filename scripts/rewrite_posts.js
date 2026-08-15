const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

function processMarkdownFiles() {
  const fileNames = fs.readdirSync(postsDirectory);
  let updatedCount = 0;

  fileNames.forEach((fileName) => {
    if (!fileName.endsWith('.md')) return;

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 프론트매터 파싱
    const match = fileContents.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return;

    const frontmatter = match[1];
    let content = match[2];

    // 이미 주입된 파일인지 확인
    if (content.includes('바른관절 헬프센터 대표 에디터 조형준 전문의입니다')) {
      return;
    }

    // 제목과 요약 추출
    const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
    const summaryMatch = frontmatter.match(/summary:\s*"?([^"\n]+)"?/);

    if (!titleMatch) return;

    // 대괄호 카테고리가 제목에 포함된 경우(예: "[Chapter 1...] 제목") 제거
    let rawTitle = titleMatch[1];
    let title = rawTitle.replace(/^\[.*?\]\s*/, '').trim();
    let summary = summaryMatch ? summaryMatch[1] : '';

    const intro = `> **안녕하세요. 바른관절 헬프센터 대표 에디터 조형준 전문의입니다.**\n> 오늘 여러분과 함께 다룰 주제는 바로 **'${title}'**입니다.\n> ${summary}\n> 바쁜 일상 속에서도 척추와 관절 건강을 지키기 위한 핵심 의학 정보를 알기 쉽게 정리해 드립니다.\n\n---\n\n`;
    
    const outro = `\n\n---\n\n> **👨‍⚕️ 전문의의 당부 말씀**\n> 지금까지 **'${title}'**에 대해 알아보았습니다.\n> 가장 중요한 것은 통증을 방치하지 않고, 무리하지 않는 선에서 꾸준히 관리하는 것입니다.\n> 언제나 여러분의 건강한 관절과 척추를 응원합니다. 이상 정형외과 전문의 조형준이었습니다.\n`;

    const newContent = `---\n${frontmatter}\n---\n\n${intro}${content.trim()}${outro}`;
    
    fs.writeFileSync(fullPath, newContent, 'utf8');
    updatedCount++;
  });

  console.log(`Successfully updated ${updatedCount} markdown files with E-E-A-T intro/outro.`);
}

processMarkdownFiles();
