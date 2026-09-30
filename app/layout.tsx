import type { Metadata } from "next";
import { DEVELOPER } from "./developer";
import "./globals.css";

export const metadata: Metadata = {
  title: "맛집 방명록",
  description: "전국 곳곳의 맛있었던 식당, 소개하고 싶은 식당을 남기는 방명록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-line bg-cream">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 px-4 py-3">
            <span className="flex items-center gap-1 text-lg font-bold text-orange-dark">
              <span aria-hidden>🍚</span> 맛집 방명록
            </span>
            <span className="text-sm">
              개발자 <b>{DEVELOPER.name}</b> · 학번 <b>{DEVELOPER.studentId}</b>
            </span>
          </div>
        </header>
        {children}
        <footer className="muted mx-auto mt-auto w-full max-w-2xl px-4 pb-6 pt-10 text-center text-xs">
          만든 사람: {DEVELOPER.name} ({DEVELOPER.studentId})
        </footer>
      </body>
    </html>
  );
}
