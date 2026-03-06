/**
 * Module 2: B2B Proposal Generation Prompt
 *
 * Why it produces structured JSON:
 * - Budget is embedded directly in the prompt as a hard constraint
 * - We define the exact output schema + field types in the prompt
 * - Temperature is low (0.2) to minimise hallucination
 * - Post-generation, budget validation is done in the service layer
 * Located at: lib/ai/prompts/proposal.ts
 */

export interface ProposalPromptInput {
  requirements: string;
  budget: number;
  companyName?: string;
}

export function buildProposalPrompt(input: ProposalPromptInput): string {
  const { requirements, budget, companyName } = input;
  const company = companyName ?? "the client company";

  return `You are an expert sustainable commerce B2B proposal advisor for the platform "Sustainify".
Your task is to generate a comprehensive, budget-compliant product proposal based on the client's requirements.

CRITICAL RULES:TRAINT: The TOTAL cost in "cost_breakdown.total_cost" MUST NOT exceed ${budget} (USD). This is a hard budget limit.

COMPANY REQUIREMENTS:
${requirements}

MAXIMUM BUDGET: $${budget.toLocaleString()}

INSTRUCTIONS:
1. Suggest a mix of 3–6 sustainable product categories suitable for the company's needs.
2. Allocate percentages of the budget across product categories (must sum to 100%).
3. Provide a cost breakdown per product with unit prices and quantities.
4. Write a compelling impact positioning summary (2–4 sentences) highlighting sustainability benefits.
5. Return ONLY valid JSON. No explanation, no markdown fencing.

REQUIRED OUTPUT SCHEMA:
{
  "product_mix": [
    {
      "product_name": "string",
      "category": "string",
      "description": "string",
      "quantity": number,
      "unit_price": number,
      "sustainability_highlights": ["string"]
    }
  ],
  "budget_allocation": {
    "<category_name>": "<percentage_string e.g. 30%>"
  },
  "cost_breakdown": {
    "items": [
      { "product": "string", "quantity": number, "unit_price": number, "subtotal": number }
    ],
    "total_cost": number,
    "currency": "USD"
  },
  "impact_summary": "string"
}

Return only the JSON object:`;
}
