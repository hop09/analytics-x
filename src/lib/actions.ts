"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import type { Link, LinkMode, DashboardStats, LinkStats } from "@/lib/types";

async function requireUser() {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user;
}

export async function createLink(data: {
    short_code: string;
    original_url: string;
    custom_title?: string;
    custom_image_url?: string;
    bot_redirect_url?: string;
    bot_custom_title?: string;
    bot_custom_image_url?: string;
    mode?: LinkMode;
}): Promise<{ data: Link | null; error: string | null }> {
    const user = await requireUser();

    const { data: link, error } = await supabaseAdmin
        .from("links")
        .insert({
            user_id: user.id,
            short_code: data.short_code,
            original_url: data.original_url,
            custom_title: data.custom_title || null,
            custom_image_url: data.custom_image_url || null,
            bot_redirect_url: data.bot_redirect_url || null,
            bot_custom_title: data.bot_custom_title || null,
            bot_custom_image_url: data.bot_custom_image_url || null,
            mode: data.mode || "real",
        })
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            return { data: null, error: "This short code is already taken" };
        }
        return { data: null, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/links");
    return { data: link, error: null };
}

export async function getLinks(): Promise<Link[]> {
    const user = await requireUser();

    const { data, error } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
}

export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
    const { data, error } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("short_code", shortCode)
        .single();

    if (error) return null;
    return data;
}

export async function deleteLink(id: string): Promise<{ error: string | null }> {
    const user = await requireUser();

    const { error } = await supabaseAdmin
        .from("links")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/links");
    return { error: null };
}

export async function updateLink(
    id: string,
    data: {
        short_code?: string;
        original_url?: string;
        custom_title?: string | null;
        custom_image_url?: string | null;
        bot_redirect_url?: string | null;
        bot_custom_title?: string | null;
        bot_custom_image_url?: string | null;
        mode?: LinkMode;
    }
): Promise<{ data: Link | null; error: string | null }> {
    const user = await requireUser();

    // Build update object — only include provided fields
    const updates: Record<string, string | null> = {};
    if (data.short_code !== undefined) updates.short_code = data.short_code;
    if (data.original_url !== undefined) updates.original_url = data.original_url;
    if (data.custom_title !== undefined) updates.custom_title = data.custom_title || null;
    if (data.custom_image_url !== undefined) updates.custom_image_url = data.custom_image_url || null;
    if (data.bot_redirect_url !== undefined) updates.bot_redirect_url = data.bot_redirect_url || null;
    if (data.bot_custom_title !== undefined) updates.bot_custom_title = data.bot_custom_title || null;
    if (data.bot_custom_image_url !== undefined) updates.bot_custom_image_url = data.bot_custom_image_url || null;
    if (data.mode !== undefined) updates.mode = data.mode;

    if (Object.keys(updates).length === 0) {
        return { data: null, error: "No fields to update" };
    }

    const { data: link, error } = await supabaseAdmin
        .from("links")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            return { data: null, error: "This short code is already taken" };
        }
        return { data: null, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/links");
    revalidatePath(`/analytics/${id}`);
    return { data: link, error: null };
}

export async function getLinkWithStats(id: string): Promise<{ link: Link | null; stats: LinkStats | null }> {
    const user = await requireUser();

    const [
        { data: link, error: linkError },
        { count: totalClicks },
        { count: humanClicks },
        { count: botClicks },
        { data: clicks }
    ] = await Promise.all([
        supabaseAdmin.from("links").select("*").eq("id", id).eq("user_id", user.id).single(),
        supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("link_id", id),
        supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("link_id", id).eq("is_bot", false),
        supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("link_id", id).eq("is_bot", true),
        supabaseAdmin.from("clicks").select("country, device_type, referrer, user_agent, is_bot, created_at").eq("link_id", id).order("created_at", { ascending: false }).limit(50000)
    ]);

    if (linkError || !link) return { link: null, stats: null };

    const allClicks = clicks || [];

    const countryMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();
    const referrerMap = new Map<string, number>();
    const dateMap = new Map<string, number>();
    const uaMap = new Map<string, { count: number; is_bot: boolean }>();

    allClicks.forEach((click) => {
        const country = click.country || "Unknown";
        countryMap.set(country, (countryMap.get(country) || 0) + 1);

        const device = click.device_type || "Unknown";
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);

        const referrer = click.referrer || "Direct";
        referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);

        const date = new Date(click.created_at).toISOString().split("T")[0];
        dateMap.set(date, (dateMap.get(date) || 0) + 1);

        // Aggregate user agents (truncate to 256 chars for efficiency)
        if (click.user_agent) {
            const ua = click.user_agent.slice(0, 256);
            const existing = uaMap.get(ua);
            if (existing) {
                existing.count += 1;
            } else {
                uaMap.set(ua, { count: 1, is_bot: click.is_bot });
            }
        }
    });

    const sortMap = (map: Map<string, number>) =>
        Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

    const stats: LinkStats = {
        total_clicks: totalClicks || 0,
        human_clicks: humanClicks || 0,
        bot_clicks: botClicks || 0,
        top_countries: sortMap(countryMap).map(([country, count]) => ({ country, count })),
        top_devices: sortMap(deviceMap).map(([device, count]) => ({ device, count })),
        clicks_over_time: Array.from(dateMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count })),
        top_referrers: sortMap(referrerMap).map(([referrer, count]) => ({ referrer, count })),
        top_user_agents: Array.from(uaMap.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 20)
            .map(([user_agent, { count, is_bot }]) => ({ user_agent, count, is_bot })),
    };

    return { link, stats };
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const user = await requireUser();

    // Get user's link IDs first
    const { data: userLinks } = await supabaseAdmin
        .from("links")
        .select("id")
        .eq("user_id", user.id);

    const linkIds = (userLinks || []).map((l) => l.id);

    if (linkIds.length === 0) {
        return { total_clicks: 0, total_links: 0, human_clicks: 0, bot_clicks: 0 };
    }

    const [
        { count: totalLinks },
        { count: totalClicks },
        { count: humanClicks },
        { count: botClicks },
    ] = await Promise.all([
        supabaseAdmin.from("links").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).in("link_id", linkIds),
        supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).in("link_id", linkIds).eq("is_bot", false),
        supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).in("link_id", linkIds).eq("is_bot", true),
    ]);

    return {
        total_clicks: totalClicks || 0,
        total_links: totalLinks || 0,
        human_clicks: humanClicks || 0,
        bot_clicks: botClicks || 0,
    };
}

export async function getRecentClicks(limit: number = 10) {
    const user = await requireUser();

    // Get user's link IDs
    const { data: userLinks } = await supabaseAdmin
        .from("links")
        .select("id")
        .eq("user_id", user.id);

    const linkIds = (userLinks || []).map((l) => l.id);
    if (linkIds.length === 0) return [];

    const { data, error } = await supabaseAdmin
        .from("clicks")
        .select("*, links(short_code)")
        .in("link_id", linkIds)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return data || [];
}

export async function getLinksWithClickCounts(): Promise<(Link & { click_count: number })[]> {
    const user = await requireUser();

    const { data: links } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (!links || links.length === 0) return [];

    // Get accurate counts via individual count queries (server-side, no row limit)
    const countResults = await Promise.all(
        links.map((link) =>
            supabaseAdmin
                .from("clicks")
                .select("*", { count: "exact", head: true })
                .eq("link_id", link.id)
                .then(({ count }) => ({ id: link.id, count: count || 0 }))
        )
    );

    const countMap = new Map<string, number>();
    countResults.forEach(({ id, count }) => countMap.set(id, count));

    return links.map((link) => ({
        ...link,
        click_count: countMap.get(link.id) || 0,
    }));
}

export async function toggleLinkMode(
    id: string,
    mode: LinkMode
): Promise<{ data: Link | null; error: string | null }> {
    const user = await requireUser();

    const { data: link, error } = await supabaseAdmin
        .from("links")
        .update({ mode })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) return { data: null, error: error.message };

    revalidatePath("/");
    revalidatePath("/links");
    revalidatePath(`/analytics/${id}`);
    return { data: link, error: null };
}
