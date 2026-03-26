import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // MUST call getUser() to refresh session — do not remove
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Read role from Supabase user metadata (set during signup & role changes)
  const role: string = user?.user_metadata?.role ?? "PUBLIC";

  // ── Skip middleware for auth callback ────────────────────────────────────
  if (pathname.startsWith("/auth/callback")) {
    return response;
  }

  // ── Not logged in — protect private routes ───────────────────────────────
  if (!user) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/subscribe") ||
      pathname.startsWith("/admin")
    ) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ── User IS logged in ─────────────────────────────────────────────────────

  // Redirect away from auth pages
  if (pathname === "/login" || pathname === "/signup") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ADMIN: can only access /admin/* — block from /dashboard and /subscribe
  if (role === "ADMIN") {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/subscribe")
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  // NON-ADMIN: block from /admin/*
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};