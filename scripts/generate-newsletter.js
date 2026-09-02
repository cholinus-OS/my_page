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
        title: (data.title || '').replace(/<[^>]+>/g, '').replace(/["']/g, '').trim(),
        summary: (data.summary || '').trim(),
        date: data.date,
        category: (data.category || '사용 설명서').trim(),
        url: `https://cholinus-exerciseismedicine.com/blog/${fileName.replace('.md', '')}`
      };
    });

  // 날짜 내림차순 정렬 후 상위 3개 반환
  return posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 3);
}

async function generateNewsletter() {
  console.log('📰 뉴스레터 생성을 시작합니다...');
  
  const latestPosts = getLatestPosts();
  console.log(`✅ 최신 글 ${latestPosts.length}개 추출 완료.`);

  let aiIntro = "안녕하세요, 소중한 구독자 여러분! 정형외과 전문의 조형준 원장입니다. 매일 우리의 삶을 지탱해 주는 소중한 관절, 잘 관리하고 계신가요? 이번 주에도 일상에서 바로 실천할 수 있는 건강한 재활 루틴과 유익한 의학 정보를 준비했습니다. 여러분의 활기찬 일상을 응원합니다!";

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
1. ${latestPosts[0]?.title || ''}
2. ${latestPosts[1]?.title || ''}

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

  // 오늘 날짜 포맷팅 (YYYY.MM.DD)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const formattedDate = `${kstDate.getFullYear()}년 ${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;

  // 인트로 문단을 <p> 태그로 변환 (네이버 메일 등에서 white-space 지원 안 해도 줄바꿈 유지)
  const introParagraphs = aiIntro
    .split(/\n+/)
    .map(p => `<p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.75; color: #334155; word-break: keep-all;">${p.trim()}</p>`)
    .join('');

  // 3. HTML 뉴스레터 템플릿 생성 (100% 인라인 스타일 및 테이블 레이아웃 적용으로 네이버/핫메일/지메일 완벽 호환)
  const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>바른관절 헬프센터 주간 뉴스레터</title>
  <style type="text/css">
    /* 모바일 반응형 및 다크모드 대응 */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 20px 16px !important; }
      .mobile-btn { width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- 전체 감싸는 외부 테이블 -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 30px 10px 40px 10px;">
    <tr>
      <td align="center" valign="top">
        <!-- 600px 중앙 컨테이너 -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <!-- 헤더 영역 -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); background-color: #0d9488; padding: 36px 24px 32px 24px; text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px;">
                      정형외과 전문의 조형준의 주간 메디컬 리포트
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 25px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3;">
                      바른관절 헬프센터 뉴스레터 💌
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <p style="margin: 0; color: #ccfbf1; font-size: 13px; font-weight: 500;">
                      발송일: ${formattedDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 본문 영역 -->
          <tr>
            <td class="mobile-padding" style="padding: 32px 28px;">

              <!-- 원장님 인사말 카드 -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 22px 20px;">
                    <div style="font-size: 14px; font-weight: 800; color: #0d9488; margin-bottom: 10px;">
                      🩺 조형준 원장의 주간 인사말
                    </div>
                    ${introParagraphs}
                  </td>
                </tr>
              </table>

              <!-- 섹션 타이틀 -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td>
                    <h2 style="margin: 0; font-size: 19px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">
                      🔥 이번 주 최신 건강 리포트
                    </h2>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">
                      평생 쓰는 관절을 지키기 위한 이번 주 핵심 가이드라인입니다.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- 게시글 리스트 -->
              ${latestPosts.map((post, idx) => `
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); overflow: hidden;">
                <tr>
                  <td style="padding: 22px 20px;">
                    <!-- 카테고리 뱃지 -->
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td style="background-color: #e0f2fe; border-radius: 6px; padding: 4px 10px;">
                          <span style="color: #0284c7; font-size: 12px; font-weight: 700; display: block; line-height: 1;">
                            ${post.category || '사용 설명서'}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- 글 제목 -->
                    <h3 style="margin: 0 0 10px 0; font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.45; word-break: keep-all;">
                      <a href="${post.url}" target="_blank" style="color: #0f172a; text-decoration: none;">
                        ${post.title}
                      </a>
                    </h3>

                    <!-- 요약문 -->
                    <p style="margin: 0 0 18px 0; font-size: 14px; color: #64748b; line-height: 1.6; word-break: keep-all;">
                      ${post.summary}
                    </p>

                    <!-- 버튼 (네이버 메일/아웃룩/지메일 완벽 지원 테이블 버튼) -->
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #0d9488; border-radius: 8px;">
                          <a href="${post.url}" target="_blank" class="mobile-btn" style="display: inline-block; padding: 10px 22px; font-size: 13px; font-weight: 700; color: #ffffff !important; text-decoration: none; border-radius: 8px; background-color: #0d9488; letter-spacing: 0.2px;">
                            전체 읽어보기 &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
              `).join('')}

              <!-- 하단 배너/안내 박스 -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; margin-top: 10px;">
                <tr>
                  <td align="center" style="padding: 18px 16px; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #475569; font-weight: 500; line-height: 1.5;">
                      💬 관절 통증이나 재활 운동에 대해 궁금한 점이 있으신가요?<br />
                      <span style="color: #0d9488; font-weight: 700;">홈페이지 우측 하단 챗봇</span>을 통해 원장님과 실시간 1:1 상담이 가능합니다.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 푸터 영역 -->
          <tr>
            <td align="center" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 26px 20px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                본 메일은 바른관절 헬프센터 뉴스레터를 신청하신 구독자분들께 발송되는 정기 건강 정보입니다.<br />
                통증이 지속되거나 급성 손상이 의심될 경우 반드시 전문의의 정확한 진단을 받으시기 바랍니다.
              </p>
              <p style="margin: 0; font-size: 12px; color: #cbd5e1;">
                © 2026 바른관절 헬프센터 (조형준 원장). All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /컨테이너 -->
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // 4. 파일 저장
  fs.writeFileSync(OUTPUT_FILE, htmlContent, 'utf8');
  console.log(`🎉 통일된 고품질 뉴스레터가 성공적으로 생성되었습니다: ${OUTPUT_FILE}`);
}

generateNewsletter();
