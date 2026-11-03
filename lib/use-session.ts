"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

export type Session = {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  verified: boolean;
};

async function profileFor(user: User): Promise<Session> {
  // Role comes only from the database, never user_metadata or localStorage.
  const { data, error } = await getSupabase()
    .from("users")
    .select("name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) console.error("Unable to read user profile:", error.message);

  return {
    userId: user.id,
    email: user.email ?? null,
    name: data?.name ?? user.user_metadata?.name ?? "User",
    role: data?.role === "admin" && !error ? "admin" : "user",
    verified: Boolean(user.email_confirmed_at),
  };
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeSession = useCallback(async () => {
    try {
      const { data, error } = await getSupabase().auth.getUser();
      if (error && error.name !== "AuthSessionMissingError") throw error;
      setSession(data.user ? await profileFor(data.user) : null);
    } catch (error) {
      console.error("Session initialization error:", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Do not await Supabase operations inside the auth callback: it may deadlock
    // while the auth client is processing an auth state change.
    let active = true;
    let generation = 0;
    const refresh = async () => {
      const current = ++generation;
      try {
        const { data, error } = await getSupabase().auth.getUser();
        if (error && error.name !== "AuthSessionMissingError") throw error;
        const next = data.user ? await profileFor(data.user) : null;
        if (active && current === generation) setSession(next);
      } catch (error) {
        console.error("Auth refresh error:", error);
        if (active && current === generation) setSession(null);
      } finally {
        if (active && current === generation) setIsLoading(false);
      }
    };
    try {
      const { data } = getSupabase().auth.onAuthStateChange(() => {
        void Promise.resolve().then(refresh);
      });
      void refresh();
      return () => {
        active = false;
        data.subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Supabase setup error:", error);
      setIsLoading(false);
      return () => { active = false; };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<Session> => {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Sign in did not return a user.");
    const next = await profileFor(data.user);
    setSession(next);
    return next;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string, _role: "user" | "admin" = "user") => {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (data.session && data.user) setSession(await profileFor(data.user));
    return { confirmationRequired: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
    setSession(null);
  }, []);

  const markVerified = useCallback(async () => {
    await initializeSession();
  }, [initializeSession]);

  const updateProfile = useCallback(async (name: string, email: string) => {
    if (!session?.userId) throw new Error("Sign in to update your profile.");
    const client = getSupabase();
    const { error } = await client.from("users").update({ name }).eq("id", session.userId);
    if (error) throw error;
    if (email !== session.email) {
      const { error: emailError } = await client.auth.updateUser({ email });
      if (emailError) throw emailError;
    }
    await initializeSession();
  }, [session?.userId, session?.email, initializeSession]);

  return { session, isLoading, isSignedIn: Boolean(session?.userId), signIn, signUp, signOut, markVerified, updateProfile, initializeSession };
}
