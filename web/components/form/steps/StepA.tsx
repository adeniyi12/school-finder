"use client";
import { FormState, COUNTRIES } from "@/lib/formTypes";
import clsx from "clsx";

interface Props {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

export default function StepA({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Your Profile</h2>
        <p className="text-slate-500 mt-1">Let's start with the basics.</p>
      </div>

      {/* Level */}
      <div>
        <label className="form-label">What are you applying for?</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "undergraduate", label: "🎓 Undergraduate", sub: "High school → Bachelor's" },
            { value: "graduate", label: "📚 Graduate", sub: "Master's / PhD / MBA" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ level: opt.value as FormState["level"] })}
              className={clsx("option-card flex-col items-start", {
                selected: data.level === opt.value,
              })}
            >
              <div className="font-semibold text-slate-900">{opt.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{opt.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Field of Study */}
      <div>
        <label className="form-label">What do you want to study?</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Computer Science, Medicine, Business..."
          value={data.fieldOfStudy}
          onChange={(e) => onChange({ fieldOfStudy: e.target.value })}
        />
      </div>

      {/* Specialization */}
      <div>
        <label className="form-label">
          Specialization{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Machine Learning, Oncology, Finance..."
          value={data.specialization}
          onChange={(e) => onChange({ specialization: e.target.value })}
        />
      </div>

      {/* Country */}
      <div>
        <label className="form-label">Where are you from?</label>
        <select
          className="form-input"
          value={data.countryOfOrigin}
          onChange={(e) => onChange({ countryOfOrigin: e.target.value })}
        >
          <option value="">Select your country...</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
