import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexa — AI Business Intelligence for SMBs",
    template: "%s | Nexa",
  },
  description: "Next-generation business intelligence and autonomous agent orchestration tailored for modern SMBs. Seamlessly connect your tools for real-time operational analytics.",
  openGraph: {
    title: "Nexa — AI Business Intelligence for SMBs",
    description: "Next-generation business intelligence and autonomous agent orchestration tailored for modern SMBs. Seamlessly connect your tools for real-time operational analytics.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-neutral-800 selection:text-neutral-100">
        <ThemeProvider defaultTheme="system" storageKey="nexa-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
