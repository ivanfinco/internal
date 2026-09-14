import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wowtpkqdfvnbzbuareda.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_u7oKNcUO4yvb2KbyUv6MWw_uGPZ0NWo';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
