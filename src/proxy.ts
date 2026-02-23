import { NextRequest, NextResponse } from "next/server";
import { isBot } from "@/lib/bot-detector";

const RESERVED_PATHS = [
    "/api",
    "/links",
    "/analytics",
    "/settings",
    "/docs",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname === "/" ||
        RESERVED_PATHS.some((path) => pathname.startsWith(path)) ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const shortCode = pathname.slice(1);
    if (!shortCode || shortCode.includes("/")) {
        return NextResponse.next();
    }

    const userAgent = request.headers.get("user-agent");
    const isBotRequest = isBot(userAgent);

    if (isBotRequest) {
        const botUrl = new URL(`/bot/${shortCode}`, request.url);
        return NextResponse.rewrite(botUrl);
    }

    const redirectUrl = new URL(`/r/${shortCode}`, request.url);
    return NextResponse.rewrite(redirectUrl);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image).*)"],
};
