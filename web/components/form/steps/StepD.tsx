"use client";
import { FormState } from "@/lib/formTypes";
import clsx from "clsx";

interface Props {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

export default function StepD({ data, onChange }: Props) {
  const isUndergrad = data.level === "undergraduate";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Experience & Achievements</h2>
        <p className="text-slate-500 mt-1">Research, awards, and relevant experience.</p>
      </div>

      {/* Work Experience (grad only) */}
      {!isUndergrad && (
        <div>
          <label className="form-label">Work experience relevant to your field</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "none", label: "None" },
              { value: "<1",   label: "< 1 year" },
              { value: "1-2",  label: "1–2 years" },
              { value: "3-5",  label: "3–5 years" },
              { value: "5+",   label: "5+ years" },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => onChange({ workExperience: opt.value as FormState["workExperience"] })}
                className={clsx("option-card justify-center py-3", {
                  selected: data.workExperience === opt.value,
                })}
              >
                <span className="font-medium text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitions (undergrad only) */}
      {isUndergrad && (
        <div>
          <label className="form-label">Academic competitions or olympiads?</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { value: true, label: "✅ Yes" },
              { value: false, label: "❌ No" },
            ].map((opt) => (
              <div
                key={String(opt.value)}
                onClick={() => onChange({ hasCompetitions: opt.value })}
                className={clsx("option-card justify-center py-3", {
                  selected: data.hasCompetitions === opt.value,
                })}
              >
                <span className="font-medium text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
          {data.hasCompetitions && (
            <textarea
              className="form-input"
              rows={2}
              placeholder="Briefly describe (e.g. National Science Olympiad, USACO Gold)"
              value={data.competitions}
              onChange={(e) => onChange({ competitions: e.target.value })}
            />
          )}
        </div>
      )}

      {/* Research */}
      <div>
        <label className="form-label">Research experience</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "formal",   label: "🔬 Formal", sub: "Lab / published" },
            { value: "informal", label: "📝 Informal", sub: "Coursework / personal" },
            { value: "none",     label: "❌ None", sub: "" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ researchLevel: opt.value as FormState["researchLevel"] })}
              className={clsx("option-card flex-col items-start py-3", {
                selected: data.researchLevel === opt.value,
              })}
            >
              <span className="font-semibold text-sm">{opt.label}</span>
              {opt.sub && <span className="text-xs text-slate-500">{opt.sub}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Publications */}
      <div>
        <label className="form-label">Publications, patents, or significant projects?</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { value: true,  label: "✅ Yes" },
            { value: false, label: "❌ No" },
          ].map((opt) => (
            <div
              key={String(opt.value)}
              onClick={() => onChange({ hasPublications: opt.value })}
              className={clsx("option-card justify-center py-3", {
                selected: data.hasPublications === opt.value,
              })}
            >
              <span className="font-medium text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
        {data.hasPublications && (
          <textarea
            className="form-input"
            rows={2}
            placeholder="Brief description..."
            value={data.publications}
            onChange={(e) => onChange({ publications: e.target.value })}
          />
        )}
      </div>

      {/* Awards */}
      <div>
        <label className="form-label">Academic awards or honors?</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { value: true,  label: "✅ Yes" },
            { value: false, label: "❌ No" },
          ].map((opt) => (
            <div
              key={String(opt.value)}
              onClick={() => onChange({ hasAwards: opt.value })}
              className={clsx("option-card justify-center py-3", {
                selected: data.hasAwards === opt.value,
              })}
            >
              <span className="font-medium text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
        {data.hasAwards && (
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Dean's List, National Merit, subject prizes"
            value={data.academicAwards}
            onChange={(e) => onChange({ academicAwards: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}
