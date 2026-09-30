import { systemClock, toDate, toDateOrNull, type Clock, type Db } from "../db.ts";
import { hashPassword, verifyPassword } from "../password.ts";
import { isRegion, type Region } from "../regions.ts";

// 방명록 글의 모든 규칙. 회원 가입 없이, 글마다 입력한 비밀번호로
// 작성자 본인의 수정·삭제만 허용한다 (ADR-0003). Pages only call this.

export type EntryInput = {
  name: string;
  restaurant: string;
  region: string;
  rating: number;
  message: string;
  password: string;
};

export type Entry = {
  id: number;
  name: string;
  restaurant: string;
  region: Region;
  rating: number;
  message: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateError =
  | "invalid-name"
  | "invalid-restaurant"
  | "invalid-region"
  | "invalid-rating"
  | "invalid-message"
  | "invalid-password";

export type ChangeError = "not-found" | "wrong-password";

type Fail<E> = { ok: false; error: E };

function length(text: string) {
  return Array.from(text).length;
}

function between(text: string, min: number, max: number) {
  return length(text) >= min && length(text) <= max;
}

function parseMessage(message: string) {
  const trimmed = message.trim();
  return between(trimmed, 1, 500) ? trimmed : null;
}

type EntryRow = {
  id: number;
  name: string;
  restaurant: string;
  region: Region;
  rating: number;
  message: string;
  created_at: Date | string;
  updated_at: Date | string | null;
};

function toEntry(r: EntryRow): Entry {
  return {
    id: r.id,
    name: r.name,
    restaurant: r.restaurant,
    region: r.region,
    rating: r.rating,
    message: r.message,
    createdAt: toDate(r.created_at),
    updatedAt: toDateOrNull(r.updated_at),
  };
}

export function createGuestbook(db: Db, clock: Partial<Clock> = {}) {
  const now = clock.now ?? systemClock.now;

  async function checkPassword(id: number, password: string): Promise<{ ok: true } | Fail<ChangeError>> {
    const [row] = await db.query<{ password_hash: string }>(
      `SELECT password_hash FROM guestbook_entries WHERE id = $1`,
      [id],
    );
    if (!row) return { ok: false, error: "not-found" };
    if (!(await verifyPassword(password, row.password_hash))) return { ok: false, error: "wrong-password" };
    return { ok: true };
  }

  return {
    async createEntry(input: EntryInput): Promise<{ ok: true; entryId: number } | Fail<CreateError>> {
      const name = input.name.trim();
      const restaurant = input.restaurant.trim();
      const message = parseMessage(input.message);

      if (!between(name, 1, 20)) return { ok: false, error: "invalid-name" };
      if (!between(restaurant, 1, 50)) return { ok: false, error: "invalid-restaurant" };
      if (!isRegion(input.region)) return { ok: false, error: "invalid-region" };
      if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
        return { ok: false, error: "invalid-rating" };
      }
      if (message === null) return { ok: false, error: "invalid-message" };
      if (!between(input.password, 4, 30)) return { ok: false, error: "invalid-password" };

      const [row] = await db.query<{ id: number }>(
        `INSERT INTO guestbook_entries (name, restaurant, region, rating, message, password_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [name, restaurant, input.region, input.rating, message, await hashPassword(input.password), now()],
      );
      return { ok: true, entryId: row.id };
    },

    // 최신 작성 순. 수정해도 순서는 작성 시각 기준 그대로다.
    async listEntries(): Promise<Entry[]> {
      const rows = await db.query<EntryRow>(
        `SELECT id, name, restaurant, region, rating, message, created_at, updated_at
         FROM guestbook_entries
         ORDER BY created_at DESC, id DESC`,
      );
      return rows.map(toEntry);
    },

    // 메시지만 고칠 수 있다.
    async updateMessage(
      id: number,
      password: string,
      message: string,
    ): Promise<{ ok: true } | Fail<ChangeError | "invalid-message">> {
      const checked = await checkPassword(id, password);
      if (!checked.ok) return checked;
      const parsed = parseMessage(message);
      if (parsed === null) return { ok: false, error: "invalid-message" };

      const rows = await db.query(
        `UPDATE guestbook_entries SET message = $2, updated_at = $3 WHERE id = $1 RETURNING id`,
        [id, parsed, now()],
      );
      return rows.length === 0 ? { ok: false, error: "not-found" } : { ok: true };
    },

    async deleteEntry(id: number, password: string): Promise<{ ok: true } | Fail<ChangeError>> {
      const checked = await checkPassword(id, password);
      if (!checked.ok) return checked;

      const rows = await db.query(`DELETE FROM guestbook_entries WHERE id = $1 RETURNING id`, [id]);
      return rows.length === 0 ? { ok: false, error: "not-found" } : { ok: true };
    },
  };
}

export type Guestbook = ReturnType<typeof createGuestbook>;
