"use client";
import { useState } from "react";
import JsonViewer from "@/components/JsonViewer";

const exampleReqs = `We are GreenOffice Solutions, a mid-size company of 200 employees looking to switch to sustainable office supplies. We need eco-friendly alternatives for our break rooms, meeting rooms, and individual desks. Products should be compostable or recycled where possible. Priority: coffee supplies, cleaning products, stationery, and personal care items for restrooms.`;

export default function ProposalsPage() {
    const [requirements, setRequirements] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        const budgetNum = parseFloat(budget);
        if (isNaN(budgetNum) || budgetNum <= 0) {
            setError("Please enter a valid budget amount.");
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
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            setResult(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    type ResultData = {
        data?: {
            product_mix?: Array<{ product_name: string; unit_price: number; quantity: number; sustainability_highlights?: string[] }>;
            cost_breakdown?: { total_cost: number; currency: string };
            impact_summary?: string;
            budget_allocation?: Record<string, string>;
        };
    };

    const data = (result as ResultData)?.data;

    return (
        <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10 animate-fade-up">
                <span className="text-xs text-white/40 uppercase tracking-widest">Module 2</span>
                <h1 className="text-4xl font-black mt-1 mb-2">
                    <span className="text-3xl mr-2">📋</span>
                    <span className="gradient-text">B2B Proposal Generator</span>
                </h1>
                <p className="text-white/50">
                    Provide your company requirements and budget — AI generates a complete, budget-compliant sustainable product proposal.
                </p>
            </div>

            {/* Form */}
            <div className="glass rounded-2xl p-6 border border-teal-500/20 glow-teal mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Company Name</label>
                            <input
                                type="text"
                                placeholder="e.g. GreenOffice Solutions"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-1.5">Maximum Budget (USD) *</label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-1.5">Company Requirements *</label>
                        <textarea
                            rows={6}
                            placeholder="Describe your company, number of employees, product categories needed, sustainability priorities..."
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            required
                            minLength={20}
                            style={{ resize: "vertical" } as React.CSSProperties}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin-slow" />Generating...</>
                            ) : "✨ Generate Proposal"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setRequirements(exampleReqs); setCompanyName("GreenOffice Solutions"); setBudget("4500"); }}
                            className="text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                            Use example →
                        </button>
                    </div>
                </form>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Results */}
            {data && (
                <div className="space-y-4 animate-fade-up">
                    {/* Summary Banner */}
                    <div className="glass rounded-2xl p-5 border border-teal-500/20 flex flex-wrap items-center gap-6">
                        <div>
                            <p className="text-xs text-white/40 mb-1">Total Cost</p>
                            <p className="text-2xl font-bold text-teal-400">
                                ${data.cost_breakdown?.total_cost?.toLocaleString()} {data.cost_breakdown?.currency}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 mb-1">Products</p>
                            <p className="text-2xl font-bold text-white">{data.product_mix?.length}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-white/40 mb-1">Impact Summary</p>
                            <p className="text-sm text-white/70 leading-relaxed">{data.impact_summary}</p>
                        </div>
                    </div>

                    {/* Product Mix Table */}
                    {data.product_mix && data.product_mix.length > 0 && (
                        <div className="glass rounded-2xl p-5 border border-white/8">
                            <h3 className="text-white/60 text-xs uppercase tracking-widest mb-4">Product Mix</h3>
                            <div className="space-y-3">
                                {data.product_mix.map((p, i) => (
                                    <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/4">
                                        <div>
                                            <p className="text-white font-medium text-sm">{p.product_name}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {p.sustainability_highlights?.map((h) => (
                                                    <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">🌿 {h}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-white/80 text-sm font-mono">${p.unit_price} × {p.quantity}</p>
                                            <p className="text-teal-400 font-bold">${(p.unit_price * p.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget Allocation */}
                    {data.budget_allocation && (
                        <div className="glass rounded-2xl p-5 border border-white/8">
                            <h3 className="text-white/60 text-xs uppercase tracking-widest mb-4">Budget Allocation</h3>
                            <div className="space-y-2">
                                {Object.entries(data.budget_allocation).map(([cat, pct]) => (
                                    <div key={cat} className="flex items-center gap-3">
                                        <span className="text-sm text-white/60 w-40 shrink-0">{cat}</span>
                                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-green-500"
                                                style={{ width: pct }}
                                            />
                                        </div>
                                        <span className="text-sm text-teal-400 font-mono w-12 text-right">{pct}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <JsonViewer data={result} />
                </div>
            )}
        </div>
    );
}
