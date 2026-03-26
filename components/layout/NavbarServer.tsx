// components/layout/NavbarServer.tsx
// This is a SERVER component — it fetches the user's role from the DB
// and passes it down to the client Navbar.
// Use this in app/layout.tsx instead of <Navbar /> directly.

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "./Navbar";

export async function NavbarServer() {
  let role: "PUBLIC" | "SUBSCRIBER" | "ADMIN" = "PUBLIC";

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseId: data.user.id },
        select: { role: true },
      });
      if (dbUser?.role === "ADMIN") role = "ADMIN";
      else if (dbUser?.role === "SUBSCRIBER") role = "SUBSCRIBER";
    }
  } catch (err) {
    // Don't crash the whole page if DB is slow — just show public nav
    console.error("[NavbarServer] Could not fetch role:", err);
  }

  return <Navbar initialRole={role} />;
}