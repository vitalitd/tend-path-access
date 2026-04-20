import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import heroImg from "@/assets/hero-landscape.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tend — Quiet passage on kept ground" },
      {
        name: "description",
        content:
          "A grassroots ledger of land shared by neighbors. Tend mediates trusted, paid access through privately stewarded woods, pastures, and creeks.",
      },
      { property: "og:title", content: "Tend — Quiet passage on kept ground" },
      {
        property: "og:description",
        content: "A grassroots ledger of land shared by neighbors. Tend mediates trusted, paid access.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 lg:py-24">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 lg:mb-32">
          <div className="lg:col-span-6 space-y-10">
            <p className="label-meta">Registry v1.0 · A care-led project</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-tighter font-light text-balance">
              Cross the <br />
              <span className="italic text-moss">unseen borders.</span>
            </h1>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-moss/40" />
              <div className="pl-8 space-y-8">
                <p className="text-lg max-w-[46ch] text-ink/80 leading-relaxed font-light">
                  Tend mediates quiet passage through privately stewarded woods, pastures, and
                  creeks. A grassroots ledger of land shared by neighbours, opened only to those who
                  seek to preserve it.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <Link
                    to="/properties"
                    className="group inline-flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-ink font-bold hover:text-rust transition-colors"
                  >
                    Consult the Ledger
                    <span className="block w-12 h-px bg-ink group-hover:bg-rust group-hover:w-20 transition-all duration-300" />
                  </Link>
                  <Link
                    to="/auth"
                    className="font-mono text-xs uppercase tracking-widest text-twine hover:text-ink transition-colors"
                  >
                    Become a steward →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-ink/5 border border-ink/20 rotate-[2deg] translate-x-3 translate-y-3" />
            <div className="relative bg-paper-soft border border-ink/40 p-3 shadow-[4px_4px_0_0_rgba(43,42,39,0.15)]">
              <div className="aspect-[4/3] overflow-hidden border border-ink/10 relative">
                <img
                  src={heroImg}
                  alt="Morning frost on a stone boundary wall in misty hills"
                  className="w-full h-full object-cover"
                  width={1600}
                  height={1200}
                />
                <div className="absolute top-3 left-3 bg-paper-soft/95 px-2 py-1.5 label-meta border border-ink/20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rust block" />
                  Plate I · Morning boundary
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-ink/15 pt-16 lg:pt-24">
          <p className="label-meta mb-3">§ I — The Method</p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight font-light max-w-[24ch] mb-16">
            Three quiet steps, one shared trust.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                n: "01",
                t: "Browse the registry",
                d: "Open lands across the country, each one quietly tended by its steward. Read their conditions, see their map.",
              },
              {
                n: "02",
                t: "Request your passage",
                d: "Choose a date. Acknowledge the land's rules. The steward reviews — most reply within a day.",
              },
              {
                n: "03",
                t: "Walk, then check out",
                d: "Arrive, tap to check in. Roam carefully. Tap out when you leave. A simple, recorded visit.",
              },
            ].map((s) => (
              <div key={s.n} className="space-y-4">
                <p className="font-mono text-xs text-rust">{s.n}</p>
                <h3 className="font-display text-2xl tracking-tight">{s.t}</h3>
                <p className="text-ink-muted leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 lg:mt-32 border-t border-ink/15 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <h2 className="font-display text-3xl md:text-4xl tracking-tight font-light max-w-[20ch]">
              Begin your visit, or open your land.
            </h2>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link
                to="/properties"
                className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                to="/auth"
                className="font-mono text-xs uppercase tracking-widest border border-ink/40 px-6 py-3 hover:bg-rust hover:text-paper hover:border-rust transition-colors"
              >
                List your land
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/15 mt-24 py-10 text-center label-meta">
        Tend · A care-led registry · MMXXVI
      </footer>
    </div>
  );
}
