"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee,
  Sparkles
} from "lucide-react";

interface LottoGame {
  mainNumbers: number[];
  bonusNumber: number;
}

export default function BreakPage() {
  const [activeTab, setActiveTab] = useState<"timer" | "lotto" | "roulette">("timer");

  // --- 1. 스트레칭 타이머 상태 관리 ---
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 타이머 원형 진행률 계산 (둘레: 565)
  const strokeDashoffset = 565 - (565 * timeLeft) / timerMax;

  // --- 2. 로또 번호 생성기 상태 관리 ---
  const [lottoGames, setLottoGames] = useState<LottoGame[]>([]);

  const getBallColor = (number: number) => {
    if (number <= 10) return "#fbc531"; // 노랑
    if (number <= 20) return "#00a8ff"; // 파랑
    if (number <= 30) return "#e84118"; // 빨강
    if (number <= 40) return "#7f8fa6"; // 회색
    return "#4cd137"; // 녹색
  };

  const generateSingleGame = (): LottoGame => {
    const numbers: number[] = [];
    while (numbers.length < 7) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    const mainNumbers = numbers.slice(0, 6).sort((a, b) => a - b);
    const bonusNumber = numbers[6];
    return { mainNumbers, bonusNumber };
  };

  const generateLottoGames = () => {
    const newGames = [];
    for (let i = 0; i < 5; i++) {
      newGames.push(generateSingleGame());
    }
    setLottoGames(newGames);
  };

  useEffect(() => {
    if (activeTab === "lotto" && lottoGames.length === 0) {
      generateLottoGames();
    }
  }, [activeTab]);

  // --- 3. 제비뽑기 (룰렛 게임) 상태 관리 ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [namesText, setNamesText] = useState("김철수, 이영희, 박지민, 최동훈");
  const [winner, setWinner] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F06292", "#AED581", "#FFD54F"];

  const initRoulette = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const names = namesText.split(",").map(name => name.trim()).filter(name => name !== "");
    if (names.length < 2) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const arcCount = names.length;
    const arcAngle = (Math.PI * 2) / arcCount;

    for (let i = 0; i < arcCount; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 150, i * arcAngle, (i + 1) * arcAngle);
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(i * arcAngle + arcAngle / 2);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(names[i], 130, 5);
      ctx.restore();
    }

    rotationRef.current = 0;
    canvas.style.transition = "none";
    canvas.style.transform = "rotate(0deg)";
    setWinner("");
    setIsSpinning(false);
  };

  const spinRoulette = () => {
    const canvas = canvasRef.current;
    const names = namesText.split(",").map(name => name.trim()).filter(name => name !== "");
    if (isSpinning || names.length < 2 || !canvas) return;

    setIsSpinning(true);
    setWinner("회전 중...");

    const randomSpinAngle = Math.floor(Math.random() * 360);
    const totalSpinAngle = 3600 + randomSpinAngle;
    rotationRef.current += totalSpinAngle;

    canvas.style.transition = "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)";
    canvas.style.transform = `rotate(${rotationRef.current}deg)`;

    setTimeout(() => {
      const normalizedRotation = rotationRef.current % 360;
      let winningAngle = (270 - normalizedRotation) % 360;
      if (winningAngle < 0) winningAngle += 360;

      const arcAngleDegree = 360 / names.length;
      const winnerIndex = Math.floor(winningAngle / arcAngleDegree);

      setWinner(`🎉 당첨자: ${names[winnerIndex]} 🎉`);
      setIsSpinning(false);
    }, 3000);
  };

  useEffect(() => {
    if (activeTab === "roulette") {
      const timer = setTimeout(() => {
        initRoulette();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {/* 🌿 헤더 영역 */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-600 border border-teal-100">
          <Coffee className="h-3.5 w-3.5" />
          힐링 라운지
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          잠시 쉬어가기
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500">
          컴퓨터 앞을 벗어나 잠시 쉬어가세요. <br className="hidden sm:inline" />
          스트레칭 타이머와 재미 삼아 해보는 로또 번호 생성기, 제비뽑기를 즐겨보세요!
        </p>
      </div>

      {/* 탭 버튼 네비게이션 */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-slate-200 pb-5">
        <button
          onClick={() => setActiveTab("timer")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition ${
            activeTab === "timer"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          스트레칭 타이머
        </button>
        <button
          onClick={() => setActiveTab("lotto")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition ${
            activeTab === "lotto"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          🎰 로또 생성기
        </button>
        <button
          onClick={() => setActiveTab("roulette")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition ${
            activeTab === "roulette"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          🎯 제비뽑기 (룰렛)
        </button>
      </div>

      {/* ⏱️ 탭 1: 스트레칭 타이머 */}
      {activeTab === "timer" && (
        <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-8 justify-center">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">스트레칭 타이머</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[30, 60, 180, 300, 600].map((seconds) => (
              <button
                key={seconds}
                onClick={() => changeTimerPreset(seconds)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition border ${
                  timerMax === seconds
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {seconds >= 60 ? `${seconds / 60}분` : `${seconds}초`}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center my-8">
            <div className="relative flex items-center justify-center w-72 h-72">
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
      )}

      {/* 🎰 탭 2: 로또 번호 생성기 */}
      {activeTab === "lotto" && (
        <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6 justify-center">
            <h2 className="text-xl font-bold text-slate-900">🎰 프리미엄 로또 번호 생성기</h2>
          </div>
          
          <div className="flex justify-center mb-8">
            <button
              onClick={generateLottoGames}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md shadow-teal-600/10 flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> 5게임 자동 생성
            </button>
          </div>

          <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
            {lottoGames.map((game, i) => {
              const labels = ["A", "B", "C", "D", "E"];
              return (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-100/60 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="font-bold text-slate-400 text-sm w-6 text-center">
                    {labels[i]}
                  </div>
                  
                  <div className="flex gap-1.5 flex-grow justify-center">
                    {game.mainNumbers.map((num) => (
                      <div
                        key={num}
                        style={{ backgroundColor: getBallColor(num) }}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-inner"
                      >
                        {num}
                      </div>
                    ))}
                    
                    <div className="font-bold text-slate-400 text-base sm:text-lg mx-0.5 flex items-center">+</div>
                    
                    <div
                      style={{ backgroundColor: getBallColor(game.bonusNumber) }}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-inner"
                    >
                      {game.bonusNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 🎯 탭 3: 제비뽑기 (룰렛 게임) */}
      {activeTab === "roulette" && (
        <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6 justify-center">
            <h2 className="text-xl font-bold text-slate-900">🎯 누가 결제할까? 룰렛 게임</h2>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label htmlFor="names-input" className="block text-xs font-semibold text-slate-500 mb-1.5 pl-1">
                이름을 쉼표(,)로 구분해 입력
              </label>
              <div className="flex gap-2">
                <input
                  id="names-input"
                  type="text"
                  value={namesText}
                  onChange={(e) => setNamesText(e.target.value)}
                  placeholder="예: 김철수, 이영희, 박지민"
                  className="flex-grow rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-50"
                />
                <button
                  onClick={initRoulette}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition whitespace-nowrap"
                >
                  룰렛 생성
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center my-6">
            <div className="relative w-[300px] h-[300px]">
              <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 z-10 drop-shadow-sm" />
              <canvas
                ref={canvasRef}
                width="300"
                height="300"
                className="rounded-full shadow-md"
              />
            </div>
          </div>

          {winner && (
            <div className="text-center text-lg font-black text-emerald-600 mb-6 animate-bounce">
              {winner}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={spinRoulette}
              disabled={isSpinning}
              className={`w-full max-w-xs flex items-center justify-center gap-1.5 rounded-2xl py-4 text-base font-bold transition shadow-md ${
                isSpinning
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/10"
              }`}
            >
              🎯 룰렛 돌리기
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
