import type { Metadata } from "next";

import "./globals.css";
import "../styles/fonts.css";

export const metadata: Metadata = {
  title: "My App",
  description: "My App Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-dseg">{children}</body>
    </html>
  );
}
