// ─────────────────────────────────────────────
// SCORING ENGINE — School Finder
// ─────────────────────────────────────────────

import {
  FormSubmission,
  ScoreBreakdown,
  ScoredProfile,
  AcademicTier,
  StudentFilters,
} from "./types";

// ─── Weights ───────────────────────────────────

const WEIGHTS = {
  academic: 0.30,
  test: 0.20,
  english: 0.10,
  experience: 0.25,
  extracurricular: 0.15,
};

// ─── Helpers ───────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function tierFromScore(score: number): AcademicTier {
  if (score >= 85) return "Elite";
  if (score >= 70) return "Highly Competitive";
  if (score >= 55) return "Competitive";
  if (score >= 40) return "Moderate";
  return "Foundational";
}

// ─── GPA Normalization ─────────────────────────
// Converts any scale to a 0–100 academic score

function normalizeGPA(gpa: number, scale: FormSubmission["gradingScale"]): number {
  let normalized: number; // 0.0 – 1.0

  switch (scale) {
    case "4.0":
      normalized = gpa / 4.0;
      break;
    case "5.0":
      normalized = gpa / 5.0;
      break;
    case "percentage":
      normalized = gpa / 100;
      break;
    case "letter": {
      // Map letter grade to GPA equivalent
      const letterMap: Record<string, number> = {
        "A+": 1.0, "A": 0.95, "A-": 0.9,
        "B+": 0.85, "B": 0.78, "B-": 0.72,
        "C+": 0.65, "C": 0.58, "C-": 0.52,
        "D": 0.4, "F": 0.0,
      };
      normalized = letterMap[String(gpa)] ?? 0.5;
      break;
    }
    default:
      normalized = gpa / 4.0; // fallback assumption
  }

  // Score curve (not linear — top end rewarded more)
  if (normalized >= 0.925) return 100;
  if (normalized >= 0.875) return 85;
  if (normalized >= 0.825) return 70;
  if (normalized >= 0.75)  return 55;
  if (normalized >= 0.675) return 40;
  return 25;
}

// ─── Class Rank Bonus ──────────────────────────

function rankBonus(rank: FormSubmission["classRankPercentile"]): number {
  switch (rank) {
    case "top5":  return 10;
    case "top10": return 7;
    case "top25": return 4;
    default:      return 0;
  }
}

// ─── Academic Score ────────────────────────────

function scoreAcademic(data: FormSubmission): number {
  const gpaScore = normalizeGPA(data.gpa, data.gradingScale);
  const bonus = rankBonus(data.classRankPercentile);
  return clamp(gpaScore + bonus);
}

// ─── Standardized Test Score ───────────────────

function scoreTest(data: FormSubmission): number {
  if (data.level === "undergraduate") {
    if (!data.undergradTest || data.undergradTest === "none") return 0;

    if (data.undergradTest === "sat" && data.satScore !== undefined) {
      const s = data.satScore;
      if (s >= 1500) return 100;
      if (s >= 1400) return 85;
      if (s >= 1300) return 70;
      if (s >= 1200) return 55;
      if (s >= 1100) return 40;
      if (s >= 1000) return 25;
      return 10;
    }

    if (data.undergradTest === "act" && data.actScore !== undefined) {
      const a = data.actScore;
      if (a >= 34) return 100;
      if (a >= 30) return 85;
      if (a >= 27) return 70;
      if (a >= 24) return 55;
      if (a >= 20) return 40;
      if (a >= 17) return 25;
      return 10;
    }
  }

  if (data.level === "graduate") {
    if (!data.gradTest || data.gradTest === "none") return 0;

    if (data.gradTest === "gre") {
      // Average verbal + quant, normalize to 340 max
      const combined = (data.greVerbal ?? 150) + (data.greQuant ?? 150);
      if (combined >= 325) return 100;
      if (combined >= 310) return 85;
      if (combined >= 295) return 70;
      if (combined >= 280) return 55;
      if (combined >= 265) return 40;
      return 25;
    }

    if (data.gradTest === "gmat" && data.gmatScore !== undefined) {
      const g = data.gmatScore;
      if (g >= 720) return 100;
      if (g >= 680) return 85;
      if (g >= 640) return 70;
      if (g >= 590) return 55;
      if (g >= 540) return 40;
      return 25;
    }

    if (data.gradTest === "lsat" && data.lsatScore !== undefined) {
      const l = data.lsatScore;
      if (l >= 173) return 100;
      if (l >= 167) return 85;
      if (l >= 161) return 70;
      if (l >= 155) return 55;
      if (l >= 149) return 40;
      return 25;
    }

    if (data.gradTest === "mcat" && data.mcatScore !== undefined) {
      const m = data.mcatScore;
      if (m >= 520) return 100;
      if (m >= 514) return 85;
      if (m >= 508) return 70;
      if (m >= 500) return 55;
      if (m >= 492) return 40;
      return 25;
    }
  }

  return 0;
}

// ─── English Proficiency Score ─────────────────

function scoreEnglish(data: FormSubmission): number {
  switch (data.englishTest) {
    case "native":
      return 100;

    case "ielts": {
      const s = data.ieltsScore ?? 0;
      if (s >= 8.0) return 100;
      if (s >= 7.5) return 90;
      if (s >= 7.0) return 80;
      if (s >= 6.5) return 65;
      if (s >= 6.0) return 50;
      if (s >= 5.5) return 35;
      return 20;
    }

    case "toefl": {
      const s = data.toeflScore ?? 0;
      if (s >= 110) return 100;
      if (s >= 100) return 85;
      if (s >= 90)  return 70;
      if (s >= 80)  return 55;
      if (s >= 70)  return 40;
      return 25;
    }

    case "duolingo": {
      const s = data.duolingoScore ?? 0;
      if (s >= 135) return 100;
      if (s >= 120) return 85;
      if (s >= 105) return 70;
      if (s >= 90)  return 55;
      if (s >= 75)  return 40;
      return 25;
    }

    case "pte": {
      const s = data.pteScore ?? 0;
      if (s >= 79) return 100;
      if (s >= 70) return 85;
      if (s >= 61) return 70;
      if (s >= 51) return 55;
      if (s >= 42) return 40;
      return 25;
    }

    case "none":
    default:
      return 0;
  }
}

// ─── Experience & Achievements Score ───────────

function scoreExperience(data: FormSubmission): number {
  let score = 0;

  // Research (max 40 pts)
  if (data.researchLevel === "formal")   score += 40;
  if (data.researchLevel === "informal") score += 20;

  // Publications / projects (max 25 pts)
  if (data.hasPublications) score += 25;

  // Awards (max 20 pts)
  if (data.hasAwards && data.academicAwards) score += 20;

  // Level-specific (max 15 pts)
  if (data.level === "graduate" && data.workExperience) {
    const workMap: Record<string, number> = {
      "none": 0, "<1": 5, "1-2": 8, "3-5": 12, "5+": 15,
    };
    score += workMap[data.workExperience] ?? 0;
  }

  if (data.level === "undergraduate" && data.hasCompetitions) {
    score += 15;
  }

  return clamp(score);
}

// ─── Extracurricular Score ─────────────────────

function scoreExtracurricular(data: FormSubmission): number {
  let score = 0;

  // Leadership (max 60 pts)
  if (data.hasLeadership) score += 60;

  // Volunteering (max 40 pts)
  if (data.volunteeringLevel === "significant") score += 40;
  if (data.volunteeringLevel === "some")        score += 20;

  return clamp(score);
}

// ─── Final Weighted Score ──────────────────────

function computeFinalScore(breakdown: Omit<ScoreBreakdown, "finalScore" | "tier">): number {
  return clamp(
    breakdown.academicScore       * WEIGHTS.academic +
    breakdown.testScore           * WEIGHTS.test +
    breakdown.englishScore        * WEIGHTS.english +
    breakdown.experienceScore     * WEIGHTS.experience +
    breakdown.extracurricularScore * WEIGHTS.extracurricular
  );
}

// ─── Build Filters ─────────────────────────────

function buildFilters(data: FormSubmission): StudentFilters {
  return {
    preferredCountries: data.preferredCountries,
    universitySize: data.universitySize,
    annualBudget: data.annualBudget,
    scholarshipNeed: data.scholarshipNeed,
    countryOfOrigin: data.countryOfOrigin,
  };
}

// ─── Main Export ───────────────────────────────

export function scoreStudent(data: FormSubmission): ScoredProfile {
  const academicScore       = scoreAcademic(data);
  const testScore           = scoreTest(data);
  const englishScore        = scoreEnglish(data);
  const experienceScore     = scoreExperience(data);
  const extracurricularScore = scoreExtracurricular(data);

  const partialBreakdown = {
    academicScore,
    testScore,
    englishScore,
    experienceScore,
    extracurricularScore,
  };

  const finalScore = computeFinalScore(partialBreakdown);
  const tier = tierFromScore(finalScore);

  const scores: ScoreBreakdown = {
    ...partialBreakdown,
    finalScore: Math.round(finalScore),
    tier,
  };

  return {
    scores,
    filters: buildFilters(data),
    level: data.level,
    fieldOfStudy: data.fieldOfStudy,
    specialization: data.specialization,
  };
}
