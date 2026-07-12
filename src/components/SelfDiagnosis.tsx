"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Activity, 
  ChevronRight, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Stethoscope
} from "lucide-react";

interface Disease {
  id: string;
  name: string;
  part: string;
  partName: string;
  summary: string;
  symptoms: string[];
  keyword: string;
}

interface SelfDiagnosisProps {
  diseases: Disease[];
}

export default function SelfDiagnosis({ diseases }: SelfDiagnosisProps) {
  // 1. 상태 및 Ref 정의
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<Disease | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. 고유 부위 목록 추출 (중복 제거)
  const parts = Array.from(
    new Map(diseases.map((d) => [d.part, d.partName])).entries()
  ).map(([part, partName]) => ({ part, partName }));

  // 3. 현재 선택된 부위에 해당하는 질환들
  const filteredDiseases = diseases.filter((d) => d.part === selectedPart);

  // 4. 선택된 부위의 모든 증상 목록 수집
  const availableSymptoms = filteredDiseases.reduce((acc: { text: string; diseaseId: string }[], d) => {
    d.symptoms.forEach((symptom) => {
      acc.push({ text: symptom, diseaseId: d.id });
    });
    return acc;
  }, []);

  // 5. 증상 선택 토글
  const toggleSymptom = (symptomText: string) => {
    if (selectedSymptoms.includes(symptomText)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptomText));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomText]);
    }
  };

  // 6. 결과 계산 진단 함수
  const diagnose = () => {
    if (selectedSymptoms.length === 0) return;

    let bestMatchDisease: Disease | null = null;
    let maxMatchCount = -1;

    filteredDiseases.forEach((disease) => {
      // 이 질환의 증상 중 사용자가 선택한 증상들과 겹치는 개수 계산
      const matchCount = disease.symptoms.filter((symptom) =>
        selectedSymptoms.includes(symptom)
      ).length;

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestMatchDisease = disease;
      }
    });

    setResult(bestMatchDisease);
    setIsSubmitted(true);

    // 진단 결과 확인 영역으로 화면을 부드럽게 자동 스크롤
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // 7. 초기화 함수
  const reset = () => {
    setSelectedPart(null);
    setSelectedSymptoms([]);
    setResult(null);
    setIsSubmitted(false);

    // 초기화 시 다시 질문 영역 상단으로 부드럽게 스크롤
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <section id="self-diagnosis" className="bg-white py-16 border-t border-slate-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
            <Activity className="h-3.5 w-3.5" />
            관절 자가진단 서비스
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            1분 스마트 관절 자가진단 테스트
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-500 leading-relaxed">
            자가 진단 툴을 통해 현재 느끼시는 통증 부위와 증상을 선택하시면, 가장 가능성이 높은 의심 질환과 맞춤 가이드를 처방해 드립니다.
          </p>
        </div>

        {/* 메인 진단 박스 (글래스모피즘 풍 프리미엄 보드) */}
        <div ref={containerRef} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-xs sm:p-8">
          {!isSubmitted ? (
            <div>
              {/* STEP 1: 통증 부위 선택 */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-black text-white">1</span>
                  통증이 발생하는 신체 부위를 선택해 주세요.
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {parts.map((p) => (
                    <button
                      key={p.part}
                      type="button"
                      onClick={() => {
                        setSelectedPart(p.part);
                        setSelectedSymptoms([]);
                      }}
                      className={`rounded-xl py-3 px-4 text-sm font-bold border transition duration-200 cursor-pointer ${
                        selectedPart === p.part
                          ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/10"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {p.partName}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: 세부 증상 선택 (부위가 선택되었을 때만 노출) */}
              {selectedPart && (
                <div className="mb-8 animate-fadeIn">
                  <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-black text-white">2</span>
                    느끼시는 증상을 모두 선택해 주세요. (중복 선택 가능)
                  </label>
                  <div className="space-y-2.5">
                    {availableSymptoms.map((symptom, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleSymptom(symptom.text)}
                        className={`w-full flex items-start gap-3 rounded-xl p-4 text-left text-xs sm:text-sm border transition duration-150 cursor-pointer ${
                          selectedSymptoms.includes(symptom.text)
                            ? "bg-teal-50 border-teal-200 text-teal-900"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selectedSymptoms.includes(symptom.text)
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}>
                          {selectedSymptoms.includes(symptom.text) && (
                            <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span>{symptom.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 진단하기 버튼 */}
              <div className="flex justify-end pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  disabled={!selectedPart || selectedSymptoms.length === 0}
                  onClick={diagnose}
                  className={`inline-flex items-center gap-1.5 rounded-xl py-3 px-6 text-sm font-bold transition duration-200 cursor-pointer shadow-md ${
                    selectedPart && selectedSymptoms.length > 0
                      ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/10"
                      : "bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                  }`}
                >
                  <Stethoscope className="h-4 w-4" />
                  결과 진단하기
                </button>
              </div>
            </div>
          ) : (
            /* 진단 결과 화면 */
            <div className="animate-scaleIn text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase">Diagnosis Result</span>
              <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
                가장 의심되는 질환은 <span className="text-teal-600">'{result?.name}'</span>입니다.
              </h3>
              
              {result && (
                <div className="mx-auto mt-6 max-w-lg rounded-2xl bg-white border border-slate-200 p-5 text-left shadow-xs">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <HelpCircle className="h-4 w-4 text-teal-600" />
                    질환 요약 정보
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {result.summary}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/disease/${result.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs font-bold text-white transition duration-200"
                    >
                      질환 사전에서 확인하기
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/blog?search=${encodeURIComponent(result.keyword)}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 transition duration-200"
                    >
                      관련 재활 블로그 검색
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* 면책 및 다시하기 조절 */}
              <div className="mx-auto mt-6 max-w-lg flex items-start gap-2 text-left rounded-xl bg-amber-50/50 border border-amber-200/50 p-3 text-amber-800 text-[10px] sm:text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="leading-relaxed">
                  본 자가진단은 약식 참고용 툴입니다. 통증이 계속되거나 심해질 경우 자가 치료에만 의존하지 마시고, 반드시 정형외과 등 전문 의료기관을 찾아 대면 전문의 상담을 받으시기 바랍니다.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 transition duration-200 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  처음부터 다시하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
