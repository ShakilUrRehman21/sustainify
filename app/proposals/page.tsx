"use client";

import { useState } from "react";
import JsonViewer from "@/components/JsonViewer";
import {
  IconFileText,
  IconSparkles,
  IconCopy,
  IconCheck,
  IconPrinter,
  IconLeaf,
} from "@/components/Icons";

const RFP_PRESETS = [
  {
    title: "Corporate Campus (200 staff)",
    company: "GreenOffice Solutions",
    budget: "4500",
    reqs: "We are a mid-size tech company of 200 employees transitioning to 100% sustainable break rooms and workstation supplies. Need plastic-free compostable coffee cups, biodegradable cleaning sprays, recycled unbleached stationery, and fair-trade organic hand soaps.",
  },
  {
    title: "Eco-Boutique Hotel (40 rooms)",
    company: "Verdant Coast Lodge",
    budget: "8500",
    reqs: "Boutique eco-lodge requiring sustainable guest room amenities. Looking for refillable aluminum body wash containers, bamboo toothbrushes in kraft paper, compostable slippers, and fair-trade organic cotton laundry bags.",
  },
  {
    title: "University Dining & Cafe",
    company: "Metropolitan College Cafe",
    budget: "3200",
    reqs: "Campus cafe serving 800 students daily. We urgently need certified compostable food containers, birchwood cutlery sets, unbleached kraft napkins, and organic oat milk bulk dispensers. Zero single-use petroleum plastic permitted.",
  },
];

type ProposalResultData = {
  success: boolean;
  data?: {
    product_mix: Array<{
      product_name: string;
      category: string;
      description: string;
      quantity: number;
      unit_price: number;
      sustainability_highlights: string[];
    }>;
    budget_allocation: Record<string, string>;
    cost_breakdown: {
      items: Array<{ product: string; quantity: number; unit_price: number; subtotal: number }>;
      total_cost: number;
      currency: string;
    };
    impact_summary: string;
  };
  meta?: {
    logId?: string;
    durationMs?: number;
  };
  error?: string;
};

export default function ProposalsPage() {
  const [requirements, setRequirements] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [result, setResult] = useState<ProposalResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  function applyPreset(preset: (typeof RFP_PRESETS)[0]) {
    setCompanyName(preset.company);
    setBudget(preset.budget);
    setRequirements(preset.reqs);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError("Please specify a valid procurement budget (minimum $1 USD).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements,
          budget: budgetNum,
          companyName: companyName || undefined,
        }),
      });

      const json: ProposalResultData = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to generate proposal");

      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proposal synthesis error occurred");
    } finally {
      setLoading(false);
    }
  }

  const data = result?.data;

  const copySummary = () => {
    if (!data) return;
    const text = `PROPOSAL FOR: ${companyName || "Client"}
TOTAL BUDGET: $${data.cost_breakdown.total_cost.toLocaleString()} ${data.cost_breakdown.currency}
IMPACT SUMMARY: ${data.impact_summary}

PRODUCT MIX:
${data.product_mix.map((p) => `- ${p.product_name} (${p.category}): ${p.quantity} units @ $${p.unit_price} = $${(p.quantity * p.unit_price).toFixed(2)}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const printProposal = () => {
    window.print();
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
            Module 02 • B2B Procurement Engine
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-500 font-medium">Mathematical Budget Enforcement (≤2% Overrun Limit)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <IconFileText className="w-5 h-5" />
          </span>
          <span>B2B Sustainable <span className="gradient-text">Proposal Generator</span></span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl font-normal">
          Instantly transform commercial client RFPs and rigid budget caps into mathematically verified,
          categorized sustainable product proposals with complete ESG summaries.
        </p>
      </div>

      {/* Preset RFP Bar */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Load Commercial RFP Scenarios:
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Click to load realistic client requirements</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {RFP_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-3.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800">
                  {preset.title}
                </p>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ${parseInt(preset.budget).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {preset.company}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Card */}
      <div
        className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-100 mb-8 animate-fade-up shadow-xs"
        style={{ animationDelay: "100ms" }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                Client Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Patagonia Logistics, Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                Maximum Target Budget (USD) <span className="text-emerald-600 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  $
                </span>
                <input
                  type="number"
                  placeholder="5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  min="10"
                  className="pl-8 font-mono font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Procurement Brief & Sustainability Priorities <span className="text-emerald-600 font-bold">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {requirements.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Outline staff headcount, facilities (breakrooms, desks, restrooms), product needs, compostability or recycling criteria, and volume requirements..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
              minLength={20}
              className="leading-relaxed resize-y"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="btn-primary min-w-[210px]"
                disabled={loading || requirements.trim().length < 20 || !budget}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                    <span>Optimizing Product Mix...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-4 h-4 text-emerald-200" />
                    <span>Generate B2B Proposal</span>
                  </>
                )}
              </button>

              {(requirements || companyName || budget) && (
                <button
                  type="button"
                  onClick={() => {
                    setRequirements("");
                    setCompanyName("");
                    setBudget("");
                    setResult(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  Reset Form
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Auto-verifies cost sum ≤ budget × 1.02
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm flex items-start gap-3 animate-fade-up">
          <span className="text-red-500 font-bold text-base">!</span>
          <div>
            <p className="font-semibold">Proposal Generation Failed</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {data && (
        <div className="space-y-6 animate-fade-up">
          {/* Executive Summary Banner */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PROPOSAL DELIVERABLE READY
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  {companyName ? `Commercial Proposal: ${companyName}` : "Sustainable Procurement Proposal"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copySummary}
                  className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                >
                  {copiedSummary ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Summary!</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-3.5 h-3.5" />
                      <span>Copy Brief</span>
                    </>
                  )}
                </button>
                <button
                  onClick={printProposal}
                  className="btn-primary text-xs py-1.5 px-3 cursor-pointer"
                >
                  <IconPrinter className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Total Proposal Cost</p>
                <p className="text-2xl font-bold text-emerald-800 mt-1 font-mono">
                  ${data.cost_breakdown?.total_cost?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  Budget: ${parseFloat(budget).toLocaleString()} (
                  {((data.cost_breakdown?.total_cost / parseFloat(budget)) * 100).toFixed(1)}% of cap)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Curated SKUs</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.product_mix?.length} Items
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Zero petroleum plastics</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 col-span-2">
                <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold">Procurement Impact</p>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed line-clamp-3">
                  {data.impact_summary}
                </p>
              </div>
            </div>

            {/* Budget Allocation Progress Bars */}
            {data.budget_allocation && Object.keys(data.budget_allocation).length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50/60 border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Target Budget Allocation by Vertical
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(data.budget_allocation).map(([category, percentage]) => {
                    const cleanPct = parseInt(percentage) || 25;
                    return (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-xs text-slate-700 w-36 truncate font-medium">
                          {category}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${Math.min(cleanPct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-emerald-800 w-12 text-right">
                          {percentage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Mix Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Itemized Product Mix & Unit Economics
              </h4>
              <div className="space-y-3">
                {data.product_mix?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                          {item.category}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 tracking-tight">
                          {item.product_name}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.sustainability_highlights?.map((h, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1"
                          >
                            <IconLeaf className="w-3 h-3 text-emerald-600" />
                            <span>{h}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-xs text-slate-500 font-mono">
                        ${item.unit_price.toFixed(2)} × {item.quantity} units
                      </span>
                      <span className="text-base font-bold text-emerald-800 font-mono">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <JsonViewer data={result} />
        </div>
      )}
    </div>
  );
}
