import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1, 
  timeout: 60 * 1000,
  expect: { timeout: 10000 },
  reporter: 'html',
  
  use: {
    trace: 'on-first-retry',
    headless: !!process.env.CI,
    viewport: { width: 1920, height: 1080 },

    /* 👇 [추가] 서울 사는 척하기 (위치 속이기) */
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    geolocation: { longitude: 126.9780, latitude: 37.5665 },
    permissions: ['geolocation'],

    /* 기존 스텔스 설정 유지 */
    extraHTTPHeaders: {
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'referer': 'https://www.google.com/', 
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    },
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },

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