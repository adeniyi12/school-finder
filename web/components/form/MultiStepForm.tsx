"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { FormState, defaultFormState } from "@/lib/formTypes";
import StepA from "./steps/StepA";
import StepB from "./steps/StepB";
import StepC from "./steps/StepC";
import StepD from "./steps/StepD";
import StepE from "./steps/StepE";
import StepF from "./steps/StepF";

const STEPS = [
  { id: "A", label: "Profile" },
  { id: "B", label: "Academics" },
  { id: "C", label: "Tests" },
  { id: "D", label: "Experience" },
  { id: "E", label: "Extras" },
  { id: "F", label: "Budget" },
];

function canProceed(step: number, data: FormState): boolean {
  switch (step) {
    case 0: return !!(data.level && data.fieldOfStudy && data.countryOfOrigin);
    case 1: return !!(data.gpa && data.gradingScale);
    case 2: return !!(data.englishTest && data.preferredCountries.length > 0);
    case 3: return !!(data.researchLevel);
    case 4: return !!(data.volunteeringLevel && data.universitySize);
    case 5: return !!(data.annualBudget && data.scholarshipNeed);
    default: return true;
  }
}

export default function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (updates: Partial<FormState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        level: data.level || "undergraduate",
        fieldOfStudy: data.fieldOfStudy,
        specialization: data.specialization || undefined,
        countryOfOrigin: data.countryOfOrigin,
        gpa: parseFloat(data.gpa),
        gradingScale: data.gradingScale || "4.0",
        classRankPercentile: data.classRankPercentile || undefined,
        schoolYear: data.level === "undergraduate" ? (data.schoolYear || undefined) : undefined,
        completedDegree: data.level === "graduate" ? (data.completedDegree || undefined) : undefined,
        undergradTest: data.level === "undergraduate" ? (data.undergradTest || "none") : undefined,
        satScore: data.satScore ? parseInt(data.satScore) : undefined,
        actScore: data.actScore ? parseInt(data.actScore) : undefined,
        gradTest: data.level === "graduate" ? (data.gradTest || "none") : undefined,
        greVerbal: data.greVerbal ? parseInt(data.greVerbal) : undefined,
        greQuant: data.greQuant ? parseInt(data.greQuant) : undefined,
        gmatScore: data.gmatScore ? parseInt(data.gmatScore) : undefined,
        lsatScore: data.lsatScore ? parseInt(data.lsatScore) : undefined,
        mcatScore: data.mcatScore ? parseInt(data.mcatScore) : undefined,
        englishTest: data.englishTest || "none",
        ieltsScore: data.ieltsScore ? parseFloat(data.ieltsScore) : undefined,
        toeflScore: data.toeflScore ? parseInt(data.toeflScore) : undefined,
        duolingoScore: data.duolingoScore ? parseInt(data.duolingoScore) : undefined,
        pteScore: data.pteScore ? parseInt(data.pteScore) : undefined,
        preferredCountries: data.preferredCountries,
        universitySize: data.universitySize || "no-preference",
        annualBudget: data.annualBudget || "flexible",
        scholarshipNeed: data.scholarshipNeed || "open",
        workExperience: data.level === "graduate" ? (data.workExperience || "none") : undefined,
        hasCompetitions: data.level === "undergraduate" ? data.hasCompetitions : undefined,
        competitions: data.competitions || undefined,
        researchLevel: data.researchLevel || "none",
        hasPublications: data.hasPublications,
        publications: data.publications || undefined,
        hasAwards: data.hasAwards,
        academicAwards: data.academicAwards || undefined,
        hasLeadership: data.hasLeadership,
        leadershipDescription: data.leadershipDescription || undefined,
        volunteeringLevel: data.volunteeringLevel || "none",
      };

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.errors?.join(", ") ?? json.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      // Store results and redirect
      sessionStorage.setItem("scholarpath_results", JSON.stringify(json.data));
      router.push("/results");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const isLast = step === STEPS.length - 1;
  const canGo = canProceed(step, data);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-bold text-slate-900">ScholarPath</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={clsx(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                i < step ? "bg-brand-600" :
                i === step ? "bg-brand-400" :
                "bg-slate-200"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step].label}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="card w-full max-w-xl p-8">
        {/* Step Content */}
        {step === 0 && <StepA data={data} onChange={update} />}
        {step === 1 && <StepB data={data} onChange={update} />}
        {step === 2 && <StepC data={data} onChange={update} />}
        {step === 3 && <StepD data={data} onChange={update} />}
        {step === 4 && <StepE data={data} onChange={update} />}
        {step === 5 && <StepF data={data} onChange={update} />}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-30"
          >
            ← Back
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={!canGo || loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                "🎓 Find My Schools →"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              disabled={!canGo}
              className="btn-primary"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
