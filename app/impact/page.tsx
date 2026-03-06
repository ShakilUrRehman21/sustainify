export default function ImpactPage() {
    const metrics = [
        { icon: "♻️", label: "Plastic Saved (kg)", formula: "Σ (units × category_avg_plastic_kg × filter_bonus)", example: "100 bamboo toothbrushes × 0.05 kg × 1.2 (plastic-free bonus) = 6 kg" },
        { icon: "🌡️", label: "Carbon Avoided (kg CO₂e)", formula: "Σ (units × filter_co2e_per_unit)", example: "100 toothbrushes × 0.3 (organic) + 0.2 (compostable) = 50 kg CO₂e" },
        { icon: "🏘️", label: "Local Sourcing Benefit", formula: "% locally sourced × avg_transport_emissions_saved", example: "70% local sourcing → 35 kg CO₂e transport emissions avoided" },
    ];

    const flow = [
        { step: "1", label: "Input Products", desc: "Product list with categories, quantities, sustainability filters" },
        { step: "2", label: "AI Estimation", desc: "Gemini applies category averages and filter multipliers" },
        { step: "3", label: "Zod Validation", desc: "Output validated: all numbers ≥ 0, strings non-empty" },
        { step: "4", label: "DB Persist", desc: "Report saved to ImpactReport table with full breakdown" },
        { step: "5", label: "Human Statement", desc: "AI generates marketing-ready sustainability summary" },
    ];

    const exampleOutput = {
        plastic_saved_kg: 12.5,
        carbon_avoided_kg: 38.2,
        local_impact_summary:
            "75% of selected products are locally sourced from within 200km, reducing transport emissions by an estimated 18 kg CO₂e.",
        human_readable_statement:
            "Your order with Sustainify saved 12.5 kg of plastic from entering landfills and avoided 38.2 kg of carbon emissions — equivalent to planting 2 trees.",
        calculation_breakdown: {
            plastic_per_product: [
                { product: "Bamboo Toothbrush ×100", kg_saved: 6.0 },
                { product: "Compostable Bags ×200", kg_saved: 6.5 },
            ],
            carbon_per_product: [
                { product: "Bamboo Toothbrush ×100", kg_co2e_avoided: 18.2 },
                { product: "Compostable Bags ×200", kg_co2e_avoided: 20.0 },
            ],
        },
    };

    return (
        <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10 animate-fade-up">
                <span className="text-xs text-white/40 uppercase tracking-widest">Module 3 · Architecture</span>
                <h1 className="text-4xl font-black mt-1 mb-2">
                    <span className="text-3xl mr-2">🌍</span>
                    <span className="text-white">Impact Report </span>
                    <span className="gradient-text">Generator</span>
                </h1>
                <p className="text-white/50">
                    Automatically estimates environmental impact using product metadata, quantity, and sustainability filters.
                </p>
            </div>

            {/* Architecture Flow */}
            <div className="glass rounded-2xl p-6 border border-purple-500/20 glow-purple mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
                <h2 className="text-sm text-white/60 uppercase tracking-widest mb-5">Processing Architecture</h2>
                <div className="flex flex-wrap gap-0">
                    {flow.map((f, i) => (
                        <div key={f.step} className="flex items-center">
                            <div className="flex flex-col items-center p-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-sm mb-2">
                                    {f.step}
                                </div>
                                <p className="text-white text-sm font-semibold text-center">{f.label}</p>
                                <p className="text-white/40 text-xs text-center mt-1 max-w-24">{f.desc}</p>
                            </div>
                            {i < flow.length - 1 && (
                                <div className="text-white/20 text-xl pb-8">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Calculation Logic */}
            <div className="glass rounded-2xl p-6 border border-purple-500/20 mb-6 animate-fade-up" style={{ animationDelay: "120ms" }}>
                <h2 className="text-sm text-white/60 uppercase tracking-widest mb-5">Calculation Logic</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {metrics.map((m) => (
                        <div key={m.label} className="p-4 rounded-xl bg-white/4 border border-white/8">
                            <div className="text-2xl mb-2">{m.icon}</div>
                            <h3 className="text-white font-semibold text-sm mb-2">{m.label}</h3>
                            <p className="text-xs font-mono text-purple-300/70 bg-purple-500/10 p-2 rounded mb-2">{m.formula}</p>
                            <p className="text-xs text-white/40"><strong>Example:</strong> {m.example}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* API Endpoint + Integration */}
            <div className="grid md:grid-cols-2 gap-4 mb-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
                <div className="glass rounded-2xl p-5 border border-white/8">
                    <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3">API Endpoint</h3>
                    <pre className="text-xs text-green-300 font-mono bg-black/30 p-3 rounded-lg">{`POST /api/impact/generate

Body:
{
  "products": [
    {
      "name": "Bamboo Toothbrush",
      "category": "Personal Care",
      "quantity": 100,
      "sustainabilityFilters": [
        "plastic-free",
        "compostable"
      ]
    }
  ]
}`}</pre>
                </div>
                <div className="glass rounded-2xl p-5 border border-white/8">
                    <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3">Integration Points</h3>
                    <ul className="space-y-3 text-sm text-white/60">
                        <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">▸</span><div><strong className="text-white/80">Trigger:</strong> After order is placed or B2B proposal is accepted</div></li>
                        <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">▸</span><div><strong className="text-white/80">Output:</strong> Stored in ImpactReport table, linked to order</div></li>
                        <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">▸</span><div><strong className="text-white/80">Display:</strong> Shown on customer account dashboard and B2B portal</div></li>
                        <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">▸</span><div><strong className="text-white/80">Export:</strong> PDF report generation for B2B ESG reporting</div></li>
                    </ul>
                </div>
            </div>

            {/* Example Output */}
            <div className="glass rounded-2xl p-5 border border-white/8 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3">Example Output JSON</h3>
                <pre className="text-xs text-green-300/90 font-mono bg-black/30 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(exampleOutput, null, 2)}
                </pre>
            </div>
        </div>
    );
}
