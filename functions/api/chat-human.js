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
