import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  /* 1. 하나씩 순서대로 실행 (충돌 방지) */
  fullyParallel: false,
  workers: 1, 

  /* 공통 설정 */
  timeout: 60 * 1000,
  expect: { timeout: 10000 },
  reporter: 'html',
  
  use: {
    /* 기본 트레이스 설정 */
    trace: 'on-first-retry',
    
    /* CI 환경이면 Headless(화면 없음), 내 컴퓨터면 Headed(화면 있음) */
    headless: !!process.env.CI,
    
    /* PC 화면 크기 고정 (반응형 UI 이슈 방지) */
    viewport: { width: 1920, height: 1080 },

    /* 👇 [핵심 1] 한국 위치/언어 강제 설정 (무신사 USA 리다이렉트 방지) */
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    geolocation: { longitude: 126.9780, latitude: 37.5665 }, // 서울 시청 좌표
    permissions: ['geolocation'], // 위치 권한 자동 허용

    /* 👇 [핵심 2] 봇 탐지 회피용 헤더 (오늘의집 Access Denied 방지) */
    extraHTTPHeaders: {
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'referer': 'https://www.google.com/', 
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    },

    /* 👇 [핵심 3] 브라우저의 '자동화 제어' 깃발 숨기기 */
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },

    /* 일반 사용자 브라우저인 척 위장 (User-Agent) */
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },

  /* 2. 프로젝트 설정 */
  projects: [
    {
      name: 'Musinsa', 
      testMatch: '**/musinsa_search_filter.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.musinsa.com', 
      },
    },
    {
      name: 'Ohou', 
      testMatch: '**/ohou-shopping-full.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://ohou.se',
        /* 오늘의집은 로그인 유지 파일 사용 */
        storageState: 'ohou-auth.json', 
      },
    },
  ],
});