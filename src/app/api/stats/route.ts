import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── GET /api/stats ── Global dashboard stats
export async function GET() {
    try {
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
