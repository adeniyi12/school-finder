import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-bold text-slate-900">ScholarPath</span>
        </div>
        <Link href="/form" className="btn-primary text-xs px-4 py-2">
          Get Started →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-8">
          🌍 For International Students
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-6">
          Find the universities{" "}
          <span className="text-brand-600">built for you</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-xl mb-12 leading-relaxed">
          Answer 20 questions about your academics, goals, and preferences.
          Our AI finds your top 10 matching universities with everything you need to apply.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/form" className="btn-primary text-base px-8 py-4">
            Start My Profile →
          </Link>
          <span className="text-slate-400 text-sm">Takes about 5 minutes · Free</span>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { value: "10+", label: "Countries covered" },
            { value: "500+", label: "Universities indexed" },
            { value: "2 min", label: "Average search time" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-brand-600">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-white/60 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Build your profile",
                desc: "Tell us your grades, test scores, achievements, and preferences.",
              },
              {
                step: "02",
                title: "AI evaluates your strength",
                desc: "We score your academic profile across 5 dimensions and place you in a competitive tier.",
              },
              {
                step: "03",
                title: "Get your top 10 schools",
                desc: "Receive a tailored list with tuition, scholarships, deadlines, and why each school fits you.",
              },
            ].map((item) => (
              <div key={item.step} className="card p-6">
                <div className="text-4xl font-extrabold text-brand-100 mb-3">{item.step}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-slate-400 text-sm border-t border-slate-200/60">
        ScholarPath · Built to help international students find their path
      </footer>
    </main>
  );
}
