import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateShortCode } from "@/lib/utils";
import { createServerClient } from "@supabase/ssr";

async function getSessionUser(request: NextRequest) {
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return request.cookies.getAll(); },
                    setAll() {},
                },
            }
        );
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch {
        return null;
    }
}

// ── GET /api/links ── List all links (with click counts)
// If authenticated via session, returns only the user's links
// Pass ?user_id=xxx to filter by user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
        const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
        const queryUserId = searchParams.get("user_id");

        // Try to get user from session
        const sessionUser = await getSessionUser(request);
        const userId = sessionUser?.id || queryUserId;

        let query = supabaseAdmin
            .from("links")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

        if (userId) {
            query = query.eq("user_id", userId);
        }

        const { data: links, error, count } = await query.range(offset, offset + limit - 1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get accurate counts via server-side count (no 1000-row limit)
        const countResults = await Promise.all(
            (links || []).map((link) =>
                supabaseAdmin
                    .from("clicks")
                    .select("*", { count: "exact", head: true })
                    .eq("link_id", link.id)
                    .then(({ count: c }) => ({ id: link.id, count: c || 0 }))
            )
        );

        const countMap = new Map<string, number>();
        countResults.forEach(({ id, count: c }) => countMap.set(id, c));

        const result = (links || []).map((link) => ({
            ...link,
            click_count: countMap.get(link.id) || 0,
        }));

        return NextResponse.json({
            data: result,
            pagination: {
                total: count || 0,
                limit,
                offset,
            },
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ── POST /api/links ── Create a new short link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { original_url, short_code, custom_title, custom_image_url, user_id, mode } = body;

        // Resolve user_id: prefer session user, then body param
        const sessionUser = await getSessionUser(request);
        const resolvedUserId = sessionUser?.id || user_id || null;

        if (!original_url || typeof original_url !== "string") {
            return NextResponse.json(
                { error: "original_url is required and must be a string" },
                { status: 400 }
            );
        }

        // Basic URL validation
        try {
            new URL(original_url);
        } catch {
            return NextResponse.json(
                { error: "original_url must be a valid URL" },
                { status: 400 }
            );
        }

        const code = (typeof short_code === "string" && short_code.trim())
            ? short_code.trim()
            : generateShortCode();

        // Validate short_code format
        if (!/^[a-zA-Z0-9_-]{1,50}$/.test(code)) {
            return NextResponse.json(
                { error: "short_code must be 1-50 alphanumeric characters, hyphens, or underscores" },
                { status: 400 }
            );
        }

        const { data: link, error } = await supabaseAdmin
            .from("links")
            .insert({
                short_code: code,
                original_url: original_url.trim(),
                custom_title: custom_title?.trim() || null,
                custom_image_url: custom_image_url?.trim() || null,
                mode: mode === "bot" ? "bot" : "real",
                ...(resolvedUserId ? { user_id: resolvedUserId } : {}),
            })
            .select()
            .single();

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { error: "This short_code is already taken" },
                    { status: 409 }
                );
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: link }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
}
