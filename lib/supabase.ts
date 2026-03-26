import { createBrowserClient } from "@supabase/ssr";

// Singleton pattern — prevents multiple GoTrue instances fighting over the lock
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Use in-memory storage instead of localStorage to avoid lock contention
        // across multiple tabs / concurrent SSR + client requests
        storageKey: "sylva-vault-auth",
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        lock: async (name, acquireTimeout, fn) => {
          // Custom lock that gracefully handles contention instead of throwing
          try {
            if (typeof navigator !== "undefined" && navigator.locks) {
              return await navigator.locks.request(
                name,
                { ifAvailable: false, steal: false },
                async (lock) => {
                  if (!lock) {
                    // Lock unavailable — run without lock rather than crash
                    return await fn();
                  }
                  return await fn();
                }
              );
            }
          } catch {
            // Fallback: just run the function without a lock
          }
          return await fn();
        },
      },
    }
  );

  return client;
}