import { createClient } from "@supabase/supabase-js";

// Provided credentials
const DEFAULT_URL = 'https://arahvjmqzwpalhnnetrs.supabase.co';
const DEFAULT_KEY = 'sb_publishable_G8-E4_WaxC-IILTGfA7Gbg_QYhiNuYb';

const supabaseUrl = DEFAULT_URL;
const supabaseAnonKey = DEFAULT_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);