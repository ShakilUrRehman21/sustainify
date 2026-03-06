/**
 * Zod Validation Schemas for all 4 AI modules
 * Located at: lib/validators/schemas.ts
 */

import { z } from "zod";

// ─── Module 1: Product Categorization ───────────────────────────────────────
export const categorizeOutputSchema = z.object({
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().min(1, "Subcategory is required"),
    seo_tags: z
        .array(z.string().min(1))
        .min(5, "At least 5 SEO tags required")
        .max(10, "Maximum 10 SEO tags allowed"),
    sustainability_filters: z.array(z.string()).default([]),
});

export type CategorizeOutput = z.infer<typeof categorizeOutputSchema>;

// ─── Module 2: B2B Proposal ──────────────────────────────────────────────────
export const productMixItemSchema = z.object({
    product_name: z.string(),
    category: z.string(),
    description: z.string(),
    quantity: z.number().positive(),
    unit_price: z.number().positive(),
    sustainability_highlights: z.array(z.string()).default([]),
});

export const costBreakdownItemSchema = z.object({
    product: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
    subtotal: z.number(),
});

export const proposalOutputSchema = z.object({
    product_mix: z.array(productMixItemSchema).min(1),
    budget_allocation: z.record(z.string()),
    cost_breakdown: z.object({
        items: z.array(costBreakdownItemSchema),
        total_cost: z.number().positive(),
        currency: z.string().default("USD"),
    }),
    impact_summary: z.string().min(10),
});

export type ProposalOutput = z.infer<typeof proposalOutputSchema>;

// ─── Module 3: Impact Report ─────────────────────────────────────────────────
export const impactOutputSchema = z.object({
    plastic_saved_kg: z.number().min(0),
    carbon_avoided_kg: z.number().min(0),
    local_impact_summary: z.string(),
    human_readable_statement: z.string(),
    calculation_breakdown: z
        .object({
            plastic_per_product: z
                .array(z.object({ product: z.string(), kg_saved: z.number() }))
                .optional(),
            carbon_per_product: z
                .array(z.object({ product: z.string(), kg_co2e_avoided: z.number() }))
                .optional(),
        })
        .optional(),
});

export type ImpactOutput = z.infer<typeof impactOutputSchema>;

// ─── Module 4: Chat Bot ───────────────────────────────────────────────────────
export const chatOutputSchema = z.object({
    intent: z.enum([
        "order_status",
        "return_policy",
        "refund_escalation",
        "general",
    ]),
    response: z.string().min(1),
    escalate_to_human: z.boolean().default(false),
    suggested_actions: z.array(z.string()).default([]),
});

export type ChatOutput = z.infer<typeof chatOutputSchema>;

// ─── API Request Schemas ─────────────────────────────────────────────────────
export const categorizeRequestSchema = z.object({
    description: z
        .string()
        .min(10, "Product description must be at least 10 characters")
        .max(2000, "Description is too long"),
    productName: z.string().optional(),
});

export const proposalRequestSchema = z.object({
    requirements: z
        .string()
        .min(20, "Please provide detailed requirements")
        .max(3000),
    budget: z.number().positive("Budget must be a positive number").max(10_000_000),
    companyName: z.string().optional(),
});

export const impactRequestSchema = z.object({
    products: z
        .array(
            z.object({
                name: z.string(),
                category: z.string(),
                quantity: z.number().positive(),
                sustainabilityFilters: z.array(z.string()).default([]),
            })
        )
        .min(1, "At least one product is required"),
});

export const chatRequestSchema = z.object({
    message: z.string().min(1).max(1000),
    sessionId: z.string().min(1),
});
