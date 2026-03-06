/**
 * Module 2: B2B Proposal AI Service
 * Located at: lib/ai/services/proposal.service.ts
 */

import { generateContent, extractJson } from "@/lib/ai/gemini-client";
import { buildProposalPrompt } from "@/lib/ai/prompts/proposal";
import { logAICall } from "@/lib/ai/logger";
import { proposalOutputSchema, ProposalOutput } from "@/lib/validators/schemas";
import { db } from "@/lib/db";

export interface ProposalInput {
    requirements: string;
    budget: number;
    companyName?: string;
}

export interface ProposalResult {
    success: boolean;
    data?: ProposalOutput;
    error?: string;
    logId?: string;
    durationMs?: number;
    budgetOverflowAmount?: number;
}

export async function generateProposal(
    input: ProposalInput
): Promise<ProposalResult> {
    const prompt = buildProposalPrompt({
        requirements: input.requirements,
        budget: input.budget,
        companyName: input.companyName,
    });

    let rawResponse = "";
    let durationMs = 0;

    try {
        // 1. Call Gemini
        const result = await generateContent(prompt);
        rawResponse = result.text;
        durationMs = result.durationMs;

        // 2. Extract + Parse JSON
        const jsonString = extractJson(rawResponse);
        let parsed: unknown;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            throw new Error(`AI returned invalid JSON. Raw: ${rawResponse.slice(0, 200)}`);
        }

        // 3. Validate with Zod
        const validated = proposalOutputSchema.safeParse(parsed);
        if (!validated.success) {
            throw new Error(`AI output failed validation: ${validated.error.message}`);
        }

        const data = validated.data;

        // 4. Budget Overflow Check (hard constraint)
        const totalCost = data.cost_breakdown.total_cost;
        if (totalCost > input.budget * 1.02) {
            // Allow 2% margin for rounding
            throw new Error(
                `Budget overflow: proposal total $${totalCost.toFixed(2)} exceeds budget $${input.budget.toFixed(2)}`
            );
        }

        // 5. Persist to DB
        await db.b2BProposal.create({
            data: {
                companyName: input.companyName ?? null,
                requirements: input.requirements,
                budget: input.budget,
                productMix: JSON.stringify(data.product_mix),
                budgetAlloc: JSON.stringify(data.budget_allocation),
                costBreakdown: JSON.stringify(data.cost_breakdown),
                impactSummary: data.impact_summary,
                totalCost: totalCost,
            },
        });

        // 6. Log
        const logId = await logAICall({
            module: "proposal",
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
            module: "proposal",
            prompt,
            response: rawResponse,
            success: false,
            errorMsg,
            durationMs,
        });

        // Detect budget overflow for specific error message
        const isOverflow = errorMsg.includes("Budget overflow");
        return {
            success: false,
            error: errorMsg,
            durationMs,
            budgetOverflowAmount: isOverflow ? undefined : undefined,
        };
    }
}
