// ─────────────────────────────────────────────
// AGENT RUNNER — Entry point
// Usage: scoreStudent(formData) → runAgent(profile) → AgentResult
// ─────────────────────────────────────────────

import { FormSubmission, ScoredProfile } from "../types";
import { scoreStudent } from "../scoring";
import { buildAgentPrompt, parseAgentResponse, mockAgentRun, AgentResult } from "./schoolAgent";

export interface AgentRunOptions {
  /**
   * Provide a callLLM function to use a real AI model.
   * If omitted, the agent returns mock data (useful for testing).
   */
  callLLM?: (prompt: string) => Promise<string>;
  mock?: boolean;
}

// ─── Main Entry Point ──────────────────────────

export async function runSchoolFinder(
  formData: FormSubmission,
  options: AgentRunOptions = {}
): Promise<AgentResult> {
  // Step 1: Score the student
  const profile: ScoredProfile = scoreStudent(formData);

  console.log(`\n[Agent] Student scored: ${profile.scores.finalScore}/100 → ${profile.scores.tier}`);
  console.log(`[Agent] Field: ${profile.fieldOfStudy}, Level: ${profile.level}`);

  // Step 2: Use mock or real LLM
  if (options.mock || !options.callLLM) {
    console.log("[Agent] Running in mock mode...");
    return mockAgentRun(profile);
  }

  // Step 3: Build prompt and call LLM
  const prompt = buildAgentPrompt(profile);
  console.log("[Agent] Querying LLM for school recommendations...");

  const rawResponse = await options.callLLM(prompt);

  // Step 4: Parse and return
  const result = parseAgentResponse(rawResponse, profile);
  console.log(`[Agent] Got ${result.recommendations.length} recommendations.`);

  return result;
}

// Re-export types for consumers
export type { AgentResult, SchoolRecommendation } from "./schoolAgent";
export { buildAgentPrompt } from "./schoolAgent";
export { scoreStudent } from "../scoring";
export type { ScoredProfile, FormSubmission } from "../types";
