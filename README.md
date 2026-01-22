# 🛒 E-commerce E2E Automation (Ohou & Musinsa)

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

**오늘의집(Ohou)**과 **무신사(Musinsa)**의 핵심 구매 프로세스(검색 → 필터 → 장바구니)를 검증하는 **E2E 테스트 자동화 프로젝트**입니다.  
로컬 환경뿐만 아니라 **GitHub Actions를 통한 CI 환경**에서도 안정적으로 동작하는 파이프라인을 구축하는 데 중점을 두었습니다.

---

## 📸 Test Results (CI/CD Pipeline)

> **"From Failure to Success"** > 초기에는 봇 탐지 및 환경 이슈로 인해 실패(Fail)했으나, 끈질긴 원인 분석 및 설정을 통해 최종적으로 안정적인 성공(Success) 파이프라인을 구축했습니다.


---

## 🔥 Key Troubleshooting & Features

이 프로젝트를 진행하며 마주친 **4가지 핵심 기술적 이슈와 해결 과정**입니다.

### 1. 🔐 보안 (Security): 민감 정보 관리
- **문제:** 자동 로그인을 위한 쿠키 파일(`auth.json`)에는 민감한 세션 정보가 포함되어 있어, Public Repository에 업로드할 수 없음.
- **해결:** - 인증에 필요한 쿠키 파일은 암호화하여 **GitHub Secrets**에 등록하는 방식으로 보안을 유지하며 관리했습니다.
  - CI 실행 시점에 복호화하여 테스트에 사용하도록 파이프라인을 구성했습니다.

### 2. 🤖 봇 탐지 우회 (Anti-Bot / WAF)
- **문제:** 로컬에서는 정상 작동하던 '오늘의집' 테스트가 CI 서버(Headless Chrome)에서는 **"Access Denied"**로 차단됨.
- **해결:** `playwright.config.ts`에 강력한 스텔스(Stealth) 설정을 적용했습니다.
  - `User-Agent`를 일반 윈도우 크롬 브라우저와 동일하게 설정.
  - `Referer`, `Accept-Language` 등 리얼한 헤더 추가.
  - 브라우저 구동 Args에 `--disable-blink-features=AutomationControlled` 옵션을 추가하여 자동화 도구 탐지를 우회했습니다.

### 3. 🌍 접속 환경 및 리다이렉트 (Geo-blocking)
- **문제:** GitHub Actions 서버(해외 IP)에서 '무신사' 접속 시, 강제로 **글로벌 사이트(Global)**로 리다이렉트되어 한국 전용 테스트 시나리오 수행 불가.
- **해결:** - 네트워크 차단 및 헤더 조작을 시도했으나, 서버 측의 강력한 정책(IP 기반 리다이렉트)을 확인했습니다.
  - **전략 수정:** GitHub Actions 서버와 국내 서비스 간의 접속 환경 차이를 인정하고, CI 환경에서는 접속이 원활한 **'오늘의집' 프로젝트만 수행**하도록 전략을 수정하여 파이프라인의 신뢰성을 확보했습니다. ('무신사'는 로컬 전용으로 분리)

### 4. 🖥️ CI 환경 최적화 (Headless & Viewport)
- **문제:** CI 서버(Linux)는 UI가 없는 환경
