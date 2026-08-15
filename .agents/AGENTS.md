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

