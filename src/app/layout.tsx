import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/elementor-frontend.css";
import "@/styles/wp-global-styles.css";
import "@/styles/wp-kit-global.css";
import "@/styles/wp-custom.css";
import "@/styles/wp-header.css";
import "@/styles/wp-footer.css";
import "@/styles/wp-mobile-menu.css";
import "@/styles/wp-megamenu-1.css";
import "@/styles/wp-megamenu-2.css";
import "@/styles/wp-theme-full.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DXD Asia",
    template: "%s",
  },
  description: "DXD Asia — digital marketing, SEO and web design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
