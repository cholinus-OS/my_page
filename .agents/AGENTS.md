# AI Agent Behavior Rules

<!-- BEGIN:syntax-check-rule -->
- 코드를 작성하거나 수정한 후에는 **반드시 문법 오류(Syntax Error)**가 없는지 자체 검토를 수행하세요.
- Node.js 스크립트의 경우 터미널에서 `node -c 파일명.js` 명령어를, 프론트엔드 코드의 경우 `npm run lint` 등을 사용하여 구문이 올바른지 확인해야 합니다.
- 재검토 과정에서 오류가 발견되지 않은 것이 완벽히 확인된 후에만 다음 작업(커밋, 배포, 다음 명령어 실행 등)을 진행하세요.
<!-- END:syntax-check-rule -->

<!-- BEGIN:naver-blog-image-rule -->
- **Naver Blog Image Extraction Rule**: When fetching and extracting content from Naver Blogs to create markdown posts, ALWAYS exclude thumbnail or blurred preview images. Specifically, DO NOT include image URLs that contain `type=w80_blur`, `type=s1`, or `blogpfthumb`. Only include the high-resolution original images (e.g., URLs ending with `type=w773` or similar large versions) to prevent duplicate or blurred images in the generated posts.
<!-- END:naver-blog-image-rule -->

<!-- BEGIN:markdown-formatting-rule -->
- **Markdown Formatting Rule**: 모든 글 작성 시 강조를 위해 글자 양옆에 물결표(~)를 사용하지 마세요. (예: 4~5kg 처럼 숫자의 범위를 나타낼 때 물결표를 쓰면 마크다운 파서가 취소선으로 잘못 인식할 수 있습니다. 대신 4-5kg 처럼 하이픈을 사용하세요). 강조를 할 때는 마크다운의 굵게(bold) 처리 외에도, 바닥 밑줄을 위한 `<u>밑줄</u>` 태그나 노란색 형광펜 하이라이트를 위한 `<mark>강조</mark>` HTML 태그를 적극 활용하여 가독성을 높이세요.
<!-- END:markdown-formatting-rule -->

<!-- BEGIN:table-mobile-readability-rule -->
- **Table Mobile Readability Rule**: 마크다운 표(Table)를 작성할 때는 항상 모바일(스마트폰) 화면의 가독성을 최우선으로 고려하세요. 특히 표의 제목 열(왼쪽 항목) 글자가 길어서 본문 열을 비좁게 만들거나 가로 스크롤이 생길 우려가 있다면, 억지로 한 줄에 맞추려 하지 마세요. 대신 `<br/>` 태그를 적극 활용하여 '두 줄'로 명확하고 일관성 있게(예: '수술 후<br/>3일째', '수술 후<br/>6~12주') 줄바꿈하여 시각적 통일감과 모바일 가독성을 동시에 확보해야 합니다. 또한, 특정 행의 글자 수 차이로 인해 기준 열의 너비가 들쭉날쭉해지는 것을 방지하기 위해, 절대 줄바꿈이 일어나면 안 되는 텍스트(예: 6~12주)에는 `<span style="white-space: nowrap;">...</span>` 태그를 적용하여 모든 열과 행이 일관된 크기를 유지하도록 기본 설정하세요.
<!-- END:table-mobile-readability-rule -->

<!-- BEGIN:briefing-title-rule -->
- **Briefing Title Rule**: '니숄더이야기' (무릎 이야기, 어깨 이야기 등) 브리핑 섹션에 추가되는 모든 공식 브리핑 블로그 글은 반드시 제목의 접두사로 `[센터장 브리핑]`이라는 말머리를 통일성 있게 추가하여야 합니다.
<!-- END:briefing-title-rule -->

<!-- BEGIN:subscription-stability-rule -->
- **Subscription Stability Rule**: 구독(Newsletter Subscription)과 관련된 기능은 병원의 신뢰도와 직결되므로 안정성을 최우선으로 해야 합니다. 웹사이트를 업데이트하거나 배포, 리빌드(Rebuild)를 진행할 때마다, 반드시 구독 관련 폼이나 데이터 저장 로직(KV 연동 등)이 정상적으로 동작하는지 최우선으로 사전 점검(체크)해야 합니다.
<!-- END:subscription-stability-rule -->

<!-- BEGIN:user-manual-distinction-rule -->
- **User Manual vs Disease Guidelines/Rehab Blog Rule**:
  - `재활 블로그 자동 작성` (Rehab Blog): Automated by `deploy.yml` (generate-blog-post.js). Currently STOPPED (no cron schedule).
  - `질환 가이드라인 자동 보강` (Disease Guidelines): Automated by `disease-guideline.yml` (update-disease-content.js). Updates `data.json`.
  - `우리 몸 사용 설명서` (User Manual):
    - 매주 월요일 새벽(04:27 KST)에 `user-manual-auto.yml` (scripts/generate-user-manual.js)을 통해 3개 챕터(Chapter 1. 스포츠 부상 예방, Chapter 2. 일상 속 바른 자세, Chapter 3. 생애주기별 관리)가 자동 작성 및 배포됩니다.
    - **중요**: 웹페이지의 30가지 질병 데이터(`data.json`)에 국한되지 않으며, 오로지 각 챕터의 일반론적 대주제와 다양한 관절 부위 풀(어깨, 무릎, 팔꿈치, 허리, 골반, 발목 등)을 바탕으로 새롭고 다변화된 주제로 제작됩니다.
    - **주제 및 부위 중복 원천 차단 (영구 기본 설정)**: 글 자동 작성 전 기존에 발행된 모든 글의 제목, 다룬 부위, 운동법을 100% 추적하여, 최근에 다룬 부위나 주제(예: 발목 등)가 중복되지 않도록 완전히 새로운 신체 부위와 새로운 상황으로 순환 배치하는 것이 기본 설정입니다. 또한 같은 주차에 발행되는 3개 챕터 간에도 신체 부위가 서로 겹치지 않아야 합니다.
  - `원장님 브리핑` (Briefing):
    - 원장님께서 직접 위 '우리 몸 사용 설명서'의 내용을 바탕으로 재가공하여 `[센터장 브리핑]` 말머리를 달고 직접 작성 및 발행하는 공식 칼럼입니다.
  - `주간 뉴스레터` (Weekly Newsletter):
    - 매주 화요일 아침(08:00 KST)에 `newsletter.yml`을 통해 월요일에 배포된 최신 사용설명서 3편을 담아 네이버/핫메일/지메일 완벽 호환 인라인 테이블 템플릿으로 자동 발송됩니다.
<!-- END:user-manual-distinction-rule -->

<!-- BEGIN:title-plain-text-rule -->
- **Title Plain Text Rule**: 모든 글(블로그, 브리핑, 우리 몸 사용 설명서 등)의 프론트매터 제목(`title`)에는 `<mark>`, `<u>`, `<b>`, `**`, `~~` 등의 HTML 태그나 마크다운 서식 기호를 절대 포함하지 마세요. 제목은 반드시 순수 텍스트(Plain Text)로만 작성해야 합니다.
<!-- END:title-plain-text-rule -->
