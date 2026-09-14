import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wowtpkqdfvnbzbuareda.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_u7oKNcUO4yvb2KbyUv6MWw_uGPZ0NWo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
