import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ shortCode: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { shortCode } = await params;

    const { data: link } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("short_code", shortCode)
        .single();

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

    const { data: link } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("short_code", shortCode)
        .single();

    if (!link) {
        notFound();
    }

    return (
        <html lang="en">
            <head>
                <meta property="og:title" content={link.custom_title || link.short_code} />
                {link.custom_image_url && (
                    <meta property="og:image" content={link.custom_image_url} />
                )}
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={link.custom_title || link.short_code} />
                {link.custom_image_url && (
                    <meta name="twitter:image" content={link.custom_image_url} />
                )}
            </head>
            <body>
                <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
                    <h1 style={{ fontSize: "24px", color: "#111827" }}>
                        {link.custom_title || link.short_code}
                    </h1>
                    {link.alt_page_content ? (
                        <div dangerouslySetInnerHTML={{ __html: link.alt_page_content }} />
                    ) : (
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            Redirecting to the destination...
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
