const quickStyles = [
  "Brand Editorial",
  "Product Clean",
  "Soft Minimal",
  "Studio Light",
];

const historyItems = [
  { title: "Summer sale hero", status: "Completed", time: "12 min ago" },
  { title: "Skincare banner", status: "Generating", time: "Just now" },
  { title: "Office poster", status: "Failed", time: "1 hour ago" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--color-border)] bg-white/70 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
              Picify Studio
            </p>
            <h1 className="text-lg font-semibold text-[var(--color-ink)]">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[var(--color-ice)] px-4 py-2 text-sm text-[var(--color-ink)]">
              Credits: <span className="font-semibold">128</span>
            </div>
            <button className="rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white">
              New Session
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-8 lg:grid-cols-[260px_1fr_320px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Persona
            </p>
            <div className="mt-4 space-y-2">
              {["E-commerce", "Creator", "Designer", "Office"].map((item) => (
                <button
                  key={item}
                  className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-ink)] transition hover:border-[var(--color-brand)]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Quick Styles
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickStyles.map((style) => (
                <span
                  key={style}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-ink)]"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
                  Prompt
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
                  Create a bright hero image for a premium skincare launch.
                </h2>
              </div>
              <button className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm">
                Edit
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { label: "Style", value: "Studio minimal" },
                { label: "Ratio", value: "4:5" },
                { label: "Color", value: "Soft blue" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-[var(--color-ice)] p-4"
                >
                  <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
              Generate Preview
            </button>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-[radial-gradient(circle_at_top,_#e7f1ff,_#ffffff_70%)] p-6 shadow-sm">
            <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Preview
            </p>
            <div className="mt-4 aspect-[4/5] w-full rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(145deg,_rgba(120,185,255,0.25),_rgba(255,255,255,0.6))]" />
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-muted)]">
              <span>ETA 18s</span>
              <span>Queue #4</span>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Session
            </p>
            <div className="mt-4 space-y-3">
              {historyItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[var(--color-border)] p-3"
                >
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {item.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span>{item.status}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-ice)] p-4">
            <p className="text-xs font-semibold tracking-[0.3em] text-[var(--color-muted)] uppercase">
              Tips
            </p>
            <p className="mt-3 text-sm text-[var(--color-ink)]">
              Use short, concrete nouns first, then add camera or lighting notes
              to sharpen results.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
