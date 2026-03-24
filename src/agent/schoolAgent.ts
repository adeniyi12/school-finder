// ─────────────────────────────────────────────
// SCHOOL SEARCH AGENT
// Takes a ScoredProfile → returns top 10 school recommendations
// ─────────────────────────────────────────────

import { ScoredProfile, AcademicTier } from "../types";
import { buildSearchQueries } from "./queryBuilder";

// ─── Output Types ──────────────────────────────

export interface SchoolRecommendation {
  rank: number;
  name: string;
  country: string;
  programName: string;
  degreeType: string;
  worldRanking?: string;
  acceptanceRate?: string;
  tuitionPerYear?: string;
  scholarshipsAvailable?: boolean;
  scholarshipDetails?: string;
  minGPA?: string;
  minTestScore?: string;
  minEnglishScore?: string;
  applicationDeadline?: string;
  programDuration?: string;
  websiteUrl?: string;
  whyRecommended: string;
  fitScore: "Reach" | "Match" | "Safety";
}

export interface AgentResult {
  profile: {
    tier: AcademicTier;
    finalScore: number;
    level: string;
    fieldOfStudy: string;
    specialization?: string;
  };
  recommendations: SchoolRecommendation[];
  searchQueriesUsed: string[];
  generatedAt: string;
}

// ─── Fit Score Logic ───────────────────────────
// Based on student score vs school tier requirements

function determineFit(
  studentScore: number,
  schoolTierIndex: number // 0=Elite, 1=HighlyComp, 2=Comp, 3=Moderate, 4=Found
): "Reach" | "Match" | "Safety" {
  const tierThresholds = [85, 70, 55, 40, 0];
  const schoolMinScore = tierThresholds[schoolTierIndex];

  if (studentScore >= schoolMinScore + 10) return "Safety";
  if (studentScore >= schoolMinScore - 5)  return "Match";
  return "Reach";
}

// ─── Prompt Builder ────────────────────────────
// Builds the LLM prompt that drives school research

export function buildAgentPrompt(profile: ScoredProfile): string {
  const { scores, filters, level, fieldOfStudy, specialization } = profile;
  const queries = buildSearchQueries(profile);

  const field = specialization
    ? `${fieldOfStudy} (specialization: ${specialization})`
    : fieldOfStudy;

  const levelLabel = level === "undergraduate"
    ? "Undergraduate (Bachelor's)"
    : "Graduate (Master's/PhD)";

  return `
You are a university admissions advisor. Your job is to recommend the top 10 universities for this international student profile.

## STUDENT PROFILE

- **Application Level:** ${levelLabel}
- **Field of Study:** ${field}
- **Origin Country:** ${filters.countryOfOrigin}
- **Academic Tier:** ${scores.tier} (Score: ${scores.finalScore}/100)
- **Score Breakdown:**
  - Academic: ${scores.academicScore}/100
  - Standardized Test: ${scores.testScore}/100
  - English Proficiency: ${scores.englishScore}/100
  - Experience & Achievements: ${scores.experienceScore}/100
  - Extracurriculars: ${scores.extracurricularScore}/100

## PREFERENCES & CONSTRAINTS

- **Preferred Countries:** ${filters.preferredCountries.length > 0 ? filters.preferredCountries.join(", ") : "Open to anywhere"}
- **Annual Budget:** ${filters.annualBudget}
- **Scholarship Need:** ${filters.scholarshipNeed}
- **University Size:** ${filters.universitySize}

## SEARCH CONTEXT

Use these as guidance for your web research:
1. ${queries.primary}
2. ${queries.requirements}
${queries.scholarships ? `3. ${queries.scholarships}` : ""}

## YOUR TASK

Return EXACTLY 10 university recommendations as a valid JSON array. 
Mix of Reach (2–3), Match (4–5), and Safety (2–3) schools.
Prioritize schools known for the student's specific field.

For each school, provide:
{
  "rank": number (1–10, 1 = best fit),
  "name": "Full university name",
  "country": "Country",
  "programName": "Exact program/course name",
  "degreeType": "BSc / MSc / PhD / MBA etc",
  "worldRanking": "QS 2024 rank or equivalent",
  "acceptanceRate": "e.g. 8%",
  "tuitionPerYear": "e.g. $55,000/year (international)",
  "scholarshipsAvailable": true/false,
  "scholarshipDetails": "e.g. merit scholarships up to 50%",
  "minGPA": "e.g. 3.5/4.0",
  "minTestScore": "e.g. GRE 315+, SAT 1400+",
  "minEnglishScore": "e.g. IELTS 7.0",
  "applicationDeadline": "e.g. December 1 (Early), January 15 (Regular)",
  "programDuration": "e.g. 2 years",
  "websiteUrl": "official program URL",
  "whyRecommended": "2-3 sentence explanation specific to this student's profile",
  "fitScore": "Reach" | "Match" | "Safety"
}

Return ONLY the JSON array. No extra text. No markdown. Just valid JSON.
`.trim();
}

// ─── Result Parser ─────────────────────────────
// Parses raw LLM output into typed recommendations

export function parseAgentResponse(
  rawResponse: string,
  profile: ScoredProfile
): AgentResult {
  let recommendations: SchoolRecommendation[] = [];

  try {
    // Strip any accidental markdown code fences
    const cleaned = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations ?? [];

    // Validate and re-rank
    recommendations = recommendations
      .slice(0, 10)
      .map((school, i) => ({
        ...school,
        rank: i + 1,
        fitScore: school.fitScore ?? "Match",
      }));
  } catch (err) {
    console.error("Failed to parse agent response:", err);
    recommendations = [];
  }

  const queries = buildSearchQueries(profile);

  return {
    profile: {
      tier: profile.scores.tier,
      finalScore: profile.scores.finalScore,
      level: profile.level,
      fieldOfStudy: profile.fieldOfStudy,
      specialization: profile.specialization,
    },
    recommendations,
    searchQueriesUsed: [
      queries.primary,
      queries.requirements,
      queries.scholarships,
    ].filter(Boolean),
    generatedAt: new Date().toISOString(),
  };
}

// ─── Mock Runner (for testing without LLM) ────

export function mockAgentRun(profile: ScoredProfile): AgentResult {
  const { scores, filters, level, fieldOfStudy } = profile;

  const mockSchools: SchoolRecommendation[] = [
    {
      rank: 1,
      name: "Massachusetts Institute of Technology",
      country: "USA",
      programName: `${fieldOfStudy} Program`,
      degreeType: level === "undergraduate" ? "BSc" : "MSc",
      worldRanking: "QS #1",
      acceptanceRate: "4%",
      tuitionPerYear: "$57,590/year",
      scholarshipsAvailable: true,
      scholarshipDetails: "Need-based aid available for international students",
      minGPA: "3.9/4.0",
      minTestScore: "SAT 1570+ / GRE 330+",
      minEnglishScore: "IELTS 7.5",
      applicationDeadline: "November 1 (Early Action), January 1 (Regular)",
      programDuration: level === "undergraduate" ? "4 years" : "2 years",
      websiteUrl: "https://web.mit.edu",
      whyRecommended: `MIT is the top choice for ${fieldOfStudy}. Given your ${scores.tier} profile and strong academic score of ${scores.academicScore}/100, you are a competitive applicant.`,
      fitScore: determineFit(scores.finalScore, 0),
    },
    {
      rank: 2,
      name: "University of Toronto",
      country: "Canada",
      programName: `${fieldOfStudy} Program`,
      degreeType: level === "undergraduate" ? "BSc" : "MSc",
      worldRanking: "QS #21",
      acceptanceRate: "43%",
      tuitionPerYear: "CAD $45,000/year",
      scholarshipsAvailable: true,
      scholarshipDetails: "Lester B. Pearson Scholarship (full funding for international undergrads)",
      minGPA: "3.5/4.0",
      minTestScore: "SAT 1400+ / GRE 310+",
      minEnglishScore: "IELTS 6.5",
      applicationDeadline: "January 15",
      programDuration: level === "undergraduate" ? "4 years" : "2 years",
      websiteUrl: "https://www.utoronto.ca",
      whyRecommended: `University of Toronto is one of Canada's best for ${fieldOfStudy}. Strong scholarship options available for international students from ${filters.countryOfOrigin}.`,
      fitScore: determineFit(scores.finalScore, 1),
    },
    {
      rank: 3,
      name: "University of Edinburgh",
      country: "UK",
      programName: `${fieldOfStudy} Program`,
      degreeType: level === "undergraduate" ? "BSc" : "MSc",
      worldRanking: "QS #27",
      acceptanceRate: "35%",
      tuitionPerYear: "£26,500/year",
      scholarshipsAvailable: true,
      scholarshipDetails: "Edinburgh Global Scholarship for international students",
      minGPA: "3.5/4.0 equivalent",
      minTestScore: "SAT 1350+ / GRE 305+",
      minEnglishScore: "IELTS 6.5",
      applicationDeadline: "January 15 (UCAS)",
      programDuration: level === "undergraduate" ? "4 years" : "1 year",
      websiteUrl: "https://www.ed.ac.uk",
      whyRecommended: `Edinburgh is renowned for ${fieldOfStudy} in the UK, with a strong international community and scholarship support.`,
      fitScore: determineFit(scores.finalScore, 1),
    },
  ];

  const queries = buildSearchQueries(profile);

  return {
    profile: {
      tier: scores.tier,
      finalScore: scores.finalScore,
      level,
      fieldOfStudy,
      specialization: profile.specialization,
    },
    recommendations: mockSchools,
    searchQueriesUsed: [queries.primary, queries.requirements, queries.scholarships].filter(Boolean),
    generatedAt: new Date().toISOString(),
  };
}
