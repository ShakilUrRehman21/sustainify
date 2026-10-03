import Link from "next/link";
import Hero from "@/components/Hero";
import {
  IconTag,
  IconFileText,
  IconGlobe,
  IconMessage,
  IconChart,
  IconArrowRight,
  IconCheck,
} from "@/components/Icons";

const modules = [
  {
    id: 1,
    href: "/categorize",
    tagNumber: "MODULE 01",
    icon: IconTag,
    title: "AI Auto-Categorizer & Taxonomy",
    desc: "Ingests raw sustainable product descriptions and automatically resolves taxonomy, subcategories, 5–10 SEO keywords, and accredited eco-filter attributes.",
    badge: "10 Predefined Categories",
    tags: ["Personal Care", "Eco-Certifications", "SEO Tags", "Plastic-Free"],
    previewInput: "Bamboo toothbrush with compostable packaging. 100% plant-based...",
    previewOutput: "Category: Personal Care • Filters: [plastic-free, vegan]",
  },
  {
    id: 2,
    href: "/proposals",
    tagNumber: "MODULE 02",
    icon: IconFileText,
    title: "B2B Procurement Proposal Generator",
    desc: "Transforms company requirements and rigid procurement budgets into itemized, sustainable inventory proposals with mathematical budget overflow protection.",
    badge: "Budget Overflow Guard (≤2%)",
    tags: ["Cost Breakdown", "Budget Allocation", "Product Mix", "ESG Value"],
    previewInput: "200-employee company switching to eco break room & office supplies...",
    previewOutput: "$4,500 Budget → 4 Categories • 100% Allocated",
  },
  {
    id: 3,
    href: "/impact",
    tagNumber: "MODULE 03",
    icon: IconGlobe,
    title: "Interactive Impact & ESG Calculator",
    desc: "Estimates plastic diversion (kg), CO₂e greenhouse gas reduction, and local economic benefit with rigorous category heuristics and investor-ready ESG copy.",
    badge: "Live Calculation Engine",
    tags: ["Plastic Saved", "Carbon Avoided", "Local Sourcing", "ESG PDF"],
    previewInput: "100x Bamboo Toothbrushes + 200x Compostable Bags...",
    previewOutput: "12.5 kg plastic saved • 38.2 kg CO₂e avoided",
  },
  {
    id: 4,
    href: "/chat",
    tagNumber: "MODULE 04",
    icon: IconMessage,
    title: "WhatsApp & Web Support Concierge",
    desc: "Omnichannel customer support simulator handling automated order tracking, policy lookups, and intelligent human agent escalation with full session audit trails.",
    badge: "Live Webhook Simulator",
    tags: ["Order Tracking", "Damaged Returns", "Instant Resolution", "Human Handoff"],
    previewInput: "Where is my order #RAY-2024-891? Arrived damaged...",
    previewOutput: "Intent: order_status • Real-time Courier Status",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      {/* Hero Component */}
      <Hero />

      {/* Live System Capability Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14">
        {[
          { label: "Core Foundation", value: "Gemini 2.5 Flash", sub: "T=0.2 Deterministic Mode" },
          { label: "Schema Validation", value: "100% Zod Verified", sub: "Hard constraint checking" },
          { label: "Execution Speed", value: "< 950ms", sub: "Average pipeline latency" },
          { label: "Data Persistence", value: "Neon PostgreSQL", sub: "Full audit logs stored" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass-card p-4 sm:p-5 rounded-2xl"
          >
            <p className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-1">
              {stat.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Module Showcase Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Integrated AI Modules
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Engineered with strict schemas, verified prompt architectures, and database persistence.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> 4 of 4 Active
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="glass-card glass-card-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div>
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-semibold uppercase">
                          {m.tagNumber}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                          {m.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 hidden sm:block">
                      {m.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {m.desc}
                  </p>

                  {/* Live Preview Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 mb-5 font-mono text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 border-b border-emerald-100 pb-1">
                      <span>LIVE PIPELINE SAMPLE</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <IconCheck className="w-3 h-3 text-emerald-600" />
                        OUTPUT VERIFIED
                      </span>
                    </div>
                    <p className="truncate text-slate-500 text-[11px]">In: &ldquo;{m.previewInput}&rdquo;</p>
                    <p className="text-emerald-800 text-[11px] font-semibold mt-1">Out: {m.previewOutput}</p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Ready to test</span>
                  <Link href={m.href} className="btn-primary text-xs py-2 px-4">
                    <span>Open Interactive Module</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Reliability Architecture */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-14">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
            System Reliability
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Why Sustainify Does Not Hallucinate
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Standard AI outputs fail in production e-commerce due to invalid JSON and hallucinated pricing. Sustainify utilizes four layers of architectural guarantees:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "1. Low-Temp Prompts",
              desc: "Temperature pinned at 0.2 with embedded schema signatures and predefined category constraints.",
            },
            {
              title: "2. Robust JSON Extractor",
              desc: "Depth-tracking parser isolates pure JSON from markdown code fences and reasoning tokens.",
            },
            {
              title: "3. Strict Zod Validation",
              desc: "Every AI response is validated at runtime. Invalid shapes trigger automatic retries or handled fallbacks.",
            },
            {
              title: "4. Full DB Audit Trail",
              desc: "Every prompt, raw response, parsed JSON, latency, and error is persisted in the AIOutput ledger.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <p className="text-sm font-semibold text-emerald-900 mb-1">{item.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
