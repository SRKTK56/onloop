import type { Metadata } from "next";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "@/components/shared/Providers";
import { Header } from "@/components/shared/Header";

export const metadata: Metadata = {
  title: "ONLOOP｜恩ループ",
  description: "恩送りが繋がり、ループして、みんなに戻ってくる。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
