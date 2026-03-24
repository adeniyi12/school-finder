// ─────────────────────────────────────────────
// API Route: POST /api/recommend
// ─────────────────────────────────────────────

import { NextRequest } from "next/server";
import { runSchoolFinder } from "@/../../src/agent";
import { FormSubmission } from "@/../../src/types";
import OpenAI from "openai";

// ─── OpenRouter LLM caller ─────────────────────

function makeOpenRouterCaller() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return undefined;

  const model = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": siteUrl,
      "X-Title": "ScholarPath",
    },
  });

  return async (prompt: string): Promise<string> => {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a university admissions expert. Return only valid JSON arrays. No markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    return response.choices[0].message.content ?? "[]";
  };
}

// ─── Validation ────────────────────────────────

function validate(body: Partial<FormSubmission>): string[] {
  const errors: string[] = [];
  if (!body.level) errors.push("level is required");
  if (!body.fieldOfStudy) errors.push("fieldOfStudy is required");
  if (!body.countryOfOrigin) errors.push("countryOfOrigin is required");
  if (body.gpa === undefined) errors.push("gpa is required");
  if (!body.gradingScale) errors.push("gradingScale is required");
  if (!body.englishTest) errors.push("englishTest is required");
  if (!body.researchLevel) errors.push("researchLevel is required");
  if (body.hasPublications === undefined) errors.push("hasPublications is required");
  if (body.hasAwards === undefined) errors.push("hasAwards is required");
  if (body.hasLeadership === undefined) errors.push("hasLeadership is required");
  if (!body.volunteeringLevel) errors.push("volunteeringLevel is required");
  if (!Array.isArray(body.preferredCountries)) errors.push("preferredCountries must be an array");
  if (!body.universitySize) errors.push("universitySize is required");
  if (!body.annualBudget) errors.push("annualBudget is required");
  if (!body.scholarshipNeed) errors.push("scholarshipNeed is required");
  return errors;
}

// ─── Handler ───────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Partial<FormSubmission>;

  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return Response.json({ success: false, errors }, { status: 400 });
  }

  try {
    const callLLM = makeOpenRouterCaller();

    const result = await runSchoolFinder(body as FormSubmission, {
      callLLM,
      mock: !callLLM, // fallback to mock if no API key configured
    });

    return Response.json({ success: true, data: result });
  } catch (err) {
    console.error("[/api/recommend]", err);
    return Response.json(
      { success: false, error: "Failed to generate recommendations." },
      { status: 500 }
    );
  }
}
