/**
 * API Route: POST /api/impact/generate
 * Module 3 – AI Impact Report Generator
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImpactReport } from "@/lib/ai/services/impact.service";
import { impactRequestSchema } from "@/lib/validators/schemas";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = impactRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Validation error", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const result = await generateImpactReport({ products: parsed.data.products });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 422 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            meta: { durationMs: result.durationMs },
        });
    } catch (err) {
        console.error("[/api/impact/generate] Unexpected error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
