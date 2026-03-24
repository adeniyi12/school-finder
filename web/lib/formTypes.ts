// Shared form state used across all steps

export interface FormState {
  // Section A
  level: "undergraduate" | "graduate" | "";
  fieldOfStudy: string;
  specialization: string;
  countryOfOrigin: string;

  // Section B
  gpa: string;
  gradingScale: "4.0" | "5.0" | "percentage" | "letter" | "other" | "";
  classRankPercentile: "top5" | "top10" | "top25" | "none" | "";
  schoolYear: "grade11" | "grade12" | "graduated" | "";
  completedDegree: string;

  // Section C — Tests
  undergradTest: "sat" | "act" | "none" | "";
  satScore: string;
  actScore: string;
  gradTest: "gre" | "gmat" | "lsat" | "mcat" | "none" | "";
  greVerbal: string;
  greQuant: string;
  gmatScore: string;
  lsatScore: string;
  mcatScore: string;

  // English
  englishTest: "ielts" | "toefl" | "duolingo" | "pte" | "native" | "none" | "";
  ieltsScore: string;
  toeflScore: string;
  duolingoScore: string;
  pteScore: string;

  // Preferences
  preferredCountries: string[];
  universitySize: "large" | "medium" | "small" | "no-preference" | "";
  annualBudget: "<10k" | "10k-20k" | "20k-35k" | "35k-50k" | "50k+" | "flexible" | "";
  scholarshipNeed: "full" | "partial" | "none" | "open" | "";

  // Section D
  workExperience: "none" | "<1" | "1-2" | "3-5" | "5+" | "";
  hasCompetitions: boolean;
  competitions: string;
  researchLevel: "formal" | "informal" | "none" | "";
  hasPublications: boolean;
  publications: string;
  hasAwards: boolean;
  academicAwards: string;

  // Section E
  hasLeadership: boolean;
  leadershipDescription: string;
  volunteeringLevel: "significant" | "some" | "none" | "";
}

export const defaultFormState: FormState = {
  level: "",
  fieldOfStudy: "",
  specialization: "",
  countryOfOrigin: "",
  gpa: "",
  gradingScale: "",
  classRankPercentile: "",
  schoolYear: "",
  completedDegree: "",
  undergradTest: "",
  satScore: "",
  actScore: "",
  gradTest: "",
  greVerbal: "",
  greQuant: "",
  gmatScore: "",
  lsatScore: "",
  mcatScore: "",
  englishTest: "",
  ieltsScore: "",
  toeflScore: "",
  duolingoScore: "",
  pteScore: "",
  preferredCountries: [],
  universitySize: "",
  annualBudget: "",
  scholarshipNeed: "",
  workExperience: "",
  hasCompetitions: false,
  competitions: "",
  researchLevel: "",
  hasPublications: false,
  publications: "",
  hasAwards: false,
  academicAwards: "",
  hasLeadership: false,
  leadershipDescription: "",
  volunteeringLevel: "",
};

export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bangladesh","Belarus","Belgium","Bolivia","Brazil",
  "Cambodia","Cameroon","Canada","Chile","China","Colombia","Congo","Croatia",
  "Cuba","Czech Republic","Denmark","Ecuador","Egypt","Ethiopia","Finland",
  "France","Germany","Ghana","Greece","Guatemala","Haiti","Honduras","Hungary",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Lebanon","Libya","Malaysia","Mexico","Morocco",
  "Mozambique","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua","Nigeria",
  "North Korea","Norway","Pakistan","Panama","Peru","Philippines","Poland",
  "Portugal","Romania","Russia","Saudi Arabia","Senegal","Sierra Leone",
  "Singapore","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan",
  "Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand","Turkey",
  "Uganda","Ukraine","United Kingdom","United States","Uzbekistan","Venezuela",
  "Vietnam","Yemen","Zambia","Zimbabwe",
];
