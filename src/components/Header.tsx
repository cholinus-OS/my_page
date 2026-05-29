import Link from "next/link";
import { Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 transition hover:opacity-80">
          <Activity className="h-6 w-6 text-teal-600 animate-pulse" />
          <span>바른관절 <span className="text-teal-600 font-semibold">헬프센터</span></span>
        </Link>
        
        <div className="hidden md:block text-base md:text-lg font-black tracking-widest bg-gradient-to-r from-rose-500 via-purple-600 to-teal-500 bg-clip-text text-transparent select-none">
          Exercise Is Medicine..!
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-600 transition hover:text-teal-600"
          >
            질환 사전
          </Link>
          <Link 
            href="/blog" 
            className="text-sm font-medium text-slate-600 transition hover:text-teal-600"
          >
            재활 블로그
          </Link>
        </nav>
      </div>
    </header>
  );
}
