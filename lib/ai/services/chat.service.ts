/**
 * Module 4: Chat (WhatsApp Support Bot) AI Service
 * Located at: lib/ai/services/chat.service.ts
 */

import { generateContent, extractJson } from "@/lib/ai/gemini-client";
import { buildChatPrompt } from "@/lib/ai/prompts/chat";
import { logAICall } from "@/lib/ai/logger";
import { chatOutputSchema, ChatOutput } from "@/lib/validators/schemas";
import { db } from "@/lib/db";

export interface ChatInput {
    message: string;
    sessionId: string;
}

export interface ChatResult {
    success: boolean;
    data?: ChatOutput;
    error?: string;
    durationMs?: number;
}

export async function processChatMessage(
    input: ChatInput
): Promise<ChatResult> {
    let rawResponse = "";
    let durationMs = 0;

    try {
        // 1. Load conversation history
        const history = await db.chatLog.findMany({
            where: { sessionId: input.sessionId },
            orderBy: { createdAt: "asc" },
            take: 10, // last 10 messages
        });

        const conversationHistory = history.map((log) => ({
            role: log.from as "user" | "bot",
            message: log.message,
        }));

        // 2. Find order context (look for order number in message or session history)
        const orderNumberMatch = input.message.match(
            /(?:order|#)\s*([A-Z0-9-]{5,})/i
        );
        let orderContext = null;
        if (orderNumberMatch) {
            const order = await db.order.findUnique({
                where: { orderNumber: orderNumberMatch[1].toUpperCase() },
            });
            if (order) {
                orderContext = {
                    orderNumber: order.orderNumber,
                    status: order.status,
                    items: order.items,
                    total: order.total,
                    placedAt: order.placedAt.toLocaleDateString("en-IN"),
                };
            }
        }

        // 3. Build prompt and call Gemini
        const prompt = buildChatPrompt({
            userMessage: input.message,
            conversationHistory,
            orderContext,
        });

        const result = await generateContent(prompt);
        rawResponse = result.text;
        durationMs = result.durationMs;

        // 4. Extract + Validate
        const jsonString = extractJson(rawResponse);
        let parsed: unknown;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            throw new Error(`AI returned invalid JSON: ${rawResponse.slice(0, 200)}`);
        }

        const validated = chatOutputSchema.safeParse(parsed);
        if (!validated.success) {
            throw new Error(`Validation failed: ${validated.error.message}`);
        }

        const data = validated.data;

        // 5. Log user message + bot response
        await db.chatLog.createMany({
            data: [
                {
                    sessionId: input.sessionId,
                    from: "user",
                    message: input.message,
                    intent: data.intent,
                    orderId: orderContext ? undefined : undefined,
                },
                {
                    sessionId: input.sessionId,
                    from: "bot",
                    message: data.response,
                    intent: data.intent,
                },
            ],
        });

        await logAICall({
            module: "chat",
            prompt,
            response: rawResponse,
            parsedJson: data,
            success: true,
            durationMs,
        });

        return { success: true, data, durationMs };
    } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        await logAICall({
            module: "chat",
            prompt: input.message,
            response: rawResponse,
            success: false,
            errorMsg,
            durationMs,
        });
        return { success: false, error: errorMsg, durationMs };
    }
}
