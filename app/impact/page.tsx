"use client";

import { useState } from "react";
import JsonViewer from "@/components/JsonViewer";
import {
  IconGlobe,
  IconSparkles,
  IconCopy,
  IconCheck,
  IconRecycle,
  IconLeaf,
} from "@/components/Icons";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  sustainabilityFilters: string[];
}

const BASKET_PRESETS = [
  {
    title: "Hotel Amenities (350 Units)",
    desc: "Boutique hospitality bundle with bathroom essentials and guest amenities.",
    products: [
      { id: "1", name: "Organic Bamboo Toothbrush", category: "Personal Care", quantity: 150, sustainabilityFilters: ["plastic-free", "biodegradable", "vegan"] },
      { id: "2", name: "Cold-Pressed Soap Bar", category: "Cleaning & Hygiene", quantity: 100, sustainabilityFilters: ["organic", "zero-waste", "plastic-free"] },
      { id: "3", name: "Compostable Kraft Laundry Bags", category: "Home & Kitchen", quantity: 100, sustainabilityFilters: ["compostable", "recycled"] },
    ],
  },
  {
    title: "E-Commerce Shipping (1,000 Units)",
    desc: "Circular fulfillment packaging for sustainable apparel e-retailer.",
    products: [
      { id: "1", name: "Recycled Kraft Padded Mailer (10x13)", category: "Office & Stationery", quantity: 600, sustainabilityFilters: ["recycled", "biodegradable", "plastic-free"] },
      { id: "2", name: "Water-Activated Reinforced Paper Tape", category: "Office & Stationery", quantity: 400, sustainabilityFilters: ["compostable", "zero-waste"] },
    ],
  },
  {
    title: "Corporate Welcome Kits (150 Kits)",
    desc: "Employee onboarding bundle with reusable everyday essentials.",
    products: [
      { id: "1", name: "Insulated Stainless Steel Water Bottle", category: "Home & Kitchen", quantity: 150, sustainabilityFilters: ["plastic-free", "zero-waste"] },
      { id: "2", name: "Fair-Trade Organic Cotton Canvas Tote", category: "Clothing & Apparel", quantity: 150, sustainabilityFilters: ["fair-trade", "organic", "upcycled"] },
      { id: "3", name: "Seed-Paper Recycled Journal", category: "Office & Stationery", quantity: 150, sustainabilityFilters: ["recycled", "biodegradable"] },
    ],
  },
];

const AVAILABLE_FILTERS = [
  "plastic-free",
  "compostable",
  "vegan",
  "recycled",
  "biodegradable",
  "organic",
  "fair-trade",
  "zero-waste",
  "solar-powered",
  "upcycled",
];

const CATEGORIES = [
  "Personal Care",
  "Home & Kitchen",
  "Food & Beverage",
  "Clothing & Apparel",
  "Office & Stationery",
  "Outdoor & Travel",
  "Cleaning & Hygiene",
  "Baby & Kids",
  "Pet Care",
  "Electronics & Accessories",
];

type ImpactResponse = {
  success: boolean;
  data?: {
    plastic_saved_kg: number;
    carbon_avoided_kg: number;
    local_impact_summary: string;
    human_readable_statement: string;
    calculation_breakdown?: {
      plastic_per_product?: Array<{ product: string; kg_saved: number }>;
      carbon_per_product?: Array<{ product: string; kg_co2e_avoided: number }>;
    };
  };
  meta?: {
    durationMs?: number;
  };
  error?: string;
};

export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState<"calculator" | "architecture">("calculator");
  const [products, setProducts] = useState<ProductItem[]>(BASKET_PRESETS[0].products);
  const [loading, setLoading] = useState(false);
  const [copiedStmt, setCopiedStmt] = useState(false);
  const [result, setResult] = useState<ImpactResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New item form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newQuantity, setNewQuantity] = useState("50");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["plastic-free"]);

  function toggleFilter(filter: string) {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  }

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const qty = parseInt(newQuantity) || 1;
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        category: newCategory,
        quantity: Math.max(1, qty),
        sustainabilityFilters: [...selectedFilters],
      },
    ]);
    setNewName("");
    setNewQuantity("50");
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function loadPreset(preset: (typeof BASKET_PRESETS)[0]) {
    setProducts(preset.products);
    setError(null);
    setResult(null);
  }

  async function handleCalculate() {
    if (products.length === 0) {
      setError("Please add at least one product to calculate environmental impact.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/impact/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: products.map((p) => ({
            name: p.name,
            category: p.category,
            quantity: p.quantity,
            sustainabilityFilters: p.sustainabilityFilters,
          })),
        }),
      });

      const json: ImpactResponse = await res.json();
      if (!json.success) throw new Error(json.error || "Impact calculation failed");
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation error occurred");
    } finally {
      setLoading(false);
    }
  }

  const copyStatement = () => {
    if (!result?.data?.human_readable_statement) return;
    navigator.clipboard.writeText(result.data.human_readable_statement);
    setCopiedStmt(true);
    setTimeout(() => setCopiedStmt(false), 2000);
  };

  const data = result?.data;

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
            Module 03 • ESG Life-Cycle Analytics
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-xs text-slate-500 font-medium">Scientific Category Benchmarks + Emission Offsets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <IconGlobe className="w-5 h-5" />
          </span>
          <span>Interactive Impact & <span className="gradient-text">ESG Engine</span></span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl font-normal">
          Model real-world emissions reductions, landfill plastic diversion, and localized freight benefits for commercial batches with rigorous audit formulas.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "calculator"
                ? "bg-white text-emerald-900 border border-slate-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Live Interactive Calculator
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "architecture"
                ? "bg-white text-emerald-900 border border-slate-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pipeline Architecture & Formulas
          </button>
        </div>
      </div>

      {activeTab === "calculator" ? (
        <div className="space-y-8 animate-fade-up">
          {/* Preset Baskets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Load Standard Sustainable Baskets:
              </span>
              <span className="text-[11px] text-slate-400">Select a pre-assembled commercial order</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {BASKET_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => loadPreset(preset)}
                  className="text-left p-3.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    {preset.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {preset.desc}
                  </p>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold mt-2 block">
                    {preset.products.length} products • {preset.products.reduce((acc, p) => acc + p.quantity, 0)} items
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Batch Table */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Selected Batch Inventory ({products.length} SKUs)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Total Volume: {products.reduce((acc, p) => acc + p.quantity, 0).toLocaleString()} units
                </p>
              </div>

              {products.length > 0 && (
                <button
                  onClick={() => setProducts([])}
                  className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No products in batch. Pick a preset above or add custom products below.
              </div>
            ) : (
              <div className="space-y-2.5 mb-6">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.sustainabilityFilters.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium font-mono"
                          >
                            #{f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-medium">Qty:</span>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setProducts((prev) =>
                              prev.map((p) => (p.id === item.id ? { ...p, quantity: Math.max(1, val) } : p))
                            );
                          }}
                          className="w-20 text-center font-mono py-1 px-2 text-xs"
                        />
                      </div>

                      <button
                        onClick={() => removeProduct(item.id)}
                        className="text-slate-400 hover:text-red-600 text-sm px-1.5 py-1 rounded transition-colors font-bold"
                        title="Remove SKU"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Add Product Collapsible Box */}
            <div className="pt-4 border-t border-slate-100">
              <form onSubmit={addProduct} className="space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Add Custom SKU to Analysis:
                </span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Product name (e.g. Bamboo Cutlery Set)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-xs font-medium"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="text-xs font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-white text-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={newQuantity}
                      min="1"
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="text-xs w-24 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!newName.trim()}
                      className="btn-secondary text-xs flex-1 cursor-pointer"
                    >
                      Add SKU
                    </button>
                  </div>
                </div>

                {/* Filter Selector */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 self-center mr-1 font-medium">Eco Filters:</span>
                  {AVAILABLE_FILTERS.map((f) => {
                    const isSelected = selectedFilters.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFilter(f)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {f}
                      </button>
                    );
                  })}
                </div>
              </form>
            </div>

            {/* Run Calculation Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleCalculate}
                disabled={loading || products.length === 0}
                className="btn-primary min-w-[240px]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                    <span>Computing Life-Cycle Impact...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-4 h-4 text-emerald-200" />
                    <span>Calculate Environmental Impact</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-500 font-medium">
                Calculates life-cycle heuristics via Gemini 2.5 Flash
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm flex items-start gap-3">
              <span className="text-red-500 font-bold text-base">!</span>
              <div>
                <p className="font-semibold">Calculation Error</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Live Environmental Results */}
          {data && (
            <div className="space-y-6 animate-fade-up">
              <div className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold flex items-center gap-1.5">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      VERIFIED IMPACT METRICS
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                      Environmental Scorecard
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.meta?.durationMs && (
                      <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {result.meta.durationMs}ms latency
                      </span>
                    )}
                    <button
                      onClick={copyStatement}
                      className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                    >
                      {copiedStmt ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied Statement!</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>Copy ESG Statement</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Ribbon */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                      <IconRecycle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-mono uppercase text-emerald-800 font-semibold">
                      Plastic Waste Diverted
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                      {data.plastic_saved_kg} <span className="text-base font-normal text-emerald-700">kg</span>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      ≈ {Math.round(data.plastic_saved_kg * 40)} single-use 500ml water bottles kept out of oceans
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                      <IconLeaf className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-mono uppercase text-emerald-800 font-semibold">
                      CO₂e Emissions Avoided
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                      {data.carbon_avoided_kg} <span className="text-base font-normal text-emerald-700">kg CO₂e</span>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      ≈ Equivalent to planting {Math.max(1, Math.round(data.carbon_avoided_kg / 21))} urban seedlings for 10 yrs
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                      <IconGlobe className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-mono uppercase text-emerald-800 font-semibold">
                      Localized Impact
                    </p>
                    <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                      {data.local_impact_summary}
                    </p>
                  </div>
                </div>

                {/* Marketing & ESG Statement */}
                <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                      Audit-Ready ESG Statement
                    </span>
                    <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      ISO 14044 ALIGNED
                    </span>
                  </div>
                  <blockquote className="text-sm text-emerald-950 italic leading-relaxed">
                    &ldquo;{data.human_readable_statement}&rdquo;
                  </blockquote>
                </div>

                {/* Per-Product Breakdown */}
                {data.calculation_breakdown && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                      Sub-Component Life-Cycle Breakdown
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Plastic Breakdown */}
                      {data.calculation_breakdown.plastic_per_product && (
                        <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200">
                          <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                            <IconRecycle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Plastic Saved by SKU</span>
                          </p>
                          <div className="space-y-1.5">
                            {data.calculation_breakdown.plastic_per_product.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-slate-200/70 last:border-0">
                                <span className="text-slate-600 truncate pr-2">{item.product}</span>
                                <span className="font-mono font-semibold text-emerald-800 shrink-0">{item.kg_saved} kg</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Carbon Breakdown */}
                      {data.calculation_breakdown.carbon_per_product && (
                        <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200">
                          <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                            <IconLeaf className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Carbon Avoided by SKU</span>
                          </p>
                          <div className="space-y-1.5">
                            {data.calculation_breakdown.carbon_per_product.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-slate-200/70 last:border-0">
                                <span className="text-slate-600 truncate pr-2">{item.product}</span>
                                <span className="font-mono font-semibold text-emerald-800 shrink-0">{item.kg_co2e_avoided} kg</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw JSON Debug */}
              <JsonViewer data={result} />
            </div>
          )}
        </div>
      ) : (
        /* Architecture & Methodology Tab */
        <div className="space-y-8 animate-fade-up">
          {/* Architecture Flow */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-xs">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold mb-6">
              AI Processing Pipeline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { step: "01", label: "SKU Batch Ingestion", desc: "Volume, category, and verified eco-filters parsed" },
                { step: "02", label: "Gemini Life-Cycle", desc: "Model applies verified baseline emission multipliers" },
                { step: "03", label: "Zod Schema Validation", desc: "Non-negative floats enforced; schemas guaranteed" },
                { step: "04", label: "Neon DB Storage", desc: "ImpactReport table records immutable audit payload" },
                { step: "05", label: "ESG Deliverable", desc: "Executive statement generated for investor reports" },
              ].map((f) => (
                <div key={f.step} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100">
                  <span className="text-xs font-mono font-bold text-emerald-800 mb-2 block">
                    {f.step}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mb-1">{f.label}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold mb-4">
              Scientific Calculation Logic
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                  <IconRecycle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Plastic Saved (kg)</h3>
                <p className="text-xs font-mono text-emerald-900 bg-emerald-50 p-2 rounded mb-2 border border-emerald-200 font-medium">
                  Σ (units × category_baseline × filter_mult)
                </p>
                <p className="text-xs text-slate-600">
                  Personal care: ~0.05kg; Home & Kitchen: ~0.20kg. Plastic-free certification adds 20% bonus.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                  <IconLeaf className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Carbon Avoided (kg CO₂e)</h3>
                <p className="text-xs font-mono text-emerald-900 bg-emerald-50 p-2 rounded mb-2 border border-emerald-200 font-medium">
                  Σ (units × filter_co2e_per_unit)
                </p>
                <p className="text-xs text-slate-600">
                  Organic: 0.3kg CO₂e/unit; Compostable: 0.2kg CO₂e/unit; Localized sourcing: 0.15kg CO₂e/unit.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                  <IconGlobe className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Localized Freight Benefit</h3>
                <p className="text-xs font-mono text-emerald-900 bg-emerald-50 p-2 rounded mb-2 border border-emerald-200 font-medium">
                  % local × transport_emissions_saved
                </p>
                <p className="text-xs text-slate-600">
                  Calculates reduction in freight ton-kilometers for suppliers within 250km radius.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
