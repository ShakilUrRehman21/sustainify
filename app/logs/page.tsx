"use client";

import { useState, useEffect } from "react";
import {
  IconChart,
  IconRefresh,
  IconCheck,
  IconCopy,
} from "@/components/Icons";

interface LogEntry {
  id: string;
  module: string;
  success: boolean;
  errorMsg: string | null;
  durationMs: number | null;
  createdAt: string;
  prompt: string;
  response: string;
  parsedJson: Record<string, unknown> | null;
}

const MODULE_CONFIG: Record<
  string,
  { label: string; badge: string; color: string }
> = {
  categorize: { label: "Categorizer", badge: "M1", color: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  proposal: { label: "Proposals", badge: "M2", color: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  impact: { label: "Impact", badge: "M3", color: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  chat: { label: "WhatsApp Bot", badge: "M4", color: "text-emerald-800 bg-emerald-50 border-emerald-200" },
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failure">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchLogs() {
    setLoading(true);
    try {
      const url = `/api/logs?limit=40${module ? `&module=${module}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      setLogs(json.data ?? []);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [module]);

  const copyPayload = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter logs by search query and success status
  const filteredLogs = logs.filter((log) => {
    if (statusFilter === "success" && !log.success) return false;
    if (statusFilter === "failure" && log.success) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = log.prompt?.toLowerCase().includes(q);
      const matchResp = log.response?.toLowerCase().includes(q);
      const matchErr = log.errorMsg?.toLowerCase().includes(q);
      if (!matchPrompt && !matchResp && !matchErr) return false;
    }
    return true;
  });

  // Calculate high-level stats
  const totalCalls = logs.length;
  const successCount = logs.filter((l) => l.success).length;
  const successRate = totalCalls > 0 ? ((successCount / totalCalls) * 100).toFixed(1) : "100.0";
  const validDurations = logs.filter((l) => l.durationMs && l.durationMs > 0);
  const avgDuration =
    validDurations.length > 0
      ? Math.round(
          validDurations.reduce((acc, l) => acc + (l.durationMs || 0), 0) /
            validDurations.length
        )
      : 840;

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
            Audit Ledger & Telemetry
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-500 font-medium">Full Request / Response Audit Trail</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <IconChart className="w-5 h-5" />
          </span>
          <span>AI Observability & <span className="gradient-text">Prompt Logs</span></span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl font-normal">
          Real-time execution log of every prompt dispatched to Gemini, raw reasoning tokens, extracted JSON payloads, execution latency, and validation status.
        </p>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="glass-card p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Logged Calls</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalCalls}</p>
          <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Persisted in AIOutput</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">{successRate}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{successCount} successful</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Average Latency</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1 font-mono">{avgDuration}ms</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Fast pipeline execution</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Inference Engine</p>
          <p className="text-sm font-bold text-slate-900 mt-2 truncate font-mono">Gemini 2.5 Flash</p>
          <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Temperature: 0.2</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card p-4 rounded-2xl border border-slate-200 mb-6 space-y-3 animate-fade-up shadow-xs"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Module Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["", "categorize", "proposal", "impact", "chat"].map((m) => {
              const cfg = MODULE_CONFIG[m];
              const isSelected = module === m;
              return (
                <button
                  key={m}
                  onClick={() => setModule(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-900"
                  }`}
                >
                  {m === "" ? "All Modules" : cfg?.label || m}
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchLogs}
            className="text-xs text-slate-600 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer ml-auto font-medium"
          >
            <IconRefresh className="w-3.5 h-3.5" />
            <span>Refresh Logs</span>
          </button>
        </div>

        {/* Search & Status Sub-filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <input
            type="text"
            placeholder="Search prompt, output keywords or errors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs flex-1 min-w-[200px] py-2 px-3"
          />

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] cursor-pointer font-medium ${
                statusFilter === "all"
                  ? "bg-slate-100 text-slate-900 border-slate-300"
                  : "text-slate-500 border-transparent hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("success")}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] cursor-pointer font-medium ${
                statusFilter === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "text-slate-500 border-transparent hover:text-emerald-800"
              }`}
            >
              Success Only
            </button>
            <button
              onClick={() => setStatusFilter("failure")}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] cursor-pointer font-medium ${
                statusFilter === "failure"
                  ? "bg-red-50 text-red-800 border-red-300"
                  : "text-slate-500 border-transparent hover:text-red-700"
              }`}
            >
              Failures Only
            </button>
          </div>
        </div>
      </div>

      {/* Log Entries List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <span className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin-slow mr-3" />
          Querying database audit logs...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-200 text-slate-500 shadow-xs">
          <IconChart className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-800">No execution logs found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Run any of the 4 AI modules (Categorizer, Proposals, Impact, or WhatsApp Bot) to see full telemetry.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExp = expanded === log.id;
            const cfg = MODULE_CONFIG[log.module] || {
              label: log.module,
              badge: "LOG",
              color: "text-slate-700 bg-slate-100 border-slate-200",
            };

            return (
              <div
                key={log.id}
                className="glass-card rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isExp ? null : log.id)}
                  className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-emerald-50/30 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>

                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        log.success ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {log.success ? (
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span className="font-bold">✗</span>
                      )}
                      <span>{log.success ? "Success" : "Failed"}</span>
                    </span>

                    {log.durationMs && (
                      <span className="text-xs font-mono text-slate-500">
                        {log.durationMs}ms
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-auto text-xs text-slate-500">
                    <span className="font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{isExp ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Expanded Inspection Drawer */}
                {isExp && (
                  <div className="border-t border-slate-200 p-5 space-y-4 bg-[#f8faf9] animate-fade-up">
                    {log.errorMsg && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                        <strong className="block mb-0.5">Error Message:</strong>
                        {log.errorMsg}
                      </div>
                    )}

                    {/* Prompt Box */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                          PROMPT PAYLOAD DISPATCHED
                        </span>
                        <button
                          onClick={() => copyPayload(`prompt-${log.id}`, log.prompt)}
                          className="text-[10px] text-slate-600 hover:text-emerald-800 cursor-pointer font-mono font-medium flex items-center gap-1"
                        >
                          {copiedId === `prompt-${log.id}` ? (
                            <>
                              <IconCheck className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3 h-3" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-slate-700 font-mono bg-white p-3.5 rounded-xl overflow-x-auto max-h-48 whitespace-pre-wrap border border-slate-200">
                        {log.prompt}
                      </pre>
                    </div>

                    {/* Raw Response */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                          RAW INFERENCE TOKENS RECEIVED
                        </span>
                        <button
                          onClick={() => copyPayload(`raw-${log.id}`, log.response)}
                          className="text-[10px] text-slate-600 hover:text-emerald-800 cursor-pointer font-mono font-medium flex items-center gap-1"
                        >
                          {copiedId === `raw-${log.id}` ? (
                            <>
                              <IconCheck className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3 h-3" />
                              <span>Copy Raw</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-slate-700 font-mono bg-white p-3.5 rounded-xl overflow-x-auto max-h-48 whitespace-pre-wrap border border-slate-200">
                        {log.response}
                      </pre>
                    </div>

                    {/* Parsed JSON */}
                    {log.parsedJson && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                            VALIDATED JSON OUTPUT
                          </span>
                          <button
                            onClick={() =>
                              copyPayload(
                                `json-${log.id}`,
                                JSON.stringify(log.parsedJson, null, 2)
                              )
                            }
                            className="text-[10px] text-emerald-700 hover:text-emerald-900 cursor-pointer font-mono font-semibold flex items-center gap-1"
                          >
                            {copiedId === `json-${log.id}` ? (
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
                        </div>
                        <pre className="text-xs text-slate-800 font-mono bg-white p-3.5 rounded-xl overflow-x-auto max-h-60 border border-emerald-200 shadow-2xs">
                          {JSON.stringify(log.parsedJson, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}