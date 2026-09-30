import { getGuestbook, isSort, type Sort } from "@/lib/guestbook";
import { EntryActions } from "./entry-actions";
import { foodEmoji, regionColor } from "./food";
import { formatDateTime } from "./format";
import { SORT_OPTIONS } from "./sort-options";
import { SortSelect } from "./sort-select";
import { Stars } from "./stars";
import { WriteForm } from "./write-form";

export const dynamic = "force-dynamic";

// Floating food around the hero title: [emoji, position classes, tilt, delay].
const HERO_FOOD: [string, string, string, string][] = [
  ["🍜", "left-[4%] top-[12%] text-5xl", "-10deg", "0s"],
  ["🍣", "right-[6%] top-[8%] text-4xl", "12deg", "0.6s"],
  ["🍗", "left-[10%] bottom-[10%] text-4xl", "8deg", "1.2s"],
  ["🥟", "right-[12%] bottom-[14%] text-5xl", "-6deg", "0.3s"],
  ["🍰", "left-[46%] top-[4%] text-3xl", "10deg", "0.9s"],
  ["🌶️", "right-[32%] bottom-[4%] text-3xl", "-14deg", "1.5s"],
];

export default async function Home({ searchParams }: PageProps<"/">) {
  const { sort: sortParam } = await searchParams;
  const sort: Sort = isSort(sortParam) ? sortParam : "latest";
  const entries = await getGuestbook().listEntries(sort);
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)!.label;
  const regions = new Set(entries.map((e) => e.region)).size;
  const average = entries.length ? entries.reduce((sum, e) => sum + e.rating, 0) / entries.length : null;

  return (
    <main id="top" className="page">
      {/* 첫 화면: 여기가 맛집 모음 방명록이라는 걸 한눈에 */}
      <section className="relative overflow-hidden rounded-4xl border-2 border-line bg-linear-to-br from-orange-soft via-paper to-amber-100 px-6 py-12 text-center shadow-[0_6px_0_var(--line)] sm:py-16">
        {HERO_FOOD.map(([emoji, position, tilt, delay]) => (
          <span
            key={emoji}
            aria-hidden
            className={`float pointer-events-none absolute select-none opacity-90 ${position}`}
            style={{ ["--r" as string]: tilt, animationDelay: delay }}
          >
            {emoji}
          </span>
        ))}
        <p className="font-display relative mx-auto mb-3 w-fit -rotate-2 rounded-full bg-tomato px-4 py-1 text-sm text-white shadow">
          전국 맛집 탐방 기록장 🗺️
        </p>
        <h1 className="font-display relative text-4xl leading-tight text-ink sm:text-6xl">
          여기 <span className="text-orange-dark">진짜</span> 맛있어요!
        </h1>
        <p className="relative mx-auto mt-4 max-w-md text-base text-muted sm:text-lg">
          서울부터 제주까지, 다녀온 식당 중 또 가고 싶은 곳을
          <br className="hidden sm:inline" /> 한 줄씩 남겨 주세요. 🥢
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <a href="#write" className="btn">
            ✍️ 맛집 남기러 가기
          </a>
          <a href="#list" className="btn-ghost font-display text-lg">
            👀 구경하기
          </a>
        </div>
      </section>

      {/* 한눈에 보는 숫자 */}
      <section className="grid grid-cols-3 gap-3">
        <Stat emoji="📝" label="모인 맛집 글" value={`${entries.length}개`} />
        <Stat emoji="📍" label="다녀간 지역" value={`${regions}곳`} />
        <Stat emoji="⭐" label="평균 별점" value={average === null ? "-" : average.toFixed(1)} />
      </section>

      <section id="write" className="scroll-mt-20">
        <WriteForm />
      </section>

      <section id="list" className="flex scroll-mt-20 flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display flex items-end gap-2 text-2xl">
            🍽️ 맛집 방명록
            <span className="muted font-sans text-sm">
              {sortLabel} · {entries.length}개
            </span>
          </h2>
          <SortSelect value={sort} />
        </div>

        {entries.length === 0 && (
          <div className="card flex flex-col items-center gap-2 py-10 text-center">
            <span aria-hidden className="float text-6xl">
              🍳
            </span>
            <p className="font-display text-xl">아직 식탁이 비어 있어요</p>
            <p className="muted">첫 번째 맛집을 소개해 주세요!</p>
          </div>
        )}

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="pop-in card relative flex flex-col gap-3 transition hover:-translate-y-1 hover:rotate-0"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms`, rotate: i % 2 ? "0.6deg" : "-0.6deg" }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="grid size-14 shrink-0 place-items-center rounded-2xl bg-orange-soft text-3xl shadow-inner"
                >
                  {foodEmoji(entry.restaurant)}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap gap-1">
                    <span className={`chip w-fit ${regionColor(entry.region)}`}>📍 {entry.region}</span>
                    {entry.restaurantEntryCount > 1 && (
                      <span className="chip w-fit bg-mustard/40 text-ink">📒 방명록 {entry.restaurantEntryCount}개</span>
                    )}
                  </span>
                  <h3 className="font-display wrap-break-word text-xl leading-snug">{entry.restaurant}</h3>
                  <Stars value={entry.rating} />
                </div>
              </div>
              <p className="relative whitespace-pre-wrap wrap-break-word rounded-2xl bg-cream px-4 py-3 leading-relaxed">
                {entry.message}
              </p>
              <p className="muted flex flex-wrap items-center gap-x-2 text-xs">
                <span className="font-display text-sm text-ink">🙋 {entry.name}</span>
                <span>{formatDateTime(entry.createdAt)}</span>
                {entry.updatedAt && <span>· 수정됨 {formatDateTime(entry.updatedAt)}</span>}
              </p>
              <EntryActions entryId={entry.id} message={entry.message} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Stat({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="card flex flex-col items-center gap-0.5 px-2 py-4 text-center">
      <span aria-hidden className="text-2xl">
        {emoji}
      </span>
      <span className="font-display text-2xl text-orange-dark">{value}</span>
      <span className="muted text-xs">{label}</span>
    </div>
  );
}
