import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
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

// ── GET /api/stats ── Dashboard stats (scoped to user if authenticated)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryUserId = searchParams.get("user_id");
        const sessionUser = await getSessionUser(request);
        const userId = sessionUser?.id || queryUserId;

        if (userId) {
            // Scoped stats: get user's link IDs first
            const { data: userLinks } = await supabaseAdmin
                .from("links")
                .select("id")
                .eq("user_id", userId);

            const linkIds = (userLinks || []).map((l) => l.id);

            if (linkIds.length === 0) {
                return NextResponse.json({
                    data: { total_links: 0, total_clicks: 0, human_clicks: 0, bot_clicks: 0 },
                });
            }

            const [
                { count: totalLinks },
                { count: totalClicks },
                { count: humanClicks },
                { count: botClicks },
            ] = await Promise.all([
                supabaseAdmin.from("links").select("*", { count: "exact", head: true }).eq("user_id", userId),
                supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).in("link_id", linkIds),
                supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).in("link_id", linkIds).eq("is_bot", false),
                supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).in("link_id", linkIds).eq("is_bot", true),
            ]);

            return NextResponse.json({
                data: {
                    total_links: totalLinks || 0,
                    total_clicks: totalClicks || 0,
                    human_clicks: humanClicks || 0,
                    bot_clicks: botClicks || 0,
                },
            });
        }

        // Global stats (no user filter)
        const [
            { count: totalLinks },
            { count: totalClicks },
            { count: humanClicks },
            { count: botClicks },
        ] = await Promise.all([
            supabaseAdmin.from("links").select("*", { count: "exact", head: true }),
            supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }),
            supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("is_bot", false),
            supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("is_bot", true),
        ]);

        return NextResponse.json({
            data: {
                total_links: totalLinks || 0,
                total_clicks: totalClicks || 0,
                human_clicks: humanClicks || 0,
                bot_clicks: botClicks || 0,
            },
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
