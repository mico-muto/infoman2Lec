if (!window.supabase || !window.supabase.createClient) {
  throw new Error("Supabase JS failed to load.");
}

window.supabaseClient = window.supabase.createClient(
  "https://ayqfquzfuqgtoqjouziv.supabase.co",
  "sb_publishable_Pgvjfpz2YbosgyQPH6ZndQ_AXYigQ_3"
);
