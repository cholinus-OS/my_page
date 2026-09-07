import { BookOpen, ExternalLink, ShieldCheck } from "lucide-react";

interface ReferenceItem {
  name: string;
  org: string;
  url: string;
  desc: string;
}

interface MedicalReferencesProps {
  title?: string;
  category?: string;
  tags?: string[];
  partName?: string;
}

export default function MedicalReferences({
  title = "",
  category = "",
  tags = [],
  partName = "",
}: MedicalReferencesProps) {
  const combinedKeywords = `${title} ${category} ${tags.join(" ")} ${partName}`.toLowerCase();

  // 기본 공통 최상위 공신력 기관
  const references: ReferenceItem[] = [
    {
      name: "국가건강정보포털",
      org: "질병관리청 (KDCA)",
      url: "https://health.kdca.go.kr",
      desc: "대한민국 보건복지부 및 질병관리청에서 제공하는 표준 의학 임상 정보",
    },
    {
      name: "대한정형외과학회",
      org: "대한정형외과학회 (KOA)",
      url: "https://www.koa.or.kr",
      desc: "국내 척추 및 관절 정형외과 전문의 공식 학술 단체 및 질환 가이드라인",
    },
    {
      name: "PubMed 국립의학도서관",
      org: "미국 국립생명공학정보센터 (NCBI)",
      url: "https://pubmed.ncbi.nlm.nih.gov",
      desc: "전 세계 의료 연구진이 검증한 생명과학 및 근골격계 임상 논문 데이터베이스",
    },
  ];

  // 주제별 특화 공신력 학술 기관 매칭
  if (/무릎|슬관|반월상|십자인대|연골|관절염/.test(combinedKeywords)) {
    references.push({
      name: "OrthoInfo Knee Guidelines",
      org: "미국정형외과학회 (AAOS)",
      url: "https://orthoinfo.aaos.org/en/diseases--conditions/#Knee",
      desc: "무릎 관절염, 인대 파열, 연골판 손상에 대한 글로벌 표준 환자 교육 가이드",
    });
  } else if (/어깨|회전근개|오십견|충돌증후군|견관절/.test(combinedKeywords)) {
    references.push({
      name: "OrthoInfo Shoulder Guidelines",
      org: "미국정형외과학회 (AAOS)",
      url: "https://orthoinfo.aaos.org/en/diseases--conditions/#Shoulder",
      desc: "회전근개 파열, 오십견(동결견) 및 어깨 충돌증후군 재활 프로토콜",
    });
  } else if (/목|경추|허리|요추|디스크|척추|협착/.test(combinedKeywords)) {
    references.push({
      name: "Spine Health & Care Guidelines",
      org: "미국정형외과학회 (AAOS)",
      url: "https://orthoinfo.aaos.org/en/diseases--conditions/#Spine",
      desc: "경추 및 요추 추간판 탈출증, 척추관 협착증의 비수술적 재활 지침",
    });
  } else if (/걷기|유산소|보행|러닝|달리기|스포츠/.test(combinedKeywords)) {
    references.push({
      name: "Physical Activity Guidelines",
      org: "미국스포츠의학회 (ACSM)",
      url: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines",
      desc: "세계 공인 운동 처방 지침 및 심혈관 유산소 보행 권고안",
    });
  } else if (/손목|팔꿈치|엘보|수근관|건초염|방아쇠/.test(combinedKeywords)) {
    references.push({
      name: "Arm & Hand Clinical Resources",
      org: "미국정형외과학회 (AAOS)",
      url: "https://orthoinfo.aaos.org/en/diseases--conditions/#Arm",
      desc: "테니스·골프 엘보, 수근관 증후군 및 상지 건초염 정밀 관리 수칙",
    });
  } else {
    references.push({
      name: "대한재활의학회",
      org: "대한재활의학회 (KARM)",
      url: "https://www.karm.or.kr",
      desc: "근골격계 만성 통증 조절 및 비수술적 운동 재활 치료 표준 가이드라인",
    });
  }

  return (
    <section 
      aria-label="의학 학술 참고문헌 및 공신력 출처" 
      className="mt-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-7 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3.5 mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 shrink-0" />
          <span>의학 학술 참고문헌 및 공신력 출처</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          근거 기반 의학 (EBM) 감수
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed break-keep">
        바른관절 헬프센터의 콘텐츠는 정형외과 전문의의 임상 지식과 함께 아래의 국내외 공인 의학 학술 기관 및 보건복지부 임상 가이드라인을 바탕으로 엄격히 교정·작성됩니다.
      </p>

      <ul className="grid gap-2.5 sm:grid-cols-2">
        {references.map((ref) => (
          <li key={ref.name} className="h-full">
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between h-full rounded-xl bg-white p-3.5 border border-slate-200/70 hover:border-teal-400 hover:shadow-xs transition duration-150"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition flex items-center gap-1">
                    {ref.name}
                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-teal-600 transition" />
                  </span>
                  <span className="text-[10px] text-teal-700 bg-teal-50/80 px-1.5 py-0.5 rounded font-medium">
                    {ref.org}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug break-keep">
                  {ref.desc}
                </p>
              </div>
              <span className="mt-2 text-[10px] text-slate-400 group-hover:text-teal-600 font-medium self-end">
                공식 사이트 확인 ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
