'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { CustomerProfile } from '@/types/customer';

interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { fullName: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const loadUserProfile = useCallback(async (currentUser: User) => {
    try {
      const supabase = createBrowserClient();
      // Attempt to load from public.profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: currentUser.email || '',
          fullName: data.full_name || currentUser.user_metadata?.full_name || '',
          phone: data.phone || currentUser.user_metadata?.phone || '',
          role: data.role || 'customer',
          createdAt: data.created_at || currentUser.created_at,
          updatedAt: data.updated_at || currentUser.updated_at || '',
        });
      } else {
        // Fallback to user metadata
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || '',
          phone: currentUser.user_metadata?.phone || '',
          role: 'customer',
          createdAt: currentUser.created_at,
          updatedAt: currentUser.updated_at || '',
        });
      }
    } catch {
      // Fallback to user metadata if DB query fails
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: currentUser.user_metadata?.full_name || '',
        phone: currentUser.user_metadata?.phone || '',
        role: 'customer',
        createdAt: currentUser.created_at,
        updatedAt: currentUser.updated_at || '',
      });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isConfigured) return;
    try {
      const supabase = createBrowserClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setProfile(null);
      }
    } catch {
      // Ignored
    }
  }, [isConfigured, loadUserProfile]);

  const router = useRouter();

  useEffect(() => {
    if (!isConfigured) {
      const timer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const supabase = createBrowserClient();

    // Initial user fetch
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserProfile(currentUser).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured, loadUserProfile]);

  const signOut = useCallback(async () => {
    if (!isConfigured) return;
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }, [isConfigured, router]);

  const updateProfile = useCallback(
    async (data: { fullName: string; phone: string }) => {
      if (!isConfigured || !user) {
        return { success: false, error: 'User is not authenticated' };
      }

      try {
        const supabase = createBrowserClient();

        // 1. Update auth.users metadata
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        });

        if (authError) {
          return { success: false, error: authError.message };
        }

        // 2. Attempt to update public.profiles table
        await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            phone: data.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        await refreshProfile();
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        return { success: false, error: message };
      }
    },
    [isConfigured, user, refreshProfile]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isConfigured,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [user, profile, isLoading, isConfigured, signOut, refreshProfile, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
