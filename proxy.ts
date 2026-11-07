import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const redirect = (path: string, response?: NextResponse) => {
    const target = NextResponse.redirect(new URL(path, request.url));
    response?.cookies.getAll().forEach((cookie) => {
      target.cookies.set(cookie);
    });
    return target;
  };

  if (!url || !key) {
    return pathname === "/manage" ? redirect("/admin") : redirect("/login");
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    // Supabase redirects email-confirmation and recovery links to the Site URL
    // with a ?code= (PKCE) or ?token_hash=&type= parameter. Exchange it before
    // the auth gate runs, otherwise the parameter is dropped and the user is
    // sent back to /login without ever getting a session.
    const code = request.nextUrl.searchParams.get("code");
    const tokenHash = request.nextUrl.searchParams.get("token_hash");
    const otpType = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

    if (code || (tokenHash && otpType)) {
      const { error: exchangeError } = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : await supabase.auth.verifyOtp({ type: otpType!, token_hash: tokenHash! });

      if (exchangeError) return redirect("/login?error=auth", response);

      const success = NextResponse.redirect(new URL(pathname, request.url));
      response.cookies.getAll().forEach((cookie) => success.cookies.set(cookie));
      return success;
    }

    return redirect(pathname === "/manage" ? "/admin" : "/login", response);
  }

  if (pathname === "/manage") {
    // A normal user cannot make themselves admin by editing localStorage or
    // passing an "admin" string to signIn.
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return redirect("/admin", response);
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/manage", "/manage/:path*"],
};
