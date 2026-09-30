"use client";

import { useActionState, useState } from "react";
import { deleteEntryAction, updateMessageAction, type FormState } from "./actions";

const initialState: FormState = { ok: false, error: null };

type Mode = "idle" | "edit" | "delete";

// 수정·삭제 buttons for one 글; both ask for the 비밀번호 given when it was written.
export function EntryActions({ entryId, message }: { entryId: number; message: string }) {
  const [mode, setMode] = useState<Mode>("idle");

  if (mode === "idle") {
    return (
      <div className="flex justify-end gap-1">
        <button type="button" className="rounded-lg px-2 py-1 text-sm hover:bg-orange-soft" onClick={() => setMode("edit")}>
          수정
        </button>
        <button type="button" className="btn-danger" onClick={() => setMode("delete")}>
          삭제
        </button>
      </div>
    );
  }

  return mode === "edit" ? (
    <EditForm entryId={entryId} message={message} onClose={() => setMode("idle")} />
  ) : (
    <DeleteForm entryId={entryId} onClose={() => setMode("idle")} />
  );
}

function EditForm({ entryId, message, onClose }: { entryId: number; message: string; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(updateMessageAction.bind(null, entryId), initialState);
  const [draft, setDraft] = useState(message);
  const [password, setPassword] = useState("");

  if (state.ok && !pending) {
    return (
      <div className="flex items-center justify-between">
        <p className="notice">메시지를 수정했어요.</p>
        <button type="button" className="btn-ghost text-sm" onClick={onClose}>
          닫기
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 border-t border-line pt-3">
      <label className="label">
        <span>메시지 수정</span>
        <textarea
          name="message"
          className="input min-h-24"
          required
          maxLength={500}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      <PasswordField value={password} onChange={setPassword} />
      {state.error && (
        <p className="error" role="alert">
          {state.error} {state.error.includes("비밀번호") && "수정이 거부되었어요."}
        </p>
      )}
      <div className="flex gap-2">
        <button className="btn" disabled={pending}>
          {pending ? "수정하는 중…" : "수정"}
        </button>
        <button type="button" className="btn-ghost" onClick={onClose}>
          취소
        </button>
      </div>
    </form>
  );
}

function DeleteForm({ entryId, onClose }: { entryId: number; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(deleteEntryAction.bind(null, entryId), initialState);
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-2 border-t border-line pt-3">
      <p className="text-sm font-medium">이 글을 삭제하려면 비밀번호를 입력해 주세요.</p>
      <PasswordField value={password} onChange={setPassword} />
      {state.error && (
        <p className="error" role="alert">
          {state.error} {state.error.includes("비밀번호") && "삭제가 거부되었어요."}
        </p>
      )}
      <div className="flex gap-2">
        <button className="btn bg-danger hover:bg-red-800" disabled={pending}>
          {pending ? "삭제하는 중…" : "삭제"}
        </button>
        <button type="button" className="btn-ghost" onClick={onClose}>
          취소
        </button>
      </div>
    </form>
  );
}

function PasswordField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="label">
      <span>비밀번호</span>
      <input
        name="password"
        type="password"
        className="input"
        required
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
