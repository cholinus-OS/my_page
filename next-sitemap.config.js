/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // 웹사이트의 실제 주소 (배포 후 도메인 주소로 교체하시면 좋습니다)
  siteUrl: process.env.SITE_URL || "https://cholinus-exerciseismedicine.dev",
  generateRobotsTxt: true, // 검색 로봇 제어 파일(robots.txt)도 자동으로 생성합니다.
  sitemapSize: 7000,
};
