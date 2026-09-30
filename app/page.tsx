import { getGuestbook } from "@/lib/guestbook";
import { EntryActions } from "./entry-actions";
import { formatDateTime } from "./format";
import { Stars } from "./stars";
import { WriteForm } from "./write-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await getGuestbook().listEntries();

  return (
    <main className="page">
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">전국 맛집 방명록</h1>
        <p className="muted">다녀온 식당 중 맛있었던 곳, 소개하고 싶은 곳을 남겨 주세요.</p>
      </section>

      <WriteForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">
          방명록 <span className="muted text-base font-normal">{entries.length}개 · 최신순</span>
        </h2>
        {entries.length === 0 && <p className="card muted text-center">아직 남긴 글이 없어요. 첫 글을 남겨 주세요!</p>}
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="card flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{entry.region}</span>
                <span className="font-bold">{entry.restaurant}</span>
                <Stars value={entry.rating} />
              </div>
              <p className="whitespace-pre-wrap wrap-break-word">{entry.message}</p>
              <p className="muted text-xs">
                <span className="font-semibold text-ink">{entry.name}</span> · {formatDateTime(entry.createdAt)}
                {entry.updatedAt && ` · 수정됨 ${formatDateTime(entry.updatedAt)}`}
              </p>
              <EntryActions entryId={entry.id} message={entry.message} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
