import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "새내기 과목픽",
  description: "학과별 학생 강의 선택 통계를 살펴보는 신입생용 모바일 목업",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
