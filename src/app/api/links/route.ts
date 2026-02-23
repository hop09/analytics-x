import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateShortCode } from "@/lib/utils";

// ── GET /api/links ── List all links (with click counts)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
        const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

        const [{ data: links, error, count }, { data: clicks }] = await Promise.all([
            supabaseAdmin
                .from("links")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1),
            supabaseAdmin.from("clicks").select("link_id"),
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const countMap = new Map<string, number>();
        (clicks || []).forEach((c) => {
            countMap.set(c.link_id, (countMap.get(c.link_id) || 0) + 1);
        });

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

        const { original_url, short_code, custom_title, custom_image_url, alt_page_url } = body;

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
                alt_page_url: alt_page_url?.trim() || null,
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
