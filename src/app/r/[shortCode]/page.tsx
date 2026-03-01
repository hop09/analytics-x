import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { detectDevice } from "@/lib/bot-detector";
import { cache } from "react";

// Ensure every visit runs the page function (no caching of the redirect)
export const dynamic = "force-dynamic";

const getLink = cache(async (shortCode: string) => {
    const { data } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("short_code", shortCode)
        .single();
    return data;
});

interface PageProps {
    params: Promise<{ shortCode: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { shortCode } = await params;
    const link = await getLink(shortCode);

    if (!link) return {};

    // Use the correct mode-specific title and image
    const isBotMode = link.mode === "bot";
    const title = (isBotMode ? link.bot_custom_title : link.custom_title) || link.short_code;
    const imageUrl = isBotMode ? link.bot_custom_image_url : link.custom_image_url;
    const hasImage = !!imageUrl;

    return {
        title,
        openGraph: {
            title,
            images: hasImage ? [{ url: imageUrl! }] : [],
            type: "website" as const,
        },
        twitter: {
            card: "summary_large_image" as const,
            title,
            images: hasImage ? [imageUrl!] : [],
        },
    };
}

export default async function RedirectPage({ params }: PageProps) {
    const { shortCode } = await params;
    const link = await getLink(shortCode);

    if (!link) {
        notFound();
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const referer = headersList.get("referer");
    const isBotMode = link.mode === "bot";

    // Track the click — is_bot is based on the link's mode, not user-agent detection
    await supabaseAdmin.from("clicks").insert({
        link_id: link.id,
        user_agent: userAgent ? userAgent.slice(0, 512) : null,
        country: null,
        device_type: detectDevice(userAgent),
        is_bot: isBotMode,
        referrer: referer || null,
    });

    if (isBotMode) {
        // Bot mode: redirect to bot_redirect_url, or fall back to original_url
        const botDestination = link.bot_redirect_url || link.original_url;
        redirect(botDestination);
    }

    // Real mode: redirect to the destination URL
    redirect(link.original_url);
}
