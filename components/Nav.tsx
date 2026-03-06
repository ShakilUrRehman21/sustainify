"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Dashboard" },
    { href: "/categorize", label: "Categorizer" },
    { href: "/proposals", label: "Proposals" },
    { href: "/impact", label: "Impact" },
    { href: "/chat", label: "Support Bot" },
    { href: "/logs", label: "Logs" },
];

export default function Nav() {
    const pathname = usePathname();
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/8 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
                    <span className="text-xl font-bold gradient-text">Sustainify</span>
                    <span className="text-xs text-white/40 mt-0.5 hidden sm:block">AI Systems</span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${pathname === l.href
                                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
