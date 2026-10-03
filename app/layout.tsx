import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { IconLeaf } from "@/components/Icons";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sustainify — Sustainable Commerce AI Operations Suite",
  description:
    "Production-grade AI systems for circular e-commerce: auto-taxonomy & tagging, B2B procurement proposals, life-cycle impact analytics, and WhatsApp concierge.",
  keywords: [
    "Sustainable E-commerce",
    "AI Product Categorization",
    "ESG Impact Reporting",
    "Circular Economy",
    "B2B Sustainable Proposals",
    "Gemini 2.5 Flash",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="text-slate-800 min-h-screen antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
        <Nav />
        <main className="pt-20 min-h-[calc(100vh-140px)]">{children}</main>

        <footer className="mt-20 border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <IconLeaf className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold text-slate-800">Sustainify AI Systems</span>
              <span className="text-slate-300">•</span>
              <span>Autonomous Sustainable Commerce Engine</span>
            </div>

            <div className="flex items-center gap-6 font-mono text-[11px] text-slate-400">
              <span>Gemini 2.5 Flash</span>
              <span>Prisma ORM</span>
              <span>Neon PostgreSQL</span>
              <span>Zod Schema</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
