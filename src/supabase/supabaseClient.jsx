import { createClient } from "@supabase/supabase-js";

// Provided credentials
const DEFAULT_URL = 'https://arahvjmqzwpalhnnetrs.supabase.co';
const DEFAULT_KEY = 'sb_publishable_G8-E4_WaxC-IILTGfA7Gbg_QYhiNuYb';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);