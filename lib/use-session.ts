"use client";

import { useCallback, useEffect } from "react";
import { supabase } from "./supabase";
import { usePersistentState } from "./use-persistent-state";

export type Session = {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  verified: boolean;
};

export function useSession() {
  const [session, setSession] = usePersistentState<Session | null>(
    "2go.session",
    null,
  );

  // Initialize session from Supabase on client mount
  const initializeSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const { session: supabaseSession } = data;

      if (supabaseSession) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", supabaseSession.user.id)
          .single();

        if (userError) throw userError;

        const next: Session = {
          userId: supabaseSession.user.id,
          email: supabaseSession.user.email || null,
          name: userData?.name || supabaseSession.user.user_metadata?.name || "User",
          role: userData?.role || "user",
          verified: userData?.verified || false,
        };
        setSession(next);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Session init error:", error);
      setSession(null);
    }
  }, [setSession]);

  // Sync session changes from Supabase
  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      if (session) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError) throw userError;

        const next: Session = {
          userId: session.user.id,
          email: session.user.email,
          name: userData?.name || session.user.user_metadata?.name || "User",
          role: userData?.role || "user",
          verified: userData?.verified || false,
        };
        setSession(next);
      } else {
        setSession(null);
      }
    };

    const { data: authChange } = supabase.auth.onAuthStateChange(
      handleAuthChange,
    );

    return () => {
      authChange.subscription.unsubscribe();
    };
  }, [setSession]);

  // Initialize on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Refresh session to get/update user profile
      await initializeSession();
    },
    [initializeSession],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string, role: "user" | "admin" = "user") => {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            verified: false,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Wait for auth to propagate, then initialize
      await initializeSession();
    },
    [initializeSession],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
  }, [setSession]);

  const markVerified = useCallback(async () => {
    setSession((current) => (current ? { ...current, verified: true } : null));
  }, [setSession]);

  const updateProfile = useCallback(
    async (name: string, email: string) => {
      setSession((current) => (current ? { ...current, name, email } : current));

      if (!session?.userId) return;

      const { error } = await supabase
        .from("users")
        .update({ name, email })
        .eq("id", session.userId!);

      if (error) throw error;
    },
    [session?.userId],
  );

  return {
    session,
    isSignedIn: Boolean(session?.userId),
    signIn,
    signUp,
    signOut,
    markVerified,
    updateProfile,
    initializeSession,
  };
}