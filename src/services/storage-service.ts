import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type StorageBucket =
  | 'product-images'
  | 'category-images'
  | 'brand-assets'
  | 'user-avatars';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image file to the designated Supabase Storage bucket.
 * Enforces file size and type boundaries server-side.
 */
export async function uploadStoreAsset(
  bucket: StorageBucket,
  file: File,
  folder = ''
): Promise<UploadResult> {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
  if (!allowedMime.includes(file.type)) {
    return {
      success: false,
      error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF, SVG.`,
    };
  }

  // 5MB max for assets, 2MB for avatars
  const maxSize = bucket === 'user-avatars' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      success: false,
      error: `File exceeds maximum size of ${maxSize / (1024 * 1024)}MB.`,
    };
  }

  if (!isSupabaseConfigured()) {
    // Demo fallback URL
    return {
      success: true,
      url: `https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80`,
    };
  }

  try {
    const supabase = await createServerSupabase();
    const extension = file.name.split('.').pop() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const path = folder ? `${folder}/${cleanFileName}` : cleanFileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: (err as Error).message || 'Error uploading file to Supabase Storage',
    };
  }
}
