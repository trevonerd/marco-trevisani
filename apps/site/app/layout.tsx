import type { Metadata, Viewport } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marcotrevisani.com"),
  title: {
    default: "Marco Trevisani | Lead Frontend Engineer",
    template: "%s | Marco Trevisani"
  },
  description:
    "Marco Trevisani is a lead frontend engineer in Bologna working with React, Next.js, frontend architecture, design systems and polished product UI.",
  applicationName: "Marco Trevisani",
  authors: [{ name: "Marco Trevisani", url: "https://www.marcotrevisani.com" }],
  creator: "Marco Trevisani",
  keywords: [
    "Marco Trevisani",
    "lead frontend engineer Bologna",
    "React developer",
    "Next.js developer",
    "frontend architecture",
    "design systems",
    "creative developer",
    "Trevisoft",
    "DJ Trevo"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Marco Trevisani | Lead Frontend Engineer",
    description:
      "React, Next.js, design systems and frontend architecture. Bologna-based, product-minded, web-first.",
    url: "/",
    siteName: "Marco Trevisani",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/marco_trevisani_web_developer_cartoon@2x.png",
        width: 400,
        height: 400,
        alt: "Marco Trevisani cartoon portrait"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Marco Trevisani | Lead Frontend Engineer",
    description:
      "React, Next.js, design systems and frontend architecture. Bologna-based, product-minded, web-first.",
    images: ["/marco_trevisani_web_developer_cartoon@2x.png"]
  },
  icons: {
    icon: [
      { url: "/ico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: [{ url: "/ico/apple-icon-180x180.png", sizes: "180x180" }]
  },
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09031a",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={audiowide.variable}>
      <body>{children}</body>
    </html>
  );
}
