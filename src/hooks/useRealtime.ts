"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useRealtimeClicks(linkId?: string) {
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel(linkId ? `clicks-${linkId}` : "clicks-all")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "clicks",
                    ...(linkId ? { filter: `link_id=eq.${linkId}` } : {}),
                },
                () => {
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [linkId, router]);
}

export function useRealtimeLinks() {
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel("links-all")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "links",
                },
                () => {
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);
}
