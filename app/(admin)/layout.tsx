import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── 1. Get Supabase session ──────────────────────────────────────────────
  let user = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      redirect("/login");
    }
    user = data.user;
  } catch {
    redirect("/login");
  }

  // ── 2. Check DB role ─────────────────────────────────────────────────────
  let isAdmin = false;
  try {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { role: true },
    });
    isAdmin = dbUser?.role === "ADMIN";
  } catch (err) {
    // Prisma error (cold start, connection issue, schema mismatch)
    // Log it but don't crash — treat as non-admin
    console.error("[AdminLayout] Prisma error:", err);
    isAdmin = false;
  }

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // ── 3. Render admin shell ────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}