import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoWeather Nexus",
  description: "Real-time cryptocurrency and weather data dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" richColors closeButton />
        </NotificationProvider>
      </body>
    </html>
  );
}
