/**
 * Module 1: Product Categorization AI Service
 * Located at: lib/ai/services/categorize.service.ts
 *
 * Orchestrates: prompt build → Gemini call → JSON extract → Zod validate → DB log
 */

import { generateContent, extractJson } from "@/lib/ai/gemini-client";
import { buildCategorizePrompt } from "@/lib/ai/prompts/categorize";
import { logAICall } from "@/lib/ai/logger";
import {
    categorizeOutputSchema,
    CategorizeOutput,
} from "@/lib/validators/schemas";
import { db } from "@/lib/db";

export interface CategorizeInput {
    description: string;
    productName?: string;
}

export interface CategorizeResult {
    success: boolean;
    data?: CategorizeOutput;
    error?: string;
    logId?: string;
    durationMs?: number;
}

export async function categorizeProduct(
    input: CategorizeInput
): Promise<CategorizeResult> {
    const prompt = buildCategorizePrompt(input.description);
    let rawResponse = "";
    let durationMs = 0;

    try {
        // 1. Call Gemini
        const result = await generateContent(prompt);
        rawResponse = result.text;
        durationMs = result.durationMs;

        // 2. Extract JSON
        const jsonString = extractJson(rawResponse);

        // 3. Parse JSON
        let parsed: unknown;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            throw new Error(
                `AI returned invalid JSON. Raw: ${rawResponse.slice(0, 200)}`
            );
        }

        // 4. Validate with Zod
        const validated = categorizeOutputSchema.safeParse(parsed);
        if (!validated.success) {
            throw new Error(
                `AI output failed validation: ${validated.error.message}`
            );
        }

        const data = validated.data;

        // 5. Save to database
        let productId: string | undefined;
        if (input.productName) {
            const product = await db.product.create({
                data: {
                    name: input.productName,
                    description: input.description,
                    category: data.category,
                    subcategory: data.subcategory,
                    seoTags: JSON.stringify(data.seo_tags),
                    susFilters: JSON.stringify(data.sustainability_filters),
                },
            });
            productId = product.id;
        }

        // 6. Log to AIOutput
        const logId = await logAICall({
            module: "categorize",
            prompt,
            response: rawResponse,
            parsedJson: data,
            success: true,
            durationMs,
            productId,
        });

        return { success: true, data, logId, durationMs };
    } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);

        // Log failure
        const logId = await logAICall({
            module: "categorize",
            prompt,
            response: rawResponse,
            success: false,
            errorMsg,
            durationMs,
        });

        return { success: false, error: errorMsg, logId, durationMs };
    }
}
