import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase non configuré');
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function tryCreateClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
