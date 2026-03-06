import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sustainify – AI Systems",
  description: "AI-powered sustainable commerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0f1a] text-white min-h-screen antialiased">
        <Nav />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
