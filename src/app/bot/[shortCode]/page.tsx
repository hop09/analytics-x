import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { headers } from "next/headers";
import { detectDevice } from "@/lib/bot-detector";

// Ensure every visit runs the page function (no caching)
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

    // Bot page always uses bot-specific fields (fallback to real fields)
    const title = link.bot_custom_title || link.custom_title || link.short_code;
    const imageUrl = link.bot_custom_image_url || link.custom_image_url;

    return {
        title,
        openGraph: {
            title,
            images: imageUrl ? [{ url: imageUrl }] : [],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function BotPage({ params }: PageProps) {
    const { shortCode } = await params;
    const link = await getLink(shortCode);

    if (!link) {
        notFound();
    }

    // Track as bot visit (direct /bot/ access always counted as bot)
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const referer = headersList.get("referer");

    await supabaseAdmin.from("clicks").insert({
        link_id: link.id,
        user_agent: userAgent ? userAgent.slice(0, 512) : null,
        country: null,
        device_type: detectDevice(userAgent),
        is_bot: true,
        referrer: referer || null,
    });

    // Render the social preview / meta page for bot access — use bot-specific fields
    const botTitle = link.bot_custom_title || link.custom_title || link.short_code;
    const botImage = link.bot_custom_image_url || link.custom_image_url;

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: "24px", color: "#111827" }}>
                {botTitle}
            </h1>
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
    );
}
