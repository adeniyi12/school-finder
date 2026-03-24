// ─────────────────────────────────────────────
// QUERY BUILDER — Constructs targeted search queries
// from a scored student profile
// ─────────────────────────────────────────────

import { ScoredProfile, AcademicTier } from "../types";

// Maps tier to school ranking language for search
const TIER_SEARCH_TERMS: Record<AcademicTier, string> = {
  "Elite":               "top 10 world ranking best",
  "Highly Competitive":  "top 50 highly ranked",
  "Competitive":         "top 100 well ranked",
  "Moderate":            "good affordable",
  "Foundational":        "accessible pathway programs",
};

// Maps budget to tuition language
const BUDGET_TERMS: Record<string, string> = {
  "<10k":     "low tuition under 10000",
  "10k-20k":  "affordable tuition under 20000",
  "20k-35k":  "moderate tuition",
  "35k-50k":  "tuition range 35000 50000",
  "50k+":     "top tier tuition",
  "flexible": "",
};

export interface SearchQuery {
  primary: string;      // Main school search
  requirements: string; // Entry requirement lookup
  scholarships: string; // Scholarship search (if needed)
}

export function buildSearchQueries(profile: ScoredProfile): SearchQuery {
  const { scores, filters, level, fieldOfStudy, specialization } = profile;

  const tier = scores.tier;
  const field = specialization
    ? `${fieldOfStudy} ${specialization}`
    : fieldOfStudy;

  const levelTerm = level === "undergraduate"
    ? "undergraduate bachelor degree"
    : "graduate masters PhD program";

  const countryTerm = filters.preferredCountries.length > 0
    ? filters.preferredCountries.join(" OR ")
    : "worldwide";

  const tierTerm = TIER_SEARCH_TERMS[tier];
  const budgetTerm = BUDGET_TERMS[filters.annualBudget] ?? "";
  const scholarshipTerm = ["full", "partial"].includes(filters.scholarshipNeed)
    ? "scholarship financial aid"
    : "";

  // Primary: find schools matching field + tier + location
  const primary = [
    tierTerm,
    "universities",
    "for",
    levelTerm,
    "in",
    field,
    countryTerm,
    budgetTerm,
    scholarshipTerm,
    "international students",
    "2024 2025",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Requirements: find admission requirements specific to tier + field
  const requirements = [
    "admission requirements",
    levelTerm,
    field,
    tier === "Elite" || tier === "Highly Competitive"
      ? "top ranked universities"
      : "universities",
    countryTerm,
    "international students GPA test scores",
    "2024 2025",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Scholarships: only if student needs funding
  const scholarships = ["full", "partial", "open"].includes(filters.scholarshipNeed)
    ? [
        "scholarships for international students",
        levelTerm,
        field,
        countryTerm,
        tier === "Elite" ? "merit based fully funded" : "financial aid",
        "2024 2025",
      ]
        .filter(Boolean)
        .join(" ")
        .trim()
    : "";

  return { primary, requirements, scholarships };
}
