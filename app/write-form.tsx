"use client";

import { useActionState, useState } from "react";
import { REGIONS } from "@/lib/regions";
import { createEntryAction, type FormState } from "./actions";

const initialState: FormState = { ok: false, error: null };
const empty = { name: "", restaurant: "", region: "", rating: 0, message: "", password: "" };
const RATING_WORDS = ["골라 주세요", "음… 그냥 그래요 😐", "나쁘지 않아요 🙂", "맛있어요 😋", "정말 맛있어요 🤤", "인생 맛집! 😍"];

// Controlled, so a rejected submission keeps what was typed; cleared once saved.
export function WriteForm() {
  const [values, setValues] = useState(empty);
  const set = (patch: Partial<typeof empty>) => setValues((v) => ({ ...v, ...patch }));
  const [state, formAction, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const next = await createEntryAction(prev, formData);
    if (next.ok) setValues(empty);
    return next;
  }, initialState);

  return (
    <form action={formAction} className="card relative flex flex-col gap-4 border-dashed bg-white/80">
      <div className="flex items-center gap-3">
        <span aria-hidden className="wiggle inline-block text-4xl">
          📒
        </span>
        <div>
          <h2 className="font-display text-2xl">맛집 한 줄 남기기</h2>
          <p className="muted text-sm">비밀번호는 나중에 글을 고치거나 지울 때 필요해요.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="label">
          <span>🙋 이름</span>
          <input
            name="name"
            className="input"
            required
            maxLength={20}
            value={values.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </label>
        <label className="label">
          <span>🔒 비밀번호 (수정·삭제용)</span>
          <input
            name="password"
            type="password"
            className="input"
            required
            minLength={4}
            maxLength={30}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => set({ password: e.target.value })}
          />
        </label>
        <label className="label">
          <span>🏠 식당 이름</span>
          <input
            name="restaurant"
            className="input"
            required
            maxLength={50}
            placeholder="예: 해운대 할매국밥"
            value={values.restaurant}
            onChange={(e) => set({ restaurant: e.target.value })}
          />
        </label>
        <label className="label">
          <span>📍 지역</span>
          <select
            name="region"
            className="input"
            required
            value={values.region}
            onChange={(e) => set({ region: e.target.value })}
          >
            <option value="" disabled>
              시/도를 골라 주세요
            </option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className="text-sm font-bold">⭐ 별점</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-lg text-4xl leading-none transition hover:scale-125 has-focus-visible:ring-2 has-focus-visible:ring-orange"
            >
              <input
                type="radio"
                name="rating"
                value={n}
                className="sr-only"
                required
                checked={values.rating === n}
                onChange={() => set({ rating: n })}
              />
              <span className={n <= values.rating ? "text-star" : "text-line"} aria-label={`${n}점`}>
                ★
              </span>
            </label>
          ))}
          <span className="font-display ml-2 text-base text-orange-dark">{RATING_WORDS[values.rating]}</span>
        </div>
      </fieldset>

      <label className="label">
        <span>💬 메시지</span>
        <textarea
          name="message"
          className="input min-h-28"
          required
          maxLength={500}
          placeholder="어떤 점이 맛있었나요? 추천 메뉴도 알려 주세요."
          value={values.message}
          onChange={(e) => set({ message: e.target.value })}
        />
        <small className="muted self-end">{Array.from(values.message).length} / 500</small>
      </label>

      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && !pending && <p className="notice">🎉 맛집을 남겼어요! 아래 목록에서 확인해 보세요.</p>}

      <button className="btn" disabled={pending}>
        {pending ? "🍳 굽는 중…" : "🍽️ 맛집 남기기"}
      </button>
    </form>
  );
}
