"use client";
import { FormState } from "@/lib/formTypes";
import clsx from "clsx";

interface Props {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

const scaleOptions = [
  { value: "4.0", label: "4.0 Scale", placeholder: "e.g. 3.75" },
  { value: "5.0", label: "5.0 Scale", placeholder: "e.g. 4.5" },
  { value: "percentage", label: "Percentage", placeholder: "e.g. 85" },
  { value: "letter", label: "Letter Grade", placeholder: "e.g. A" },
];

const rankOptions = [
  { value: "top5",  label: "Top 5%" },
  { value: "top10", label: "Top 10%" },
  { value: "top25", label: "Top 25%" },
  { value: "none",  label: "Not available" },
];

export default function StepB({ data, onChange }: Props) {
  const isUndergrad = data.level === "undergraduate";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Academic Background</h2>
        <p className="text-slate-500 mt-1">Your grades and academic standing.</p>
      </div>

      {/* Grading Scale */}
      <div>
        <label className="form-label">What grading scale does your school use?</label>
        <div className="grid grid-cols-2 gap-2">
          {scaleOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ gradingScale: opt.value as FormState["gradingScale"] })}
              className={clsx("option-card py-3", {
                selected: data.gradingScale === opt.value,
              })}
            >
              <span className="font-medium text-slate-800 text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GPA */}
      {data.gradingScale && (
        <div>
          <label className="form-label">Your GPA / Score</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder={scaleOptions.find((s) => s.value === data.gradingScale)?.placeholder ?? "Enter your score"}
            value={data.gpa}
            onChange={(e) => onChange({ gpa: e.target.value })}
          />
        </div>
      )}

      {/* Class Rank */}
      <div>
        <label className="form-label">Class rank or percentile <span className="font-normal text-slate-400">(optional)</span></label>
        <div className="grid grid-cols-2 gap-2">
          {rankOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ classRankPercentile: opt.value as FormState["classRankPercentile"] })}
              className={clsx("option-card py-3", {
                selected: data.classRankPercentile === opt.value,
              })}
            >
              <span className="font-medium text-slate-800 text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level-specific */}
      {isUndergrad ? (
        <div>
          <label className="form-label">Current school year</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "grade11", label: "Grade 11" },
              { value: "grade12", label: "Grade 12" },
              { value: "graduated", label: "Graduated" },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => onChange({ schoolYear: opt.value as FormState["schoolYear"] })}
                className={clsx("option-card py-3 justify-center", {
                  selected: data.schoolYear === opt.value,
                })}
              >
                <span className="font-medium text-slate-800 text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="form-label">Degree you completed</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. BSc Computer Science"
            value={data.completedDegree}
            onChange={(e) => onChange({ completedDegree: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
