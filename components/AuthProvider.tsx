"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  displayName: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getUserDisplayName(user: User | null) {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata;
  const nickname = metadata.nickname ?? metadata.name ?? metadata.full_name;
  return typeof nickname === "string" && nickname.trim().length > 0 ? nickname : user.email ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      window.alert("Supabase 환경변수를 설정한 뒤 Google 로그인을 사용할 수 있습니다.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href
      }
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) {
      throw new Error("Supabase 환경변수를 설정한 뒤 이메일 로그인을 사용할 수 있습니다.");
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href
      }
    });

    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  }, []);

  const user = session?.user ?? null;
  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      displayName: getUserDisplayName(user),
      signInWithGoogle,
      signInWithEmail,
      signOut
    }),
    [loading, session, signInWithEmail, signInWithGoogle, signOut, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {!isSupabaseConfigured && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-800">
          Supabase 환경변수가 없어 샘플 데이터 fallback으로 표시 중입니다.
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
