"use server";

import { revalidatePath } from "next/cache";
import { getGuestbook, type ChangeError, type CreateError } from "@/lib/guestbook";

export type FormState = { ok: boolean; error: string | null };

const ERRORS: Record<CreateError | ChangeError, string> = {
  "invalid-name": "이름은 1~20자로 입력해 주세요.",
  "invalid-restaurant": "식당 이름은 1~50자로 입력해 주세요.",
  "invalid-region": "지역을 골라 주세요.",
  "invalid-rating": "별점을 1~5점 중에서 골라 주세요.",
  "invalid-message": "메시지는 1~500자로 입력해 주세요.",
  "invalid-password": "비밀번호는 4~30자로 입력해 주세요.",
  "not-found": "글을 찾을 수 없어요. 이미 삭제되었을 수 있어요.",
  "wrong-password": "비밀번호가 일치하지 않습니다.",
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function createEntryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await getGuestbook().createEntry({
    name: text(formData, "name"),
    restaurant: text(formData, "restaurant"),
    region: text(formData, "region"),
    rating: Number(text(formData, "rating")),
    message: text(formData, "message"),
    password: text(formData, "password"),
  });
  if (!result.ok) return { ok: false, error: ERRORS[result.error] };

  revalidatePath("/");
  return { ok: true, error: null };
}

export async function updateMessageAction(
  entryId: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await getGuestbook().updateMessage(
    entryId,
    text(formData, "password"),
    text(formData, "message"),
  );
  if (!result.ok) return { ok: false, error: ERRORS[result.error] };

  revalidatePath("/");
  return { ok: true, error: null };
}

export async function deleteEntryAction(
  entryId: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await getGuestbook().deleteEntry(entryId, text(formData, "password"));
  if (!result.ok) return { ok: false, error: ERRORS[result.error] };

  revalidatePath("/");
  return { ok: true, error: null };
}
