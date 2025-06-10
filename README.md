# 상상이상의 카드 - 창작 스토리텔링 앱

한국어 기반의 인터랙티브 카드 스토리텔링 웹 애플리케이션입니다. 사용자가 랜덤 카드를 뒤집어 이미지를 확인하고, 이를 바탕으로 창의적인 이야기를 작성할 수 있습니다.

## 주요 기능

- **랜덤 카드 생성**: 1~30장의 파스텔 색상 카드 생성
- **이중 이미지 소스**: 실물사진(Picsum) 또는 일러스트 선택 가능
- **인터랙티브 카드 뒤집기**: 클릭으로 카드 내용 확인
- **이야기 작성**: 뒤집힌 카드를 바탕으로 자유로운 창작
- **다중 내보내기**: TXT 및 JPG 형태로 작품 저장
- **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험

## 기술 스택

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **빌드 도구**: Vite
- **이미지 처리**: html2canvas
- **라우팅**: Wouter
- **폰트**: Noto Sans KR, Do Hyeon

## GitHub Pages 배포

### 자동 배포 설정

1. GitHub 저장소의 Settings > Pages로 이동
2. Source를 "GitHub Actions"로 선택
3. 코드를 main 브랜치에 푸시하면 자동으로 배포됩니다

### 수동 배포

```bash
# 의존성 설치
npm install

# 정적 사이트 빌드
node build-static.js

# dist 폴더의 내용을 GitHub Pages에 배포
```

### 로컬 개발

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드 테스트
npm run preview
```

## 프로젝트 구조

```
├── client/                 # 프론트엔드 소스
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── lib/           # 유틸리티 함수
│   │   └── assets/        # 정적 자산
├── .github/workflows/     # GitHub Actions
├── build-static.js       # 정적 빌드 스크립트
└── README.md
```

## 사용법

1. **카드 개수 설정**: 1~30 사이의 숫자 입력
2. **이미지 타입 선택**: 실물사진, 일러스트, 또는 둘 다
3. **카드 생성**: "카드 만들기" 버튼 클릭
4. **카드 뒤집기**: 원하는 카드를 클릭하여 이미지 확인
5. **이야기 작성**: 텍스트 영역에 창의적인 이야기 작성
6. **저장**: TXT 또는 JPG 형태로 작품 다운로드

## 라이선스

MIT License

## 개발자

교육뮤지컬 꿈꾸는 치수쌤