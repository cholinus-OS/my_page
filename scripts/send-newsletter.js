const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const NEWSLETTER_FILE = path.join(__dirname, "../newsletter-output.html");

async function sendNewsletter() {
  console.log("🚀 뉴스레터 전송 준비 중...");

  // 1. 한국 시간(KST) 기준 화요일 검증 안전장치 (Tuesday Guard)
  const now = new Date();
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const dayOfWeek = kstTime.getUTCDay(); // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토
  const isTuesday = dayOfWeek === 2;
  const forceSend = process.env.FORCE_SEND === "true";

  if (!isTuesday && !forceSend) {
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    console.log(`🛑 [발송 차단] 오늘은 ${dayNames[dayOfWeek]}입니다.`);
    console.log(`📌 주간 뉴스레터는 매주 [화요일]에만 정기 발송되도록 안전 잠금장치가 활성화되어 있습니다.`);
    console.log(`   (테스트나 수동 발송이 필요한 경우 FORCE_SEND=true 설정 필요)`);
    process.exit(0);
  }

  const userEmail = process.env.EMAIL_USER;
  const userPass = process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.replace(/\s+/g, '') : undefined;

  if (!userEmail || !userPass) {
    console.error("❌ 오류: EMAIL_USER 또는 EMAIL_APP_PASSWORD가 설정되지 않았습니다.");
    process.exit(1);
  }

  // 2. 파일 존재 여부 확인
  if (!fs.existsSync(NEWSLETTER_FILE)) {
    console.error("❌ 오류: 뉴스레터 HTML 파일을 찾을 수 없습니다.");
    process.exit(1);
  }

  // 3. 구독자 목록 및 뉴스레터 본문 읽어오기
  const secret = process.env.NEWSLETTER_SECRET_KEY || "cholinus_newsletter_secret_2026";
  let subscribers = [];
  try {
    const res = await fetch(`https://cholinus-exerciseismedicine.com/api/subscribe?secret=${secret}`);
    if (res.ok) {
      subscribers = await res.json();
    } else {
      console.error("⚠️ 서버에서 구독자 목록을 가져오는데 실패했습니다.", res.statusText);
      process.exit(1);
    }
  } catch (err) {
    console.error("⚠️ 실서버 구독자 조회 중 오류 발생:", err.message);
    process.exit(1);
  }

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
  
  if (successCount === 0 && subscribers.length > 0) {
    console.error("❌ 모든 이메일 발송이 실패했습니다.");
    process.exit(1);
  }
}

sendNewsletter().catch((err) => {
  console.error("❌ 치명적인 오류 발생:", err);
  process.exit(1);
});
