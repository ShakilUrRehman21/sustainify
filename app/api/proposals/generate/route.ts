/**
 * API Route: POST /api/proposals/generate
 * Module 2 – AI B2B Proposal Generator
 */

import { NextRequest, NextResponse } from "next/server";
import { generateProposal } from "@/lib/ai/services/proposal.service";
import { proposalRequestSchema } from "@/lib/validators/schemas";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = proposalRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Validation error", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const result = await generateProposal({
            requirements: parsed.data.requirements,
            budget: parsed.data.budget,
            companyName: parsed.data.companyName,
        });

        if (!result.success) {
            const isBudgetError = result.error?.includes("Budget overflow");
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                    code: isBudgetError ? "BUDGET_OVERFLOW" : "AI_ERROR",
                },
                { status: isBudgetError ? 400 : 422 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            meta: { logId: result.logId, durationMs: result.durationMs },
        });
    } catch (err) {
        console.error("[/api/proposals/generate] Unexpected error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
