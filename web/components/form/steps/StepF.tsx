"use client";
import { FormState } from "@/lib/formTypes";
import clsx from "clsx";

interface Props {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

export default function StepF({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Budget & Funding</h2>
        <p className="text-slate-500 mt-1">Final step — your financial situation.</p>
      </div>

      {/* Budget */}
      <div>
        <label className="form-label">Estimated annual budget (tuition + living)</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "<10k",     label: "Under $10,000" },
            { value: "10k-20k",  label: "$10,000 – $20,000" },
            { value: "20k-35k",  label: "$20,000 – $35,000" },
            { value: "35k-50k",  label: "$35,000 – $50,000" },
            { value: "50k+",     label: "$50,000+" },
            { value: "flexible", label: "Flexible / family-supported" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ annualBudget: opt.value as FormState["annualBudget"] })}
              className={clsx("option-card justify-start py-3", {
                selected: data.annualBudget === opt.value,
              })}
            >
              <span className="font-medium text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scholarship */}
      <div>
        <label className="form-label">Do you need a scholarship or financial aid?</label>
        <div className="space-y-2">
          {[
            { value: "full",    label: "🎯 Full scholarship required",       sub: "I can only attend with full funding" },
            { value: "partial", label: "💰 Partial scholarship preferred",   sub: "I'll apply for scholarships but not required" },
            { value: "open",    label: "🔍 Open to any — will apply",        sub: "Nice to have, but won't block me" },
            { value: "none",    label: "✅ Self-funded — no aid needed",     sub: "I have the budget covered" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ scholarshipNeed: opt.value as FormState["scholarshipNeed"] })}
              className={clsx("option-card", {
                selected: data.scholarshipNeed === opt.value,
              })}
            >
              <div>
                <div className="font-semibold text-sm text-slate-900">{opt.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{opt.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary preview */}
      {data.annualBudget && data.scholarshipNeed && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <p className="text-sm text-brand-700 font-medium">
            ✅ You&apos;re all set. Hit <strong>Find My Schools</strong> to see your results!
          </p>
        </div>
      )}
    </div>
  );
}
