// ─────────────────────────────────────────────
// API HANDLER — Drop this into Express or Next.js
// POST /api/recommend
// ─────────────────────────────────────────────

import { FormSubmission } from "./types";
import { runSchoolFinder } from "./agent";

// ─── Validation ────────────────────────────────

function validateForm(body: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const data = body as Partial<FormSubmission>;

  if (!data.level) errors.push("level is required");
  if (!data.fieldOfStudy) errors.push("fieldOfStudy is required");
  if (!data.countryOfOrigin) errors.push("countryOfOrigin is required");
  if (data.gpa === undefined || data.gpa === null) errors.push("gpa is required");
  if (!data.gradingScale) errors.push("gradingScale is required");
  if (!data.englishTest) errors.push("englishTest is required");
  if (!data.researchLevel) errors.push("researchLevel is required");
  if (data.hasPublications === undefined) errors.push("hasPublications is required");
  if (data.hasAwards === undefined) errors.push("hasAwards is required");
  if (data.hasLeadership === undefined) errors.push("hasLeadership is required");
  if (!data.volunteeringLevel) errors.push("volunteeringLevel is required");
  if (!data.preferredCountries || !Array.isArray(data.preferredCountries)) {
    errors.push("preferredCountries must be an array");
  }
  if (!data.universitySize) errors.push("universitySize is required");
  if (!data.annualBudget) errors.push("annualBudget is required");
  if (!data.scholarshipNeed) errors.push("scholarshipNeed is required");

  return { valid: errors.length === 0, errors };
}

// ─── Express-compatible handler ────────────────

export async function recommendHandler(
  req: { body: unknown },
  res: {
    status: (code: number) => { json: (data: unknown) => void };
    json: (data: unknown) => void;
  },
  callLLM?: (prompt: string) => Promise<string>
) {
  const { valid, errors } = validateForm(req.body);

  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const result = await runSchoolFinder(req.body as FormSubmission, {
      callLLM,
      mock: !callLLM,
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("[API] Error running school finder:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate recommendations. Please try again.",
    });
  }
}

// ─── Next.js Route Handler (App Router) ────────

export async function nextRouteHandler(
  request: Request,
  callLLM?: (prompt: string) => Promise<string>
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { valid, errors } = validateForm(body);

  if (!valid) {
    return Response.json({ success: false, errors }, { status: 400 });
  }

  try {
    const result = await runSchoolFinder(body as FormSubmission, {
      callLLM,
      mock: !callLLM,
    });

    return Response.json({ success: true, data: result });
  } catch (err) {
    console.error("[API] Error:", err);
    return Response.json(
      { success: false, error: "Failed to generate recommendations." },
      { status: 500 }
    );
  }
}
