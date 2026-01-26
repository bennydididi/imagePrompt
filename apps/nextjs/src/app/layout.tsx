import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import "~/styles/globals.css";

import { NextDevtoolsProvider } from "@next-devtools/core";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { cn } from "@saasfly/ui";
import { Toaster } from "@saasfly/ui/toaster";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { i18n } from "~/config/i18n-config";
import { siteConfig } from "~/config/site";

// import { Suspense } from "react";
// import { PostHogPageview } from "~/config/providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../styles/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: {
    default: siteConfig.description,
    en: "Image to Prompt — Generate prompts from images. Describe this image and get AI-ready prompts quickly.",
    zh: "图像转提示词 — 将图片自动描述并生成高质量 AI prompt，支持一键复制与导出。",
  },
  keywords: [
    "image to prompt",
    "describe this image",
    "image prompt.org",
    "image describer",
    "imageprompt",
    "ai describe image",
    "image prompt",
    "image to prompt generator",
    "describe image",
  ],
  authors: [
    {
      name: "saasfly",
    },
  ],
  creator: "Saasfly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: siteConfig.ogImage || `${siteConfig.url}/logo.svg`,
  },
  icons: {
    icon: "/logo.svg",
    // shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-US": `${siteConfig.url}/en`,
      "zh-CN": `${siteConfig.url}/zh`,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    images: siteConfig.ogImage || `${siteConfig.url}/logo.svg`,
  },
  // manifest: `${siteConfig.url}/site.webmanifest`,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "url": siteConfig.url,
      "name": siteConfig.name,
      "logo": `${siteConfig.url}/logo.svg`
    },
    {
      "@type": "WebSite",
      "url": siteConfig.url,
      "name": siteConfig.name,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        var _hmt = _hmt || []; 
        (function() { 
          var hm = document.createElement("script"); 
          hm.src = "https://hm.baidu.com/hm.js?11edbc5d9fedc9d8c8dac5a73ddef1f0"; 
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s); 
        })(); 
      `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" hrefLang="en-US" href={`${siteConfig.url}/en`} />
        <link rel="alternate" hrefLang="zh-CN" href={`${siteConfig.url}/zh`} />
      </head>
      {/*<Suspense>*/}
      {/*  <PostHogPageview />*/}
      {/*</Suspense>*/}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <NextDevtoolsProvider>{children}</NextDevtoolsProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
