/**
 * Client-safe Supabase exports.
 * For server-side usage, import directly from '@/lib/supabase/server'.
 */
export { createClient as createBrowserClient } from './client';
export { isSupabaseConfigured } from './config';
