import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Tend" },
      { name: "description", content: "Sign in or create your Tend account to request access or list your land." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { refreshRole } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<AppRole>("visitor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.user) {
          // Assign role
          const { error: roleErr } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role });
          if (roleErr) throw roleErr;
          await refreshRole();
          toast.success("Welcome to Tend.");
          navigate({ to: role === "landowner" ? "/dashboard" : "/properties" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshRole();
        toast.success("Signed in.");
        navigate({ to: "/properties" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[480px] mx-auto px-6 py-16 lg:py-24">
        <p className="label-meta mb-3">{mode === "signin" ? "§ Returning" : "§ New entry"}</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight font-light mb-10">
          {mode === "signin" ? "Sign in." : "Open the ledger."}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <>
              <div>
                <label className="label-meta block mb-2">Display name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-paper-soft border border-ink/30 px-4 py-3 font-sans text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
                />
              </div>
              <div>
                <label className="label-meta block mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["visitor", "landowner"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`font-mono text-xs uppercase tracking-widest py-3 border transition-colors ${
                        role === r
                          ? "bg-ink text-paper border-ink"
                          : "border-ink/30 text-ink hover:border-ink"
                      }`}
                    >
                      {r === "visitor" ? "Visitor" : "Steward"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

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

          <div>
            <label className="label-meta block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-paper-soft border border-ink/30 px-4 py-3 font-sans text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-mono text-xs uppercase tracking-widest bg-ink text-paper py-4 hover:bg-rust transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          {mode === "signin" && (
            <div className="pt-1 text-right">
              <Link
                to="/forgot-password"
                className="label-meta hover:text-rust transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-8 label-meta hover:text-rust transition-colors"
        >
          {mode === "signin" ? "→ New here? Open an account" : "→ Already a member? Sign in"}
        </button>
      </main>
    </div>
  );
}
