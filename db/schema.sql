-- 방명록 글 하나. 회원 가입 없이, 글마다 입력한 비밀번호(해시로만 저장)로
-- 작성자 본인의 수정·삭제 권한을 확인한다 (ADR-0003).
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  restaurant text NOT NULL,
  region text NOT NULL CHECK (region IN (
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기',
    '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  )),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS guestbook_entries_created_at ON guestbook_entries (created_at DESC)
