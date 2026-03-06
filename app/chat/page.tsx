export default function ChatPage() {
    const capabilities = [
        { icon: "📦", title: "Order Status", desc: "Looks up order by number in the Orders table. Returns status, items, delivery ETA." },
        { icon: "↩️", title: "Return Policy", desc: "Answers return window (30 days), eligible items, and how to initiate a return." },
        { icon: "💸", title: "Refund Escalation", desc: "Handles refund requests. Escalates complex cases to human agents with full chat log." },
        { icon: "💬", title: "General Support", desc: "Answers FAQs about Sustainify products, sustainability mission, and eco-packaging." },
    ];

    const integrations = [
        { name: "WhatsApp Business API", logo: "📱", desc: "Meta Cloud API receives webhook messages from WhatsApp numbers. POST to /api/chat/message." },
        { name: "Twilio", logo: "📞", desc: "Alternative SMS/WhatsApp provider. Twilio Sandbox supports development testing." },
        { name: "Orders Database", logo: "🗄️", desc: "Prisma queries the Orders table to look up real-time order status by order number." },
        { name: "Human Escalation", logo: "👤", desc: "When escalate_to_human=true, creates a support ticket and notifies human agent via email/Slack." },
    ];

    const sampleConversation = [
        { from: "user", text: "Hi, where is my order #RAY-2024-891?" },
        { from: "bot", text: "Hi there! 👋 I found your order #RAY-2024-891. It was shipped on March 2nd and is currently out for delivery. Expected delivery: March 5th. You'll receive a notification when it arrives. Is there anything else I can help with?" },
        { from: "user", text: "I want to return the bamboo kit, it arrived damaged." },
        { from: "bot", text: "I'm so sorry to hear that! 😔 Since your item arrived damaged, you're eligible for a full refund or replacement under our 7-day damaged item policy. I'll connect you with a human agent who can process this right away. One moment please." },
    ];

    const webhookFlow = [
        { step: "1", actor: "Customer", action: "Sends WhatsApp message" },
        { step: "2", actor: "Meta/Twilio", action: "Webhook POST → /api/chat/message" },
        { step: "3", actor: "Chat Service", action: "Load history + lookup order" },
        { step: "4", actor: "Gemini AI", action: "Generate intent + response JSON" },
        { step: "5", actor: "DB", action: "Save ChatLog + AIOutput" },
        { step: "6", actor: "API", action: "POST reply to WhatsApp API" },
    ];

    return (
        <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10 animate-fade-up">
                <span className="text-xs text-white/40 uppercase tracking-widest">Module 4 · Architecture</span>
                <h1 className="text-4xl font-black mt-1 mb-2">
                    <span className="text-3xl mr-2">💬</span>
                    <span className="text-white">WhatsApp </span>
                    <span className="gradient-text">Support Bot</span>
                </h1>
                <p className="text-white/50">
                    AI-powered customer support bot with WhatsApp integration, order lookup, and escalation logic.
                </p>
            </div>

            {/* Capabilities */}
            <div className="grid md:grid-cols-2 gap-4 mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
                {capabilities.map((c) => (
                    <div key={c.title} className="glass rounded-2xl p-5 border border-blue-500/20 glow-blue">
                        <div className="text-2xl mb-2">{c.icon}</div>
                        <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                        <p className="text-white/50 text-sm">{c.desc}</p>
                    </div>
                ))}
            </div>

            {/* Webhook Flow */}
            <div className="glass rounded-2xl p-6 border border-blue-500/20 mb-6 animate-fade-up" style={{ animationDelay: "120ms" }}>
                <h2 className="text-sm text-white/60 uppercase tracking-widest mb-5">Webhook Message Flow</h2>
                <div className="space-y-2">
                    {webhookFlow.map((f, i) => (
                        <div key={f.step} className="flex items-center gap-4">
                            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                                {f.step}
                            </div>
                            {i < webhookFlow.length - 1 && (
                                <div className="absolute ml-3 mt-7 w-0.5 h-4 bg-blue-500/20" />
                            )}
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">{f.actor}</span>
                                <span className="text-sm text-white/60">{f.action}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sample Conversation */}
            <div className="glass rounded-2xl p-6 border border-blue-500/20 mb-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
                <h2 className="text-sm text-white/60 uppercase tracking-widest mb-5">Sample Conversation</h2>
                <div className="space-y-3">
                    {sampleConversation.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.from === "user"
                                    ? "bg-blue-500/20 text-white border border-blue-500/30"
                                    : "bg-white/6 text-white/80 border border-white/10"
                                    }`}
                            >
                                {msg.from === "bot" && (
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-xs text-green-400 font-medium">🤖 Ava · Sustainify Support</span>
                                    </div>
                                )}
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Integrations */}
            <div className="glass rounded-2xl p-6 border border-white/8 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <h2 className="text-sm text-white/60 uppercase tracking-widest mb-5">Integrations</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {integrations.map((int) => (
                        <div key={int.name} className="p-4 rounded-xl bg-white/4 border border-white/8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{int.logo}</span>
                                <span className="text-white font-semibold text-sm">{int.name}</span>
                            </div>
                            <p className="text-white/50 text-sm">{int.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
