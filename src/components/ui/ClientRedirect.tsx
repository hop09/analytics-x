"use client";

import { useEffect } from "react";

/**
 * Client-side redirect component.
 * Crawlers/bots won't execute JavaScript, so they see the server-rendered meta tags.
 * Real browsers execute JS and get redirected immediately.
 */
export default function ClientRedirect({ url }: { url: string }) {
    useEffect(() => {
        window.location.replace(url);
    }, [url]);

    return (
        <noscript>
            <meta httpEquiv="refresh" content={`0;url=${url}`} />
        </noscript>
    );
}
