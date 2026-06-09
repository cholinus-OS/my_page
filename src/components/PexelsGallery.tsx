"use client";

import React, { useState } from 'react';
import { Search, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';

interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

/**
 * Pexels 이미지 검색을 위한 클라이언트 갤러리 컴포넌트입니다.
 * 
 * 사용자가 입력창에 검색어(영문)를 입력하면 Pexels 공식 API 서버로 직접 이미지를 요청하여
 * 가져온 뒤 격자 형태로 아름답게 띄워줍니다.
 */
export default function PexelsGallery() {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // .env에 등록한 API Key를 가져옵니다.
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

      if (!apiKey || apiKey === 'YOUR_PEXELS_API_KEY_HERE') {
        throw new Error('Pexels API Key가 설정되지 않았습니다. .env 파일에 NEXT_PUBLIC_PEXELS_API_KEY를 입력해 주세요.');
      }

      // Pexels 공식 API 서버로 직접 이미지 검색을 요청합니다.
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '이미지를 가져오는 데 실패했습니다.');
      }

      setPhotos(data.photos || []);

      if (data.photos && data.photos.length === 0) {
        setError('검색 결과가 존재하지 않습니다. 다른 단어로 검색해 보세요!');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '인터넷 연결이 불안정하거나 서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
      {/* 컴포넌트 타이틀 정보 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <ImageIcon className="text-teal-400 h-6 w-6" />
          Pexels 무료 이미지 검색
        </h2>
        <p className="text-sm text-slate-400">
          안전하게 등록한 Pexels API 열쇠를 활용해 고화질 이미지를 실시간으로 검색합니다.
        </p>
      </div>

      {/* 검색어 입력창 */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="영문 검색어 입력 (예: nature, fitness, health)"
          className="flex-grow px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          검색
        </button>
      </form>

      {/* 에러 상태 안내창 */}
      {error && (
        <div className="p-4 mb-6 bg-red-950/30 border border-red-900/60 text-red-200 rounded-xl text-center text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 로딩 스피너 */}
      {loading && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin text-teal-400 mb-4" />
          <p className="text-sm">Pexels 라이브러리에서 멋진 사진을 가져오고 있습니다...</p>
        </div>
      )}

      {/* 이미지 갤러리 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="group relative flex flex-col bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition duration-300"
          >
            {/* 이미지 컨테이너 */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
              <img
                src={photo.src.medium}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* 이미지 원본 새창 링크 아이콘 */}
              <a 
                href={photo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute top-2.5 right-2.5 bg-slate-950/80 hover:bg-slate-950 p-2 rounded-lg text-slate-300 hover:text-white transition opacity-0 group-hover:opacity-100 shadow"
                title="Pexels 원본 보기"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 작가 및 출처 표시 (Pexels 라이선스 준수) */}
            <div className="p-3.5 flex flex-col justify-between flex-grow">
              <p className="text-xs text-slate-200 line-clamp-1 mb-2 font-medium">
                {photo.alt || 'Pexels 무료 이미지'}
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/60 pt-2.5 mt-auto">
                <span className="truncate max-w-[120px]">
                  작가: <a 
                    href={photo.photographer_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    {photo.photographer}
                  </a>
                </span>
                <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  Pexels
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 아무것도 없을 때의 첫 화면 */}
      {!loading && photos.length === 0 && !error && (
        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-850 rounded-2xl">
          <ImageIcon className="mx-auto h-10 w-10 text-slate-700 mb-3" />
          <p className="text-sm font-medium text-slate-400">원하는 주제를 검색해 보세요!</p>
          <p className="text-xs text-slate-600 mt-1">예: &quot;fitness&quot;(운동), &quot;nature&quot;(자연), &quot;healthy&quot;(건강) 등 영단어로 검색하면 결과가 더욱 정확합니다.</p>
        </div>
      )}
    </div>
  );
}
