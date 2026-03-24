"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface School {
  rank: number;
  name: string;
  country: string;
  programName: string;
  degreeType: string;
  worldRanking?: string;
  acceptanceRate?: string;
  tuitionPerYear?: string;
  scholarshipsAvailable?: boolean;
  scholarshipDetails?: string;
  minGPA?: string;
  minTestScore?: string;
  minEnglishScore?: string;
  applicationDeadline?: string;
  programDuration?: string;
  websiteUrl?: string;
  whyRecommended: string;
  fitScore: "Reach" | "Match" | "Safety";
}

interface AgentResult {
  profile: {
    tier: string;
    finalScore: number;
    level: string;
    fieldOfStudy: string;
    specialization?: string;
  };
  recommendations: School[];
  generatedAt: string;
}

const FIT_STYLES = {
  Reach:  "bg-rose-50 text-rose-600 border-rose-200",
  Match:  "bg-amber-50 text-amber-600 border-amber-200",
  Safety: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const TIER_COLORS: Record<string, string> = {
  "Elite":               "text-purple-700 bg-purple-50 border-purple-200",
  "Highly Competitive":  "text-blue-700 bg-blue-50 border-blue-200",
  "Competitive":         "text-brand-700 bg-brand-50 border-brand-200",
  "Moderate":            "text-amber-700 bg-amber-50 border-amber-200",
  "Foundational":        "text-slate-600 bg-slate-50 border-slate-200",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-500">{value}/100</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SchoolCard({ school }: { school: School }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={clsx("card overflow-hidden transition-all duration-200", {
      "ring-2 ring-brand-200": school.rank === 1,
    })}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0",
              school.rank === 1 ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
            )}>
              #{school.rank}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{school.name}</h3>
              <p className="text-slate-500 text-sm mt-0.5">{school.country} · {school.worldRanking ?? "Ranked"}</p>
            </div>
          </div>
          <span className={clsx(
            "px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0",
            FIT_STYLES[school.fitScore]
          )}>
            {school.fitScore}
          </span>
        </div>

        {/* Program */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
            {school.programName}
          </span>
          <span className="px-3 py-1 bg-brand-100 rounded-lg text-xs font-medium text-brand-700">
            {school.degreeType}
          </span>
          {school.programDuration && (
            <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
              ⏱ {school.programDuration}
            </span>
          )}
        </div>

        {/* Why recommended */}
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">{school.whyRecommended}</p>

        {/* Key info row */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {school.tuitionPerYear && (
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-medium">Tuition / year</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{school.tuitionPerYear}</div>
            </div>
          )}
          {school.acceptanceRate && (
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-medium">Acceptance rate</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{school.acceptanceRate}</div>
            </div>
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1"
        >
          {expanded ? "Hide details ↑" : "Show full details ↓"}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
          {/* Requirements */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Entry Requirements</h4>
            <div className="grid grid-cols-1 gap-2">
              {school.minGPA && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Minimum GPA</span>
                  <span className="font-semibold text-slate-900">{school.minGPA}</span>
                </div>
              )}
              {school.minTestScore && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Test Score</span>
                  <span className="font-semibold text-slate-900">{school.minTestScore}</span>
                </div>
              )}
              {school.minEnglishScore && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">English</span>
                  <span className="font-semibold text-slate-900">{school.minEnglishScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Deadline */}
          {school.applicationDeadline && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Application Deadline</h4>
              <p className="text-sm text-slate-800 font-medium">{school.applicationDeadline}</p>
            </div>
          )}

          {/* Scholarships */}
          {school.scholarshipsAvailable && school.scholarshipDetails && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="text-xs font-bold text-emerald-700 mb-1">💰 Scholarships Available</div>
              <p className="text-sm text-emerald-800">{school.scholarshipDetails}</p>
            </div>
          )}

          {/* Website */}
          {school.websiteUrl && (
            <a
              href={school.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700"
            >
              🔗 Visit program website →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AgentResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("scholarpath_results");
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      router.push("/form");
    }
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { profile, recommendations } = results;
  const reachCount  = recommendations.filter((s) => s.fitScore === "Reach").length;
  const matchCount  = recommendations.filter((s) => s.fitScore === "Match").length;
  const safetyCount = recommendations.filter((s) => s.fitScore === "Safety").length;

  return (
    <main className="min-h-screen pb-20">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-bold text-slate-900">ScholarPath</span>
        </div>
        <button
          onClick={() => router.push("/form")}
          className="btn-secondary text-xs px-4 py-2"
        >
          ← New Search
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        {/* Profile Summary */}
        <div className="card p-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Your Results</h1>
              <p className="text-slate-500 mt-1">
                {profile.fieldOfStudy}
                {profile.specialization ? ` → ${profile.specialization}` : ""}
                {" · "}
                {profile.level === "undergraduate" ? "Undergraduate" : "Graduate"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-brand-600">{profile.finalScore}</div>
              <div className="text-xs text-slate-400">/ 100</div>
            </div>
          </div>

          <div className="mt-4">
            <span className={clsx(
              "inline-flex px-4 py-1.5 rounded-full text-sm font-bold border",
              TIER_COLORS[profile.tier] ?? "bg-slate-100 text-slate-700 border-slate-200"
            )}>
              {profile.tier}
            </span>
          </div>

          {/* Distribution */}
          <div className="mt-6 flex gap-4 text-center">
            {[
              { label: "Reach",  count: reachCount,  color: "text-rose-600" },
              { label: "Match",  count: matchCount,  color: "text-amber-600" },
              { label: "Safety", count: safetyCount, color: "text-emerald-600" },
            ].map((item) => (
              <div key={item.label} className="flex-1 bg-slate-50 rounded-xl py-3">
                <div className={clsx("text-2xl font-extrabold", item.color)}>{item.count}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* School list */}
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Top {recommendations.length} Recommended Schools
        </h2>

        <div className="space-y-4">
          {recommendations.map((school) => (
            <SchoolCard key={school.rank} school={school} />
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Generated {new Date(results.generatedAt).toLocaleString()} · Results are AI-generated. Always verify with official sources.
        </p>
      </div>
    </main>
  );
}
