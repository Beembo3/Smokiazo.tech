"use client";

import { useCallback } from "react";
import { STORAGE_KEYS, usePersistentState, writeJSON } from "./use-persistent-state";

export type Session = {
  name: string;
  email: string;
  verified: boolean;
};

export function useSession() {
  const [session, setSession] = usePersistentState<Session | null>(
    STORAGE_KEYS.session,
    null,
  );

  const signIn = useCallback(
    (email: string) => {
      const next: Session = { name: "Alex D.", email, verified: false };
      setSession(next);
      writeJSON(STORAGE_KEYS.session, next);
    },
    [setSession],
  );

  const signUp = useCallback(
    (name: string, email: string) => {
      const next: Session = { name, email, verified: false };
      setSession(next);
      writeJSON(STORAGE_KEYS.session, next);
    },
    [setSession],
  );

  const signOut = useCallback(() => {
    setSession(null);
    writeJSON(STORAGE_KEYS.session, null);
  }, [setSession]);

  const markVerified = useCallback(() => {
    setSession((current) => (current ? { ...current, verified: true } : null));
  }, [setSession]);

  const updateProfile = useCallback(
    (name: string, email: string) => {
      setSession((current) => (current ? { ...current, name, email } : current));
    },
    [setSession],
  );

  return {
    session,
    isSignedIn: Boolean(session),
    signIn,
    signUp,
    signOut,
    markVerified,
    updateProfile,
  };
}
