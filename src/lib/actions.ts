"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import type { Link, DashboardStats, LinkStats } from "@/lib/types";

export async function createLink(data: {
    short_code: string;
    original_url: string;
    custom_title?: string;
    custom_image_url?: string;
    alt_page_url?: string;
}): Promise<{ data: Link | null; error: string | null }> {
    const { data: link, error } = await supabaseAdmin
        .from("links")
        .insert({
            short_code: data.short_code,
            original_url: data.original_url,
            custom_title: data.custom_title || null,
            custom_image_url: data.custom_image_url || null,
            alt_page_url: data.alt_page_url || null,
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
    const { data, error } = await supabaseAdmin
        .from("links")
        .select("*")
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
    const { error } = await supabaseAdmin
        .from("links")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/links");
    return { error: null };
}

export async function getLinkWithStats(id: string): Promise<{ link: Link | null; stats: LinkStats | null }> {
    const [
        { data: link, error: linkError },
        { data: clicks }
    ] = await Promise.all([
        supabaseAdmin.from("links").select("*").eq("id", id).single(),
        supabaseAdmin.from("clicks").select("*").eq("link_id", id).order("created_at", { ascending: false })
    ]);

    if (linkError || !link) return { link: null, stats: null };

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

    const stats: LinkStats = {
        total_clicks: allClicks.length,
        human_clicks: humanClicks.length,
        bot_clicks: botClicks.length,
        top_countries: sortMap(countryMap).map(([country, count]) => ({ country, count })),
        top_devices: sortMap(deviceMap).map(([device, count]) => ({ device, count })),
        clicks_over_time: Array.from(dateMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count })),
        top_referrers: sortMap(referrerMap).map(([referrer, count]) => ({ referrer, count })),
    };

    return { link, stats };
}

export async function getDashboardStats(): Promise<DashboardStats> {
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

    return {
        total_clicks: totalClicks || 0,
        total_links: totalLinks || 0,
        human_clicks: humanClicks || 0,
        bot_clicks: botClicks || 0,
    };
}

export async function getRecentClicks(limit: number = 10) {
    const { data, error } = await supabaseAdmin
        .from("clicks")
        .select("*, links(short_code)")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return data || [];
}

export async function getLinksWithClickCounts(): Promise<(Link & { click_count: number })[]> {
    const [{ data: links }, { data: clicks }] = await Promise.all([
        supabaseAdmin.from("links").select("*").order("created_at", { ascending: false }),
        supabaseAdmin.from("clicks").select("link_id"),
    ]);

    if (!links) return [];

    const countMap = new Map<string, number>();
    (clicks || []).forEach((click) => {
        countMap.set(click.link_id, (countMap.get(click.link_id) || 0) + 1);
    });

    return links.map((link) => ({
        ...link,
        click_count: countMap.get(link.id) || 0,
    }));
}
