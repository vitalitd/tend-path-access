import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password · Tend" },
      {
        name: "description",
        content: "Request a password reset link for your Tend account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "sent" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setStatus({ kind: "sent" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send the reset email.";
      setStatus({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[480px] mx-auto px-6 py-16 lg:py-24">
        <p className="label-meta mb-3">§ Recovery</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight font-light mb-6">
          Reset your password.
        </h1>
        <p className="text-ink-muted leading-relaxed mb-10">
          Enter the email tied to your account. If a record exists, we will send a link to set a
          new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-meta block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-paper-soft border border-ink/30 px-4 py-3 font-sans text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-mono text-xs uppercase tracking-widest bg-ink text-paper py-4 hover:bg-rust transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : "Send reset link"}
          </button>
        </form>

        {status.kind === "sent" && (
          <p className="mt-6 text-sm text-ink-muted leading-relaxed border-l-2 border-moss pl-4">
            If an account exists for {email}, a reset link is on its way. Check your inbox, and your
            spam folder if needed.
          </p>
        )}
        {status.kind === "error" && (
          <p className="mt-6 text-sm text-rust leading-relaxed border-l-2 border-rust pl-4">
            {status.message}
          </p>
        )}

        <div className="mt-10 flex gap-6">
          <Link to="/auth" className="label-meta hover:text-rust transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
