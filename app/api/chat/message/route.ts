/**
 * API Route: POST /api/chat/message
 * Module 4 – AI WhatsApp Support Bot
 */

import { NextRequest, NextResponse } from "next/server";
import { processChatMessage } from "@/lib/ai/services/chat.service";
import { chatRequestSchema } from "@/lib/validators/schemas";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = chatRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Validation error", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const result = await processChatMessage({
            message: parsed.data.message,
            sessionId: parsed.data.sessionId,
        });

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
        console.error("[/api/chat/message] Unexpected error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
