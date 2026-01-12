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
    trace: 'on-first-retry',
    headless: !!process.env.CI,
    viewport: { width: 1920, height: 1080 },
    
    /* 👇 [핵심 1] 진짜 사람처럼 보이는 헤더 추가 (구글에서 온 척하기) */
    extraHTTPHeaders: {
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'referer': 'https://www.google.com/', 
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    },

    /* 👇 [핵심 2] 봇 탐지 기능을 끄는 강력한 옵션 */
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled', // "나 자동화 봇 아님" 라고 속임
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },

    // 기존 User-Agent 유지
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
        storageState: 'ohou-auth.json', 
      },
    },
  ],
});