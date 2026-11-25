import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { BACKGROUND_STORAGE_KEY, backgroundOptions } from "@/config/background";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const backgroundIds = backgroundOptions.map((option) => option.id);
const backgroundBootstrap = `(function(){try{var v=localStorage.getItem("${BACKGROUND_STORAGE_KEY}");if(v&&${JSON.stringify(backgroundIds)}.indexOf(v)>-1)document.documentElement.dataset.bg=v}catch(e){}})();`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    "hand-drawn svg stickers",
    "crayon svg stickers",
    "free svg stickers",
    "react svg stickers",
    "vue svg stickers",
    "doodle svg icons",
    "scribble svg",
    "wax crayon vector",
    "trazo-stickers",
    "web stickers",
  ],
  authors: [{ name: siteConfig.author.name, url: "https://www.akoder.xyz" }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  category: "Design & Developer Tools",
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
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    site: "@AdiKodez",
    creator: "@AdiKodez",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-background font-sans",
        dmSans.variable,
        geistMono.variable,
        caveat.variable,
      )}
    >
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: backgroundBootstrap }} />
        <TooltipProvider>{children}</TooltipProvider>
        <Script
          defer
          src="https://talvess.app/script.js"
          data-website-id="021c9712-faed-478f-a94b-a771e1692c49"
        />
      </body>
    </html>
  );
}
