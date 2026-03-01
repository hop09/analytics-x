import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const RESERVED_PATHS = [
    "/api",
    "/links",
    "/analytics",
    "/settings",
    "/docs",
    "/login",
    "/register",
    "/auth",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
];

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login", "/register", "/auth", "/api", "/r", "/bot"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // Create Supabase client that can read/write cookies
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Refresh session (important for keeping tokens alive)
    const { data: { user } } = await supabase.auth.getUser();

    // Handle short-code redirect (non-reserved, non-dot paths)
    const isReservedOrRoot =
        pathname === "/" ||
        RESERVED_PATHS.some((path) => pathname.startsWith(path)) ||
        pathname.includes(".");

    if (!isReservedOrRoot) {
        const shortCode = pathname.slice(1);
        if (shortCode && !shortCode.includes("/")) {
            // All short codes route to /r/ — the page checks the link's mode
            // to decide whether to redirect (real mode) or render meta (bot mode)
            const redirectUrl = new URL(`/r/${shortCode}`, request.url);
            return NextResponse.rewrite(redirectUrl);
        }
    }

    // Check if route is public
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    // If user is logged in and trying to access login/register, redirect to dashboard
    if (user && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is NOT logged in and route requires auth, redirect to login
    if (!user && !isPublicPath && !pathname.includes(".")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image).*)"],
};
