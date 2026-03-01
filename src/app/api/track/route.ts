import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { detectDevice } from "@/lib/bot-detector";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { link_id, user_agent, referrer } = body;

        if (!link_id) {
            return NextResponse.json({ error: "link_id is required" }, { status: 400 });
        }

        // Look up the link's mode to determine is_bot flag
        const { data: link } = await supabaseAdmin
            .from("links")
            .select("mode")
            .eq("id", link_id)
            .single();

        const isBotMode = link?.mode === "bot";

        const { error } = await supabaseAdmin.from("clicks").insert({
            link_id,
            user_agent: user_agent ? String(user_agent).slice(0, 512) : null,
            country: null,
            device_type: detectDevice(user_agent),
            is_bot: isBotMode,
            referrer: referrer || null,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
