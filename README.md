# 프로젝트명: vanilla-js-spa

## 부제: Deep Dive JavaScript

### 프레임워크 사용 하지 않고 SPA(Single Page Application)를 구현 목표

---

## 📁 프로젝트 구조

```
views/
  ├─ index.html
  ├─ js/
  │    └─ main.js
  ├─ components/
  │    ├─ Header.js
  │    ├─ Sidebar.js
  │    └─ Footer.js
  └─ css/
       └─ style.css
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
