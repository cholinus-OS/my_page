const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 설정
const POSTS_DIR = path.join(__dirname, '../src/content/posts');
const OUTPUT_FILE = path.join(__dirname, '../newsletter-output.html');

// 1. 최신 블로그 3개 추출
function getLatestPosts() {
  const fileNames = fs.readdirSync(POSTS_DIR);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fileContents = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
      const { data } = matter(fileContents);
      return {
        title: data.title,
        summary: data.summary,
        date: data.date,
        url: `https://cholinus-exerciseismedicine.com/blog/${fileName.replace('.md', '')}`
      };
    });

  // 날짜 내림차순 정렬 후 상위 3개 반환
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
}

async function generateNewsletter() {
  console.log('📰 뉴스레터 생성을 시작합니다...');
  
  const latestPosts = getLatestPosts();
  console.log(`✅ 최신 글 ${latestPosts.length}개 추출 완료.`);

  let aiIntro = "안녕하세요, 바른관절 헬프센터입니다. 이번 주에도 유익한 재활 정보와 함께 건강한 한 주 보내시길 바랍니다.";

  // 2. Gemini AI를 활용한 인사말 생성 (API 키가 있을 경우만)
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      console.log('🤖 AI 인트로 생성을 요청합니다...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
당신은 정형외과 전문의 '조형준 원장'입니다. 
당신의 블로그 구독자들에게 매주 보내는 뉴스레터의 오프닝 인사말(3~4문장)을 작성해주세요.
말투는 다정하고 전문적이며, 환자들의 관절 건강을 염려하고 응원하는 뉘앙스여야 합니다.
이번 주에 다룰 내용들은 다음과 같습니다:
1. ${latestPosts[0].title}
2. ${latestPosts[1].title}

html 태그 없이 순수 텍스트로만 작성하세요.
      `;

      const result = await model.generateContent(prompt);
      aiIntro = result.response.text().trim();
      console.log('✅ AI 인트로 생성 완료.');
    } catch (error) {
      console.error('⚠️ AI 생성 실패 (기본 인사말 대체):', error.message);
    }
  } else {
    console.log('⚠️ GEMINI_API_KEY가 없습니다. 기본 인사말로 대체합니다.');
  }

  // 3. HTML 뉴스레터 템플릿 생성
  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>바른관절 헬프센터 주간 뉴스레터</title>
  <style>
    body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; background-color: #f8fafc; color: #334155; line-height: 1.6; padding: 20px; }
    .container { max-w-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #0d9488; color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .content { padding: 30px; }
    .intro { font-size: 16px; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; white-space: pre-wrap; }
    .post-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .post-title { font-size: 18px; font-weight: bold; color: #0f172a; margin: 0 0 10px 0; }
    .post-summary { font-size: 14px; color: #64748b; margin: 0 0 15px 0; }
    .btn { display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>바른관절 헬프센터 주간 뉴스레터 💌</h1>
    </div>
    
    <div class="content">
      <div class="intro">
${aiIntro}
      </div>

      <h2 style="font-size: 20px; color: #0f172a; margin-bottom: 20px;">🔥 이번 주 최신 건강 리포트</h2>
      
      ${latestPosts.map(post => `
      <div class="post-card">
        <h3 class="post-title">${post.title}</h3>
        <p class="post-summary">${post.summary}</p>
        <a href="${post.url}" class="btn">전체 읽어보기 &rarr;</a>
      </div>
      `).join('')}
    </div>

    <div class="footer">
      본 메일은 바른관절 헬프센터 뉴스레터를 구독하신 분들께 발송됩니다.<br>
      © 2026 바른관절 헬프센터. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  // 4. 파일 저장
  fs.writeFileSync(OUTPUT_FILE, htmlContent, 'utf8');
  console.log(`🎉 뉴스레터가 성공적으로 생성되었습니다: ${OUTPUT_FILE}`);
}

generateNewsletter();
