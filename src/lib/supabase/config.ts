/**
 * Supabase Configuration Utilities
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return false;
  }

  const trimmedUrl = url.trim();
  const trimmedKey = key.trim();

  if (
    !trimmedUrl ||
    !trimmedKey ||
    trimmedUrl === 'https://your-project-id.supabase.co' ||
    trimmedKey === 'your-anon-key-here' ||
    trimmedUrl.includes('your-project-id')
  ) {
    return false;
  }

  return true;
}
