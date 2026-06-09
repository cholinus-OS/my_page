"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee 
} from "lucide-react";

export default function BreakPage() {
  // --- 스트레칭 타이머 상태 관리 ---
  const [timeLeft, setTimeLeft] = useState(60); // 기본 1분(60초)
  const [timerMax, setTimerMax] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            // 소리 알림 (브라우저 지원 시)
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioCtx.createOscillator();
              oscillator.type = "sine";
              oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 음
              oscillator.connect(audioCtx.destination);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.3);
            } catch (e) {
              console.log("Audio notify failed:", e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(timerMax);
  };

  const changeTimerPreset = (seconds: number) => {
    setIsRunning(false);
    setTimerMax(seconds);
    setTimeLeft(seconds);
  };

  // 시간 형식 변환 (분:초)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 타이머 원형 진행률 계산
  // 반지름 r=90 일 때 둘레는 2 * pi * 90 = 565.48 -> 565
  const strokeDashoffset = 565 - (565 * timeLeft) / timerMax;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {/* 🌿 헤더 영역 */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-600 border border-teal-100">
          <Coffee className="h-3.5 w-3.5" />
          힐링 라운지
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          잠시 쉬어가기
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
          컴퓨터 앞을 벗어나 잠시 눈을 식히고, <br className="hidden sm:inline" />
          타이머에 맞춰 몸과 마음을 이완하는 시간을 가져보세요.
        </p>
      </div>

      {/* ⏱️ 스트레칭 타이머 카드 */}
      <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-8 justify-center">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">스트레칭 타이머</h2>
        </div>

        {/* 프리셋 설정 버튼 */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[30, 60, 180, 300, 600].map((seconds) => (
            <button
              key={seconds}
              onClick={() => changeTimerPreset(seconds)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition border ${
                timerMax === seconds
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {seconds >= 60 ? `${seconds / 60}분` : `${seconds}초`}
            </button>
          ))}
        </div>

        {/* 동그라미 타이머 그래픽 디스플레이 (크기 키움: w-72 h-72) */}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="relative flex items-center justify-center w-72 h-72">
            {/* SVG 원형 프로그레스 바 */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="90"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="144"
                cy="144"
                r="90"
                className="text-teal-500 transition-all duration-1000"
                strokeWidth="10"
                strokeDasharray="565"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            {/* 내부 디지털 시간 텍스트 */}
            <div className="absolute text-center">
              <div className="text-5xl font-black text-slate-900 tracking-tight">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">
                {isRunning ? "Focusing" : "Paused"}
              </div>
            </div>
          </div>
        </div>

        {/* 제어 버튼 영역 */}
        <div className="flex gap-4 mt-8 max-w-md mx-auto w-full">
          <button
            onClick={handleStartPause}
            className={`flex-grow flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition shadow-md ${
              isRunning
                ? "bg-slate-800 text-white hover:bg-slate-700 shadow-slate-800/10"
                : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/10"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" /> 일시 정지
              </>
            ) : (
              <>
                <Play className="h-5 w-5" /> 타이머 시작
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl transition flex items-center justify-center"
            aria-label="타이머 재설정"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
