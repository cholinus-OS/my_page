"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-teal-600 mb-6" />
        <h2 className="text-2xl font-bold mb-4">예기치 않은 오류가 발생했습니다</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          이용에 불편을 드려 죄송합니다. 일시적인 시스템 오류이거나 네트워크 문제일 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
          >
            다시 시도하기
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white text-teal-700 font-semibold border border-teal-200 hover:bg-teal-50 transition"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </body>
    </html>
  );
}
