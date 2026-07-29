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

  // 실시간 상담원 연결 폴링 제거 (정적 배포 404 에러 방지)

  const handleQuestionClick = (question: string, answer: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
    }, 400);
  };

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInputValue("");
    setIsLoading(true);

    if (isHumanMode) {
      // 상담원 연결 모드 시뮬레이션
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "현재 상담원이 부재중입니다. 문의사항을 cholinus@naver.com 이메일로 남겨주시면 영업일 기준 24시간 내에 신속히 회신해 드리겠습니다." }
        ]);
        setIsLoading(false);
      }, 1000);
    } else {
      // AI 모드 시뮬레이션 (클라이언트 키워드 분석 매칭)
      setTimeout(() => {
        const query = trimmed.toLowerCase();
        let answer = "안녕하세요! 저는 바른관절 헬프센터의 안내 봇입니다. 현재 질문하신 단어에 매칭되는 정보를 찾지 못했습니다. 아래의 자주 묻는 질문 버튼을 누르시거나, 메인 화면의 '1분 스마트 자가진단 테스트'를 통해 관절 통증의 의심 질환을 확인해 보세요!";
        
        if (query.includes("블로그") || query.includes("소개") || query.includes("누구")) {
          answer = "바른관절 헬프센터는 정형외과 질환 및 과학적인 물리치료 재활 운동법을 기획하여 매일 제공해 드리는 정보 공유 플랫폼입니다.";
        } else if (query.includes("업데이트") || query.includes("주기") || query.includes("언제")) {
          answer = "새로운 건강 정보 및 재활 운동 팁이 주기적으로 홈페이지에 자동으로 반영되어 업데이트됩니다.";
        } else if (query.includes("정보") || query.includes("제공") || query.includes("무슨")) {
          answer = "30가지 주요 관절 질환 정밀 사전 및 단계별 예방 홈트레이닝 재활 스트레칭 가이드를 제공합니다.";
        } else if (query.includes("광고") || query.includes("문의") || query.includes("이메일") || query.includes("연락")) {
          answer = "모든 제휴 및 문의 사항은 공식 이메일 cholinus@naver.com으로 보내주시면 신속하게 답변해 드립니다.";
        }
        
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: answer }
        ]);
        setIsLoading(false);
      }, 800);
    }
  };

  const connectToHuman = () => {
    setIsHumanMode(true);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "실시간 상담원을 연결하고 있습니다. 잠시만 대기해 주세요..." }
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "안녕하세요! 실시간 상담원 연결이 시도되었습니다. 현재 상담원 업무가 종료되었거나 부재 중이므로, 상세 내용이나 피드백은 cholinus@naver.com 이메일로 보내주시면 감사하겠습니다." }
      ]);
    }, 1500);
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
