import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bé Học Tiếng Anh",
  description: "English Kids Roadmap MVP cho trẻ lớp 1-2"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
