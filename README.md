# Sustainify – AI Systems for Sustainable Commerce

 Production-ready AI platform with 4 modules: product categorization, B2B proposals, impact reporting, and WhatsApp support.

---

##  Quick Start

```bash
# 1. Clone / enter the project
cd d:/Claude/sustainify

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Set up database
npx prisma migrate dev --name init

# 5. Start development server
npm run dev
# → http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable          | Description                                                            |
|-------------------|------------------------------------------------------------------------|
| `GEMINI_API_KEY`  | Google Gemini API key (get from https://aistudio.google.com)           |
| `DATABASE_URL`    | SQLite: `file:./dev.db` · PostgreSQL: `postgresql://user:pass@host/db` |

---

##  Architecture Overview

```
sustainify/
├── app/
│   ├── api/
│   │   ├── products/categorize/route.ts   # Module 1 API
│   │   ├── proposals/generate/route.ts    # Module 2 API
│   │   ├── impact/generate/route.ts       # Module 3 API
│   │   ├── chat/message/route.ts          # Module 4 API
│   │   └── logs/route.ts                  # Prompt/response logs
│   ├── categorize/page.tsx                # Module 1 UI
│   ├── proposals/page.tsx                 # Module 2 UI
│   ├── impact/page.tsx                    # Module 3 architecture
│   ├── chat/page.tsx                      # Module 4 architecture
│   ├── logs/page.tsx                      # AI logs viewer
│   └── page.tsx                           # Dashboard
├── lib/
│   ├── ai/
│   │   ├── gemini-client.ts               # Gemini singleton + retry
│   │   ├── logger.ts                      # Prompt/response logger
│   │   ├── prompts/                       # Prompt templates
│   │   │   ├── categorize.ts
│   │   │   ├── proposal.ts
│   │   │   ├── impact.ts
│   │   │   └── chat.ts
│   │   └── services/                      # AI service functions
│   │       ├── categorize.service.ts
│   │       ├── proposal.service.ts
│   │       ├── impact.service.ts
│   │       └── chat.service.ts
│   ├── validators/schemas.ts              # Zod schemas
│   └── db.ts                              # Prisma singleton
├── components/
│   ├── Nav.tsx
│   └── JsonViewer.tsx
└── prisma/schema.prisma                   # Database schema
```

Separation of concerns:
- `lib/ai/prompts/` — Pure prompt strings (no business logic)
- `lib/ai/services/` — AI orchestration (call → parse → validate → log)
- `app/api/` — HTTP layer (request validation → service call → HTTP response)
- `lib/db.ts` — Database access only

---

##  AI Modules

### Module 1 – Auto-Category & Tag Generator
- Input: Product description (text)  
- Output: `{ category, subcategory, seo_tags[], sustainability_filters[] }`
- Endpoint: `POST /api/products/categorize`
- Validates against 10 predefined categories and 10 sustainability filters

### Module 2 – B2B Proposal Generator
- Input: Company requirements + budget (USD)
- Output: `{ product_mix[], budget_allocation{}, cost_breakdown{}, impact_summary }`
- Endpoint: `POST /api/proposals/generate`
- Budget overflow protection: rejects proposals where total > budget × 1.02

### Module 3 – Impact Report Generator *(Architecture)*
- Calculation: Category averages × filter bonuses for plastic/carbon
- Output: `{ plastic_saved_kg, carbon_avoided_kg, local_impact_summary, human_readable_statement }`
- Endpoint: `POST /api/impact/generate`

### Module 4 – WhatsApp Support Bot *(Architecture)*
- Capabilities: Order status, return policy, refund escalation, general FAQs
- Intent Classification: `order_status | return_policy | refund_escalation | general`
- Endpoint: `POST /api/chat/message`
- Integrates with WhatsApp Business API / Twilio webhooks

---

##  Prompt Design

### Why prompts produce structured JSON:

1. Explicit output-only instruction — "Return ONLY valid JSON. No explanation, no markdown."
2. Schema embedded in prompt — The exact required JSON schema is shown inside the prompt.
3. Constrained values — Categories and filters are listed as valid options to pick from.
4. Low temperature (0.2) — Reduces creativity, increases determinism and schema adherence.
5. JSON extraction fallback — `extractJson()` strips markdown fences if the model adds them.

---

##  Database Schema

| Model           | Purpose                                                              |
|-----------------|----------------------------------------------------------------------|
| `Product`       | Stores product info + AI-generated category/tags                     |
| `AIOutput`      | Logs every AI call: module, prompt, response, parsed JSON, duration  |
| `B2BProposal`   | Stores generated proposals with budget metadata                      |
| `Order`         | Customer orders for WhatsApp bot order lookup                        |
| `ImpactReport`  | Environmental impact calculations                                    |
| `ChatLog`       | WhatsApp conversation history per session                            |

---

##  Tech Stack Rationale

| Technology             | Why                                                              |
|------------------------|------------------------------------------------------------------|
| Next.js 14 App Router  | API routes + SSR in one framework, no separate backend needed    |
| TypeScript             | Type safety across AI response parsing reduces runtime errors    |
| Gemini-1.5-flash       | Fast, generous free tier, excellent JSON instruction-following   |
| Prisma + SQLite        | Type-safe ORM; SQLite for demo portability, swap to Postgres     |
| Zod                    | Runtime validation of AI outputs                                 |
| Tailwind CSS           | Rapid styling with consistent design tokens                      |

---

##  Error Handling

| Scenario               | Handling                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Invalid AI JSON        | `extractJson()` strips fences; if parse fails, error logged and returned |
| API failure            | Retry with exponential backoff, error returned after all retries fail    |
| Empty response         | Explicit check throws before JSON parse                                  |
| Budget overflow        | Checks `total_cost>budget×1.02`,returns `BUDGET_OVERFLOW` error code     |
| Zod validation failure | Descriptive error message with which fields failed                       |

---

##  Assumptions

1. Gemini API key is available from [Google AI Studio](https://aistudio.google.com) (free tier)
2. SQLite is used for development; production should use PostgreSQL
3. WhatsApp Business API integration requires Meta Business verification (Module 4 shows architecture only)
4. Impact calculations use industry-average estimates (not product-specific real data)
5. No authentication is implemented (add NextAuth.js or Clerk for production)
