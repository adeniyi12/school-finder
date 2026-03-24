// ─── End-to-end agent test ─────────────────────

import { runSchoolFinder } from "./index";
import { FormSubmission } from "../types";

const testStudent: FormSubmission = {
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
  academicAwards: "Best Student Award",
  hasLeadership: true,
  leadershipDescription: "CS student association president",
  volunteeringLevel: "some",
};

(async () => {
  console.log("Running school finder agent (mock mode)...\n");

  const result = await runSchoolFinder(testStudent, { mock: true });

  console.log("\n════════════════════════════════════════");
  console.log("  STUDENT PROFILE SUMMARY");
  console.log("════════════════════════════════════════");
  console.log(`  Tier:        ${result.profile.tier}`);
  console.log(`  Score:       ${result.profile.finalScore}/100`);
  console.log(`  Level:       ${result.profile.level}`);
  console.log(`  Field:       ${result.profile.fieldOfStudy} → ${result.profile.specialization}`);

  console.log("\n════════════════════════════════════════");
  console.log("  SEARCH QUERIES GENERATED");
  console.log("════════════════════════════════════════");
  result.searchQueriesUsed.forEach((q, i) => {
    console.log(`  Q${i + 1}: ${q}`);
  });

  console.log("\n════════════════════════════════════════");
  console.log("  TOP SCHOOL RECOMMENDATIONS");
  console.log("════════════════════════════════════════");

  result.recommendations.forEach((school) => {
    console.log(`\n  #${school.rank} — ${school.name} (${school.country})`);
    console.log(`  Program:     ${school.programName} [${school.degreeType}]`);
    console.log(`  Ranking:     ${school.worldRanking}`);
    console.log(`  Fit:         ${school.fitScore}`);
    console.log(`  Acceptance:  ${school.acceptanceRate}`);
    console.log(`  Tuition:     ${school.tuitionPerYear}`);
    console.log(`  Scholarship: ${school.scholarshipsAvailable ? school.scholarshipDetails : "Not available"}`);
    console.log(`  Min GPA:     ${school.minGPA}`);
    console.log(`  Min Test:    ${school.minTestScore}`);
    console.log(`  English:     ${school.minEnglishScore}`);
    console.log(`  Deadline:    ${school.applicationDeadline}`);
    console.log(`  Duration:    ${school.programDuration}`);
    console.log(`  Why:         ${school.whyRecommended}`);
  });

  console.log(`\n  Generated: ${result.generatedAt}`);
})();
