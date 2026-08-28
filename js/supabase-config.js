/* ==================================================
   SUPABASE CONFIG
================================================== */

const SUPABASE_URL =
    "https://kgkxqajssjirrbodestj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_h2hC0bqAenFMD6ku5frLpg_Ea6jQZOH";


window.supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );