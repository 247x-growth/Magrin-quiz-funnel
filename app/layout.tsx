import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
        <link rel="preconnect" href="https://sgtm.andreamagrin.com" />
      </head>
      <body>
        {/* Google Tag Manager (server-side container @ sgtm.andreamagrin.com) */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://sgtm.andreamagrin.com/db5k8hseuxhzo.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','2iv=Bh5VPyEoXjwtQlAiJlM3ThlHWlZEQxcGUhsGHAcAEgUOHRoRG0sQBwI%3D');`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
