import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { detectDevice } from "@/lib/bot-detector";

interface PageProps {
    params: Promise<{ shortCode: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
    const { shortCode } = await params;

    const { data: link } = await supabaseAdmin
        .from("links")
        .select("*")
        .eq("short_code", shortCode)
        .single();

    if (!link) {
        notFound();
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent");
    const forwardedFor = headersList.get("x-forwarded-for");
    const referer = headersList.get("referer");

    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/clicks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            Prefer: "return=minimal",
        },
        body: JSON.stringify({
            link_id: link.id,
            user_agent: userAgent || null,
            country: null,
            device_type: detectDevice(userAgent),
            is_bot: false,
            referrer: referer || null,
        }),
    }).catch(() => { });

    redirect(link.original_url);
}
