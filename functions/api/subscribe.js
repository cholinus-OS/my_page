export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "유효한 이메일 주소를 입력해주세요." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // KV에서 기존 구독자 목록 가져오기
    const existingStr = await env.CHAT_KV.get("newsletter_subscribers");
    let subscribers = [];
    if (existingStr) {
      try {
        subscribers = JSON.parse(existingStr);
      } catch (e) {
        subscribers = [];
      }
    }

    // 중복 체크
    if (subscribers.some((sub) => sub.email === email)) {
      return new Response(JSON.stringify({ error: "이미 구독 중인 이메일입니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 새 구독자 추가
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    // KV에 저장
    await env.CHAT_KV.put("newsletter_subscribers", JSON.stringify(subscribers));

    return new Response(JSON.stringify({ success: true, message: "구독 완료!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Subscription Error:", err);
    return new Response(JSON.stringify({ error: "서버 오류가 발생했습니다." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  // 환경변수 NEWSLETTER_SECRET_KEY 또는 기본값으로 인증
  const validSecret = env.NEWSLETTER_SECRET_KEY || "cholinus_newsletter_secret_2026";

  if (secret !== validSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const existingStr = await env.CHAT_KV.get("newsletter_subscribers");
    const subscribers = existingStr ? JSON.parse(existingStr) : [];

    return new Response(JSON.stringify(subscribers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch subscribers" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
