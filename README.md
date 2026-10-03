# Sustainify — Sustainable Commerce AI Operations Platform

Sustainify is a full-stack, enterprise-grade AI operations suite engineered for circular e-commerce, sustainable retail, and corporate ESG compliance. Powered by Google Gemini 2.5 Flash, strict Zod runtime schema verification, and Neon PostgreSQL audit ledgers, Sustainify replaces manual merchandising, complex RFP proposal drafting, and greenwashing-prone impact estimates with deterministic, auditable AI workflows.

---

## Real-World Use Cases & Business Value

### 1. Catalog Merchandising & Taxonomy Normalization
- **Challenge**: Sustainable marketplaces ingest thousands of SKUs from artisanal and ethical suppliers with inconsistent naming, missing certifications, and poor SEO tags.
- **Solution**: Sustainify's Taxonomy Engine automatically classifies raw product descriptions into 10 standardized retail categories, identifies verified eco-filter attributes (e.g., `plastic-free`, `compostable`, `vegan`), and generates 5–10 high-intent search tags without hallucinating certifications.

### 2. Corporate B2B Procurement & ESG Office Provisioning
- **Challenge**: Enterprise buyers require custom product bundles for corporate offices, hotels, or events constrained by strict department budgets. Manually balancing unit costs and sustainability criteria takes days.
- **Solution**: The Proposal Generator digests natural-language procurement briefs, allocates inventory across four distinct product verticals, and mathematically enforces budget caps (rejecting any bundle that exceeds budget by >2%), delivering itemized bills of materials with audit-ready ESG rationale.

### 3. Investor-Ready Life-Cycle Impact & Carbon Auditing
- **Challenge**: Brands struggle to quantify environmental benefits without hiring costly lifecycle assessment (LCA) consultants, often resulting in unsubstantiated greenwashing claims.
- **Solution**: The Impact Engine applies scientific category baselines to quantify plastic waste diverted (kg), greenhouse gas emissions avoided (kg CO₂e), and local freight benefits, generating verifiable, ISO 14044-aligned impact scorecards and investor statements.

### 4. Omnichannel Customer Support & Automated Returns
- **Challenge**: Sustainable consumers expect instant answers regarding compostability, packaging degradation timelines, and immediate resolutions for damaged items without friction.
- **Solution**: The WhatsApp Concierge integrates with customer order databases to verify order statuses (`#RAY-2024-891`), enforce 7-day damaged item immediate replacement policies, and intelligently escalate complex inquiries to human support managers with full session transcripts.

---

## Core AI Modules

| Module | Route | Primary Capabilities | Schema & Guarantees |
|---|---|---|---|
| **Module 01: Taxonomy Engine** | `/categorize` | Raw catalog parsing, hierarchical category assignment, eco-filter extraction, CSV export | Strict vertical validation against 10 predefined taxonomies |
| **Module 02: B2B Proposals** | `/proposals` | RFP brief synthesis, itemized bill of materials, budget allocation breakdown, print-ready PDF export | Hard mathematical budget guard (cost sum ≤ budget × 1.02) |
| **Module 03: Impact Calculator** | `/impact` | Multi-product batch lifecycle analysis, landfill diversion metrics, equivalent bottle and seedling counts | Deterministic non-negative float validation |
| **Module 04: Support Concierge** | `/chat` | WhatsApp Cloud API webhook simulation, live order database query, damaged return handling | Intent classification + automated Tier-2 escalation |
| **Observability Ledger** | `/logs` | Full audit trail of prompts, reasoning tokens, execution latency, and parsed JSON | Every prompt and response persisted in PostgreSQL |

---

## Architectural Principles: Eliminating Hallucinations

Standard LLM completions fail in production e-commerce due to syntax errors, non-deterministic pricing, and fabricated claims. Sustainify implements four layers of architectural guarantees:

1. **Pinned Low-Temperature Prompts (`T = 0.2`)**: Minimizes hallucination while optimizing for deterministic extraction and schema compliance.
2. **Robust Depth-Tracking JSON Extractor**: Isolate valid JSON objects even when LLMs wrap payloads in markdown code fences or conversational text.
3. **Strict Runtime Zod Validation**: Every payload is checked against strict Zod schemas before being returned or committed to storage.
4. **Immutable Audit Ledger**: All requests, inputs, raw completions, parsed outputs, execution durations, and error states are recorded in the `AIOutput` table.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 (Custom Green & White Sustainability Theme)
- **3D Visualization**: Three.js, React Three Fiber, React Three Drei
- **AI Core**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Validation**: Zod 3.25
- **Database & ORM**: Neon Serverless PostgreSQL + Prisma ORM 5.14
- **Icons**: Bespoke Vector SVG Icon System (zero cartoon emojis)

---

## Project Structure

```
sustainify/
├── app/
│   ├── api/
│   │   ├── products/categorize/route.ts  # Taxonomy extraction endpoint
│   │   ├── proposals/generate/route.ts   # B2B proposal synthesis endpoint
│   │   ├── impact/generate/route.ts      # Life-cycle impact engine endpoint
│   │   ├── chat/message/route.ts         # WhatsApp concierge endpoint
│   │   └── logs/route.ts                 # Telemetry & audit logs endpoint
│   ├── categorize/page.tsx               # Module 01 UI
│   ├── proposals/page.tsx                # Module 02 UI
│   ├── impact/page.tsx                   # Module 03 UI
│   ├── chat/page.tsx                     # Module 04 UI
│   ├── logs/page.tsx                     # System Observability & Prompt Logs
│   ├── layout.tsx                        # Global Layout, Fonts & Navigation
│   ├── page.tsx                          # Landing Page & 3D Interactive Hero
│   └── globals.css                       # Green & White Theme Tokens
├── components/
│   ├── Hero.tsx                          # Interactive 3D Hero Section
│   ├── ThreeBackground.tsx               # Three.js 3D Wireframe Sustainability Sphere
│   ├── Nav.tsx                           # Frosted Navigation Bar
│   ├── Icons.tsx                         # Handcrafted Vector SVG Icons
│   └── JsonViewer.tsx                    # Diagnostic JSON Payload Inspector
├── lib/
│   ├── ai/
│   │   ├── gemini-client.ts              # Gemini API client with fallback retry
│   │   ├── logger.ts                     # Database audit logging utility
│   │   ├── prompts/                      # Pure prompt templates
│   │   └── services/                     # Business logic and AI orchestration
│   ├── validators/schemas.ts             # Zod validation schemas
│   └── db.ts                             # Prisma client singleton
└── prisma/
    └── schema.prisma                     # PostgreSQL schema definitions
```

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or Node.js 20+
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- A PostgreSQL database (e.g., [Neon Serverless Postgres](https://neon.tech/))

### 1. Installation

```bash
git clone <your-repo-url>
cd sustainify
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"

# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-host.region.aws.neon.tech/neondb?sslmode=require"
```

### 3. Database Migration

Push the schema to your PostgreSQL database:

```bash
npx prisma db push
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment Guide

### Deploy to Vercel

1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete sustainify green/white redesign and interactive hero"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sustainify.git
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import your `sustainify` GitHub repository.
4. Add the following Environment Variables in the Vercel project settings:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
5. Click **Deploy**. Vercel will build and serve your application with automatic edge routing.

---

## License

MIT License. Engineered for sustainable commerce and circular logistics.
