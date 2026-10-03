"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLeaf } from "@/components/Icons";

const links = [
    { href: "/", label: "Dashboard", badge: null },
    { href: "/categorize", label: "Categorizer", badge: "M1" },
    { href: "/proposals", label: "B2B Proposals", badge: "M2" },
    { href: "/impact", label: "Impact Engine", badge: "M3" },
    { href: "/chat", label: "Support Bot", badge: "M4" },
    { href: "/logs", label: "Observability", badge: "Logs" },
];

export default function Nav() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
                        <IconLeaf className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                                Sustainify
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                AI Suite
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                            Sustainable Commerce Platform
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav links */}
                <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
                    {links.map((l) => {
                        const isActive = pathname === l.href;
                        return (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-white text-emerald-800 shadow-sm border border-slate-200/80"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                }`}
                            >
                                {l.label}
                                {l.badge && (
                                    <span
                                        className={`text-[9px] font-mono px-1 rounded ${
                                            isActive
                                                ? "bg-emerald-100 text-emerald-800 font-bold"
                                                : "bg-slate-200/60 text-slate-500"
                                        }`}
                                    >
                                        {l.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Status & Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-[11px] font-medium">Gemini 2.5 Flash</span>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1 pb-2">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setMobileOpen(false)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                                pathname === l.href
                                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <span>{l.label}</span>
                            {l.badge && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {l.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
