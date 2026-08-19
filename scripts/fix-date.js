const fs = require('fs');
const path = require('path');

const dir = '/Users/hyungjuncho/my_page/src/content/posts/';
const filesToChange = [
  '2026-08-18-rotator-cuff-repair-guide.md',
  '2026-08-18-shoulder-early-rehab.md',
  '2026-08-18-tka-rehabilitation.md'
];

filesToChange.forEach(file => {
  const oldPath = path.join(dir, file);
  if (fs.existsSync(oldPath)) {
    const newFile = file.replace('2026-08-18', '2026-08-19');
    const newPath = path.join(dir, newFile);
    
    let content = fs.readFileSync(oldPath, 'utf8');
    content = content.replace(/date:\s*["']?2026-08-18["']?/, 'date: "2026-08-19"');
    
    fs.writeFileSync(newPath, content, 'utf8');
    fs.unlinkSync(oldPath);
    console.log(`Updated ${file} to ${newFile}`);
  }
});
