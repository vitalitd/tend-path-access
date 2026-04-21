import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Steward · Tend" }, { name: "description", content: "Manage your properties and incoming access requests." }],
  }),
  component: Dashboard,
});

interface PropertyRow {
  id: string;
  name: string;
  region: string | null;
  is_available: boolean;
  pricing: { amount: number; currency: string }[] | null;
}

interface RequestRow {
  id: string;
  status: string;
  requested_datetime: string;
  group_size: number;
  visitor_message: string | null;
  property_id: string;
  user_id: string;
  properties: { name: string } | null;
}

function Dashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const [{ data: props }, { data: reqs }] = await Promise.all([
      supabase
        .from("properties")
        .select("id, name, region, is_available, pricing(amount, currency)")
        .eq("landowner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("access_requests")
        .select("id, status, requested_datetime, group_size, visitor_message, property_id, user_id, properties!inner(name, landowner_id)")
        .eq("properties.landowner_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    setProperties((props as PropertyRow[]) ?? []);
    setRequests((reqs as RequestRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
      return;
    }
    if (!authLoading && user && role !== "landowner") {
      toast.error("Only stewards can view this page.");
      navigate({ to: "/" });
      return;
    }
    if (user && role === "landowner") void load();
  }, [user, role, authLoading]);

  const decide = async (id: string, status: "approved" | "declined") => {
    const { error } = await supabase.from("access_requests").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Request ${status}.`);
      void load();
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    const { error } = await supabase.from("properties").update({ is_available: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else void load();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-paper">
        <SiteHeader />
        <p className="p-12 label-meta">Loading…</p>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-12 border-b border-ink/15 pb-8">
          <div>
            <p className="label-meta mb-3">§ The Steward's view</p>
            <h1 className="font-display text-4xl md:text-6xl tracking-tighter font-light">Your lands.</h1>
          </div>
          <Link
            to="/dashboard/properties/new"
            className="font-mono text-xs uppercase tracking-widest bg-ink text-paper px-6 py-3 hover:bg-rust transition-colors"
          >
            + Open new land
          </Link>
        </div>

        {/* Pending requests */}
        {pending.length > 0 && (
          <section className="mb-16">
            <p className="label-meta mb-4">§ Awaiting your decision · {pending.length}</p>
            <div className="space-y-4">
              {pending.map((r) => (
                <article key={r.id} className="pinned-card p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-xl tracking-tight">{r.properties?.name}</h3>
                      <p className="label-meta mt-1.5">
                        {new Date(r.requested_datetime).toLocaleString()} · group of {r.group_size}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => decide(r.id, "approved")}
                        className="font-mono text-xs uppercase tracking-widest bg-moss text-paper px-4 py-2 hover:bg-ink transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => decide(r.id, "declined")}
                        className="font-mono text-xs uppercase tracking-widest border border-ink/30 px-4 py-2 hover:bg-rust hover:text-paper hover:border-rust transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                  {r.visitor_message && (
                    <p className="text-sm text-ink-muted italic border-l-2 border-twine pl-4 mt-2">
                      "{r.visitor_message}"
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Properties */}
        <section>
          <p className="label-meta mb-4">§ Your registry</p>
          {properties.length === 0 ? (
            <div className="border border-ink/20 p-12 text-center bg-paper-soft">
              <h2 className="font-display text-2xl mb-3">No lands listed yet.</h2>
              <p className="text-ink-muted mb-6">Open your first parcel to begin.</p>
              <Link
                to="/dashboard/properties/new"
                className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 inline-block hover:bg-ink hover:text-paper transition-colors"
              >
                Open new land
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((p) => {
                const price = p.pricing?.[0];
                return (
                  <article key={p.id} className="pinned-card p-5">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <Link
                          to="/properties/$id"
                          params={{ id: p.id }}
                          className="font-display text-xl tracking-tight hover:text-rust transition-colors"
                        >
                          {p.name}
                        </Link>
                        <p className="label-meta mt-1">{p.region ?? "—"}</p>
                      </div>
                      {price && (
                        <span className="font-mono font-bold text-lg tabular-nums">
                          {price.currency === "GBP" ? "£" : "$"}{Number(price.amount).toFixed(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-ink/15">
                      <button
                        onClick={() => toggleAvailability(p.id, p.is_available)}
                        className={`label-meta px-3 py-1.5 border transition-colors ${
                          p.is_available
                            ? "border-moss/40 text-moss bg-moss/5"
                            : "border-ink/30 text-ink-muted"
                        }`}
                      >
                        {p.is_available ? "● Open" : "○ Closed"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
