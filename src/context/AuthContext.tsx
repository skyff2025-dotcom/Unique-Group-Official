import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminProfileRow } from '../types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  adminProfile: AdminProfileRow | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshAdminProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin profile for the authenticated user and verify active status
  const fetchAdminProfile = async (userId: string): Promise<AdminProfileRow | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.warn('Admin profile verification error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Admin profile fetch failed:', err);
      return null;
    }
  };

  const refreshAdminProfile = async () => {
    if (user) {
      const profile = await fetchAdminProfile(user.id);
      setAdminProfile(profile);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (!isSupabaseConfigured()) {
          setLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session error:', error.message);
        }

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);

          if (initialSession?.user) {
            const profile = await fetchAdminProfile(initialSession.user.id);
            if (isMounted) {
              setAdminProfile(profile);
            }
          }
        }
      } catch (err) {
        console.warn('Auth initialization exception:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const profile = await fetchAdminProfile(currentSession.user.id);
          if (isMounted) {
            setAdminProfile(profile);
          }
        } else {
          setAdminProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Database connection is not configured.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let friendlyMessage = 'Invalid email or password. Please try again.';
        if (error.message.toLowerCase().includes('rate limit')) {
          friendlyMessage = 'Too many sign-in attempts. Please wait a few moments and try again.';
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          friendlyMessage = 'Your email address has not been confirmed yet. Please verify your email.';
        }
        return {
          success: false,
          error: friendlyMessage,
        };
      }

      if (data.user) {
        // Authorize against admin_profiles table
        const profile = await fetchAdminProfile(data.user.id);
        setAdminProfile(profile);

        if (!profile) {
          return {
            success: false,
            error: 'Access denied. Your account is not authorized as an active Unique Group administrator.',
          };
        }
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'An unexpected authentication error occurred. Please try again.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out exception:', err);
    } finally {
      setUser(null);
      setSession(null);
      setAdminProfile(null);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Database connection not available.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: 'Unable to send password reset email. Please ensure your email is correct.',
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to process password reset request at this time.',
      };
    }
  };

  const isAdmin = Boolean(user && adminProfile && adminProfile.active);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        adminProfile,
        loading,
        isAdmin,
        login,
        logout,
        resetPassword,
        refreshAdminProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
