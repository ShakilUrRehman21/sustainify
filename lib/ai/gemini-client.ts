/**
 * Gemini AI Client – Singleton with error handling and retry logic
 * Located at: lib/ai/gemini-client.ts
 */

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Reuse the same model instance
let _model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (!_model) {
    _model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2,       // Low temperature → consistent, structured output
        topP: 0.8,
        maxOutputTokens: 8192,  // Increased from 2048 to handle full proposal JSON
      },
    });
  }
  return _model;
}

/**
 * Generate content with retry logic.
 * @param prompt - Full prompt string
 * @param retries - Number of retry attempts (default 2)
 */
export async function generateContent(
  prompt: string,
  retries = 2
): Promise<{ text: string; durationMs: number }> {
  const model = getGeminiModel();
  const start = Date.now();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim() === "") {
        throw new Error("Empty response received from Gemini API");
      }

      return { text: text.trim(), durationMs: Date.now() - start };
    } catch (error: unknown) {
      const isLast = attempt === retries;
      if (isLast) {
        throw new Error(
          `Gemini API failed after ${retries + 1} attempts: ${error instanceof Error ? error.message : String(error)
          }`
        );
      }
      // Exponential back-off
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
    }
  }

  // TypeScript: unreachable, but satisfies the compiler
  throw new Error("Unexpected error in generateContent");
}

/**
 * Extract JSON from AI response.
 * Handles:
 * - Markdown code fences (```json ... ```)
 * - Thinking models (gemini-2.5-flash) that prepend reasoning text before JSON
 * - Bare JSON with surrounding prose
 */
export function extractJson(raw: string): string {
  // 1. Strip markdown code fences first: ```json ... ``` or ``` ... ```
  // 1. Strip markdown code fences: ```json\n...\n``` — model often wraps JSON this way
  // Two-step: remove the opening ```json or ``` marker, then find closing ```
  const fenceOpen = raw.indexOf("```");
  if (fenceOpen !== -1) {
    // skip past the opening fence line (```json\n or ```\n)
    const afterFenceHeader = raw.indexOf("\n", fenceOpen);
    if (afterFenceHeader !== -1) {
      const fenceClose = raw.indexOf("```", afterFenceHeader + 1);
      if (fenceClose !== -1) {
        return raw.slice(afterFenceHeader + 1, fenceClose).trim();
      }
    }
  }

  // 2. For thinking models: find the FIRST top-level { ... } block
  //    by tracking brace depth — more reliable than lastIndexOf
  const tryExtract = (open: string, close: string): string | null => {
    const start = raw.indexOf(open);
    if (start === -1) return null;
    let depth = 0;
    for (let i = start; i < raw.length; i++) {
      if (raw[i] === open) depth++;
      else if (raw[i] === close) {
        depth--;
        if (depth === 0) return raw.slice(start, i + 1);
      }
    }
    return null;
  };

  const objJson = tryExtract("{", "}");
  if (objJson) return objJson;

  const arrJson = tryExtract("[", "]");
  if (arrJson) return arrJson;

  return raw.trim();
}
