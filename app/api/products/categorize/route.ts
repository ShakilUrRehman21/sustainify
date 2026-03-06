/**
 * API Route: POST /api/products/categorize
 * Module 1 – AI Product Category & Tag Generator
 */

import { NextRequest, NextResponse } from "next/server";
import { categorizeProduct } from "@/lib/ai/services/categorize.service";
import { categorizeRequestSchema } from "@/lib/validators/schemas";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request
        const parsed = categorizeRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Validation error", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const result = await categorizeProduct({
            description: parsed.data.description,
            productName: parsed.data.productName,
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error, logId: result.logId },
                { status: 422 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            meta: { logId: result.logId, durationMs: result.durationMs },
        });
    } catch (err) {
        console.error("[/api/products/categorize] Unexpected error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
