import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/my-requests")({
  head: () => ({
    meta: [{ title: "My Passages · Tend" }, { name: "description", content: "View and manage your access requests." }],
  }),
  component: MyRequestsPage,
});

interface RequestRow {
  id: string;
  status: string;
  requested_datetime: string;
  group_size: number;
  visitor_message: string | null;
  payment_status: string;
  price_paid: number | null;
  properties: { id: string; name: string; region: string | null; landowner_id: string } | null;
  visits: { id: string; check_in_time: string | null; check_out_time: string | null }[] | null;
}

function MyRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const checkout = useServerFn(createCheckoutSession);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("access_requests")
      .select(
        "id, status, requested_datetime, group_size, visitor_message, payment_status, price_paid, properties(id, name, region, landowner_id), visits(id, check_in_time, check_out_time)"
      )
      .eq("user_id", user.id)
      .order("requested_datetime", { ascending: false });
    if (!error && data) setRequests(data as RequestRow[]);
    setLoading(false);
  };

  const handlePay = async (requestId: string) => {
    setPayingId(requestId);
    try {
      const res = await checkout({ data: { request_id: requestId } });
      if (res.error || !res.url) {
        toast.error(res.error ?? "Could not start checkout.");
        setPayingId(null);
        return;
      }
      window.location.href = res.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed.");
      setPayingId(null);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
      return;
    }
    if (user) void load();
  }, [user, authLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") {
      toast.success("Payment received. Your passage is confirmed.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (payment === "cancelled") {
      toast.message("Payment cancelled. You can try again any time.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleCheckIn = async (requestId: string) => {
    const { error } = await supabase
      .from("visits")
      .insert({ access_request_id: requestId, check_in_time: new Date().toISOString() });
    if (error) toast.error(error.message);
    else {
      toast.success("Checked in. Walk gently.");
      void load();
    }
  };

  const handleCheckOut = async (visitId: string) => {
    const { error } = await supabase
      .from("visits")
      .update({ check_out_time: new Date().toISOString() })
      .eq("id", visitId);
    if (error) toast.error(error.message);
    else {
      toast.success("Checked out. Thank you.");
      void load();
    }
  };

  const handleCancel = async (requestId: string) => {
    const { error } = await supabase
      .from("access_requests")
      .update({ status: "cancelled" })
      .eq("id", requestId);
    if (error) toast.error(error.message);
    else void load();
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <p className="label-meta mb-3">§ Your passages</p>
        <h1 className="font-display text-4xl md:text-6xl tracking-tighter font-light mb-12">
          Requests & visits.
        </h1>

        {loading ? (
          <p className="label-meta">Loading…</p>
        ) : requests.length === 0 ? (
          <div className="border border-ink/20 p-12 text-center bg-paper-soft">
            <p className="label-meta mb-3">§ No requests yet</p>
            <h2 className="font-display text-2xl mb-3">Begin with a walk.</h2>
            <Link
              to="/properties"
              className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 inline-block hover:bg-ink hover:text-paper transition-colors mt-4"
            >
              Browse the registry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const visit = r.visits?.[0];
              const isApproved = r.status === "approved";
              return (
                <article key={r.id} className="pinned-card p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <Link
                        to="/properties/$id"
                        params={{ id: r.properties?.id ?? "" }}
                        className="font-display text-2xl tracking-tight hover:text-rust transition-colors"
                      >
                        {r.properties?.name}
                      </Link>
                      <p className="label-meta mt-1.5">{r.properties?.region ?? "—"}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-ink/15 pt-4">
                    <div>
                      <p className="label-meta">Date</p>
                      <p className="font-mono mt-1">{new Date(r.requested_datetime).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="label-meta">Time</p>
                      <p className="font-mono mt-1">{new Date(r.requested_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                      <p className="label-meta">Group</p>
                      <p className="font-mono mt-1">{r.group_size}</p>
                    </div>
                    {visit?.check_in_time && (
                      <div>
                        <p className="label-meta">Checked in</p>
                        <p className="font-mono mt-1">{new Date(visit.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )}
                  </div>

                  {isApproved && r.payment_status !== "paid" && (
                    <div className="mt-5 pt-4 border-t border-ink/15 bg-twine/5 -mx-6 -mb-6 px-6 py-5">
                      <p className="label-meta mb-2">§ Pay to confirm your passage</p>
                      <p className="text-sm text-ink-muted mb-4 leading-relaxed">
                        The steward has approved your request. Complete payment to unlock check-in.
                      </p>
                      <button
                        onClick={() => handlePay(r.id)}
                        disabled={payingId === r.id}
                        className="font-mono text-xs uppercase tracking-widest bg-ink text-paper px-5 py-2.5 hover:bg-rust transition-colors disabled:opacity-50"
                      >
                        {payingId === r.id
                          ? "Opening checkout…"
                          : r.payment_status === "failed"
                          ? "Retry payment"
                          : "Pay now"}
                      </button>
                      {r.payment_status === "failed" && (
                        <p className="label-meta text-rust mt-3">Last payment attempt failed.</p>
                      )}
                    </div>
                  )}

                  {isApproved && r.payment_status === "paid" && (
                    <div className="mt-5 pt-4 border-t border-ink/15 flex flex-wrap gap-3 items-center">
                      <span className="label-meta text-moss">● Paid</span>
                      {!visit && (
                        <button
                          onClick={() => handleCheckIn(r.id)}
                          className="font-mono text-xs uppercase tracking-widest bg-moss text-paper px-5 py-2.5 hover:bg-ink transition-colors"
                        >
                          Check in
                        </button>
                      )}
                      {visit && !visit.check_out_time && (
                        <button
                          onClick={() => handleCheckOut(visit.id)}
                          className="font-mono text-xs uppercase tracking-widest bg-rust text-paper px-5 py-2.5 hover:bg-ink transition-colors"
                        >
                          Check out
                        </button>
                      )}
                      {visit?.check_out_time && (
                        <p className="label-meta text-moss">✓ Visit complete</p>
                      )}
                    </div>
                  )}
                  {r.status === "pending" && (
                    <div className="mt-5 pt-4 border-t border-ink/15">
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="label-meta hover:text-rust transition-colors"
                      >
                        Cancel request
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-twine/20 text-ink border-twine/40",
    approved: "bg-moss/15 text-moss border-moss/40",
    declined: "bg-rust/15 text-rust border-rust/40",
    cancelled: "bg-ink/10 text-ink-muted border-ink/30",
  };
  return (
    <span className={`label-meta px-3 py-1.5 border ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}
