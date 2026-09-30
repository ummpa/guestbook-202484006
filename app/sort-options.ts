import type { Sort } from "@/lib/guestbook";

// 목록 정렬 기준. Shared by the page (server) and the dropdown (client).
export const SORT_OPTIONS: { value: Sort; emoji: string; label: string }[] = [
  { value: "latest", emoji: "🕒", label: "최신순" },
  { value: "rating", emoji: "⭐", label: "별점 높은 순" },
  { value: "popular", emoji: "📒", label: "방명록 많은 순" },
  { value: "oldest", emoji: "⏳", label: "오래된 순" },
];
