import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { detectDevice, isBot, matchesCustomBotPatterns } from "@/lib/bot-detector";
import { cache } from "react";
import ClientRedirect from "@/components/ui/ClientRedirect";

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

/**
 * Determine if this request should be treated as a "bot" request.
 * - mode "bot"  → always bot
 * - mode "auto" → check built-in bot patterns + user's custom patterns
 * - mode "real" → never bot
 */
function shouldTreatAsBot(
    mode: string,
    userAgent: string | null,
    customPatterns: string | null
): boolean {
    if (mode === "bot") return true;
    if (mode === "auto") {
        return isBot(userAgent) || matchesCustomBotPatterns(userAgent, customPatterns);
    }
    return false;
}

export async function generateMetadata({ params }: PageProps) {
    const { shortCode } = await params;
    const link = await getLink(shortCode);

    if (!link) return {};

    // Always include bot meta tags so crawlers see them regardless of mode.
    // For "auto" mode we don't know the UA here, so include bot meta if available.
    const botTitle = link.bot_custom_title || link.custom_title || link.short_code;
    const botImage = link.bot_custom_image_url || link.custom_image_url;
    const realTitle = link.custom_title || link.short_code;
    const realImage = link.custom_image_url;

    // Use bot fields if mode is bot/auto, otherwise real fields
    const isBotLike = link.mode === "bot" || link.mode === "auto";
    const title = isBotLike ? botTitle : realTitle;
    const imageUrl = isBotLike ? (botImage || realImage) : realImage;
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

    const isBotRequest = shouldTreatAsBot(
        link.mode || "real",
        userAgent,
        link.bot_user_agents
    );

    // Track the click
    await supabaseAdmin.from("clicks").insert({
        link_id: link.id,
        user_agent: userAgent ? userAgent.slice(0, 512) : null,
        country: null,
        device_type: detectDevice(userAgent),
        is_bot: isBotRequest,
        referrer: referer || null,
    });

    if (isBotRequest) {
        // Bot request: serve a page with OG meta tags visible to crawlers.
        // Real browsers that matched bot UA patterns get redirected via client-side JS.
        const destination = link.bot_redirect_url || link.original_url;
        const botTitle = link.bot_custom_title || link.short_code;
        const botImage = link.bot_custom_image_url;

        return (
            <>
                <ClientRedirect url={destination} />
                <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
                    <h1 style={{ fontSize: "24px", color: "#111827" }}>{botTitle}</h1>
                    {botImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={botImage}
                            alt={botTitle}
                            style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "16px" }}
                        />
                    )}
                    <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "12px" }}>
                        Redirecting to the destination...
                    </p>
                </div>
            </>
        );
    }

    // Real mode: server-side redirect (instant, no page render)
    redirect(link.original_url);
}
