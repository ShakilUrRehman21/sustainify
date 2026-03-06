/**
 * Module 4: WhatsApp Support Bot Prompt
 * Located at: lib/ai/prompts/chat.ts
 */

export interface ChatPromptInput {
    userMessage: string;
    conversationHistory: Array<{ role: "user" | "bot"; message: string }>;
    orderContext?: {
        orderNumber: string;
        status: string;
        items: string;
        total: number;
        placedAt: string;
    } | null;
}

export function buildChatPrompt(input: ChatPromptInput): string {
    const { userMessage, conversationHistory, orderContext } = input;

    const historyStr =
        conversationHistory.length > 0
            ? conversationHistory
                .slice(-6) // last 6 messages for context window
                .map((m) => `${m.role === "user" ? "Customer" : "Sustainify Bot"}: ${m.message}`)
                .join("\n")
            : "No previous messages.";

    const orderStr = orderContext
        ? `ORDER DETAILS FOUND:
  - Order #: ${orderContext.orderNumber}
  - Status: ${orderContext.status}
  - Items: ${orderContext.items}
  - Total: $${orderContext.total}
  - Placed: ${orderContext.placedAt}`
        : "No order found for this session.";

    return `You are the automated customer support agent for Sustainify, a sustainable commerce platform.
You are communicating with a customer via WhatsApp. Keep responses concise, helpful, and friendly.

Capabilities & Policies:
- Escalate complex refund requests to human agents
- Provide general information about Sustainify products and sustainability mission

SUSTAINIFY POLICIES:
- Return window: 30 days from delivery
- Refund processing: 5–7 business days
- Damaged items: Full refund or replacement within 7 days
- Eco-packaging: All orders use compostable packaging
- Working hours: 9 AM – 6 PM IST (Mon–Sat); bot handles 24/7

${orderStr}

CONVERSATION HISTORY:
${historyStr}

CUSTOMER MESSAGE: ${userMessage}

INSTRUCTIONS:
1. Classify the customer's intent as: "order_status" | "return_policy" | "refund_escalation" | "general"
2. Provide a warm, helpful, concise response (2–4 sentences max).
3. If refund escalation is needed, say you will connect them to a human agent.
4. Return ONLY this JSON (no markdown):

{
  "intent": "order_status|return_policy|refund_escalation|general",
  "response": "Your reply to the customer",
  "escalate_to_human": false,
  "suggested_actions": ["action1", "action2"]
}

Return only the JSON object:`;
}
