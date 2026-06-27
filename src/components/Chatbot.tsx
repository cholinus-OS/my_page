"use client";

import React, { useState, useEffect, useRef } from "react";
import chatData from "../../chat-data.json";

interface ChatMessage {
  sender: "user" | "bot" | "admin";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "안녕하세요! 궁금한 점을 선택하거나 직접 질문해 주세요." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHumanMode, setIsHumanMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 실시간 상담원 연결 시 2초 주기 폴링
  useEffect(() => {
    if (!isHumanMode || !isOpen) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/chat-poll");
        if (!res.ok) return;
        const data = await res.json();

        if (!isSubscribed) return;

        // 배열 데이터 파싱 지원 (배열 혹은 { messages: [] })
        const arrayData = Array.isArray(data)
          ? data
          : data && Array.isArray(data.messages)
          ? data.messages
          : [];

        if (arrayData.length > 0) {
          const adminMsgs = arrayData.filter((m: any) => m.sender === "admin");

          setMessages((prev) => {
            const existingAdminTexts = prev
              .filter((m) => m.sender === "admin")
              .map((m) => m.text);

            const newAdminMsgs = adminMsgs.filter(
              (m: any) => m.text && !existingAdminTexts.includes(m.text)
            );

            if (newAdminMsgs.length > 0) {
              return [
                ...prev,
                ...newAdminMsgs.map((m: any) => ({
                  sender: "admin" as const,
                  text: m.text,
                })),
              ];
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("상담원 메시지 폴링 실패:", err);
      }
    }, 2000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isHumanMode, isOpen]);

  const handleQuestionClick = (question: string, answer: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
    }, 400);
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInputValue("");
    setIsLoading(true);

    if (isHumanMode) {
      // 상담원 연결 모드
      try {
        const res = await fetch("/api/chat-human", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!res.ok) throw new Error("서버 전송 오류");
      } catch {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "상담원에게 메시지를 보내지 못했습니다. 다시 시도해 주세요." },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // AI 모드
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!res.ok) throw new Error("서버 응답 오류");

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.answer || "답변을 가져오지 못했습니다." },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "죄송합니다. 답변을 가져오는 중 오류가 발생했습니다." },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const connectToHuman = () => {
    setIsHumanMode(true);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "상담원을 연결하고 있습니다. 잠시만 대기해 주세요..." }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 플로팅 버튼 - 캐릭터 이미지 사용 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-blue-400/50 transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="챗봇 열기"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/chatbot-character.png" alt="챗봇 캐릭터" className="h-12 w-12 rounded-full object-cover" />
      </button>

      {/* 채팅창 */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-slate-100 shadow-2xl transition-all duration-300 md:inset-auto md:bottom-6 md:right-6 md:h-[500px] md:w-[360px] md:rounded-2xl md:border md:border-slate-200 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between bg-blue-500 px-4 py-3 text-white md:rounded-t-2xl">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chatbot-character.png" alt="챗봇 캐릭터" className="h-9 w-9 rounded-full bg-white object-cover ring-2 ring-white/30" />
            <div>
              <h3 className="font-semibold text-sm">{isHumanMode ? "실시간 상담" : "AI 상담원"}</h3>
              <p className="flex items-center gap-1 text-xs text-blue-100">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400"></span>
                온라인
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-100 transition-colors hover:text-white"
            aria-label="챗봇 닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 대화 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#b2c7d9]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender !== 'user' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/chatbot-character.png" alt="프로필" className="h-8 w-8 flex-shrink-0 rounded-full bg-white object-cover shadow-sm" />
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-sm'
                    : 'bg-[#fef01b] text-slate-900 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* 로딩 스피너 */}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/chatbot-character.png" alt="로딩" className="h-8 w-8 flex-shrink-0 rounded-full bg-white object-cover shadow-sm" />
              <div className="rounded-2xl rounded-tl-sm bg-[#fef01b] px-5 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]"></span>
                  <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:150ms]"></span>
                  <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 하단 질문 리스트 + 입력창 영역 */}
        <div className="border-t border-slate-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:rounded-b-2xl md:pb-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              {isHumanMode ? "상담원 연결 모드" : "궁금한 질문을 선택해 주세요"}
            </p>
            {isHumanMode ? (
              <button
                onClick={() => {
                  setIsHumanMode(false);
                  setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: "AI 상담원 모드로 복귀했습니다. 궁금한 점을 선택하거나 직접 질문해 주세요." }
                  ]);
                }}
                className="rounded-lg bg-blue-500 px-2 py-1 text-[11px] font-bold text-white transition-all hover:bg-blue-600 active:scale-95"
              >
                AI 상담원 연결
              </button>
            ) : (
              <button
                onClick={connectToHuman}
                className="rounded-lg bg-red-500 px-2 py-1 text-[11px] font-bold text-white transition-all hover:bg-red-600 active:scale-95"
              >
                상담원 연결
              </button>
            )}
          </div>

          {!isHumanMode && (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[90px] pr-1 mb-3" style={{ scrollbarWidth: 'thin' }}>
              {chatData.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(item.question, item.answer)}
                  className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-left text-[13px] text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-200"
                >
                  {item.question}
                </button>
              ))}
            </div>
          )}

          {/* 직접 입력 영역 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isHumanMode ? "상담원에게 메시지 보내기..." : "직접 질문을 입력하세요..."}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-400 focus:bg-white disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
              aria-label="전송"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
