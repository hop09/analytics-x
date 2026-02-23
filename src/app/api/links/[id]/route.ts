import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// ── GET /api/links/[id] ── Get a single link with full stats
export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        const [{ data: link, error: linkError }, { data: clicks }] = await Promise.all([
            supabaseAdmin.from("links").select("*").eq("id", id).single(),
            supabaseAdmin.from("clicks").select("*").eq("link_id", id).order("created_at", { ascending: false }),
        ]);

        if (linkError || !link) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        const allClicks = clicks || [];
        const humanClicks = allClicks.filter((c) => !c.is_bot);
        const botClicks = allClicks.filter((c) => c.is_bot);

        const countryMap = new Map<string, number>();
        const deviceMap = new Map<string, number>();
        const referrerMap = new Map<string, number>();
        const dateMap = new Map<string, number>();

        allClicks.forEach((click) => {
            const country = click.country || "Unknown";
            countryMap.set(country, (countryMap.get(country) || 0) + 1);

            const device = click.device_type || "Unknown";
            deviceMap.set(device, (deviceMap.get(device) || 0) + 1);

            const referrer = click.referrer || "Direct";
            referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);

            const date = new Date(click.created_at).toISOString().split("T")[0];
            dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });

        const sortMap = (map: Map<string, number>) =>
            Array.from(map.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

        return NextResponse.json({
            data: {
                ...link,
                stats: {
                    total_clicks: allClicks.length,
                    human_clicks: humanClicks.length,
                    bot_clicks: botClicks.length,
                    top_countries: sortMap(countryMap).map(([country, count]) => ({ country, count })),
                    top_devices: sortMap(deviceMap).map(([device, count]) => ({ device, count })),
                    top_referrers: sortMap(referrerMap).map(([referrer, count]) => ({ referrer, count })),
                    clicks_over_time: Array.from(dateMap.entries())
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([date, count]) => ({ date, count })),
                },
            },
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ── PATCH /api/links/[id] ── Update a link
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const allowedFields = ["original_url", "custom_title", "custom_image_url", "alt_page_url"];
        const updates: Record<string, string | null> = {};

        for (const field of allowedFields) {
            if (field in body) {
                const val = body[field];
                updates[field] = typeof val === "string" && val.trim() ? val.trim() : null;
            }
        }

        if (original_url_provided(updates)) {
            try {
                new URL(updates.original_url!);
            } catch {
                return NextResponse.json(
                    { error: "original_url must be a valid URL" },
                    { status: 400 }
                );
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update. Allowed: " + allowedFields.join(", ") },
                { status: 400 }
            );
        }

        const { data: link, error } = await supabaseAdmin
            .from("links")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json({ error: "Link not found" }, { status: 404 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: link });
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
}

// ── DELETE /api/links/[id] ── Delete a link
export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;

        const { error } = await supabaseAdmin.from("links").delete().eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Link deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

function original_url_provided(updates: Record<string, string | null>): boolean {
    return "original_url" in updates && updates.original_url !== null;
}
