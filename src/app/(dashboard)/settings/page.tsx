import SettingsClient from "@/components/dashboard/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const isConfigured = supabaseUrl.length > 0 && hasServiceKey;

    let isConnected = false;
    if (isConfigured) {
        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/`, {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
                },
                cache: "no-store",
            });
            isConnected = res.ok;
        } catch {
            isConnected = false;
        }
    }

    return (
        <SettingsClient
            supabaseUrl={supabaseUrl}
            isConnected={isConnected}
        />
    );
}
