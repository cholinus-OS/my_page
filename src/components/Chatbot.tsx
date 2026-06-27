"use client";

import React, { useState, useEffect, useRef } from "react";
import chatData from "../../chat-data.json";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "안녕하세요! 궁금한 점을 선택해 주세요." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = (question: string, answer: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    
    // 딜레이를 주어 실제 답변하는 것 같은 느낌 연출
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
    }, 400);
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

      {/* 채팅창 (열릴 때 부드러운 애니메이션 적용) */}
      <div
        className={`fixed bottom-0 right-0 z-50 flex h-full w-full flex-col bg-slate-100 shadow-2xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:h-[500px] sm:w-[360px] sm:rounded-2xl sm:border sm:border-slate-200 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        {/* 상단 헤더 - 캐릭터 아바타 포함 */}
        <div className="flex items-center justify-between bg-blue-500 px-4 py-3 text-white sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chatbot-character.png" alt="챗봇 캐릭터" className="h-9 w-9 rounded-full bg-white object-cover ring-2 ring-white/30" />
            <div>
              <h3 className="font-semibold text-sm">AI 상담원</h3>
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

        {/* 대화 영역 (카카오톡 스타일 배경색 적용) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#b2c7d9]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/chatbot-character.png" alt="봇" className="h-8 w-8 flex-shrink-0 rounded-full bg-white object-cover shadow-sm" />
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
          <div ref={messagesEndRef} />
        </div>

        {/* 하단 질문 리스트 영역 */}
        <div className="border-t border-slate-200 bg-white p-3 sm:rounded-b-2xl">
          <p className="mb-2 text-xs font-semibold text-slate-500">궁금한 질문을 선택해 주세요</p>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[140px] pr-1" style={{ scrollbarWidth: 'thin' }}>
            {chatData.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item.question, item.answer)}
                className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-left text-[13px] text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-200"
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
