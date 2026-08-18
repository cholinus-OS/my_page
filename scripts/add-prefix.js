const fs = require("fs");
const path = require("path");

const postsDirectory = path.join(process.cwd(), "src/content/posts");

function updateTitles() {
  const fileNames = fs.readdirSync(postsDirectory);
  let updatedCount = 0;

  fileNames.forEach((fileName) => {
    if (!fileName.endsWith(".md")) return;
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Match frontmatter
    const frontmatterRegex = /---\n([\s\S]*?)\n---/;
    const match = fileContents.match(frontmatterRegex);

    if (match) {
      const frontmatter = match[1];
      let titleMatch = frontmatter.match(/^title:\s*(.*)$/m);
      let tagsMatch = frontmatter.match(/^tags:\s*\[(.*?)\]/m);

      if (titleMatch) {
        let rawTitle = titleMatch[1].trim();
        // Remove quotes if they exist
        let title = rawTitle.replace(/^["'](.*)["']$/, '$1');
        
        let tags = [];
        if (tagsMatch) {
          tags = tagsMatch[1].split(",").map(t => t.trim().replace(/['"]/g, ''));
        }

        const isKnee = tags.some(t => t.includes("무릎") || t.includes("관절염")) || title.includes("무릎");
        const isShoulder = tags.some(t => t.includes("어깨") || t.includes("오십견")) || title.includes("어깨");

        if (isKnee || isShoulder) {
          if (!title.includes("[센터장 브리핑]")) {
            let newTitle = `"[센터장 브리핑] ${title}"`;
            let newFrontmatter = frontmatter.replace(/^title:\s*(.*)$/m, `title: ${newTitle}`);
            let newContents = fileContents.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);
            fs.writeFileSync(fullPath, newContents, "utf8");
            console.log(`Updated: ${fileName}`);
            updatedCount++;
          }
        }
      }
    }
  });

  console.log(`Total files updated: ${updatedCount}`);
}

updateTitles();
