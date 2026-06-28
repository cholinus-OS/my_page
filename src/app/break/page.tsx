"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee,
  Sparkles,
  Gamepad2
} from "lucide-react";

interface LottoGame {
  mainNumbers: number[];
  bonusNumber: number;
}

// --- 구글 애드센스 광고 박스 컴포넌트 ---
function BreakPageAd({ activeTab }: { activeTab: string }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error("Google AdSense load error:", e);
      }
    }
  }, [activeTab]);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-slate-50 p-4 border border-slate-100 flex flex-col items-center justify-center min-h-[100px] w-full">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ADVERTISEMENT</span>
      <div className="w-full flex justify-center" style={{ minHeight: "90px" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "90px" }}
          data-ad-client="ca-pub-6115967537685539"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export default function BreakPage() {
  const [activeTab, setActiveTab] = useState<"timer" | "lotto" | "roulette" | "tetris" | "converter" | "saju">("timer");

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

  // --- 4. 테트리스 상태 관리 ---
  const tetrisCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisLevel, setTetrisLevel] = useState(1);
  const [tetrisLines, setTetrisLines] = useState(0);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);
  const [tetrisPaused, setTetrisPaused] = useState(false);
  const [tetrisStarted, setTetrisStarted] = useState(false);

  const gameStateRef = useRef({
    board: Array.from({ length: 20 }, () => Array(10).fill(0)),
    piece: null as any,
    nextPiece: null as any,
    score: 0,
    level: 1,
    lines: 0,
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0,
    isPaused: false,
    isGameOver: false,
    isStarted: false,
  });

  const TETRIS_COLORS = [
    null, "#00FFFF", "#0000FF", "#FFA500", "#FFFF00", "#00FF00", "#800080", "#FF0000"
  ];
  
  const TETRIS_SHAPES = [
    [],
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
    [[2,0,0], [2,2,2], [0,0,0]], // J
    [[0,0,3], [3,3,3], [0,0,0]], // L
    [[4,4], [4,4]], // O
    [[0,5,5], [5,5,0], [0,0,0]], // S
    [[0,6,0], [6,6,6], [0,0,0]], // T
    [[7,7,0], [0,7,7], [0,0,0]]  // Z
  ];

  const createTetrisPiece = () => {
    const typeId = Math.floor(Math.random() * 7) + 1;
    return {
      matrix: JSON.parse(JSON.stringify(TETRIS_SHAPES[typeId])),
      x: Math.floor(10 / 2) - Math.floor(TETRIS_SHAPES[typeId][0].length / 2),
      y: 0,
      type: typeId
    };
  };

  const collideTetris = (board: number[][], piece: any) => {
    const m = piece.matrix;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
           (board[y + piece.y] && board[y + piece.y][x + piece.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  const drawTetris = () => {
    const canvas = tetrisCanvasRef.current;
    const nextCanvas = nextCanvasRef.current;
    if (!canvas || !nextCanvas) return;

    const ctx = canvas.getContext("2d");
    const nextCtx = nextCanvas.getContext("2d");
    if (!ctx || !nextCtx) return;

    const state = gameStateRef.current;

    // 메인 보드 채우기
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(30, 30);

    // 고정된 보드 그리기
    state.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = TETRIS_COLORS[value] as string;
          ctx.fillRect(x, y, 1, 1);
          ctx.lineWidth = 0.05;
          ctx.strokeStyle = "#000";
          ctx.strokeRect(x, y, 1, 1);
        }
      });
    });

    // 움직이는 블록 그리기
    if (state.piece) {
      // 고스트 피스(낙하 지점 예측)
      const ghost = { matrix: state.piece.matrix, x: state.piece.x, y: state.piece.y };
      while (!collideTetris(state.board, ghost)) {
        ghost.y++;
      }
      ghost.y--;

      ghost.matrix.forEach((row: number[], y: number) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.fillRect(x + ghost.x, y + ghost.y, 1, 1);
            ctx.lineWidth = 0.05;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.strokeRect(x + ghost.x, y + ghost.y, 1, 1);
          }
        });
      });

      // 실물 피스
      state.piece.matrix.forEach((row: number[], y: number) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = TETRIS_COLORS[value] as string;
            ctx.fillRect(x + state.piece.x, y + state.piece.y, 1, 1);
            ctx.lineWidth = 0.05;
            ctx.strokeStyle = "#000";
            ctx.strokeRect(x + state.piece.x, y + state.piece.y, 1, 1);
          }
        });
      });
    }

    ctx.restore();

    // 다음 블록 미리보기 캔버스 그리기
    nextCtx.fillStyle = "#333";
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (state.nextPiece) {
      const offsetX = (4 - state.nextPiece.matrix[0].length) / 2;
      const offsetY = (4 - state.nextPiece.matrix.length) / 2;
      nextCtx.save();
      nextCtx.scale(30, 30);

      state.nextPiece.matrix.forEach((row: number[], y: number) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            nextCtx.fillStyle = TETRIS_COLORS[value] as string;
            nextCtx.fillRect(x + offsetX, y + offsetY, 1, 1);
            nextCtx.lineWidth = 0.05;
            nextCtx.strokeStyle = "#000";
            nextCtx.strokeRect(x + offsetX, y + offsetY, 1, 1);
          }
        });
      });

      nextCtx.restore();
    }
  };

  const animationIdRef = useRef<number | null>(null);

  const updateTetris = (time = 0) => {
    const state = gameStateRef.current;
    if (state.isPaused || state.isGameOver || !state.isStarted) return;

    const deltaTime = time - state.lastTime;
    state.lastTime = time;
    state.dropCounter += deltaTime;

    if (state.dropCounter > state.dropInterval) {
      state.piece.y++;
      if (collideTetris(state.board, state.piece)) {
        state.piece.y--;
        // 보드에 병합
        state.piece.matrix.forEach((row: number[], y: number) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              state.board[y + state.piece.y][x + state.piece.x] = value;
            }
          });
        });
        
        // 새 조각 생성
        if (!state.nextPiece) state.nextPiece = createTetrisPiece();
        state.piece = state.nextPiece;
        state.nextPiece = createTetrisPiece();

        // 줄 소거
        let rowCount = 0;
        outer: for (let y = state.board.length - 1; y >= 0; --y) {
          for (let x = 0; x < state.board[y].length; ++x) {
            if (state.board[y][x] === 0) continue outer;
          }
          const row = state.board.splice(y, 1)[0].fill(0);
          state.board.unshift(row);
          ++y;
          rowCount++;
        }

        if (rowCount > 0) {
          const lineScores = [0, 100, 300, 500, 800];
          state.score += lineScores[rowCount] * state.level;
          state.lines += rowCount;
          state.level = Math.floor(state.lines / 10) + 1;
          state.dropInterval = Math.max(100, 1000 - (state.level - 1) * 100);
          
          setTetrisScore(state.score);
          setTetrisLines(state.lines);
          setTetrisLevel(state.level);
        }

        if (collideTetris(state.board, state.piece)) {
          state.isGameOver = true;
          setTetrisGameOver(true);
        }
      }
      state.dropCounter = 0;
    }

    drawTetris();
    animationIdRef.current = requestAnimationFrame(updateTetris);
  };

  const startTetris = () => {
    const state = gameStateRef.current;
    state.board = Array.from({ length: 20 }, () => Array(10).fill(0));
    state.score = 0;
    state.level = 1;
    state.lines = 0;
    state.dropInterval = 1000;
    state.dropCounter = 0;
    state.isGameOver = false;
    state.isPaused = false;
    state.isStarted = true;

    setTetrisScore(0);
    setTetrisLevel(1);
    setTetrisLines(0);
    setTetrisGameOver(false);
    setTetrisPaused(false);
    setTetrisStarted(true);

    state.nextPiece = createTetrisPiece();
    state.piece = state.nextPiece;
    state.nextPiece = createTetrisPiece();

    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    state.lastTime = performance.now();
    updateTetris(state.lastTime);
  };

  const togglePauseTetris = () => {
    const state = gameStateRef.current;
    if (state.isGameOver || !state.isStarted) return;

    state.isPaused = !state.isPaused;
    setTetrisPaused(state.isPaused);

    if (!state.isPaused) {
      state.lastTime = performance.now();
      updateTetris(state.lastTime);
    } else {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (activeTab !== "tetris" || !state.isStarted || state.isPaused || state.isGameOver) return;

      let keyHandled = false;

      switch (e.keyCode) {
        case 37: // Left
          state.piece.x--;
          if (collideTetris(state.board, state.piece)) {
            state.piece.x++;
          }
          keyHandled = true;
          break;
        case 39: // Right
          state.piece.x++;
          if (collideTetris(state.board, state.piece)) {
            state.piece.x--;
          }
          keyHandled = true;
          break;
        case 40: // Down (Soft drop)
          state.piece.y++;
          if (collideTetris(state.board, state.piece)) {
            state.piece.y--;
          }
          state.dropCounter = 0;
          keyHandled = true;
          break;
        case 38: // Up (Rotate)
          const pos = state.piece.x;
          let offset = 1;
          for (let y = 0; y < state.piece.matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [state.piece.matrix[x][y], state.piece.matrix[y][x]] = [state.piece.matrix[y][x], state.piece.matrix[x][y]];
            }
          }
          state.piece.matrix.forEach((row: number[]) => row.reverse());

          while (collideTetris(state.board, state.piece)) {
            state.piece.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > state.piece.matrix[0].length) {
              // undo
              state.piece.matrix.forEach((row: number[]) => row.reverse());
              for (let y = 0; y < state.piece.matrix.length; ++y) {
                for (let x = 0; x < y; ++x) {
                  [state.piece.matrix[x][y], state.piece.matrix[y][x]] = [state.piece.matrix[y][x], state.piece.matrix[x][y]];
                }
              }
              state.piece.x = pos;
              break;
            }
          }
          keyHandled = true;
          break;
        case 32: // Space (Hard drop)
          while (!collideTetris(state.board, state.piece)) {
            state.piece.y++;
          }
          state.piece.y--;
          
          state.piece.matrix.forEach((row: number[], y: number) => {
            row.forEach((value, x) => {
              if (value !== 0) {
                state.board[y + state.piece.y][x + state.piece.x] = value;
              }
            });
          });
          
          if (!state.nextPiece) state.nextPiece = createTetrisPiece();
          state.piece = state.nextPiece;
          state.nextPiece = createTetrisPiece();

          let rowCount = 0;
          outer: for (let y = state.board.length - 1; y >= 0; --y) {
            for (let x = 0; x < state.board[y].length; ++x) {
              if (state.board[y][x] === 0) continue outer;
            }
            const row = state.board.splice(y, 1)[0].fill(0);
            state.board.unshift(row);
            ++y;
            rowCount++;
          }

          if (rowCount > 0) {
            const lineScores = [0, 100, 300, 500, 800];
            state.score += lineScores[rowCount] * state.level;
            state.lines += rowCount;
            state.level = Math.floor(state.lines / 10) + 1;
            state.dropInterval = Math.max(100, 1000 - (state.level - 1) * 100);
            
            setTetrisScore(state.score);
            setTetrisLines(state.lines);
            setTetrisLevel(state.level);
          }

          if (collideTetris(state.board, state.piece)) {
            state.isGameOver = true;
            setTetrisGameOver(true);
          }
          
          state.dropCounter = 0;
          keyHandled = true;
          break;
      }

      if (keyHandled) {
        e.preventDefault();
        drawTetris();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "tetris") {
      const timer = setTimeout(() => {
        drawTetris();
      }, 50);
      return () => {
        clearTimeout(timer);
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      };
    } else {
      const state = gameStateRef.current;
      if (state.isStarted && !state.isPaused && !state.isGameOver) {
        state.isPaused = true;
        setTetrisPaused(true);
      }
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    }
  }, [activeTab]);

  // --- 5. 단위변환기 상태 관리 ---
  const [inch, setInch] = useState("");
  const [cm, setCm] = useState("");
  const [mile, setMile] = useState("");
  const [km, setKm] = useState("");
  const [pyeong, setPyeong] = useState("");
  const [m2, setM2] = useState("");

  const formatUnitNumber = (num: number) => {
    return parseFloat(num.toFixed(4)).toString();
  };

  const handleInchChange = (value: string) => {
    setInch(value);
    if (value === "") { setCm(""); return; }
    const val = parseFloat(value);
    if (!isNaN(val)) setCm(formatUnitNumber(val * 2.54));
  };

  const handleCmChange = (value: string) => {
    setCm(value);
    if (value === "") { setInch(""); return; }
    const val = parseFloat(value);
    if (!isNaN(val)) setInch(formatUnitNumber(val / 2.54));
  };

  const handleMileChange = (value: string) => {
    setMile(value);
    if (value === "") { setKm(""); return; }
    const val = parseFloat(value);
    if (!isNaN(val)) setKm(formatUnitNumber(val * 1.609344));
  };

  const handleKmChange = (value: string) => {
    setKm(value);
    if (value === "") { setMile(""); return; }
    const val = parseFloat(value);
    if (!isNaN(val)) setMile(formatUnitNumber(val / 1.609344));
  };

  const handlePyeongChange = (value: string) => {
    setPyeong(value);
    if (value === "") { setM2(""); return; }
    const val = parseFloat(value);
    if (!isNaN(val)) setM2(formatUnitNumber(val * 3.305785));
  };

  const handleM2Change = (value: string) => {
    setM2(value);
    if (value === "") { setPyeong(""); return; }
    const val = parseFloat(value);
    if (!isNaN(val)) setPyeong(formatUnitNumber(val / 3.305785));
  };

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
          타이머, 로또 생성기, 제비뽑기, 테트리스, 단위변환기 및 신기한 AI 사주•운세를 즐겨보세요!
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
        <button
          onClick={() => setActiveTab("tetris")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition ${
            activeTab === "tetris"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Gamepad2 className="h-3.5 w-3.5" />
          테트리스 게임
        </button>
        <button
          onClick={() => setActiveTab("converter")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition ${
            activeTab === "converter"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          📏 단위변환기
        </button>
        <button
          onClick={() => setActiveTab("saju")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition ${
            activeTab === "saju"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          🔮 AI 사주•운세
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

          {/* 구글 애드센스 광고 자리 */}
          <BreakPageAd activeTab={activeTab} />
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

          {/* 구글 애드센스 광고 자리 */}
          <BreakPageAd activeTab={activeTab} />
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

          {/* 구글 애드센스 광고 자리 */}
          <BreakPageAd activeTab={activeTab} />
        </section>
      )}

      {/* 🎮 탭 4: 테트리스 게임 */}
      {activeTab === "tetris" && (
        <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6 justify-center">
            <h2 className="text-xl font-bold text-slate-900">🎮 고급 테트리스 프로</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* 메인 게임 보드 */}
            <div className="relative">
              <canvas
                ref={tetrisCanvasRef}
                width="300"
                height="600"
                className="bg-black border-2 border-slate-800 rounded-xl shadow-md"
              />
              {tetrisGameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl">
                  <div className="text-red-500 text-3xl font-black tracking-widest mb-4 animate-pulse">GAME OVER</div>
                  <button
                    onClick={startTetris}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition shadow-md"
                  >
                    다시 하기
                  </button>
                </div>
              )}
            </div>

            {/* 사이드바 정보 패널 */}
            <div className="w-full md:w-[150px] flex flex-col gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">NEXT</p>
                <div className="flex justify-center">
                  <canvas
                    ref={nextCanvasRef}
                    width="120"
                    height="120"
                    className="bg-slate-800 border border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">SCORE</p>
                <span className="text-xl font-extrabold text-teal-600">{tetrisScore}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">LEVEL</p>
                <span className="text-xl font-extrabold text-teal-600">{tetrisLevel}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">LINES</p>
                <span className="text-xl font-extrabold text-teal-600">{tetrisLines}</span>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={startTetris}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
                >
                  {tetrisStarted ? "새 게임" : "게임 시작"}
                </button>
                {tetrisStarted && !tetrisGameOver && (
                  <button
                    onClick={togglePauseTetris}
                    className="w-full bg-slate-850 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition text-sm"
                  >
                    {tetrisPaused ? "계속하기" : "일시정지"}
                  </button>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-400 leading-relaxed text-[10px]">
                <p className="font-bold text-slate-500 mb-1">⌨️ 조작법:</p>
                <p>← → : 좌우 이동</p>
                <p>↑ : 블록 회전</p>
                <p>↓ : 소프트 드롭</p>
                <p>Space : 하드 드롭</p>
              </div>
            </div>
          </div>

          {/* 구글 애드센스 광고 자리 */}
          <BreakPageAd activeTab={activeTab} />
        </section>
      )}

      {/* 📏 탭 5: 단위변환기 */}
      {activeTab === "converter" && (
        <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6 justify-center">
            <h2 className="text-xl font-bold text-slate-900">📏 실시간 단위 변환기</h2>
          </div>

          <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
            {/* 길이 변환 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs">
              <div className="font-semibold text-slate-700 text-sm mb-3">📏 길이 변환 (인치 / 센티미터)</div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="number"
                    value={inch}
                    onChange={(e) => handleInchChange(e.target.value)}
                    placeholder="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right pr-12 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">in</span>
                </div>
                <div className="text-slate-400 font-bold rotate-90 sm:rotate-0">⇄</div>
                <div className="relative w-full">
                  <input
                    type="number"
                    value={cm}
                    onChange={(e) => handleCmChange(e.target.value)}
                    placeholder="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right pr-12 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">cm</span>
                </div>
              </div>
            </div>

            {/* 장거리 변환 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs">
              <div className="font-semibold text-slate-700 text-sm mb-3">🚗 장거리 변환 (마일 / 킬로미터)</div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="number"
                    value={mile}
                    onChange={(e) => handleMileChange(e.target.value)}
                    placeholder="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right pr-12 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">mi</span>
                </div>
                <div className="text-slate-400 font-bold rotate-90 sm:rotate-0">⇄</div>
                <div className="relative w-full">
                  <input
                    type="number"
                    value={km}
                    onChange={(e) => handleKmChange(e.target.value)}
                    placeholder="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right pr-12 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">km</span>
                </div>
              </div>
            </div>

            {/* 넓이 변환 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-2xs">
              <div className="font-semibold text-slate-700 text-sm mb-3">🏢 넓이 변환 (평 / 제곱미터)</div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="number"
                    value={pyeong}
                    onChange={(e) => handlePyeongChange(e.target.value)}
                    placeholder="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right pr-12 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">평</span>
                </div>
                <div className="text-slate-400 font-bold rotate-90 sm:rotate-0">⇄</div>
                <div className="relative w-full">
                  <input
                    type="number"
                    value={m2}
                    onChange={(e) => handleM2Change(e.target.value)}
                    placeholder="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-right pr-12 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">㎡</span>
                </div>
              </div>
            </div>
          </div>

          {/* 구글 애드센스 광고 자리 */}
          <BreakPageAd activeTab={activeTab} />
        </section>
      )}

      {/* 🔮 탭 6: AI 사주•운세 */}
      {activeTab === "saju" && (
        <section className="flex flex-col rounded-3xl bg-white border border-slate-200 p-0 shadow-sm overflow-hidden h-[850px] relative">
          <iframe 
            src="/break/saju.html" 
            className="w-full h-full border-0" 
            title="AI 사주•운세"
          />
        </section>
      )}
    </div>
  );
}
