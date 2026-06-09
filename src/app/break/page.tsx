"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code, 
  Sparkles, 
  Clock, 
  Coffee, 
  HelpCircle,
  Undo
} from "lucide-react";

// 예제 코드 정의
const EXAMPLES = {
  heart: `<div class="heart">❤️</div>
<h2 class="title">바른관절 헬프센터</h2>
<p class="subtitle">모두 건강하고 아프지 마세요!</p>

<style>
.heart {
  font-size: 50px;
  animation: pulse 1.2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.title {
  color: #0d9488;
  margin: 10px 0 5px;
  font-weight: bold;
}
.subtitle {
  color: #475569;
  font-size: 14px;
  margin: 0;
}
</style>`,

  rainbow: `<h1 class="rainbow-text">Coding is Fun! 🌈</h1>
<p class="desc">글자 색상이 계속 알록달록 변해요!</p>

<style>
.rainbow-text {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #6366f1, #a855f7);
  -webkit-background-clip: text;
  color: transparent;
  animation: rainbow 4s linear infinite;
  background-size: 200% auto;
}
.desc {
  color: #64748b;
  font-size: 14px;
}
@keyframes rainbow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>`,

  button: `<div class="card">
  <h3>🎉 축하합니다!</h3>
  <p>나만의 멋진 웹 카드를 만들었어요.</p>
  <button onclick="alert('반갑습니다! 코딩의 세계에 오신 것을 환영해요 🚀')">클릭해 보세요!</button>
</div>

<style>
.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}
h3 { margin-top: 0; color: #0f172a; font-size: 18px; }
p { font-size: 13px; color: #64748b; margin-bottom: 15px; }
button {
  background: #0d9488;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}
button:hover { background: #0f766e; transform: scale(1.03); }
</style>`
};

export default function BreakPage() {
  // --- 무료 코딩 상태 관리 ---
  const [userCode, setUserCode] = useState(EXAMPLES.heart);
  const [selectedExample, setSelectedExample] = useState<"heart" | "rainbow" | "button">("heart");

  const loadExample = (key: "heart" | "rainbow" | "button") => {
    setUserCode(EXAMPLES[key]);
    setSelectedExample(key);
  };

  // --- 스트레칭 타이머 상태 관리 ---
  const [timeLeft, setTimeLeft] = useState(60); // 기본 1분(60초)
  const [timerMax, setTimerMax] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 스트레칭 동작 추천 메시지
  const getStretchingTip = () => {
    if (timerMax === 30) {
      return "목 천천히 돌리기: 눈을 감고 시계 방향으로 15초, 반시계 방향으로 15초 목을 돌려주세요.";
    }
    if (timerMax === 60) {
      return "깍지 끼고 기지개 켜기: 두 손을 깍지 끼고 하늘을 향해 팔을 뻗으며 15초 동안 유지해보세요.";
    }
    return "어깨 스트레칭: 한쪽 팔을 반대쪽으로 당기며 시선은 반대를 향해 어깨 근육을 이완시켜 주세요.";
  };

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
              oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
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
  const strokeDashoffset = 283 - (283 * timeLeft) / timerMax;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
          관절 건강을 위해 잠시 스트레칭을 즐기고, <br className="hidden sm:inline" />
          코딩을 몰라도 재미있게 따라 해볼 수 있는 **무료 코딩 놀이터**를 체험해 보세요!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* 💻 왼쪽 열: 무료 코딩 실습기 (lg:col-span-7) */}
        <section className="lg:col-span-7 flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">💻 무료 코딩 체험실</h2>
                <p className="text-xs text-slate-400">코드를 고치면 우측 화면에 즉시 나타나요!</p>
              </div>
            </div>

            {/* 예제 로드 버튼들 */}
            <div className="flex gap-1.5">
              <button
                onClick={() => loadExample("heart")}
                className={`rounded-lg px-2.5 py-1 text-2xs font-semibold transition ${
                  selectedExample === "heart" 
                    ? "bg-teal-600 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                예제 1 ❤️
              </button>
              <button
                onClick={() => loadExample("rainbow")}
                className={`rounded-lg px-2.5 py-1 text-2xs font-semibold transition ${
                  selectedExample === "rainbow" 
                    ? "bg-teal-600 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                예제 2 🌈
              </button>
              <button
                onClick={() => loadExample("button")}
                className={`rounded-lg px-2.5 py-1 text-2xs font-semibold transition ${
                  selectedExample === "button" 
                    ? "bg-teal-600 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                예제 3 🎁
              </button>
            </div>
          </div>

          {/* 에디터와 라이브뷰 분할 레이아웃 */}
          <div className="flex flex-col gap-4">
            {/* 1. 코드 에디터 입력상자 */}
            <div>
              <label htmlFor="code-editor" className="sr-only">HTML/CSS 코드 입력</label>
              <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-400 text-2xs font-mono border-b border-slate-800">
                  <span>HTML / CSS Editor</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Sparkles className="h-3 w-3" /> Live Active
                  </span>
                </div>
                <textarea
                  id="code-editor"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-48 p-4 font-mono text-xs text-slate-100 bg-slate-950 focus:outline-none resize-none leading-relaxed"
                  placeholder="여기에 HTML이나 CSS 코드를 작성하세요..."
                  spellCheck="false"
                />
              </div>
            </div>

            {/* 2. 라이브 프리뷰 (결과 창) */}
            <div className="flex flex-col">
              <span className="text-2xs font-bold text-slate-400 mb-1.5 pl-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-teal-600" /> 실시간 결과 화면
              </span>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-2 shadow-inner">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <style>
                          body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 200px;
                            background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
                            color: #1e293b;
                            text-align: center;
                          }
                        </style>
                      </head>
                      <body>
                        ${userCode}
                      </body>
                    </html>
                  `}
                  title="무료 코딩 실시간 미리보기"
                  className="w-full h-[220px] rounded-xl bg-white border border-slate-100 shadow-2xs"
                  sandbox="allow-scripts allow-modals"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-teal-50/50 p-4 border border-teal-100/30 flex gap-3 text-xs leading-relaxed text-slate-600">
              <HelpCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">💡 코딩 도전해보기!</p>
                <p className="mt-1">
                  에디터 박스 안의 글자(<code className="bg-white/70 px-1 py-0.5 rounded border text-teal-700">바른관절 헬프센터</code> 등)나 색상 코드(<code className="bg-white/70 px-1 py-0.5 rounded border text-teal-700">#0d9488</code> 등)를 지우고 원하는 글자로 직접 바꾸어 보세요! 우측 화면에 신기하게 즉시 변경됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ⏱️ 오른쪽 열: 스트레칭 타이머 (lg:col-span-5) */}
        <section className="lg:col-span-5 flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">⏱️ 스트레칭 타이머</h2>
                <p className="text-xs text-slate-400">일하는 틈틈이 스트레칭으로 관절을 보호하세요.</p>
              </div>
            </div>

            {/* 프리셋 설정 버튼 */}
            <div className="flex gap-2 mb-6">
              {[30, 60, 180].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => changeTimerPreset(seconds)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition border ${
                    timerMax === seconds
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {seconds >= 60 ? `${seconds / 60}분` : `${seconds}초`}
                </button>
              ))}
            </div>

            {/* 동그라미 타이머 그래픽 디스플레이 */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative flex items-center justify-center w-48 h-48">
                {/* SVG 원형 프로그레스 바 */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="45"
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="45"
                    className="text-teal-500 transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                {/* 내부 디지털 시간 텍스트 */}
                <div className="absolute text-center">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-2xs font-semibold text-slate-400 mt-1 uppercase">
                    {isRunning ? "Focusing" : "Paused"}
                  </div>
                </div>
              </div>
            </div>

            {/* 추천 스트레칭 행동 지침 가이드 */}
            <div className="rounded-2xl bg-amber-50/50 border border-amber-100/50 p-4 min-h-[90px] flex flex-col justify-center text-xs text-amber-800 leading-relaxed">
              <p className="font-semibold flex items-center gap-1">
                <span>🧘 Recommended Stretch:</span>
              </p>
              <p className="mt-1 text-slate-600">{getStretchingTip()}</p>
            </div>
          </div>

          {/* 제어 버튼 영역 */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleStartPause}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition shadow-md ${
                isRunning
                  ? "bg-slate-800 text-white hover:bg-slate-700 shadow-slate-800/10"
                  : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/10"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" /> 일시 정지
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> 타이머 시작
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition flex items-center justify-center"
              aria-label="타이머 재설정"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </section>
        
      </div>
    </div>
  );
}
