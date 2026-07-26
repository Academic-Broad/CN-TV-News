import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder =
  !supabaseUrl ||
  !supabaseUrl.startsWith("http") ||
  supabaseUrl.includes("YOUR_PROJECT_ID");

if (isPlaceholder) {
  console.warn(
    "Supabase URL is missing or invalid. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: typeof window !== "undefined",
    },
  }
);
