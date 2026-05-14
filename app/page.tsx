const audienceCards = [
  {
    title: "E-commerce",
    description: "Launch-ready hero shots, clean packs, and rapid promo turns.",
  },
  {
    title: "Creators",
    description: "Stylized visuals for campaigns, podcasts, and social runs.",
  },
  {
    title: "Design Teams",
    description: "Brand-safe variations that keep review cycles tight.",
  },
  {
    title: "Office & Ops",
    description: "Polished internal decks, HR posters, and event visuals.",
  },
];

const steps = [
  {
    title: "Pick the scenario",
    description: "Choose a persona and scene template tuned for the goal.",
  },
  {
    title: "Refine the brief",
    description: "Adjust style, ratio, and tone without writing prompts.",
  },
  {
    title: "Generate and iterate",
    description: "Create multiple brand-consistent results in seconds.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    details: "Try the flow with a small credit pack.",
  },
  {
    name: "Basic",
    price: "$29",
    details: "Weekly campaigns and short-turn creatives.",
  },
  {
    name: "Team",
    price: "$99",
    details: "Shared credits, brand guardrails, and priority queues.",
  },
];

const faqs = [
  {
    q: "Do I need to write prompts?",
    a: "No. Picify turns scenario selections into structured prompts for you.",
  },
  {
    q: "How fast are results?",
    a: "Basic mode returns in seconds. Advanced mode refines in under 20 seconds.",
  },
  {
    q: "Can I keep brand consistency?",
    a: "Yes. Templates and style controls keep tone consistent across batches.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(247,245,240,0.85)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-[var(--color-brand)] shadow-[var(--color-shadow)] shadow-md" />
            <div>
              <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
                Picify
              </p>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                AI Visual Studio
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] md:flex">
            <a className="hover:text-[var(--color-ink)]" href="#scenes">
              Scenes
            </a>
            <a className="hover:text-[var(--color-ink)]" href="#workflow">
              Workflow
            </a>
            <a className="hover:text-[var(--color-ink)]" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-[var(--color-ink)]" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)] md:inline-flex">
              Sign in
            </button>
            <button className="rounded-full bg-[var(--color-brand-strong)] px-4 py-2 text-sm font-semibold text-white">
              Start creating
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,185,255,0.35),_rgba(247,245,240,0.1)_55%)]" />
          <div className="absolute top-24 -left-24 h-64 w-64 rounded-full bg-[rgba(120,185,255,0.18)] blur-3xl" />
          <div className="absolute top-32 right-10 h-40 w-40 rounded-full bg-[rgba(120,185,255,0.25)] blur-2xl" />
          <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
                Warm, focused, brand-ready
              </p>
              <h1 className="font-display mt-4 text-4xl leading-tight font-semibold text-[var(--color-ink)] md:text-5xl">
                Design visuals your team can ship, in minutes.
              </h1>
              <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
                Picify turns scenarios into clean, commercial-grade image sets.
                Skip prompt engineering and move straight into confident art
                direction.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white">
                  Generate a sample
                </button>
                <button className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)]">
                  See the workflow
                </button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-[var(--color-muted)]">
                <span>Trusted by lean marketing teams</span>
                <span>Secure assets in minutes</span>
                <span>No prompt debt</span>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--color-shadow)] shadow-lg">
                <div className="aspect-[4/3] rounded-2xl bg-[linear-gradient(135deg,_rgba(120,185,255,0.45),_rgba(255,255,255,0.8))]" />
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-muted)]">
                  <span>Studio product hero</span>
                  <span>4:3</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--color-shadow)] shadow-lg">
                  <div className="aspect-[3/4] rounded-2xl bg-[linear-gradient(165deg,_rgba(120,185,255,0.35),_rgba(255,255,255,0.85))]" />
                  <div className="mt-4 text-xs text-[var(--color-muted)]">
                    Lifestyle portrait
                  </div>
                </div>
                <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--color-shadow)] shadow-lg">
                  <div className="aspect-square rounded-2xl bg-[linear-gradient(155deg,_rgba(120,185,255,0.25),_rgba(255,255,255,0.9))]" />
                  <div className="mt-4 text-xs text-[var(--color-muted)]">
                    Social square
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16" id="scenes">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
                Scenes
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                Purpose-built scenarios, not blank canvases.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--color-muted)]">
              Every persona gives you a guided brief, recommended ratios, and a
              structure that keeps output consistent.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {audienceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[var(--color-ice)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16" id="workflow">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
                Workflow
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                A predictable pipeline for busy teams.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Every step is designed to be short, decision-based, and
                reversible. Keep moving without losing quality.
              </p>
              <div className="mt-8 space-y-5">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-ink)]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-ice)] p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                  <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
                    Input
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
                    Soft blue skincare launch
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    Persona: E-commerce
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                  <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
                    Output
                  </p>
                  <div className="mt-3 aspect-[4/3] rounded-xl bg-[linear-gradient(150deg,_rgba(120,185,255,0.35),_rgba(255,255,255,0.85))]" />
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                  <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
                    Controls
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-ink)]">
                    Lighting, ratio, texture, layout
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                  <p className="text-xs tracking-[0.3em] text-[var(--color-muted)] uppercase">
                    Review
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-ink)]">
                    Compare 4 variations, pick 1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16" id="pricing">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
                Pricing
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                Pick a plan and start shipping.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--color-muted)]">
              Credits are flexible and carry across campaigns.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  {plan.name}
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                  {plan.price}
                </p>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  {plan.details}
                </p>
                <button className="mt-6 w-full rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                  Choose plan
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16" id="faq">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <p className="text-xs tracking-[0.35em] text-[var(--color-muted)] uppercase">
              FAQ
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[var(--color-ink)]">
              Answers, upfront.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {faqs.map((item) => (
                <div key={item.q}>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {item.q}
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-muted)]">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
          <p>Picify Studio. Built for focused creative teams.</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-[var(--color-ink)]" href="/dashboard">
              Dashboard
            </a>
            <a className="hover:text-[var(--color-ink)]" href="#pricing">
              Plans
            </a>
            <a className="hover:text-[var(--color-ink)]" href="#faq">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
