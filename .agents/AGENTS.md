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

