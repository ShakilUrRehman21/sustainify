"use client";

import { useState } from "react";
import JsonViewer from "@/components/JsonViewer";
import {
  IconTag,
  IconSparkles,
  IconCopy,
  IconCheck,
  IconDownload,
  IconLeaf,
} from "@/components/Icons";

const PRESETS = [
  {
    title: "Bamboo Toothbrush",
    name: "EcoBrush Pro Dental Care",
    category: "Personal Care",
    desc: "Bamboo toothbrush with 100% compostable packaging. Plant-based castor bean bristles, vegan-certified. Biodegradable ergonomic handle wrapped in unbleached recycled kraft paper.",
  },
  {
    title: "Compostable Coffee Pods",
    name: "Aura Roast Fair-Trade Pods",
    category: "Food & Beverage",
    desc: "Nespresso-compatible coffee capsules made from 100% bio-based cornstarch and lignin. Certified industrial compostable within 90 days. Single-origin organic arabica beans sourced through direct fair-trade cooperatives.",
  },
  {
    title: "Recycled Ocean Wool Hoodie",
    name: "Marina Eco-Fleece Anorak",
    category: "Clothing & Apparel",
    desc: "Heavyweight unisex pullover hoodie crafted from 70% post-consumer recycled ocean plastics and 30% upcycled organic wool. Water-based non-toxic low impact dyes with zero micro-plastic shed certification.",
  },
  {
    title: "Solar Camping Lantern",
    name: "SolGlow Kinetic Lamp",
    category: "Outdoor & Travel",
    desc: "Portable LED camping light powered by monocrystalline solar cells with kinetic hand-crank backup. Housing built from recycled ABS ocean debris. Waterproof IP67 certified, rechargeable lithium iron phosphate battery with 5000+ cycle lifespan.",
  },
];

type CategorizeResponse = {
  success: boolean;
  data?: {
    category: string;
    subcategory: string;
    seo_tags: string[];
    sustainability_filters: string[];
  };
  meta?: {
    logId?: string;
    durationMs?: number;
  };
  error?: string;
};

export default function CategorizePage() {
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [result, setResult] = useState<CategorizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function applyPreset(preset: (typeof PRESETS)[0]) {
    setProductName(preset.name);
    setDescription(preset.desc);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/products/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          productName: productName || undefined,
        }),
      });

      const json: CategorizeResponse = await res.json();

      if (!json.success) throw new Error(json.error || "Taxonomy resolution failed");

      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, type: "single" | "all") => {
    navigator.clipboard.writeText(text);
    if (type === "single") {
      setCopiedTag(text);
      setTimeout(() => setCopiedTag(null), 1800);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    }
  };

  const exportCSV = () => {
    if (!result?.data) return;
    const { category, subcategory, seo_tags, sustainability_filters } = result.data;
    const rows = [
      ["Product Name", productName || "Unnamed"],
      ["Category", category],
      ["Subcategory", subcategory],
      ["SEO Tags", seo_tags.join("; ")],
      ["Sustainability Filters", sustainability_filters.join("; ")],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${productName || "catalog-item"}-taxonomy.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
            Module 01 • Taxonomy Engine
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-500 font-medium">Gemini 2.5 Flash + Zod Schema</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <IconTag className="w-5 h-5" />
          </span>
          <span>AI Product <span className="gradient-text">Auto-Categorizer</span></span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl font-normal">
          Instantly classify sustainable catalog inventory into standardized e-commerce taxonomies,
          generate high-intent SEO tags, and detect verified sustainability filters with zero hallucination.
        </p>
      </div>

      {/* Preset Library Bar */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick-Fill Preset Products:
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Click to load realistic catalog data</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-3 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all group cursor-pointer shadow-2xs"
            >
              <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 truncate">
                {preset.title}
              </p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {preset.category}
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Product Title / SKU Reference <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              {productName && (
                <button
                  type="button"
                  onClick={() => setProductName("")}
                  className="text-[11px] text-slate-400 hover:text-slate-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. EcoBrush Pro Bamboo Toothbrush"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Product Description & Materials <span className="text-emerald-600 font-bold">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {description.length} chars
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Describe materials, construction, certifications (FSC, Vegan, GOTS), compostability, and packaging..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              className="leading-relaxed resize-y"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="btn-primary min-w-[210px]"
                disabled={loading || description.trim().length < 10}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                    <span>Resolving Taxonomy...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-4 h-4 text-emerald-200" />
                    <span>Generate Taxonomy & Tags</span>
                  </>
                )}
              </button>

              {(description || productName) && (
                <button
                  type="button"
                  onClick={() => {
                    setDescription("");
                    setProductName("");
                    setResult(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  Reset Form
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Enforces 10 predefined primary verticals
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm flex items-start gap-3 animate-fade-up">
          <span className="text-red-500 font-bold text-base">!</span>
          <div>
            <p className="font-semibold">Categorization Error</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Live Results Display */}
      {result?.data && (
        <div className="space-y-6 animate-fade-up">
          {/* Main Classification Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                  TAXONOMY RESOLUTION COMPLETE
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                  {productName || "Product Taxonomy Report"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {result.meta?.durationMs && (
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {result.meta.durationMs}ms latency
                  </span>
                )}
                <button
                  onClick={exportCSV}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <IconDownload className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Category Tree Breadcrumb */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 mb-6">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1.5 font-semibold">
                Hierarchical Breadcrumb
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-2.5 py-1 rounded-md bg-white text-slate-600 font-medium border border-slate-200">
                  Catalog
                </span>
                <span className="text-slate-400">›</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200">
                  {result.data.category}
                </span>
                <span className="text-slate-400">›</span>
                <span className="px-2.5 py-1 rounded-md bg-white text-slate-800 font-semibold border border-slate-200">
                  {result.data.subcategory}
                </span>
              </div>
            </div>

            {/* SEO Tags Cloud */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  SEO Tags ({result.data.seo_tags?.length || 0})
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(result.data?.seo_tags?.join(", ") || "", "all")
                  }
                  className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  {copiedAll ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied All Tags!</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-3.5 h-3.5" />
                      <span>Copy All Tags</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.data.seo_tags?.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(tag, "single")}
                    title="Click to copy single tag"
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <span>#{tag}</span>
                    <span className="text-slate-400">
                      {copiedTag === tag ? (
                        <IconCheck className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <IconCopy className="w-3 h-3 opacity-60" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sustainability Filters */}
            <div>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">
                Verified Sustainability Attributes ({result.data.sustainability_filters?.length || 0})
              </span>
              <div className="flex flex-wrap gap-2">
                {result.data.sustainability_filters?.map((filter) => (
                  <span
                    key={filter}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 font-medium"
                  >
                    <IconLeaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{filter}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Raw JSON Debug Viewer */}
          <JsonViewer data={result} />
        </div>
      )}
    </div>
  );
}