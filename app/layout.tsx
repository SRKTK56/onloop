import type { Metadata } from "next";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "@/components/shared/Providers";
import { Header } from "@/components/shared/Header";
import { LanguageProvider } from "@/lib/i18n/context";

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
      <head>
        <meta name="base:app_id" content="69f5dcfb7a671bc641dfdc93" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Inter:wght@500;700&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
