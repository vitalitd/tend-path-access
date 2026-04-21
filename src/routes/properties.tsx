import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PropertyMap } from "@/components/PropertyMap";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Registry · Tend" },
      { name: "description", content: "Browse Tend's grassroots ledger of private lands open to careful visitors." },
    ],
  }),
  component: PropertiesPage,
});

interface PropertyRow {
  id: string;
  name: string;
  region: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  allowed_activities: string[];
  steward_name: string | null;
  acreage: number | null;
  pricing: { amount: number; currency: string; pricing_type: string }[] | null;
}

function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, name, region, description, latitude, longitude, allowed_activities, steward_name, acreage, pricing(amount, currency, pricing_type)"
        )
        .eq("is_available", true)
        .order("created_at", { ascending: false });
      if (!error && data) setProperties(data as PropertyRow[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-12 lg:py-16">
        <div className="border-b border-ink/15 pb-8 mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-meta mb-2">§ The Ledger · Volume I</p>
            <h1 className="font-display text-4xl md:text-6xl tracking-tighter font-light">
              Lands open to passage.
            </h1>
          </div>
          <p className="label-meta">{properties.length} entries</p>
        </div>

        {properties.length > 0 && (
          <div className="mb-12">
            <PropertyMap
              markers={properties.map((p) => ({
                lat: p.latitude,
                lng: p.longitude,
                label: `<strong>${p.name}</strong><br/>${p.region ?? ""}`,
              }))}
              height="380px"
            />
          </div>
        )}

        {loading ? (
          <p className="label-meta">Loading…</p>
        ) : properties.length === 0 ? (
          <div className="border border-ink/20 p-12 text-center bg-paper-soft">
            <p className="label-meta mb-3">§ Empty registry</p>
            <h2 className="font-display text-3xl tracking-tight mb-3">No lands listed yet.</h2>
            <p className="text-ink-muted mb-6">
              The ledger is fresh. Be among the first stewards to open your land.
            </p>
            <Link
              to="/dashboard"
              className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 inline-block hover:bg-ink hover:text-paper transition-colors"
            >
              Open the steward's desk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {properties.map((p) => {
              const price = p.pricing?.[0];
              return (
                <Link
                  key={p.id}
                  to="/properties/$id"
                  params={{ id: p.id }}
                  className="group block pinned-card p-4 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="bg-twine/10 aspect-[4/3] mb-4 relative overflow-hidden border border-ink/10 flex items-center justify-center">
                    <div className="label-meta text-twine/60">No plate</div>
                    <div className="absolute top-3 left-3 bg-paper-soft/95 px-2 py-1.5 label-meta border border-ink/20 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rust block" />
                      {p.latitude.toFixed(2)}°, {p.longitude.toFixed(2)}°
                    </div>
                  </div>
                  <div className="flex justify-between items-start gap-3 border-b border-ink/15 pb-3 mb-3">
                    <div>
                      <h3 className="font-display text-2xl tracking-tight text-ink leading-tight">
                        {p.name}
                      </h3>
                      <p className="label-meta mt-1.5">{p.region ?? "—"}</p>
                    </div>
                    {price && (
                      <div className="text-right shrink-0">
                        <span className="block font-mono font-bold text-xl tabular-nums">
                          {price.currency === "GBP" ? "£" : price.currency === "USD" ? "$" : ""}
                          {Number(price.amount).toFixed(0)}
                        </span>
                        <span className="label-meta block">
                          {price.pricing_type === "per_visit" ? "Per Entry" : price.pricing_type}
                        </span>
                      </div>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-sm text-ink-muted leading-relaxed line-clamp-3 mb-4">
                      {p.description}
                    </p>
                  )}
                  {p.allowed_activities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.allowed_activities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="label-meta px-2 py-1 border border-ink/20 bg-ink/5"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
