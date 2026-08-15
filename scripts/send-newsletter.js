const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const SUBSCRIBERS_FILE = path.join(__dirname, "../src/data/subscribers.json");
const NEWSLETTER_FILE = path.join(__dirname, "../newsletter-output.html");

async function sendNewsletter() {
  console.log("🚀 뉴스레터 전송 준비 중...");

  // 1. 발송자 이메일 계정 정보 확인
  const userEmail = process.env.EMAIL_USER;
  const userPass = process.env.EMAIL_APP_PASSWORD;

  if (!userEmail || !userPass) {
    console.error("❌ 오류: .env.local 파일에 EMAIL_USER 또는 EMAIL_APP_PASSWORD가 설정되지 않았습니다.");
    return;
  }

  // 2. 파일 존재 여부 확인
  if (!fs.existsSync(NEWSLETTER_FILE) || !fs.existsSync(SUBSCRIBERS_FILE)) {
    console.error("❌ 오류: 뉴스레터 HTML 파일이나 구독자 목록 파일을 찾을 수 없습니다.");
    return;
  }

  // 3. 구독자 목록 및 뉴스레터 본문 읽어오기
  const subscribersData = fs.readFileSync(SUBSCRIBERS_FILE, "utf8");
  const subscribers = JSON.parse(subscribersData);
  const htmlContent = fs.readFileSync(NEWSLETTER_FILE, "utf8");

  if (subscribers.length === 0) {
    console.log("⚠️ 구독자가 없습니다. 전송을 취소합니다.");
    return;
  }

  // 4. 이메일 서버 (Gmail) 설정
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: userPass,
    },
  });

  // 5. 모든 구독자에게 순차 발송
  console.log(`📬 총 ${subscribers.length}명의 구독자에게 발송을 시작합니다...`);

  let successCount = 0;
  for (const subscriber of subscribers) {
    try {
      await transporter.sendMail({
        from: `"바른관절 헬프센터" <${userEmail}>`,
        to: subscriber.email,
        subject: "바른관절 헬프센터 주간 뉴스레터 💌",
        html: htmlContent,
      });
      console.log(`✅ [성공] ${subscriber.email} 전송 완료`);
      successCount++;
    } catch (error) {
      console.error(`❌ [실패] ${subscriber.email} 전송 실패:`, error.message);
    }
  }

  console.log(`🎉 전송 완료! (성공: ${successCount}건)`);
}

sendNewsletter();
