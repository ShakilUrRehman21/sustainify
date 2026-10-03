"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "@/components/Icons";

interface Props {
  data: unknown;
  maxHeight?: string;
  title?: string;
}

export default function JsonViewer({
  data,
  maxHeight = "360px",
  title = "Raw JSON Diagnostic Payload",
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const formatted = JSON.stringify(data, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 glass-card shadow-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/70 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-[11px] font-mono text-emerald-900 tracking-wider uppercase font-semibold">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyJson}
            className="text-[11px] text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer font-mono font-medium flex items-center gap-1"
          >
            {copied ? (
              <>
                <IconCheck className="w-3 h-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <IconCopy className="w-3 h-3" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[11px] text-slate-500 hover:text-emerald-800 transition-colors cursor-pointer font-medium"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <pre
          style={{ maxHeight, overflowY: "auto" }}
          className="p-4 text-xs font-mono leading-relaxed text-slate-800 bg-[#f8faf9] overflow-x-auto"
        >
          {formatted}
        </pre>
      )}
    </div>
  );
}
