"use client";

import React, { useState, useEffect, useRef } from "react";

interface ChatMessage {
  sender: "user" | "admin" | "bot";
  text: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 폴링 설정 (2초 주기)
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat-poll");
        if (!res.ok) return;
        const data = await res.json();

        const arrayData = Array.isArray(data)
          ? data
          : data && Array.isArray(data.messages)
          ? data.messages
          : [];

        if (arrayData.length > 0) {
          const formatted = arrayData.map((m: any) => ({
            sender: m.sender,
            text: m.text,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("폴링 오류:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin1234") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/chat-human", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sender: "admin" }),
      });

      if (!res.ok) throw new Error("전송 실패");

      // 즉시 보낸 메시지를 UI에 반영
      setMessages((prev) => [...prev, { sender: "admin", text: trimmed }]);
      setInputValue("");
    } catch {
      alert("답장 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-center text-xl font-bold text-slate-800">관리자 로그인</h2>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-600">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[600px] max-w-2xl flex-col border border-slate-200 bg-slate-100 shadow-2xl md:my-10 md:rounded-2xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-blue-500 px-6 py-4 text-white md:rounded-t-2xl">
        <h2 className="text-lg font-bold">실시간 상담 관리자</h2>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">실시간 업데이트 중</span>
      </div>

      {/* 대화 영역 (방문자 챗봇과 동일한 카카오톡 배경 스타일) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#b2c7d9]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "admin" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/chatbot-character.png" alt="관리자" className="h-8 w-8 flex-shrink-0 rounded-full bg-white object-cover shadow-sm" />
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-tr-sm"
                  : "bg-[#fef01b] text-slate-900 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 답장 입력 영역 */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-4 md:rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="답장을 입력하세요..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
