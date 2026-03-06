"use client";
import { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  module: string;
  success: boolean;
  errorMsg: string | null;
  durationMs: number | null;
  createdAt: string;
  prompt: string;
  response: string;
  parsedJson: Record<string, any> | null;
}

const MODULE_COLORS: Record<string, string> = {
  categorize: "text-green-400 bg-green-500/10 border-green-500/30",
  proposal: "text-teal-400 bg-teal-500/10 border-teal-500/30",
  impact: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  chat: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function fetchLogs() {
    setLoading(true);
    const url = `/api/logs?limit=30${module ? `&module=${module}` : ""}`;
    const res = await fetch(url);
    const json = await res.json();
    setLogs(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, [module]);

  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <span className="text-xs text-white/40 uppercase tracking-widest">
          Observability
        </span>
        <h1 className="text-4xl font-black mt-1 mb-2 text-white">
          AI Prompt <span className="gradient-text">Logs</span>
        </h1>
        <p className="text-white/50">
          Every AI call is logged — prompt, response, duration, and parsed
          output.
        </p>
      </div>

      {/* Filter */}
      <div
        className="flex items-center gap-3 mb-6 animate-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        {["", "categorize", "proposal", "impact", "chat"].map((m) => (
          <button
            key={m}
            onClick={() => setModule(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              module === m
                ? "bg-green-500/15 text-green-400 border-green-500/30"
                : "text-white/40 border-white/10 hover:border-white/20 hover:text-white/60"
            }`}
          >
            {m === "" ? "All Modules" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}

        <button
          onClick={fetchLogs}
          className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Log Entries */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/30">
          <span className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin-slow mr-3" />
          Loading logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-4xl mb-3">📋</p>
          <p>No logs yet. Run a module to see logs appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="glass rounded-xl border border-white/8 overflow-hidden"
            >
              {/* Log Header */}
              <button
                onClick={() =>
                  setExpanded(expanded === log.id ? null : log.id)
                }
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors text-left"
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded border font-mono ${
                    MODULE_COLORS[log.module] ?? "text-white/50"
                  }`}
                >
                  {log.module}
                </span>

                <span
                  className={`text-xs font-medium ${
                    log.success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {log.success ? "✓ Success" : "✗ Failed"}
                </span>

                {log.durationMs && (
                  <span className="text-xs text-white/30">
                    {log.durationMs}ms
                  </span>
                )}

                <span className="text-xs text-white/30 ml-auto">
                  {new Date(log.createdAt).toLocaleString("en-IN")}
                </span>

                <span className="text-white/30 text-xs">
                  {expanded === log.id ? "▲" : "▼"}
                </span>
              </button>

              {/* Expanded Details */}
              {expanded === log.id && (
                <div className="border-t border-white/8 p-5 space-y-4">
                  {log.errorMsg && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      ⚠️ {log.errorMsg}
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-white/40 mb-1.5">PROMPT</p>
                    <pre className="text-xs text-white/60 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto max-h-40 whitespace-pre-wrap">
                      {log.prompt.slice(0, 800)}
                      {log.prompt.length > 800 ? "..." : ""}
                    </pre>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 mb-1.5">
                      RAW RESPONSE
                    </p>
                    <pre className="text-xs text-white/60 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto max-h-40 whitespace-pre-wrap">
                      {log.response.slice(0, 600)}
                      {log.response.length > 600 ? "..." : ""}
                    </pre>
                  </div>

                  {log.parsedJson && (
                    <div>
                      <p className="text-xs text-white/40 mb-1.5">
                        PARSED OUTPUT
                      </p>
                      <pre className="text-xs text-green-300/80 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto max-h-56">
                        {JSON.stringify(log.parsedJson, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
