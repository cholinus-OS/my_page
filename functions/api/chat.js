function stripMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/---/g, "")
    .trim();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "메시지가 비어 있습니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ① search-index.json 가져오기
    const origin = new URL(request.url).origin;
    let searchIndex = [];
    try {
      const indexRes = await fetch(origin + "/data/search-index.json");
      if (indexRes.ok) {
        searchIndex = await indexRes.json();
      }
    } catch (e) {
      // 인덱스 로드 실패 시 빈 배열로 진행
    }

    // ② 질문을 단어로 분리하여 키워드 매칭
    const keywords = message
      .replace(/[?.,!~\s]+/g, " ")
      .split(" ")
      .filter((w) => w.length >= 2);

    const scored = searchIndex.map((item) => {
      const searchText = [item.title, item.summary, item.content]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (searchText.includes(kw.toLowerCase())) {
          score++;
        }
      }
      return { ...item, score };
    });

    // ③ 매칭 점수 상위 3개 선택
    scored.sort((a, b) => b.score - a.score);
    const top3 = scored.slice(0, 3).filter((item) => item.score > 0);

    const blogDataText =
      top3.length > 0
        ? top3
            .map((item, i) => `${i + 1}. ${item.title}: ${item.summary}`)
            .join("\n")
        : "관련 데이터 없음";

    // ④ 시스템 프롬프트 조립
    const systemPrompt = `You are an AI assistant for a Korean local information blog.
Answer ONLY in Korean. Keep answers to 2-3 sentences maximum.
Do NOT use any markdown symbols (**, *, #, -). Plain text only.
Base your answer ONLY on the following blog data. If not relevant, reply: 해당 내용은 블로그에서 확인이 어렵습니다. 다른 질문을 해주세요.

[블로그 데이터]
${blogDataText}`;

    // ⑤ Workers AI 호출
    const response = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct-fast",
      {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 150,
      }
    );

    // ⑥ 응답에서 마크다운 기호 제거
    const cleanAnswer = stripMarkdown(response.response || "");

    return new Response(
      JSON.stringify({ answer: cleanAnswer }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "AI 응답 중 오류가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
