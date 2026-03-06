"use client";
import { useState } from "react";

interface Props {
    data: unknown;
    maxHeight?: string;
}

export default function JsonViewer({ data, maxHeight = "400px" }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const formatted = JSON.stringify(data, null, 2);

    return (
        <div className="rounded-xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/8">
                <span className="text-xs text-white/50 font-mono">JSON Output</span>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                    {collapsed ? "▶ Expand" : "▼ Collapse"}
                </button>
            </div>
            {!collapsed && (
                <pre
                    style={{ maxHeight, overflowY: "auto" }}
                    className="p-4 text-xs font-mono leading-relaxed text-green-300/90 bg-black/30"
                >
                    {formatted}
                </pre>
            )}
        </div>
    );
}
