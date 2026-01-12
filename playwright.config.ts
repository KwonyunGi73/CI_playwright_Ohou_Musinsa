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
    viewport: { width: 1280, height: 720 },
  },

  /* 2. 여기가 핵심입니다: 각 파일마다 사용할 주소(baseURL)를 따로 지정 */
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
        /* 👇 여기에 아까 만든 가벼운 쿠키 파일을 지정합니다! 👇 */
        storageState: 'ohou-auth.json', 
      },
    },
  ],
});