import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { env } from "@/env";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: {
    default: "Quinta Akpan | Journalist & Writer",
    template: "%s | Quinta Akpan",
  },
  description:
    "Portfolio of Quinta Akpan. Experienced journalist, writer, and editor covering culture, news, and more.",
  authors: [{ name: "Quinta Akpan", url: env.BASE_URL }],
  creator: "Quinta Akpan",
  publisher: "Quinta Akpan",
  keywords: [
    "journalist",
    "writer",
    "editor",
    "Quinta Akpan",
    "Nigeria",
    "Uyo",
    "culture",
    "news",
    "reporting",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quinta Akpan | Journalist & Writer",
    description:
      "Portfolio of Quinta Akpan. Experienced journalist, writer, and editor covering culture, news, and more.",
    url: env.BASE_URL,
    siteName: "Quinta Akpan",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Quinta Akpan | Journalist & Writer",
    description:
      "Portfolio of Quinta Akpan. Experienced journalist, writer, and editor covering culture, news, and more.",
    card: "summary_large_image",
  },
};

import { TRPCReactProvider } from "@/features/trpc/provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <NextTopLoader color="var(--primary)" showSpinner={false} />
            {children}
            <Toaster richColors={false} position="bottom-right" />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
