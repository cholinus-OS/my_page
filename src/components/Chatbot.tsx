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
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="챗봇 열기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
      </button>

      {/* 채팅창 (열릴 때 부드러운 애니메이션 적용) */}
      <div
        className={`fixed bottom-0 right-0 z-50 flex h-full w-full flex-col bg-slate-100 shadow-2xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:h-[500px] sm:w-[360px] sm:rounded-2xl sm:border sm:border-slate-200 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between bg-blue-500 px-4 py-3 text-white sm:rounded-t-2xl">
          <div>
            <h3 className="font-semibold text-sm">AI 상담원</h3>
            <p className="text-xs text-blue-100">온라인</p>
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
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm leading-relaxed ${
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
