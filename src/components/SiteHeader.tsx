import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="border-b border-ink/15 bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-5 flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-2xl italic tracking-tight font-light text-ink">
          Tend.
        </Link>
        <nav className="flex items-center gap-2 md:gap-6 text-xs md:text-[11px] font-mono uppercase tracking-widest text-twine">
          <Link
            to="/properties"
            className="hover:text-ink transition-colors"
            activeProps={{ className: "text-ink" }}
          >
            Registry
          </Link>
          {user && role === "visitor" && (
            <Link
              to="/my-requests"
              className="hover:text-ink transition-colors"
              activeProps={{ className: "text-ink" }}
            >
              My Passages
            </Link>
          )}
          {user && role === "landowner" && (
            <Link
              to="/dashboard"
              className="hover:text-ink transition-colors"
              activeProps={{ className: "text-ink" }}
            >
              Steward
            </Link>
          )}
          {user ? (
            <button onClick={handleSignOut} className="hover:text-rust transition-colors">
              Sign out
            </button>
          ) : (
            <Link to="/auth" className="hover:text-rust transition-colors">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
