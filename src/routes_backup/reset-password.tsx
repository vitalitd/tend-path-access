import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password · Tend" },
      {
        name: "description",
        content: "Choose a new password for your Tend account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  // Supabase password recovery: the link returns to this page with a hash
  // fragment (#access_token=...&type=recovery). The client picks it up
  // automatically and fires a PASSWORD_RECOVERY auth event, after which
  // updateUser({ password }) sets the new password.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // Also handle the case where the session is restored before the listener
    // attaches (e.g. on a hard refresh after Supabase parsed the hash).
    void supabase.auth.getSession().then(({ data: { session } }) => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (session && hash.includes("type=recovery")) setReady(true);
      else if (session) setReady(true);
      else if (!hash.includes("access_token")) {
        setTokenError("This reset link is missing or invalid. Request a new one.");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ kind: "error", message: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setStatus({ kind: "error", message: "Password must be at least 6 characters." });
      return;
    }
    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus({ kind: "success" });
      // Sign out so the user logs in with the new password.
      await supabase.auth.signOut();
      setTimeout(() => navigate({ to: "/auth" }), 1800);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update your password.";
      setStatus({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[480px] mx-auto px-6 py-16 lg:py-24">
        <p className="label-meta mb-3">§ New password</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight font-light mb-6">
          Set a new password.
        </h1>

        {tokenError && !ready ? (
          <>
            <p className="text-sm text-rust leading-relaxed border-l-2 border-rust pl-4">
              {tokenError}
            </p>
            <div className="mt-8">
              <Link
                to="/forgot-password"
                className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
              >
                Request a new link
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-meta block mb-2">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-paper-soft border border-ink/30 px-4 py-3 font-sans text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
              />
            </div>

            <div>
              <label className="label-meta block mb-2">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="w-full bg-paper-soft border border-ink/30 px-4 py-3 font-sans text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || status.kind === "success"}
              className="w-full font-mono text-xs uppercase tracking-widest bg-ink text-paper py-4 hover:bg-rust transition-colors disabled:opacity-50"
            >
              {submitting ? "..." : status.kind === "success" ? "Updated" : "Update password"}
            </button>
          </form>
        )}

        {status.kind === "success" && (
          <p className="mt-6 text-sm text-ink-muted leading-relaxed border-l-2 border-moss pl-4">
            Password updated. Returning you to sign in.
          </p>
        )}
        {status.kind === "error" && (
          <p className="mt-6 text-sm text-rust leading-relaxed border-l-2 border-rust pl-4">
            {status.message}
          </p>
        )}
      </main>
    </div>
  );
}
