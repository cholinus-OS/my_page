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

    const frontmatterRegex = /---\n([\s\S]*?)\n---/;
    const match = fileContents.match(frontmatterRegex);

    if (match) {
      const frontmatter = match[1];
      
      // Check if it's a briefing category
      if (!/category:\s*["']?브리핑["']?/.test(frontmatter)) {
        return;
      }

      let titleMatch = frontmatter.match(/^title:\s*(.*)$/m);
      if (titleMatch) {
        let rawTitle = titleMatch[1].trim();
        let title = rawTitle.replace(/^["'](.*)["']$/, '$1');

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
  });

  console.log(`Total files updated: ${updatedCount}`);
}

updateTitles();
