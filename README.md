# 프로젝트명: vanilla-js-spa

## 부제: Deep Dive JavaScript

### 프레임워크 사용 하지 않고 SPA(Single Page Application)를 구현 목표

---

## 📁 프로젝트 구조

```
public/
  ├─ index.html
  ├─ pages/
  │   ├─ home.html
  │   ├─ about.html
  │   ├─ posts.html
  │   └─ contact.html
  ├─ js/
  │   ├─ main.js
  │   ├─ components/
  │   │   ├─ Header.js
  │   │   ├─ Sidebar.js
  │   │   ├─ Footer.js
  │   │   └─ Intro.js
  │   ├─ home/
  │   ├─ about/
  │   ├─ posts/
  │   └─ contact/
  └─ css/
      ├─ style.css
      └─ header.css
```

---

## 🏗️ 구현된 SPA 레이아웃 및 특징

- **Header**: 로고, 네비게이션(아이콘+텍스트), 햄버거 메뉴(반응형)
- **Sidebar**: 프로필, 메뉴(아이콘+텍스트, 모바일은 아이콘만), 토글버튼(반응형)
- **Main**: 페이지별 주요 컨텐츠 영역
- **Footer**: 카피라이터 문구(© 2024 bocastle. All rights reserved.)

### 💡 주요 특징

- 바닐라 JS만으로 SPA 구조 설계
- 반응형 레이아웃(모바일/데스크탑)
- 컴포넌트 기반 구조 (Header, Sidebar, Footer)
- Gin을 이용한 정적 파일 서빙
- Webpack을 이용한 JavaScript 번들링 및 최적화

---

## 🛠️ 기술 스택

- **Backend**: Go (Gin Framework)
- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Build Tool**: Webpack 5
- **Package Manager**: npm

---

## 🚀 시작하기

### 사전 요구사항

- Go 1.23 이상
- Node.js 및 npm

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 모드 실행**
   ```bash
   make run-dev
   ```
   - `public` 폴더의 원본 파일 사용
   - 포트: `2580`

3. **프로덕션 빌드 및 실행**
   ```bash
   make build  # JavaScript 빌드 + Go 빌드
   make run    # 빌드된 애플리케이션 실행
   ```

### 빌드 명령어

- `make build-js`: JavaScript 파일만 빌드 (Webpack)
- `make build`: 전체 빌드 (JS + Go)
- `make run-dev`: 개발 모드 실행 (빌드 없이)
- `make clean`: 빌드 결과물 정리

### 빌드 프로세스

1. **JavaScript 빌드** (`npm run build`)
   - Webpack이 `public/js/main.js`를 `dist/js/bundle.js`로 번들링
   - HTML, CSS, pages 폴더를 `dist`로 복사
   - `console.log` 제거 및 코드 최적화

2. **Go 빌드** (`go build`)
   - Go 애플리케이션을 실행 파일로 빌드

3. **실행**
   - `dist` 폴더가 있으면 프로덕션 모드 (번들된 파일 사용)
   - `dist` 폴더가 없으면 개발 모드 (원본 파일 사용)

---

## 📦 배포

프로덕션 배포를 위해서는:

1. 로컬에서 빌드:
   ```bash
   npm run build  # dist 폴더 생성
   ```

2. `dist` 폴더가 Git에 포함되어 배포 환경에서 사용됩니다.

---

## 📧 스케줄링 및 메일 전송

서버는 매일 한국시간 오후 1시에 자동으로 메일을 전송합니다.

### 환경 변수 설정

메일 전송을 위해 다음 환경 변수를 설정해야 합니다:

#### 1. 로컬 개발 환경

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# SMTP 서버 설정
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# 수신자 설정
EMAIL_TO=recipient@example.com

# 서버 포트 (선택사항, 기본값: 2580)
PORT=2580
```

**주의**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

#### 2. Koyeb 배포 환경

Koyeb 대시보드에서 환경 변수를 설정하세요:

1. Koyeb 대시보드 접속
2. 해당 서비스 선택
3. **Settings** > **Environment Variables** 메뉴로 이동
4. 다음 환경 변수들을 추가:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `SMTP_FROM`
   - `EMAIL_TO`
   - `PORT` (Koyeb가 자동으로 설정하지만 필요시 수정 가능)

### Gmail 사용 시 주의사항

Gmail을 사용하는 경우:
1. 2단계 인증을 활성화해야 합니다
2. 앱 비밀번호를 생성하여 `SMTP_PASSWORD`에 사용합니다
3. 앱 비밀번호 생성: Google 계정 > 보안 > 2단계 인증 > 앱 비밀번호

### 스케줄 설정

현재 설정: 매일 오후 1시 (한국시간, Asia/Seoul)
- Cron 표현식: `0 13 * * *`
- 스케줄 변경은 `main.go`의 cron 표현식을 수정하면 됩니다
