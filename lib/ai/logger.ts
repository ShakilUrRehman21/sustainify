/**
 * AI Prompt Logger
 * Persists every AI call (prompt + response) to the AIOutput table.
 * Located at: lib/ai/logger.ts
 */

import { db } from "@/lib/db";

export interface LogAICallParams {
    module: "categorize" | "proposal" | "impact" | "chat";
    prompt: string;
    response: string;
    parsedJson?: object | null;
    success: boolean;
    errorMsg?: string;
    durationMs?: number;
    productId?: string;
}

export async function logAICall(params: LogAICallParams): Promise<string> {
    try {
        const record = await db.aIOutput.create({
            data: {
                module: params.module,
                prompt: params.prompt,
                response: params.response,
                parsedJson: params.parsedJson ? JSON.stringify(params.parsedJson) : null,
                success: params.success,
                errorMsg: params.errorMsg ?? null,
                durationMs: params.durationMs ?? null,
                productId: params.productId ?? null,
            },
        });
        return record.id;
    } catch (err) {
        // Logging should never crash the main flow
        console.error("[AILogger] Failed to log AI call:", err);
        return "log-failed";
    }
}
