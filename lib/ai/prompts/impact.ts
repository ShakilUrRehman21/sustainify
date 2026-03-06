/**
 * Module 3: Impact Report Generation Prompt
 * Located at: lib/ai/prompts/impact.ts
 *
 * Calculation Logic:
 * - Plastic saved: Based on product category averages (e.g., reusable bottle = 500g plastic/year)
 * - Carbon avoided: Based on lifecycle CO2 emissions saved vs conventional alternatives
 * - Local sourcing: % of products sourced locally × transport emissions saved
 */

export interface ImpactPromptInput {
  products: Array<{
    name: string;
    category: string;
    quantity: number;
    sustainabilityFilters: string[];
  }>;
}

export function buildImpactPrompt(input: ImpactPromptInput): string {
  const productList = input.products
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} (${p.category}) × ${p.quantity} units | Filters: ${p.sustainabilityFilters.join(", ")}`
    )
    .join("\n");

  return `You are the Impact Calculation Engine for "Sustainify".
Your task is to estimate the environmental impact of a batch of sustainable products.

CRITICAL: Return ONLY a valid JSON object. No markdown formatting, no explanations.es:

CALCULATION GUIDELINES:
- Plastic saved (kg): Use category averages:
  * Personal Care items: ~0.05 kg plastic saved per unit vs conventional
  * Home & Kitchen: ~0.2 kg plastic saved per unit
  * Cleaning & Hygiene: ~0.15 kg plastic saved per unit
  * Food & Beverage: ~0.1 kg plastic saved per unit
  * Other categories: ~0.08 kg plastic saved per unit
  * Multiply by quantity and sustainability bonus (e.g., plastic-free filter adds 20%)

- Carbon avoided (kg CO2e): Use averages:
  * Organic/recycled products: ~0.3 kg CO2e saved per unit vs conventional
  * Compostable/biodegradable: ~0.2 kg CO2e saved per unit
  * Locally sourced: ~0.15 kg CO2e saved per unit
  * Sum across all applicable filters

- Local impact: Calculate % of locally sourced products and describe benefits

PRODUCTS ORDERED:
${productList}

Return ONLY this JSON schema (no explanation, no markdown):
{
  "plastic_saved_kg": number,
  "carbon_avoided_kg": number,
  "local_impact_summary": "string describing local sourcing benefits",
  "human_readable_statement": "string - compelling 2-sentence summary for marketing use",
  "calculation_breakdown": {
    "plastic_per_product": [{ "product": "string", "kg_saved": number }],
    "carbon_per_product": [{ "product": "string", "kg_co2e_avoided": number }]
  }
}

Return only the JSON object:`;
}
