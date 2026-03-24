"use client";
import { FormState } from "@/lib/formTypes";
import clsx from "clsx";

interface Props {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

const COUNTRIES_DEST = ["USA", "UK", "Canada", "Australia", "Germany", "Netherlands", "Singapore", "Japan", "France", "Sweden", "Open to anywhere"];

export default function StepC({ data, onChange }: Props) {
  const isUndergrad = data.level === "undergraduate";

  const toggleCountry = (country: string) => {
    const current = data.preferredCountries;
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    onChange({ preferredCountries: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tests & Preferences</h2>
        <p className="text-slate-500 mt-1">Test scores and where you want to study.</p>
      </div>

      {/* Standardized Test */}
      {isUndergrad ? (
        <div>
          <label className="form-label">Have you taken SAT or ACT?</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { value: "sat", label: "SAT" },
              { value: "act", label: "ACT" },
              { value: "none", label: "Neither" },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => onChange({ undergradTest: opt.value as FormState["undergradTest"] })}
                className={clsx("option-card justify-center py-3", {
                  selected: data.undergradTest === opt.value,
                })}
              >
                <span className="font-semibold text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
          {data.undergradTest === "sat" && (
            <input type="number" className="form-input" placeholder="SAT score (400–1600)"
              value={data.satScore} onChange={(e) => onChange({ satScore: e.target.value })} />
          )}
          {data.undergradTest === "act" && (
            <input type="number" className="form-input" placeholder="ACT score (1–36)"
              value={data.actScore} onChange={(e) => onChange({ actScore: e.target.value })} />
          )}
        </div>
      ) : (
        <div>
          <label className="form-label">Graduate admission test</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { value: "gre", label: "GRE" },
              { value: "gmat", label: "GMAT" },
              { value: "lsat", label: "LSAT" },
              { value: "mcat", label: "MCAT" },
              { value: "none", label: "None" },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => onChange({ gradTest: opt.value as FormState["gradTest"] })}
                className={clsx("option-card justify-center py-3", {
                  selected: data.gradTest === opt.value,
                })}
              >
                <span className="font-semibold text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
          {data.gradTest === "gre" && (
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="form-input" placeholder="Verbal (130–170)"
                value={data.greVerbal} onChange={(e) => onChange({ greVerbal: e.target.value })} />
              <input type="number" className="form-input" placeholder="Quant (130–170)"
                value={data.greQuant} onChange={(e) => onChange({ greQuant: e.target.value })} />
            </div>
          )}
          {data.gradTest === "gmat" && (
            <input type="number" className="form-input" placeholder="GMAT (200–800)"
              value={data.gmatScore} onChange={(e) => onChange({ gmatScore: e.target.value })} />
          )}
          {data.gradTest === "lsat" && (
            <input type="number" className="form-input" placeholder="LSAT (120–180)"
              value={data.lsatScore} onChange={(e) => onChange({ lsatScore: e.target.value })} />
          )}
          {data.gradTest === "mcat" && (
            <input type="number" className="form-input" placeholder="MCAT (472–528)"
              value={data.mcatScore} onChange={(e) => onChange({ mcatScore: e.target.value })} />
          )}
        </div>
      )}

      {/* English Test */}
      <div>
        <label className="form-label">English proficiency test</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { value: "ielts", label: "IELTS" },
            { value: "toefl", label: "TOEFL" },
            { value: "duolingo", label: "Duolingo" },
            { value: "pte", label: "PTE" },
            { value: "native", label: "Native" },
            { value: "none", label: "Not yet" },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => onChange({ englishTest: opt.value as FormState["englishTest"] })}
              className={clsx("option-card justify-center py-3", {
                selected: data.englishTest === opt.value,
              })}
            >
              <span className="font-semibold text-sm">{opt.label}</span>
            </div>
          ))}
        </div>
        {data.englishTest === "ielts" && (
          <input type="number" step="0.5" className="form-input" placeholder="IELTS score (0–9)"
            value={data.ieltsScore} onChange={(e) => onChange({ ieltsScore: e.target.value })} />
        )}
        {data.englishTest === "toefl" && (
          <input type="number" className="form-input" placeholder="TOEFL score (0–120)"
            value={data.toeflScore} onChange={(e) => onChange({ toeflScore: e.target.value })} />
        )}
        {data.englishTest === "duolingo" && (
          <input type="number" className="form-input" placeholder="Duolingo score (10–160)"
            value={data.duolingoScore} onChange={(e) => onChange({ duolingoScore: e.target.value })} />
        )}
        {data.englishTest === "pte" && (
          <input type="number" className="form-input" placeholder="PTE score (10–90)"
            value={data.pteScore} onChange={(e) => onChange({ pteScore: e.target.value })} />
        )}
      </div>

      {/* Preferred Countries */}
      <div>
        <label className="form-label">Preferred study destinations <span className="font-normal text-slate-400">(select all that apply)</span></label>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES_DEST.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => toggleCountry(country)}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-150",
                data.preferredCountries.includes(country)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              )}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
