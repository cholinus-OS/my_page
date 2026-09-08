const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const NEWSLETTER_FILE = path.join(__dirname, "../newsletter-output.html");

// .env.local 로컬 환경변수 자동 로드
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

// 구독자 목록 조회 (1순위: Cloudflare Direct KV API, 2순위: 브라우저 헤더 웹사이트 API)
async function getSubscribersList() {
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfToken = process.env.CLOUDFLARE_API_TOKEN;
  const kvNamespaceId = "7ee49834412c41b8938b3b566f17cc90"; // wrangler.toml CHAT_KV

  // 1순위: Cloudflare Direct KV API (깃허브 액션 및 CI 환경에서 WAF 차단 완벽 우회)
  if (cfAccountId && cfToken) {
    try {
      console.log("📡 Cloudflare Direct KV API를 통해 구독자 조회를 시도합니다...");
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/storage/kv/namespaces/${kvNamespaceId}/values/newsletter_subscribers`,
        {
          headers: {
            Authorization: `Bearer ${cfToken}`,
          },
        }
      );
      if (cfRes.ok) {
        const data = await cfRes.json();
        console.log(`✅ Cloudflare Direct KV 조회 성공 (${data.length}명)`);
        return data;
      } else {
        console.warn(`⚠️ Cloudflare Direct KV 응답 (${cfRes.status}): ${cfRes.statusText}`);
      }
    } catch (e) {
      console.warn("⚠️ Cloudflare Direct KV 통신 에러:", e.message);
    }
  }

  // 2순위: 공식 웹사이트 엔드포인트 조회 (브라우저 User-Agent 및 Secret Header 탑재)
  const secret = (process.env.NEWSLETTER_SECRET_KEY && process.env.NEWSLETTER_SECRET_KEY.trim()) || "cholinus_newsletter_secret_2026";
  try {
    console.log("🌐 웹사이트 API 엔드포인트를 통해 구독자 조회를 시도합니다...");
    const siteRes = await fetch(
      `https://cholinus-exerciseismedicine.com/api/subscribe?secret=${encodeURIComponent(secret)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
          "x-newsletter-secret": secret,
          "Referer": "https://cholinus-exerciseismedicine.com/",
        },
      }
    );
    if (siteRes.ok) {
      const data = await siteRes.json();
      console.log(`✅ 웹사이트 API 조회 성공 (${data.length}명)`);
      return data;
    } else {
      const errText = await siteRes.text().catch(() => "");
      console.error(`⚠️ 웹사이트 API 조회 실패 (${siteRes.status} ${siteRes.statusText}): ${errText.slice(0, 100)}`);
    }
  } catch (err) {
    console.error("⚠️ 웹사이트 API 통신 에러:", err.message);
  }

  return [];
}

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

  // 2. 파일 존재 여부 확인 및 본문 읽기
  if (!fs.existsSync(NEWSLETTER_FILE)) {
    console.error("❌ 오류: 뉴스레터 HTML 파일을 찾을 수 없습니다.");
    process.exit(1);
  }
  const htmlContent = fs.readFileSync(NEWSLETTER_FILE, "utf8");

  // 3. 구독자 목록 가져오기
  const subscribers = await getSubscribersList();

  if (subscribers.length === 0) {
    console.error("❌ 오류: 구독자 목록을 가져오지 못했거나 구독자가 0명입니다.");
    process.exit(1);
  }

  // 4. 이메일 서버 (Gmail) 설정
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: userPass,
    },
  });

  // 5. 모든 구독자에게 순차 발송 (안전한 전송을 위해 500ms 간격 딜레이)
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
      await new Promise((resolve) => setTimeout(resolve, 500));
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
