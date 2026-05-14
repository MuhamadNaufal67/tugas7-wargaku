"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  getSupabaseClient,
  type AppRole,
  type ProfileRow,
} from "@/lib/supabaseClient";
import {
  buildFallbackProfileRow,
  upsertCurrentUserProfile,
} from "@/lib/authProfile";
import {
  getSupabaseActionableMessage,
  isProfilesForeignKeyError,
  isSupabaseFetchError,
  logAuthError,
  logAuthWarning,
} from "@/lib/supabaseAuthErrors";

type AuthContextValue = {
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: ProfileRow | null;
  role: AppRole | null;
  session: Session | null;
  signOut: () => Promise<void>;
  supabase: ReturnType<typeof getSupabaseClient>;
  user: User | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function writeAuthCookies(isAuthenticated: boolean, role?: AppRole | null) {
  if (!isAuthenticated) {
    document.cookie = "isLoggedIn=; path=/; max-age=0; samesite=lax";
    document.cookie = "userRole=; path=/; max-age=0; samesite=lax";
    return;
  }

  document.cookie = "isLoggedIn=true; path=/; max-age=604800; samesite=lax";
  document.cookie = `userRole=${role ?? "user"}; path=/; max-age=604800; samesite=lax`;
}

async function ensureProfile(user: User, options?: { logErrors?: boolean }) {
  const supabase = getSupabaseClient();
  const shouldLogErrors = options?.logErrors ?? true;
  const response = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const { data: existingProfile, error: selectError } = response;

  if (selectError) {
    if (shouldLogErrors) {
      logAuthError("profiles.select failed", selectError, response);
    }
    throw selectError;
  }

  if (existingProfile) {
    return existingProfile;
  }

  return upsertCurrentUserProfile(
    user,
    { role: "user" as AppRole },
    { logErrors: shouldLogErrors },
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportedAuthIssuesRef = useRef<Set<string>>(new Set());
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  function reportAuthIssueOnce(
    label: string,
    error: unknown,
    response?: unknown,
    severity: "error" | "warning" = "error",
  ) {
    const message = getSupabaseActionableMessage(error) ?? "Unknown auth error";
    const key = `${label}:${message}`;

    if (reportedAuthIssuesRef.current.has(key)) {
      return;
    }

    reportedAuthIssuesRef.current.add(key);
    if (severity === "warning") {
      logAuthWarning(label, error, response);
      return;
    }

    logAuthError(label, error, response);
  }

  const syncSession = useCallback(async (nextSession?: Session | null) => {
    setIsLoading(true);

    try {
      const sessionToUse =
        nextSession ?? (await supabase.auth.getSession()).data.session ?? null;
      const nextUser = sessionToUse?.user ?? null;

      setSession(sessionToUse);
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        writeAuthCookies(false);
        return;
      }

      try {
        const nextProfile = await ensureProfile(nextUser, { logErrors: false });
        setProfile(nextProfile);
        writeAuthCookies(true, nextProfile.role);
      } catch (error) {
        if (isProfilesForeignKeyError(error) || isSupabaseFetchError(error)) {
          reportAuthIssueOnce("profile bootstrap fallback", error, {
            sessionUserId: nextUser.id,
          }, "warning");
          const fallbackProfile = buildFallbackProfileRow(nextUser, {
            role: "user",
          });
          setProfile(fallbackProfile);
          writeAuthCookies(true, fallbackProfile.role);
          return;
        }

        throw error;
      }
    } catch (error) {
      reportAuthIssueOnce("syncSession failed", error, {
        hasIncomingSession: Boolean(nextSession),
        incomingSessionUserId: nextSession?.user?.id ?? null,
        resolvedUserId: nextSession?.user?.id ?? userRef.current?.id ?? null,
      });
      setProfile(null);
      if (nextSession?.user ?? userRef.current) {
        writeAuthCookies(true);
      } else {
        writeAuthCookies(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  async function refreshProfile() {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const data = await ensureProfile(user);
      setProfile(data);
      writeAuthCookies(true, data.role);
    } catch (error) {
      if (isProfilesForeignKeyError(error) || isSupabaseFetchError(error)) {
        reportAuthIssueOnce("refreshProfile fallback", error, {
          userId: user.id,
        }, "warning");
        const fallbackProfile = buildFallbackProfileRow(user, { role: "user" });
        setProfile(fallbackProfile);
        writeAuthCookies(true, fallbackProfile.role);
        return;
      }

      reportAuthIssueOnce("refreshProfile failed", error, {
        userId: user.id,
      });
    }
  }

  async function signOut() {
    writeAuthCookies(false);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      if (!isMounted) {
        return;
      }

      await syncSession();
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, syncSession]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin: profile?.role === "admin",
        isAuthenticated: Boolean(user),
        isLoading,
        profile,
        role: profile?.role ?? null,
        session,
        signOut,
        supabase,
        user,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider.");
  }

  return context;
}
