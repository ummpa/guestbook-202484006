import { beforeEach, describe, expect, test } from "vitest";
import { createTestDb } from "../test-db.ts";
import { createGuestbook, type EntryInput, type Guestbook } from "./guestbook.ts";

let guestbook: Guestbook;
let now: Date;

const MINUTE = 60 * 1000;

const valid: EntryInput = {
  name: "김맛집",
  restaurant: "해운대 할매국밥",
  region: "부산",
  rating: 5,
  message: "국물이 진하고 깔끔해요.",
  password: "1234",
};

async function write(override: Partial<EntryInput> = {}) {
  const result = await guestbook.createEntry({ ...valid, ...override });
  if (!result.ok) throw new Error(result.error);
  now = new Date(now.getTime() + MINUTE);
  return result.entryId;
}

beforeEach(async () => {
  now = new Date("2026-10-01T09:00:00Z");
  guestbook = createGuestbook(await createTestDb(), { now: () => now });
});

describe("작성", () => {
  test("쓴 글은 이름, 식당, 지역, 별점, 메시지, 작성 시각과 함께 목록에 보인다", async () => {
    const id = await write();

    expect(await guestbook.listEntries()).toEqual([
      {
        id,
        name: "김맛집",
        restaurant: "해운대 할매국밥",
        region: "부산",
        rating: 5,
        message: "국물이 진하고 깔끔해요.",
        createdAt: new Date("2026-10-01T09:00:00Z"),
        updatedAt: null,
      },
    ]);
  });

  test("목록에는 비밀번호가 드러나지 않는다", async () => {
    await write();
    const [entry] = await guestbook.listEntries();
    expect(JSON.stringify(entry)).not.toContain("1234");
    expect(entry).not.toHaveProperty("password");
  });

  test("앞뒤 공백은 잘려서 저장된다", async () => {
    await write({ name: "  김맛집 ", message: "  맛있어요  " });
    expect(await guestbook.listEntries()).toMatchObject([{ name: "김맛집", message: "맛있어요" }]);
  });

  test.each([
    ["빈 이름", { name: "  " }, "invalid-name"],
    ["21자 이름", { name: "가".repeat(21) }, "invalid-name"],
    ["빈 식당 이름", { restaurant: "" }, "invalid-restaurant"],
    ["51자 식당 이름", { restaurant: "가".repeat(51) }, "invalid-restaurant"],
    ["목록에 없는 지역", { region: "부산광역시" }, "invalid-region"],
    ["별점 0", { rating: 0 }, "invalid-rating"],
    ["별점 6", { rating: 6 }, "invalid-rating"],
    ["소수 별점", { rating: 3.5 }, "invalid-rating"],
    ["빈 메시지", { message: " " }, "invalid-message"],
    ["501자 메시지", { message: "가".repeat(501) }, "invalid-message"],
    ["3자 비밀번호", { password: "123" }, "invalid-password"],
    ["31자 비밀번호", { password: "a".repeat(31) }, "invalid-password"],
  ])("%s이면 거절되고 저장되지 않는다", async (_name, override, error) => {
    expect(await guestbook.createEntry({ ...valid, ...override })).toEqual({ ok: false, error });
    expect(await guestbook.listEntries()).toEqual([]);
  });

  test("경계값: 20자 이름, 50자 식당, 500자 메시지, 4자·30자 비밀번호는 저장된다", async () => {
    await write({ name: "가".repeat(20), restaurant: "가".repeat(50), message: "가".repeat(500) });
    await write({ password: "a".repeat(30) });
    expect(await guestbook.listEntries()).toHaveLength(2);
  });
});

describe("조회", () => {
  test("목록은 최신 작성 순이다", async () => {
    await write({ message: "첫 글" });
    await write({ message: "둘째 글" });
    await write({ message: "셋째 글" });

    expect((await guestbook.listEntries()).map((e) => e.message)).toEqual(["셋째 글", "둘째 글", "첫 글"]);
  });

  test("글을 수정해도 목록 순서는 바뀌지 않는다", async () => {
    const first = await write({ message: "첫 글" });
    await write({ message: "둘째 글" });

    await guestbook.updateMessage(first, "1234", "고친 첫 글");

    expect((await guestbook.listEntries()).map((e) => e.message)).toEqual(["둘째 글", "고친 첫 글"]);
  });
});

describe("수정", () => {
  test("비밀번호가 맞으면 메시지가 바뀌고 수정 시각이 남는다", async () => {
    const id = await write();

    expect(await guestbook.updateMessage(id, "1234", "  다시 가 봐도 맛있어요 ")).toEqual({ ok: true });

    expect(await guestbook.listEntries()).toMatchObject([
      { id, message: "다시 가 봐도 맛있어요", updatedAt: now, restaurant: "해운대 할매국밥" },
    ]);
  });

  test("비밀번호가 틀리면 거절되고 메시지는 그대로다", async () => {
    const id = await write();

    expect(await guestbook.updateMessage(id, "4321", "몰래 고친 글")).toEqual({
      ok: false,
      error: "wrong-password",
    });

    expect(await guestbook.listEntries()).toMatchObject([{ message: valid.message, updatedAt: null }]);
  });

  test("다른 글의 비밀번호로는 고칠 수 없다", async () => {
    const mine = await write({ password: "mine1" });
    await write({ password: "yours" });

    expect(await guestbook.updateMessage(mine, "yours", "x")).toEqual({ ok: false, error: "wrong-password" });
  });

  test("수정할 메시지도 입력 규칙을 따른다", async () => {
    const id = await write();
    expect(await guestbook.updateMessage(id, "1234", "")).toEqual({ ok: false, error: "invalid-message" });
    expect(await guestbook.updateMessage(id, "1234", "가".repeat(501))).toEqual({
      ok: false,
      error: "invalid-message",
    });
  });

  test("없는 글은 고칠 수 없다", async () => {
    expect(await guestbook.updateMessage(9999, "1234", "x")).toEqual({ ok: false, error: "not-found" });
  });
});

describe("삭제", () => {
  test("비밀번호가 맞으면 글이 사라진다", async () => {
    const id = await write();
    await write({ message: "남을 글" });

    expect(await guestbook.deleteEntry(id, "1234")).toEqual({ ok: true });

    expect((await guestbook.listEntries()).map((e) => e.message)).toEqual(["남을 글"]);
  });

  test("비밀번호가 틀리면 거절되고 글은 남는다", async () => {
    const id = await write();

    expect(await guestbook.deleteEntry(id, "wrong")).toEqual({ ok: false, error: "wrong-password" });

    expect(await guestbook.listEntries()).toHaveLength(1);
  });

  test("없는 글은 지울 수 없다", async () => {
    expect(await guestbook.deleteEntry(9999, "1234")).toEqual({ ok: false, error: "not-found" });
  });
});
