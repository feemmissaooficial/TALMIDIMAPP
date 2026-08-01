import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SplashScreen from "./components/SplashScreen";
import KillOldServiceWorker from "./components/KillOldServiceWorker";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talmidim",
  description: "Jornada Urbana",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Talmidim",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-black text-white">
        <KillOldServiceWorker />
        <SplashScreen />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
