// ─────────────────────────────────────────────
// TEST — Sample student profiles
// ─────────────────────────────────────────────

import { scoreStudent } from "./scoring";
import { FormSubmission } from "./types";

// ─── Test 1: Strong grad student (CS/ML) ──────

const strongGrad: FormSubmission = {
  level: "graduate",
  fieldOfStudy: "Computer Science",
  specialization: "Machine Learning",
  countryOfOrigin: "Nigeria",

  gpa: 3.85,
  gradingScale: "4.0",
  classRankPercentile: "top10",
  completedDegree: "BSc Computer Science",

  gradTest: "gre",
  greVerbal: 162,
  greQuant: 168,

  englishTest: "ielts",
  ieltsScore: 7.5,

  preferredCountries: ["USA", "Canada", "UK"],
  universitySize: "large",
  annualBudget: "35k-50k",
  scholarshipNeed: "partial",

  workExperience: "1-2",
  researchLevel: "formal",
  hasPublications: true,
  publications: "One paper on neural architecture search",
  hasAwards: true,
  academicAwards: "Best Student Award, Dept. of CS",
  hasLeadership: true,
  leadershipDescription: "President of CS student association",
  volunteeringLevel: "some",
};

// ─── Test 2: Average undergrad (Business) ─────

const averageUndergrad: FormSubmission = {
  level: "undergraduate",
  fieldOfStudy: "Business Administration",
  countryOfOrigin: "Ghana",

  gpa: 78,
  gradingScale: "percentage",
  classRankPercentile: "top25",
  schoolYear: "grade12",

  undergradTest: "sat",
  satScore: 1180,

  englishTest: "toefl",
  toeflScore: 82,

  preferredCountries: ["USA", "Canada"],
  universitySize: "no-preference",
  annualBudget: "20k-35k",
  scholarshipNeed: "full",

  researchLevel: "none",
  hasPublications: false,
  hasAwards: false,
  hasLeadership: false,
  hasCompetitions: false,
  volunteeringLevel: "some",
};

// ─── Test 3: Elite undergrad (Medicine) ───────

const eliteUndergrad: FormSubmission = {
  level: "undergraduate",
  fieldOfStudy: "Medicine",
  specialization: "Neuroscience",
  countryOfOrigin: "India",

  gpa: 98,
  gradingScale: "percentage",
  classRankPercentile: "top5",
  schoolYear: "grade12",

  undergradTest: "sat",
  satScore: 1540,

  englishTest: "native",

  preferredCountries: ["UK", "USA", "Australia"],
  universitySize: "large",
  annualBudget: "50k+",
  scholarshipNeed: "open",

  researchLevel: "informal",
  hasPublications: false,
  hasAwards: true,
  academicAwards: "National Science Olympiad Gold",
  hasCompetitions: true,
  competitions: "International Biology Olympiad, National Math Olympiad",
  hasLeadership: true,
  leadershipDescription: "Head Boy, Science Club President",
  volunteeringLevel: "significant",
};

// ─── Run Tests ─────────────────────────────────

const tests = [
  { name: "Strong Grad (CS/ML)", data: strongGrad },
  { name: "Average Undergrad (Business)", data: averageUndergrad },
  { name: "Elite Undergrad (Medicine)", data: eliteUndergrad },
];

for (const { name, data } of tests) {
  const result = scoreStudent(data);
  console.log(`\n═══════════════════════════════════`);
  console.log(`  ${name}`);
  console.log(`═══════════════════════════════════`);
  console.log(`  Tier:         ${result.scores.tier}`);
  console.log(`  Final Score:  ${result.scores.finalScore}/100`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  Academic:     ${result.scores.academicScore}`);
  console.log(`  Test:         ${result.scores.testScore}`);
  console.log(`  English:      ${result.scores.englishScore}`);
  console.log(`  Experience:   ${result.scores.experienceScore}`);
  console.log(`  Extracurric:  ${result.scores.extracurricularScore}`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  Field:        ${result.fieldOfStudy}${result.specialization ? " → " + result.specialization : ""}`);
  console.log(`  Countries:    ${result.filters.preferredCountries.join(", ")}`);
  console.log(`  Budget:       ${result.filters.annualBudget}`);
  console.log(`  Scholarship:  ${result.filters.scholarshipNeed}`);
}
