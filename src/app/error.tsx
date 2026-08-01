"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 text-center rounded-3xl mt-8">
      <AlertCircle className="mx-auto h-16 w-16 text-teal-600 mb-6" />
      <h2 className="text-2xl font-bold mb-4">페이지를 불러오는 중 오류가 발생했습니다</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
        일시적인 오류이거나 존재하지 않는 페이지일 수 있습니다. 다시 시도하시거나 홈으로 이동해주세요.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-full bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-sm"
        >
          다시 로드하기
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-white text-teal-700 font-semibold border border-teal-200 hover:bg-teal-50 transition shadow-sm"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
