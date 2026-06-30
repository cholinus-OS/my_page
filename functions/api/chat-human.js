export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { message, sender } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "메시지가 유효하지 않습니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validSender = sender || "user";
    const timestamp = Date.now();
    const key = `msg_${timestamp}`;
    const value = JSON.stringify({
      message,
      text: message, // Chatbot.tsx와의 하위 호환성을 위해 추가
      sender: validSender,
      timestamp,
    });

    await env.CHAT_KV.put(key, value);

    // 텔레그램 알림 발송 (sender가 admin이 아닌 경우만 발송)
    if (validSender !== "admin") {
      try {
        const botToken = env.TELEGRAM_BOT_TOKEN || "8973696742:AAH3bqFRoCl1W6nucdOsxpwGmaS7OIwNCrA";
        const chatId = env.TELEGRAM_CHAT_ID || "8798580486";

        let telegramText = "";
        if (validSender === "system") {
          telegramText = `[🏥 조형준정형외과 챗봇]\n📢 신규 상담원 연결 요청이 도착했습니다!\n\n관리자 페이지(/admin)로 접속하여 환자분의 질문에 답변해 주세요.`;
        } else {
          telegramText = `[🏥 조형준정형외과 챗봇]\n👤 환자 메시지: "${message}"`;
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramText,
          }),
        });
      } catch (tgErr) {
        console.error("텔레그램 알림 발송 실패:", tgErr.message);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
