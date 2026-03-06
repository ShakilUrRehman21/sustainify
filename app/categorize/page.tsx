"use client";
import { useState } from "react";
import JsonViewer from "@/components/JsonViewer";

const exampleDesc =
  "Bamboo toothbrush with compostable packaging. 100% plant-based bristles, vegan-certified. Biodegradable handle wrapped in recycled kraft paper.";

type CategorizeResponse = {
  success: boolean;
  data?: {
    category: string;
    subcategory: string;
    seo_tags: string[];
    sustainability_filters: string[];
  };
  error?: string;
};

export default function CategorizePage() {
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CategorizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      if (!json.success) throw new Error(json.error || "Unknown error");

      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <span className="text-xs text-white/40 uppercase tracking-widest">
          Module 1
        </span>
        <h1 className="text-4xl font-black mt-1 mb-2">
          <span className="text-3xl mr-2">🏷️</span>
          <span className="gradient-text">AI Auto-Categorizer</span>
        </h1>
        <p className="text-white/50">
          Enter a product description and our AI will generate a category,
          subcategory, SEO tags, and sustainability filters.
        </p>
      </div>

      {/* Form */}
      <div
        className="glass rounded-2xl p-6 border border-green-500/20 glow-green mb-6 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Product Name (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. EcoBrush Pro"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Product Description *
            </label>
            <textarea
              rows={5}
              placeholder="Describe the product in detail — materials, certifications, sustainability attributes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              className="resize-none"
              style={{ resize: "vertical" } as React.CSSProperties}
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin-slow" />
                  Generating...
                </>
              ) : (
                "✨ Generate Categories"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setDescription(exampleDesc);
                setProductName("EcoBrush Pro");
              }}
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

      {/* Result */}
      {result?.data && (
        <div className="space-y-4 animate-fade-up">
          {/* Quick view */}
          <div className="glass rounded-2xl p-6 border border-green-500/20">
            <h3 className="text-white/60 text-sm mb-4 uppercase tracking-widest">
              Results
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-white/40">Category</span>
                <p className="text-white font-semibold">
                  {result.data.category}
                </p>
              </div>

              <div>
                <span className="text-xs text-white/40">Subcategory</span>
                <p className="text-white">{result.data.subcategory}</p>
              </div>

              <div>
                <span className="text-xs text-white/40 block mb-2">
                  SEO Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.data.seo_tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-white/40 block mb-2">
                  Sustainability Filters
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.data.sustainability_filters?.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30"
                    >
                      🌿 {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full JSON */}
          <JsonViewer data={result} />
        </div>
      )}

      {/* Schema reference */}
      <div className="mt-10 glass rounded-2xl p-5 border border-white/8">
        <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3">
          Output Schema
        </h3>

        <pre className="text-xs text-white/50 font-mono">{`{
  "category": "string (from predefined list)",
  "subcategory": "string",
  "seo_tags": ["5–10 tags"],
  "sustainability_filters": ["plastic-free", "vegan", ...]
}`}</pre>
      </div>
    </div>
  );
}
