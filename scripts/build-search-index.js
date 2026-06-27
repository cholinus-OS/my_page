const fs = require("fs");
const path = require("path");

/**
 * 마크다운 기호(**, #, *, >, - 등)를 제거하여 순수 텍스트로 변환합니다.
 */
function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")       // # 제목
    .replace(/\*\*([^*]+)\*\*/g, "$1")  // **볼드**
    .replace(/\*([^*]+)\*/g, "$1")      // *이탤릭*
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // ![이미지](url)
    .replace(/\[[^\]]*\]\([^)]*\)/g, "") // [링크](url)
    .replace(/^>\s?/gm, "")            // > 인용
    .replace(/^[-*+]\s+/gm, "")        // - 목록
    .replace(/^\d+\.\s+/gm, "")        // 1. 번호 목록
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // `코드`
    .replace(/---/g, "")               // 구분선
    .replace(/\n{2,}/g, "\n")          // 연속 줄바꿈 정리
    .trim();
}

/**
 * 간단한 frontmatter 파서 (gray-matter 의존 없이 동작)
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const frontmatterStr = match[1];
  const body = match[2];
  const data = {};

  for (const line of frontmatterStr.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // 따옴표 제거
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body };
}

function main() {
  const entries = [];

  // ① public/data/local-info.json 읽기 (파일이 존재할 경우)
  const localInfoPath = path.join(process.cwd(), "public/data/local-info.json");
  if (fs.existsSync(localInfoPath)) {
    try {
      const localData = JSON.parse(fs.readFileSync(localInfoPath, "utf8"));
      if (Array.isArray(localData)) {
        for (const item of localData) {
          entries.push({
            type: "local-info",
            title: item.title || item.name || "",
            summary: item.summary || item.description || "",
            content: stripMarkdown(
              item.content || item.description || item.summary || ""
            ).slice(0, 500),
          });
        }
      }
    } catch (err) {
      console.warn("local-info.json 파싱 중 오류:", err.message);
    }
  }

  // ② src/content/posts/*.md 파일 읽기
  const postsDir = path.join(process.cwd(), "src/content/posts");
  if (fs.existsSync(postsDir)) {
    const mdFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

    for (const file of mdFiles) {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const plainBody = stripMarkdown(body).slice(0, 500);

      entries.push({
        type: "post",
        slug: file.replace(/\.md$/, ""),
        title: data.title || "",
        summary: data.summary || "",
        content: plainBody,
      });
    }
  }

  // ③ 결과를 public/data/search-index.json으로 저장
  const outputDir = path.join(process.cwd(), "public/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "search-index.json");
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2), "utf8");

  console.log(`Search index built: ${entries.length} entries`);
}

main();
