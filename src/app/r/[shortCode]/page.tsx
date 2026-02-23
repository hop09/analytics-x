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
    const referer = headersList.get("referer");

    await supabaseAdmin.from("clicks").insert({
        link_id: link.id,
        user_agent: userAgent || null,
        country: null,
        device_type: detectDevice(userAgent),
        is_bot: false,
        referrer: referer || null,
    });

    redirect(link.original_url);
}
