import Link from "next/link";
import diseasesData from "@/content/diseases/data.json";
import DiseaseDictionary from "@/components/DiseaseDictionary";
import { getSortedPostsData } from "@/lib/posts";
import { 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Youtube,
  BookOpen
} from "lucide-react";

// 추천 유튜브 채널 정보 정의
const youtubeChannels = [
  {
    name: "정형외과 김진구 교수",
    description: "대한민국 정형외과 무릎 치료의 명의, 스포츠 의학 및 무릎 관절염 예방·재활의 최고 권위자 공식 채널",
    url: "https://www.youtube.com/@Dr_KimJinGoo"
  },
  {
    name: "문쌤의 물리치료실",
    description: "현직 물리치료사가 알려주는 과학적인 관절 스트레칭 및 디스크 재활 전문 채널",
    url: "https://www.youtube.com/@moonssem/videos"
  },
  {
    name: "힙으뜸",
    description: "필라테스 기반의 홈트레이닝, 골반 교정 및 코어 강화 운동의 대명사 채널",
    url: "https://www.youtube.com/@euddeume"
  },
  {
    name: "모멘트핏 록샘",
    description: "바른 자세 유지와 기초 체력 증진, 부상 없는 데일리 다이어트 운동 가이드",
    url: "https://www.youtube.com/@momentfit"
  },
  {
    name: "데스런",
    description: "맨몸 운동의 교본으로 관절에 부담을 주지 않으면서 정교한 바디 정렬을 돕는 트레이닝 채널",
    url: "https://www.youtube.com/@deslun_yoonhyunyong"
  },
  {
    name: "마선호",
    description: "바른 자세 웨이트 트레이닝과 유쾌하게 배우는 부위별 근력 강화 요령 채널",
    url: "https://www.youtube.com/@Masunho"
  }
];

export default function Home() {
  // 실제 마크다운 데이터베이스에서 최신 글 2개 가져오기
  const latestPosts = getSortedPostsData().slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* 1. 영웅(Hero) 섹션 */}
      <section 
        className="relative overflow-hidden py-20 text-white sm:py-28 bg-cover bg-center" 
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
            <Sparkles className="h-3 w-3" />
            100% 무료 맞춤형 홈 재활 자가진단 사전
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            하루 한 동작, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">통증 없는 건강한 관절</span> 만들기
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            관절 통증으로 병원을 찾기 전, 부위별 세부 질환의 정확한 원인과 나도 해당되는지 체크할 수 있는 증상 진단 가이드를 확인하세요.
          </p>
        </div>
      </section>

      {/* 2. 자가진단 사전 (클라이언트 컴포넌트 렌더링) */}
      <DiseaseDictionary diseases={diseasesData} />

      {/* 3. 최근 AI 재활 블로그 목록 섹션 */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                실시간 업데이트 재활 블로그
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                의학 정보를 바탕으로 추천하는 일상 속 바른 관절 스트레칭 및 자가 관리 비법
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {latestPosts.length > 0 ? (
              latestPosts.map((blog) => (
                <div
                  key={blog.slug}
                  className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{blog.date.replace(/-/g, ".")}</span>
                      <span>•</span>
                      <span className="text-teal-600 font-medium">{blog.category}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 hover:text-teal-600 transition">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                      {blog.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                    >
                      자세히 읽기 <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
                새로운 재활 소식이 곧 등록될 예정입니다!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. 추천 사이트 및 공식 유튜브 채널 추천 영역 */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 공식 운영 네이버 블로그 카드 */}
            <div className="lg:col-span-1 flex flex-col justify-between rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Naver Blog
                  </span>
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">cholinus 공식 블로그</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  웹사이트 운영자가 직접 수집하고 기록하는 깊이 있는 건강 관련 지식과 일상 속 자세 교정 꿀팁, 일지들을 네이버 블로그에서 만나보세요.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="https://blog.naver.com/cholinus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-semibold text-white transition shadow-md shadow-emerald-600/10"
                >
                  공식 블로그 방문하기
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* 추천 유튜브 채널 리스트 */}
            <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  물리치료 & 재활 추천 유튜브 채널
                </h3>
                <span className="text-[10px] text-slate-400">※ 무단 복제가 아닌 공식 큐레이션 채널입니다.</span>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {youtubeChannels.map((channel, index) => (
                  <a
                    key={index}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition duration-200 group"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition flex items-center gap-1.5">
                        {channel.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-1">
                        {channel.description}
                      </p>
                    </div>
                    <span className="text-slate-400 group-hover:text-red-500 transition">
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
