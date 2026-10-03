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
        let conversationHistory: Array<{ role: "user" | "bot"; message: string }> = [];
        try {
            const history = await db.chatLog.findMany({
                where: { sessionId: input.sessionId },
                orderBy: { createdAt: "asc" },
                take: 10,
            });
            conversationHistory = history.map((log) => ({
                role: log.from as "user" | "bot",
                message: log.message,
            }));
        } catch (dbErr) {
            console.warn("[ChatService] Failed to load chat history from DB:", dbErr);
        }

        // 2. Find order context (look for order number in message)
        const orderNumberMatch = input.message.match(
            /(?:order|#)?\s*([A-Z0-9]{3,}-[A-Z0-9-]{3,})/i
        );
        type OrderContextType = {
            orderNumber: string;
            status: string;
            items: string;
            total: number;
            placedAt: string;
        };
        let orderContext: OrderContextType | null = null;

        if (orderNumberMatch) {
            const matchedCode = orderNumberMatch[1].toUpperCase();
            try {
                const order = await db.order.findUnique({
                    where: { orderNumber: matchedCode },
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
            } catch (err) {
                console.warn("[ChatService] Order query failed:", err);
            }

            // Fallback demo orders for instant out-of-the-box testing
            if (!orderContext) {
                const DEMO_ORDERS: Record<string, OrderContextType> = {
                    "RAY-2024-891": {
                        orderNumber: "RAY-2024-891",
                        status: "shipped (out for delivery with EcoCourier)",
                        items: "100x Bamboo Toothbrush Sets, 50x Compostable Kraft Mailers",
                        total: 320.0,
                        placedAt: "March 2, 2024",
                    },
                    "SUS-2024-8842": {
                        orderNumber: "SUS-2024-8842",
                        status: "delivered (signed by Front Desk)",
                        items: "24x Insulated Bamboo Tumblers, 48x Organic Cotton Tote Bags",
                        total: 540.0,
                        placedAt: "February 24, 2024",
                    },
                    "ECO-2024-102": {
                        orderNumber: "ECO-2024-102",
                        status: "processing at carbon-neutral warehouse",
                        items: "500x Plant-based packaging pouches",
                        total: 890.0,
                        placedAt: "Yesterday",
                    },
                };
                if (DEMO_ORDERS[matchedCode]) {
                    orderContext = DEMO_ORDERS[matchedCode];
                }
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
        try {
            await db.chatLog.createMany({
                data: [
                    {
                        sessionId: input.sessionId,
                        from: "user",
                        message: input.message,
                        intent: data.intent,
                    },
                    {
                        sessionId: input.sessionId,
                        from: "bot",
                        message: data.response,
                        intent: data.intent,
                    },
                ],
            });
        } catch (logErr) {
            console.warn("[ChatService] Failed to save chat messages to DB:", logErr);
        }

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
