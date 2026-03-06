/**
 * API Route: GET /api/logs
 * Returns paginated AI prompt/response logs
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
        const module = searchParams.get("module"); // optional filter

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            db.aIOutput.findMany({
                where: module ? { module } : undefined,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                select: {
                    id: true,
                    module: true,
                    success: true,
                    errorMsg: true,
                    durationMs: true,
                    createdAt: true,
                    parsedJson: true,
                    prompt: true,
                    response: true,
                },
            }),
            db.aIOutput.count({ where: module ? { module } : undefined }),
        ]);

        return NextResponse.json({
            success: true,
            data: logs.map((l) => ({
                ...l,
                parsedJson: l.parsedJson ? JSON.parse(l.parsedJson) : null,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("[/api/logs] Error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch logs" },
            { status: 500 }
        );
    }
}
