/**
 * Module 1: Product Categorization Prompt
 *
 * Why it produces structured JSON:
 * - The system instruction explicitly instructs the model to ONLY return JSON
 * - We list the exact schema fields required
 * - We provide predefined categories and valid filter values to constrain output
 * - Temperature is set to 0.2 so the model stays deterministic and schema-adherent
 * Located at: lib/ai/prompts/categorize.ts
 */

export const PREDEFINED_CATEGORIES = [
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
] as const;

export const VALID_SUSTAINABILITY_FILTERS = [
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
] as const;

/**
 * Build the categorization prompt for a given product description.
 */
export function buildCategorizePrompt(description: string): string {
    return `You are a product categorization AI for "Sustainify", a sustainable commerce platform.
Your task is to analyze a B2B product description and extract its category, subcategory, SEO tags, and sustainability filters.

CRITICAL: Return ONLY a valid JSON object. No markdown formatting, no code blocks, no explanation text before or after the JSON.

VALID PRIMARY CATEGORIES (pick exactly one):
${PREDEFINED_CATEGORIES.map((c) => `- ${c}`).join("\n")}

VALID SUSTAINABILITY FILTERS (pick all that apply):
${VALID_SUSTAINABILITY_FILTERS.map((f) => `- ${f}`).join("\n")}

RULES:
1. Return ONLY valid JSON matching the schema below.
2. "category" must be one of the valid categories listed above.
3. "subcategory" should be a logical subdivision of the chosen category (2–4 words).
4. "seo_tags" must contain 5 to 10 lowercase, hyphenated strings (e.g., "bamboo-toothbrush").
5. "sustainability_filters" must only contain values from the valid list above.
6. Do not include any explanation, preamble, or markdown fencing.

REQUIRED OUTPUT SCHEMA:
{
  "category": "<primary category>",
  "subcategory": "<sub-category>",
  "seo_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sustainability_filters": ["filter1", "filter2"]
}

PRODUCT DESCRIPTION:
${description}

Return only the JSON object:`;
}
