export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const filterSender = url.searchParams.get("sender");

    // KV에서 msg_ 접두사를 가진 키 목록 조회
    const list = await env.CHAT_KV.list({ prefix: "msg_" });
    const messages = [];

    for (const key of list.keys) {
      const valStr = await env.CHAT_KV.get(key.name);
      if (valStr) {
        try {
          const parsed = JSON.parse(valStr);
          // sender 필터링이 있는 경우
          if (filterSender && parsed.sender !== filterSender) {
            continue;
          }
          messages.push(parsed);
        } catch (e) {
          // 파싱 에러 무시
        }
      }
    }

    // 시간 순 정렬
    messages.sort((a, b) => a.timestamp - b.timestamp);

    return new Response(
      JSON.stringify({ messages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
