# guestbook-202484006 · 맛집 방명록

전국 식당을 다니며 맛있었던 곳, 소개하고 싶은 곳을 가입 없이 남기는 미니 방명록.

- 개발자: 김서은 · 학번 202484006
- 스택: Next.js 16 (App Router) + TypeScript, Neon Postgres, Vercel
- 개발 방식: Claude Code + Matt Pocock's Skills (`/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` → `/code-review`)

## 기능

- **작성**: 이름, 글 비밀번호, 식당 이름, 지역, 별점, 메시지를 입력해 글을 남긴다.
- **조회**: 누구나 전체 글을 최신 작성 순으로 본다.
- **수정**: 글 비밀번호를 입력해 메시지를 고친다. 틀리면 거부되고 "비밀번호가 일치하지 않습니다."가 표시된다.
- **삭제**: 글 비밀번호를 입력해 글을 지운다. 틀리면 거부되고 같은 안내가 표시된다.
- 글 비밀번호는 scrypt 해시로만 저장된다.

## 실행

```bash
npm install
# .env.local 에 DATABASE_URL=<Neon 접속 주소>
npm run db:schema   # 테이블 생성
npm run dev
npm test            # PGlite 위에서 방명록 모듈 테스트
```

Vercel 환경변수: `DATABASE_URL`

## 문서

- 용어: [GLOSSARY.md](GLOSSARY.md)
- 결정: [docs/adr](docs/adr)
- 스펙: [.scratch/exam-guestbook/spec.md](.scratch/exam-guestbook/spec.md)
