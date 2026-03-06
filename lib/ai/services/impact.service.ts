/**
 * Module 3: Impact Report AI Service
 * Located at: lib/ai/services/impact.service.ts
 */

import { generateContent, extractJson } from "@/lib/ai/gemini-client";
import { buildImpactPrompt } from "@/lib/ai/prompts/impact";
import { logAICall } from "@/lib/ai/logger";
import { impactOutputSchema, ImpactOutput } from "@/lib/validators/schemas";
import { db } from "@/lib/db";

export interface ImpactInput {
    products: Array<{
        name: string;
        category: string;
        quantity: number;
        sustainabilityFilters: string[];
    }>;
}

export interface ImpactResult {
    success: boolean;
    data?: ImpactOutput;
    error?: string;
    logId?: string;
    durationMs?: number;
}

export async function generateImpactReport(
    input: ImpactInput
): Promise<ImpactResult> {
    const prompt = buildImpactPrompt({ products: input.products });
    let rawResponse = "";
    let durationMs = 0;

    try {
        const result = await generateContent(prompt);
        rawResponse = result.text;
        durationMs = result.durationMs;

        const jsonString = extractJson(rawResponse);
        let parsed: unknown;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            throw new Error(`AI returned invalid JSON: ${rawResponse.slice(0, 200)}`);
        }

        const validated = impactOutputSchema.safeParse(parsed);
        if (!validated.success) {
            throw new Error(`Validation failed: ${validated.error.message}`);
        }

        const data = validated.data;

        // Persist report
        await db.impactReport.create({
            data: {
                inputData: JSON.stringify(input.products),
                plasticSavedKg: data.plastic_saved_kg,
                carbonAvoidedKg: data.carbon_avoided_kg,
                localImpactSummary: data.local_impact_summary,
                humanReadableStmt: data.human_readable_statement,
                calculationBreakdown: JSON.stringify(data.calculation_breakdown ?? {}),
            },
        });

        const logId = await logAICall({
            module: "impact",
            prompt,
            response: rawResponse,
            parsedJson: data,
            success: true,
            durationMs,
        });

        return { success: true, data, logId, durationMs };
    } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        await logAICall({
            module: "impact",
            prompt,
            response: rawResponse,
            success: false,
            errorMsg,
            durationMs,
        });
        return { success: false, error: errorMsg, durationMs };
    }
}
