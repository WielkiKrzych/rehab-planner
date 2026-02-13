import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

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
    default: "Rehab Planner - Planowanie Rehabilitacji",
    template: "%s | Rehab Planner",
  },
  description: "Profesjonalna aplikacja do zarządzania planami rehabilitacji dla fizjoterapeutów.",
  keywords: ["rehabilitacja", "fizjoterapia", "plan rehabilitacji", "ćwiczenia", "pacjenci"],
  authors: [{ name: "Rehab Planner" }],
  creator: "Rehab Planner",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0a0a0f]`}
      >
        <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
        <div className="fixed top-20 left-10 w-72 h-72 bg-[#00f0ff]/20 rounded-full blur-[100px] animate-float pointer-events-none" />
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-[#ff00ff]/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{animationDelay: '2s'}} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b829dd]/10 rounded-full blur-[150px] pointer-events-none" />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
