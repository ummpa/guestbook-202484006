import type { Metadata } from "next";
import { Gowun_Dodum, Jua } from "next/font/google";
import { DEVELOPER } from "./developer";
import "./globals.css";

// 동글동글한 한글 글꼴: 제목은 Jua, 본문은 Gowun Dodum.
const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua", display: "swap" });
const gowun = Gowun_Dodum({ weight: "400", subsets: ["latin"], variable: "--font-gowun", display: "swap" });

export const metadata: Metadata = {
  title: "냠냠 맛집 방명록",
  description: "전국 곳곳의 맛있었던 식당, 소개하고 싶은 식당을 남기는 방명록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} ${gowun.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 border-b-2 border-dashed border-line bg-cream/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 px-4 py-3">
            <a href="#top" className="font-display flex items-center gap-1.5 text-xl text-orange-dark">
              <span aria-hidden className="wiggle inline-block">
                🍙
              </span>
              냠냠 맛집 방명록
            </a>
            <span className="rounded-full bg-paper px-3 py-1 text-xs shadow-sm ring-1 ring-line">
              👩‍🍳 {DEVELOPER.name} · {DEVELOPER.studentId}
            </span>
          </div>
        </header>
        {children}
        <footer className="mx-auto mt-auto w-full max-w-3xl px-4 pb-8 pt-12 text-center">
          <p aria-hidden className="text-2xl tracking-[0.4em]">
            🍜🍣🍗🥟🍰
          </p>
          <p className="muted mt-2 text-sm">
            만든 사람 <b className="text-ink">{DEVELOPER.name}</b> · 학번 <b className="text-ink">{DEVELOPER.studentId}</b>
          </p>
        </footer>
      </body>
    </html>
  );
}
