import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from 'next/font/google'
import "./globals.css";

const jetBrains = JetBrains_Mono({ subsets: ['latin'], variable: '--next-font-mono' });
const inter = Inter({ subsets: ['latin'], variable: '--next-font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL("https://midnightcode.io"),
  title: {
    default: "Midnight Code | Web Development in North Carolina",
    template: "%s | Midnight Code",
  },
  description:
      "Midnight Code builds responsive websites and web apps using Next.js, Sanity, and Supabase. Based in North Carolina — let's build your next project.",
  openGraph: {
    siteName: "Midnight Code",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en"
      className={`${jetBrains.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
      </html>
  );
}