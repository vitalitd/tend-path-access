import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "visitor" | "landowner" | "admin";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  // `loading` stays true until the initial getSession() has resolved AND
  // any subsequent role lookup has completed. This avoids a race where
  // route guards see `loading=false, user=null` for one render and bounce
  // the user to /auth before the persisted session is restored.
  const [loading, setLoading] = useState(true);

  const loadRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    setRole((data?.role as AppRole) ?? null);
  };

  useEffect(() => {
    let initialResolved = false;

    // Listener: never await inside the callback — defer Supabase calls so we
    // don't deadlock the auth event loop. Only flip loading off here AFTER
    // the initial getSession() has run, so we don't briefly report
    // "logged out" before the persisted session restores.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const uid = newSession.user.id;
        setTimeout(() => {
          void loadRole(uid).finally(() => {
            if (initialResolved) setLoading(false);
          });
        }, 0);
      } else {
        setRole(null);
        if (initialResolved) setLoading(false);
      }
    });

    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        void loadRole(s.user.id).finally(() => {
          initialResolved = true;
          setLoading(false);
        });
      } else {
        initialResolved = true;
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  const refreshRole = async () => {
    if (user) await loadRole(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
