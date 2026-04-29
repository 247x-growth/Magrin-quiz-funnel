import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4ECE0" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0A1F" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://andreamagrin.com"),
  applicationName: "MindReset · Metodo Magrin",
  authors: [{ name: "Andrea Magrin" }],
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
