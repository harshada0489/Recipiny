import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Service from './service';
import type { AuthUser } from './service';

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, hydrate any persisted Cognito session from AsyncStorage.
  useEffect(() => {
    Service.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await Service.signUp(email, password);
  }, []);

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    await Service.confirmSignUp(email, code);
  }, []);

  const resendCode = useCallback(async (email: string) => {
    await Service.resendConfirmationCode(email);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await Service.signIn(email, password);
    setUser(next);
  }, []);

  const signOut = useCallback(async () => {
    await Service.signOut();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await Service.forgotPassword(email);
  }, []);

  const confirmForgotPassword = useCallback(async (email: string, code: string, password: string) => {
    await Service.confirmForgotPassword(email, code, password);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      signUp,
      confirmSignUp,
      resendCode,
      signIn,
      signOut,
      forgotPassword,
      confirmForgotPassword,
    }),
    [user, loading, signUp, confirmSignUp, resendCode, signIn, signOut, forgotPassword, confirmForgotPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
