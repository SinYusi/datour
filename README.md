# Datour

> 지역·시간대·예산·분위기만 고르면, **실제 장소**로 구성된 데이트 코스를 만들어주고
> 지도에 동선까지 그려주는 웹 서비스. 완성된 코스는 링크로 연인에게 공유한다.

매번 데이트 때마다 "오늘 어디 가지?"를 고민하는 20~30대를 위한 도구입니다.
AI가 식사 → 카페/디저트 → 산책/액티비티로 이어지는 3코스를 한 세트로 짜줍니다.

---

## 주요 기능

- **조건 기반 코스 생성** — 지역, 시간대, 예산, 분위기를 입력하면 맞춤 3코스를 추천
- **실제 장소만** — 카카오 로컬 데이터를 기반으로 해, 존재하지 않거나 폐업한 곳을 추천하지 않음
- **지도 + 동선** — 추천된 코스를 지도 위에 마커와 동선으로 표시
- **(예정) 링크 공유** — 만든 코스를 링크 하나로 연인에게 전달

## 어떻게 동작하나

1. **장소 검색** — 카카오 로컬 REST API로 입력 지역의 식당·카페·액티비티 후보를 검색 (서버)
2. **큐레이션** — 후보 목록을 Gemini에 넘겨, 분위기·예산에 맞는 3곳을 골라 동선으로 엮음
3. **환각 방지** — AI는 제공된 후보 안에서만 선택. 반환된 장소 ID가 실제 후보에 있는지 검증
4. **지도 렌더** — 장소 ID로 좌표를 찾아 지도에 마커와 동선(Polyline)으로 표시

> 핵심 원칙: **장소는 진짜(카카오 데이터), 흐름은 AI, 모든 외부 호출은 서버에서.**

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 프레임워크 | Next.js (App Router), React, TypeScript |
| 스타일 / UI | Tailwind CSS v4, shadcn/ui, lucide-react |
| 폼 / 검증 | react-hook-form, zod |
| 지도 | react-kakao-maps-sdk (카카오맵) |
| AI | Gemini API (`@google/genai`) |
| 장소 데이터 | 카카오 로컬 REST API |
| 애니메이션 | motion |
| 폰트 | Pretendard |
| 배포 (예정) | Vercel |
| DB (예정) | Supabase |

## 시작하기

### 사전 준비

- Node.js 18 이상
- 카카오 디벨로퍼스 앱 키 (REST API 키, JavaScript 키 각각)
- Gemini API 키 (Google AI Studio)

> 카카오 지도 SDK는 **JavaScript 키**를, 로컬 장소 검색은 **REST API 키**를 사용합니다.
> 카카오 콘솔에서 사이트 도메인(`http://localhost:3000`)을 등록해야 지도가 동작합니다.

### 설치 & 실행

```bash
git clone <repo-url>
cd <project>
npm install

# 환경 변수 설정 (아래 참고)
cp .env.example .env.local

npm run dev
```

### 환경 변수

`.env.local`에 다음을 설정합니다. (`.gitignore`에 포함되어 커밋되지 않습니다)

```
GEMINI_API_KEY=             # Gemini (서버)
KAKAO_REST_API_KEY=         # 카카오 로컬 장소 검색 (서버)
NEXT_PUBLIC_KAKAO_JS_KEY=   # 카카오 지도 SDK (클라이언트)
```

서버 전용 키(`GEMINI_API_KEY`, `KAKAO_REST_API_KEY`)에는 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.

## 프로젝트 구조

```
.
├── app/                  # Next.js App Router
├── components/           # UI 컴포넌트 (지도, 코스 카드, 입력 폼 등)
├── lib/                  # 코스 생성 엔진 (카카오 검색 + Gemini 큐레이션 + 검증)
├── prompts/
│   └── course-system.md  # 코스 큐레이션 시스템 프롬프트
└── CLAUDE.md             # 프로젝트 컨텍스트 (Claude Code용)
```

## 개발 로드맵

- [x] 핵심 엔진 검증 — 카카오 검색 → Gemini 큐레이션 → 검증된 JSON 코스
- [ ] **(진행 중)** Next.js 이식 — 입력 폼 → Server Action → 지도 + 동선 표시
- [ ] 프롬프트 튜닝 — 지도 위 결과를 보며 코스 품질 다듬기
- [ ] 코스 공유 링크 (Supabase)
- [ ] 공유용 데이트 카드 이미지
- [ ] 다지역 확장, 과거 코스 기록

## 라이선스

미정