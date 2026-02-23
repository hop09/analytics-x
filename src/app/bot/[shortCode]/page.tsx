import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

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

    return {
        title: link.custom_title || link.short_code,
        openGraph: {
            title: link.custom_title || link.short_code,
            images: link.custom_image_url ? [{ url: link.custom_image_url }] : [],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: link.custom_title || link.short_code,
            images: link.custom_image_url ? [link.custom_image_url] : [],
        },
    };
}

export default async function BotPage({ params }: PageProps) {
    const { shortCode } = await params;
    const link = await getLink(shortCode);

    if (!link) {
        notFound();
    }

    if (link.alt_page_url) {
        redirect(link.alt_page_url);
    }

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: "24px", color: "#111827" }}>
                {link.custom_title || link.short_code}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Redirecting to the destination...
            </p>
        </div>
    );
}
