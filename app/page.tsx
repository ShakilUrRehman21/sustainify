import Link from "next/link";

const modules = [
  {
    id: 1,
    href: "/categorize",
    emoji: "🏷️",
    title: "AI Categorizer",
    subtitle: "Module 1",
    desc: "Auto-generates categories, subcategories, SEO tags, and sustainability filters from a product description.",
    tags: ["Category", "SEO Tags", "Eco Filters"],
    color: "green",
    gradient: "from-green-500/20 to-teal-500/10",
    border: "border-green-500/20",
    glow: "glow-green",
    btnColor: "bg-green-500/15 text-green-400 border border-green-500/30",
  },
  {
    id: 2,
    href: "/proposals",
    emoji: "📋",
    title: "B2B Proposals",
    subtitle: "Module 2",
    desc: "Generates full sustainable product proposals with budget allocation and cost breakdown for B2B clients.",
    tags: ["Product Mix", "Budget Split", "Impact Summary"],
    color: "teal",
    gradient: "from-teal-500/20 to-blue-500/10",
    border: "border-teal-500/20",
    glow: "glow-teal",
    btnColor: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
  },
  {
    id: 3,
    href: "/impact",
    emoji: "🌍",
    title: "Impact Reports",
    subtitle: "Module 3 · Architecture",
    desc: "Estimates plastic saved, carbon avoided, and local sourcing benefits with calculation logic explained.",
    tags: ["Plastic Saved", "Carbon Avoided", "Local Impact"],
    color: "purple",
    gradient: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20",
    glow: "glow-purple",
    btnColor: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  },
  {
    id: 4,
    href: "/chat",
    emoji: "💬",
    title: "Support Bot",
    subtitle: "Module 4 · Architecture",
    desc: "WhatsApp-integrated AI support bot handling orders, returns, refunds and escalation with conversation logging.",
    tags: ["Order Status", "Returns", "Refunds"],
    color: "blue",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/20",
    glow: "glow-blue",
    btnColor: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 text-green-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Sustainable Commerce
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text">Sustainify</span>
            <br />
            <span className="text-white/80 text-4xl md:text-5xl font-semibold">AI Systems</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Four production-ready AI modules that reduce manual catalog effort, supercharge B2B
            sales, automate impact reporting, and deliver instant customer support.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {modules.map((m, i) => (
            <div
              key={m.id}
              className={`glass rounded-2xl p-6 border ${m.border} ${m.glow} transition-all hover:scale-[1.02] animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`inline-flex items-center gap-2 bg-gradient-to-br ${m.gradient} rounded-xl p-3 mb-4`}>
                <span className="text-3xl">{m.emoji}</span>
              </div>

              <div className="mb-1">
                <span className="text-xs text-white/40 uppercase tracking-widest">{m.subtitle}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{m.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{m.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {m.tags.map((t) => (
                  <span key={t} className={`text-xs px-2.5 py-1 rounded-full ${m.btnColor}`}>
                    {t}
                  </span>
                ))}
              </div>

              <Link href={m.href} className="btn-primary text-sm">
                Open Module →
              </Link>
            </div>
          ))}
        </div>

        {/* Logs link */}
        <div className="text-center">
          <Link
            href="/logs"
            className="inline-flex items-center gap-2 glass border border-white/10 rounded-xl px-6 py-3 text-white/60 hover:text-white/90 hover:border-white/20 transition-all text-sm"
          >
            📊 View AI Prompt & Response Logs
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 glass rounded-2xl p-6 border border-white/8">
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-3">
            {["Next.js 14", "TypeScript", "Gemini AI", "Prisma ORM", "SQLite", "Zod", "Tailwind CSS"].map(
              (tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
