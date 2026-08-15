"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold text-slate-900 transition hover:opacity-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="바른관절 헬프센터 로고" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
          <span className="inline">바른관절 <span className="text-teal-600 font-semibold">헬프센터</span></span>
        </Link>
        
        <div className="hidden lg:block text-base md:text-lg font-black tracking-widest bg-gradient-to-r from-rose-500 via-purple-600 to-teal-500 bg-clip-text text-transparent select-none">
          Exercise Is Medicine..!
        </div>
        
        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/manual" className="text-sm font-medium text-slate-600 transition hover:text-teal-600">
            사용 설명서
          </Link>
          <Link href="/disease" className="text-sm font-medium text-slate-600 transition hover:text-teal-600">
            질환 사전
          </Link>
          <Link href="/blog/" className="text-sm font-medium text-slate-600 transition hover:text-teal-600">
            재활 블로그
          </Link>
          <Link href="/#knee-shoulder-banner" className="text-sm font-medium text-slate-600 transition hover:text-teal-600">
            니숄더이야기
          </Link>
          <Link href="/about/" className="text-sm font-medium text-slate-600 transition hover:text-teal-600">
            소개
          </Link>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button 
          onClick={toggleMenu}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 모바일 풀스크린 오버레이 메뉴 */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col px-4 py-6 space-y-4">
            <Link 
              href="/manual" 
              onClick={closeMenu}
              className="flex items-center h-12 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              사용 설명서
            </Link>
            <Link 
              href="/disease" 
              onClick={closeMenu}
              className="flex items-center h-12 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              질환 사전
            </Link>
            <Link 
              href="/blog/" 
              onClick={closeMenu}
              className="flex items-center h-12 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              재활 블로그
            </Link>
            <Link 
              href="/#knee-shoulder-banner" 
              onClick={closeMenu}
              className="flex items-center h-12 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              니숄더이야기
            </Link>
            <Link 
              href="/about/" 
              onClick={closeMenu}
              className="flex items-center h-12 px-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              소개
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
