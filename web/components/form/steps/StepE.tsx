"use client";
import { FormState } from "@/lib/formTypes";
import clsx from "clsx";

interface Props {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

export default function StepE({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Extracurriculars & Fit</h2>
        <p className="text-slate-500 mt-1">Leadership, volunteering, and your ideal campus.</p>
      </div>

      {/* Leadership */}
      <div>
        <label className="form-label">Leadership roles?</label>
        <p className="text-xs text-slate-400 mb-3">Clubs, sports teams, student government, community orgs</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { value: true,  label: "✅ Yes" },
            { value: false, label: "❌ No" },
          ].map((opt) => (
            <div
              key={String(opt.value)}
              onClick={() => onChange({ hasLeadership: opt.value })}
              className={clsx("option-card justify-center py-3", {
                selected: data.hasLeadership === opt.value,
              })}
            >
              <span className="font-medium text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
        {data.hasLeadership && (
          <input
            type="text"
            className="form-input"
            placeholder="e.g. President of CS club, Team captain"
            value={data.leadershipDescription}
            onChange={(e) => onChange({ leadershipDescription: e.target.value })}
          />
        )}
      </div>

      {/* Volunteering */}
      <div>
        <label className="form-label">Volunteering or community service</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "significant", label: "Significant", sub: "100+ hrs / ongoing" },
            { value: "some",        label: "Some",        sub: "Occasional" },
            { value: "none",        label: "None",        sub: "" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ volunteeringLevel: opt.value as FormState["volunteeringLevel"] })}
              className={clsx("option-card flex-col items-start py-3", {
                selected: data.volunteeringLevel === opt.value,
              })}
            >
              <span className="font-semibold text-sm">{opt.label}</span>
              {opt.sub && <span className="text-xs text-slate-500">{opt.sub}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* University size */}
      <div>
        <label className="form-label">Preferred university environment</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "large",         label: "🏛️ Large",      sub: "Big campus, research-focused" },
            { value: "medium",        label: "🏫 Medium",     sub: "Balanced size" },
            { value: "small",         label: "🏠 Small",      sub: "Intimate, personal" },
            { value: "no-preference", label: "🤷 No preference", sub: "Open to anything" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ universitySize: opt.value as FormState["universitySize"] })}
              className={clsx("option-card flex-col items-start", {
                selected: data.universitySize === opt.value,
              })}
            >
              <span className="font-semibold text-sm">{opt.label}</span>
              <span className="text-xs text-slate-500">{opt.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
