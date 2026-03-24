// ─────────────────────────────────────────────
// TYPES — School Finder Scoring Model
// ─────────────────────────────────────────────

export type ApplicationLevel = "undergraduate" | "graduate";

export type GradingScale = "4.0" | "5.0" | "percentage" | "letter" | "other";

export type EnglishTest =
  | "ielts"
  | "toefl"
  | "duolingo"
  | "pte"
  | "native"
  | "none";

export type GradTest = "gre" | "gmat" | "lsat" | "mcat" | "none";

export type UndergraduateTest = "sat" | "act" | "none";

export type ResearchLevel = "formal" | "informal" | "none";

export type VolunteeringLevel = "significant" | "some" | "none";

export type WorkExperience = "none" | "<1" | "1-2" | "3-5" | "5+";

export type BudgetRange =
  | "<10k"
  | "10k-20k"
  | "20k-35k"
  | "35k-50k"
  | "50k+"
  | "flexible";

export type ScholarshipNeed =
  | "full"
  | "partial"
  | "none"
  | "open";

export type UniversitySize = "large" | "medium" | "small" | "no-preference";

export type AcademicTier =
  | "Elite"
  | "Highly Competitive"
  | "Competitive"
  | "Moderate"
  | "Foundational";

// ─── Raw Form Submission ───────────────────────

export interface FormSubmission {
  // Section A — Profile
  level: ApplicationLevel;
  fieldOfStudy: string;
  specialization?: string;
  countryOfOrigin: string;

  // Section B — Academic
  gpa: number;
  gradingScale: GradingScale;
  classRankPercentile?: "top5" | "top10" | "top25" | "none";
  // Undergrad only
  schoolYear?: "grade11" | "grade12" | "graduated";
  // Grad only
  completedDegree?: string;

  // Section C — Tests
  // Undergrad
  undergradTest?: UndergraduateTest;
  satScore?: number;       // 400–1600
  actScore?: number;       // 1–36
  // Grad
  gradTest?: GradTest;
  greVerbal?: number;      // 130–170
  greQuant?: number;       // 130–170
  gmatScore?: number;      // 200–800
  lsatScore?: number;      // 120–180
  mcatScore?: number;      // 472–528

  // English proficiency
  englishTest: EnglishTest;
  ieltsScore?: number;     // 0–9
  toeflScore?: number;     // 0–120
  duolingoScore?: number;  // 10–160
  pteScore?: number;       // 10–90

  // Preferences (filters, not scored)
  preferredCountries: string[];
  universitySize: UniversitySize;
  annualBudget: BudgetRange;
  scholarshipNeed: ScholarshipNeed;

  // Section D — Experience
  // Undergrad: competitions
  competitions?: string;
  hasCompetitions?: boolean;
  // Grad: work experience
  workExperience?: WorkExperience;
  researchLevel: ResearchLevel;
  hasPublications: boolean;
  publications?: string;
  academicAwards?: string;
  hasAwards: boolean;

  // Section E — Extracurriculars
  hasLeadership: boolean;
  leadershipDescription?: string;
  volunteeringLevel: VolunteeringLevel;
}

// ─── Scoring Output ────────────────────────────

export interface ScoreBreakdown {
  academicScore: number;       // 0–100
  testScore: number;           // 0–100
  englishScore: number;        // 0–100
  experienceScore: number;     // 0–100
  extracurricularScore: number; // 0–100
  finalScore: number;          // 0–100 (weighted)
  tier: AcademicTier;
}

export interface ScoredProfile {
  scores: ScoreBreakdown;
  filters: StudentFilters;
  level: ApplicationLevel;
  fieldOfStudy: string;
  specialization?: string;
}

export interface StudentFilters {
  preferredCountries: string[];
  universitySize: UniversitySize;
  annualBudget: BudgetRange;
  scholarshipNeed: ScholarshipNeed;
  countryOfOrigin: string;
}
