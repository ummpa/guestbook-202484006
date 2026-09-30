"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Sort } from "@/lib/guestbook";
import { SORT_OPTIONS } from "./sort-options";

// 목록 정렬 드롭다운. The choice lives in the URL (?sort=) so it survives reloads and links.
export function SortSelect({ value }: { value: Sort }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">정렬</span>
      <select
        className={`input w-auto cursor-pointer py-1.5 pr-8 font-bold ${pending ? "opacity-60" : ""}`}
        value={value}
        onChange={(e) => {
          const sort = e.target.value;
          startTransition(() =>
            router.replace(sort === "latest" ? pathname : `${pathname}?sort=${sort}`, { scroll: false }),
          );
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.emoji} {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
