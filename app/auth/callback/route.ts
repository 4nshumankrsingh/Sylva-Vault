import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? null;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const supabaseUser = data.user;

  try {
    // Upsert user in Prisma DB — creates on first login, updates on repeat
    const dbUser = await prisma.user.upsert({
      where: { supabaseId: supabaseUser.id },
      update: {
        email: supabaseUser.email ?? "",
        name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      },
      create: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email ?? "",
        name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        role: "PUBLIC",
      },
    });

    // Sync the Prisma role into Supabase user_metadata
    // This is what middleware reads — keeps them in sync
    const metaRole = supabaseUser.user_metadata?.role;
    if (metaRole !== dbUser.role) {
      await supabase.auth.updateUser({
        data: { role: dbUser.role },
      });
    }

    // Redirect based on role
    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    if (dbUser.role === "ADMIN") {
      return NextResponse.redirect(`${origin}/admin`);
    }
    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (dbError) {
    console.error("DB sync error in auth callback:", dbError);
    // Even if DB sync fails, still redirect so user isn't stuck
    return NextResponse.redirect(`${origin}/dashboard`);
  }
}