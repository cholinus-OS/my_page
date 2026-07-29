import Link from "next/link";
import { Search, Home, BookOpen, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | 바른관절 헬프센터",
  description: "요청하신 페이지를 찾을 수 없습니다. 올바른 경로로 다시 접속해 주세요.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 sm:px-6">
      <div className="text-center w-full max-w-lg mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>
        
        <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
          404
        </h1>
        <h2 className="mt-2 text-xl font-bold text-slate-800">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
          요청하신 페이지의 주소가 잘못 입력되었거나, 현재 삭제되어 사용할 수 없는 페이지입니다. 
          아래 버튼을 통해 메인 화면이나 원하시는 건강 정보를 찾아보세요.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700 shadow-md shadow-teal-600/20"
          >
            <Home className="h-4 w-4" />
            홈으로 가기
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <BookOpen className="h-4 w-4 text-teal-600" />
            재활 블로그 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
