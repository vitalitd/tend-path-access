import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PropertyMap } from "@/components/PropertyMap";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/properties_/$id")({
  component: PropertyDetail,
});

interface Detail {
  id: string;
  name: string;
  region: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  allowed_activities: string[];
  conditions: string | null;
  steward_name: string | null;
  acreage: number | null;
  is_available: boolean;
  access_rules: { group_size_limit: number | null; time_restrictions: string | null; warnings: string | null } | null;
  pricing: { amount: number; currency: string; pricing_type: string } | null;
}

function PropertyDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const [property, setProperty] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  // form
  const [date, setDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [message, setMessage] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, name, region, description, latitude, longitude, allowed_activities, conditions, steward_name, acreage, is_available, access_rules(group_size_limit, time_restrictions, warnings), pricing(amount, currency, pricing_type)"
        )
        .eq("id", id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setProperty(data as Detail | null);
      setLoading(false);
    })();
  }, [id]);

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (!acknowledged) {
      toast.error("Please acknowledge the conditions.");
      return;
    }
    setSubmitting(true);
    const price = property?.pricing;
    const { error } = await supabase.from("access_requests").insert({
      user_id: user.id,
      property_id: id,
      requested_datetime: new Date(date).toISOString(),
      group_size: groupSize,
      visitor_message: message || null,
      conditions_acknowledged: true,
      price_paid: price?.amount ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Passage requested. The steward will review.");
    navigate({ to: "/my-requests" });
  };

  if (loading) return <div className="min-h-screen bg-paper"><SiteHeader /><p className="p-12 label-meta">Loading…</p></div>;
  if (!property) return <div className="min-h-screen bg-paper"><SiteHeader /><p className="p-12 label-meta">Not found.</p></div>;

  const rules = property.access_rules?.[0];
  const price = property.pricing?.[0];

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <Link to="/properties" className="label-meta hover:text-rust transition-colors">
          ← Back to ledger
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-8">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="label-meta mb-3">{property.region ?? "—"}</p>
              <h1 className="font-display text-5xl md:text-7xl tracking-tighter font-light">
                {property.name}
              </h1>
              {property.steward_name && (
                <p className="text-twine mt-3">Steward: {property.steward_name}</p>
              )}
            </div>

            <PropertyMap
              markers={[{ lat: property.latitude, lng: property.longitude, label: property.name }]}
              height="320px"
              zoom={11}
            />

            {property.description && (
              <div>
                <p className="label-meta mb-3">§ Description</p>
                <p className="text-lg leading-relaxed text-ink/85">{property.description}</p>
              </div>
            )}

            {property.allowed_activities.length > 0 && (
              <div>
                <p className="label-meta mb-3">§ Permitted activities</p>
                <div className="flex flex-wrap gap-2">
                  {property.allowed_activities.map((a) => (
                    <span key={a} className="label-meta px-3 py-1.5 border border-ink/30 bg-ink/5">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.conditions && (
              <div className="border-l-2 border-moss pl-6">
                <p className="label-meta mb-3">§ Conditions of passage</p>
                <p className="text-ink-muted leading-relaxed whitespace-pre-line">{property.conditions}</p>
              </div>
            )}

            {rules?.warnings && (
              <div className="border border-rust/40 bg-rust/5 p-6">
                <p className="label-meta text-rust mb-3">⚠ Warnings</p>
                <p className="text-ink leading-relaxed">{rules.warnings}</p>
              </div>
            )}

            {(rules?.time_restrictions || rules?.group_size_limit || property.acreage) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-ink/15 pt-6">
                {property.acreage && (
                  <div>
                    <p className="label-meta mb-1">Acreage</p>
                    <p className="font-mono">{property.acreage}</p>
                  </div>
                )}
                {rules?.group_size_limit && (
                  <div>
                    <p className="label-meta mb-1">Max group</p>
                    <p className="font-mono">{rules.group_size_limit}</p>
                  </div>
                )}
                {rules?.time_restrictions && (
                  <div>
                    <p className="label-meta mb-1">Hours</p>
                    <p className="font-mono">{rules.time_restrictions}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <aside className="lg:col-span-5">
            <div className="pinned-card p-6 sticky top-24">
              <div className="flex justify-between items-end pb-4 border-b border-ink/15 mb-6">
                <div>
                  {price ? (
                    <>
                      <span className="block font-mono font-bold text-3xl tabular-nums">
                        {price.currency === "GBP" ? "£" : price.currency === "USD" ? "$" : ""}
                        {Number(price.amount).toFixed(0)}
                      </span>
                      <span className="label-meta">{price.pricing_type === "per_visit" ? "Per Entry" : price.pricing_type}</span>
                    </>
                  ) : (
                    <span className="label-meta">Free</span>
                  )}
                </div>
                <span className="label-meta">{property.is_available ? "● Open" : "Closed"}</span>
              </div>

              {authLoading ? (
                <p className="label-meta py-4 text-center">Loading…</p>
              ) : !user ? (
                <button
                  onClick={() => navigate({ to: "/auth" })}
                  disabled={!property.is_available}
                  className="w-full font-mono text-xs uppercase tracking-widest border border-ink py-4 hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
                >
                  Sign in to request
                </button>
              ) : role === "landowner" ? (
                <p className="label-meta py-4 text-center text-ink-muted">
                  Stewards cannot request passage.
                </p>
              ) : (
                <form onSubmit={handleRequest} className="space-y-4">
                  <div>
                    <label className="label-meta block mb-2">Date & time</label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      disabled={!property.is_available}
                      className="w-full bg-paper border border-ink/30 px-3 py-2 font-mono text-sm disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="label-meta block mb-2">Group size</label>
                    <input
                      type="number"
                      min={1}
                      max={rules?.group_size_limit ?? 10}
                      value={groupSize}
                      onChange={(e) => setGroupSize(Number(e.target.value))}
                      required
                      disabled={!property.is_available}
                      className="w-full bg-paper border border-ink/30 px-3 py-2 font-mono text-sm disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="label-meta block mb-2">Message to steward (optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      disabled={!property.is_available}
                      className="w-full bg-paper border border-ink/30 px-3 py-2 text-sm disabled:opacity-50"
                    />
                  </div>
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      disabled={!property.is_available}
                      className="mt-1"
                    />
                    <span className="text-sm text-ink-muted leading-relaxed">
                      I have read the conditions and will care for this land.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={submitting || !property.is_available}
                    className="w-full font-mono text-xs uppercase tracking-widest bg-ink text-paper py-4 hover:bg-rust transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Sending…" : !property.is_available ? "Closed to requests" : "Submit request"}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
