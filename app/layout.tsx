import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/TabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutrition Coach",
  description: "Your personal AI-powered nutrition assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen pb-24`}
      >
        <main className="max-w-md mx-auto min-h-screen relative overflow-hidden bg-background">
          <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  );
}
