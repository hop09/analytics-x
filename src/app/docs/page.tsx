"use client";

import { motion } from "framer-motion";
import {
    Book,
    Link2,
    BarChart3,
    Plus,
    Trash2,
    Pencil,
    ArrowRight,
    Zap,
    Copy,
    Check,
    ChevronDown,
    Activity,
} from "lucide-react";
import { useState } from "react";

/* ── Types ────────────────────────────────────── */
interface Endpoint {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    path: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    params?: { name: string; type: string; required: boolean; description: string }[];
    bodyFields?: { name: string; type: string; required: boolean; description: string }[];
    queryParams?: { name: string; type: string; required: boolean; description: string }[];
    exampleRequest?: string;
    exampleResponse: string;
    statusCodes: { code: number; description: string }[];
}

/* ── Data ─────────────────────────────────────── */
const BASE_PATH = "/api";

const endpoints: Endpoint[] = [
    {
        method: "GET",
        path: "/api/links",
        title: "List All Links",
        description: "Returns a paginated list of all short links with their click counts.",
        icon: <Link2 size={18} />,
        queryParams: [
            { name: "limit", type: "number", required: false, description: "Max results per page (1-200, default 50)" },
            { name: "offset", type: "number", required: false, description: "Number of results to skip (default 0)" },
        ],
        exampleRequest: `curl ${BASE_PATH}/links?limit=10&offset=0`,
        exampleResponse: `{
  "data": [
    {
      "id": "uuid-1234",
      "short_code": "abc123",
      "original_url": "https://example.com",
      "custom_title": "My Link",
      "custom_image_url": null,
      "mode": "real",
      "created_at": "2026-02-24T12:00:00Z",
      "click_count": 42
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}`,
        statusCodes: [
            { code: 200, description: "Success" },
            { code: 500, description: "Internal server error" },
        ],
    },
    {
        method: "POST",
        path: "/api/links",
        title: "Create Link",
        description: "Create a new short link. A random short code is generated if not provided.",
        icon: <Plus size={18} />,
        bodyFields: [
            { name: "original_url", type: "string", required: true, description: "The redirect URL (destination)" },
            { name: "short_code", type: "string", required: false, description: "Custom short code (1-50 chars: a-z, A-Z, 0-9, -, _). Auto-generated if omitted" },
            { name: "custom_title", type: "string", required: false, description: "Custom OG / social preview title" },
            { name: "custom_image_url", type: "string", required: false, description: "Custom OG / social preview image URL" },
            { name: "mode", type: "string", required: false, description: "Link mode: 'real' (redirect) or 'bot' (show meta page). Default: 'real'" },
        ],
        exampleRequest: `curl -X POST ${BASE_PATH}/links \\
  -H "Content-Type: application/json" \\
  -d '{
    "original_url": "https://example.com/long-url",
    "short_code": "my-link",
    "custom_title": "My Link Title"
  }'`,
        exampleResponse: `{
  "data": {
    "id": "uuid-1234",
    "short_code": "my-link",
    "original_url": "https://example.com/long-url",
    "custom_title": "My Link Title",
    "custom_image_url": null,
    "mode": "real",
    "created_at": "2026-02-24T12:00:00Z"
  }
}`,
        statusCodes: [
            { code: 201, description: "Link created successfully" },
            { code: 400, description: "Validation error (missing/invalid fields)" },
            { code: 409, description: "Short code already taken" },
            { code: 500, description: "Internal server error" },
        ],
    },
    {
        method: "GET",
        path: "/api/links/:id",
        title: "Get Link & Stats",
        description: "Retrieve a single link with full analytics: click counts, top countries, devices, referrers, and clicks over time.",
        icon: <BarChart3 size={18} />,
        params: [
            { name: "id", type: "string (UUID)", required: true, description: "The link ID" },
        ],
        exampleRequest: `curl ${BASE_PATH}/links/uuid-1234`,
        exampleResponse: `{
  "data": {
    "id": "uuid-1234",
    "short_code": "abc123",
    "original_url": "https://example.com",
    "custom_title": null,
    "custom_image_url": null,
    "mode": "real",
    "created_at": "2026-02-24T12:00:00Z",
    "stats": {
      "total_clicks": 42,
      "human_clicks": 38,
      "bot_clicks": 4,
      "top_countries": [
        { "country": "US", "count": 20 }
      ],
      "top_devices": [
        { "device": "Mobile", "count": 25 }
      ],
      "top_referrers": [
        { "referrer": "twitter.com", "count": 15 }
      ],
      "clicks_over_time": [
        { "date": "2026-02-24", "count": 10 }
      ],
      "top_user_agents": [
        { "user_agent": "Mozilla/5.0...", "count": 30, "is_bot": false }
      ]
    }
  }
}`,
        statusCodes: [
            { code: 200, description: "Success" },
            { code: 404, description: "Link not found" },
            { code: 500, description: "Internal server error" },
        ],
    },
    {
        method: "PATCH",
        path: "/api/links/:id",
        title: "Update Link",
        description: "Update one or more fields of an existing link. Only provided fields are changed.",
        icon: <Pencil size={18} />,
        params: [
            { name: "id", type: "string (UUID)", required: true, description: "The link ID" },
        ],
        bodyFields: [
            { name: "original_url", type: "string", required: false, description: "New redirect URL" },
            { name: "custom_title", type: "string | null", required: false, description: "New social preview title (null to clear)" },
            { name: "custom_image_url", type: "string | null", required: false, description: "New social preview image URL (null to clear)" },
            { name: "mode", type: "string", required: false, description: "Link mode: 'real' or 'bot'" },
        ],
        exampleRequest: `curl -X PATCH ${BASE_PATH}/links/uuid-1234 \\
  -H "Content-Type: application/json" \\
  -d '{ "custom_title": "Updated Title" }'`,
        exampleResponse: `{
  "data": {
    "id": "uuid-1234",
    "short_code": "abc123",
    "original_url": "https://example.com",
    "custom_title": "Updated Title",
    "custom_image_url": null,
    "mode": "real",
    "created_at": "2026-02-24T12:00:00Z"
  }
}`,
        statusCodes: [
            { code: 200, description: "Updated successfully" },
            { code: 400, description: "No valid fields provided / invalid URL" },
            { code: 404, description: "Link not found" },
            { code: 500, description: "Internal server error" },
        ],
    },
    {
        method: "DELETE",
        path: "/api/links/:id",
        title: "Delete Link",
        description: "Permanently delete a link and all its associated click data.",
        icon: <Trash2 size={18} />,
        params: [
            { name: "id", type: "string (UUID)", required: true, description: "The link ID" },
        ],
        exampleRequest: `curl -X DELETE ${BASE_PATH}/links/uuid-1234`,
        exampleResponse: `{
  "message": "Link deleted successfully"
}`,
        statusCodes: [
            { code: 200, description: "Deleted successfully" },
            { code: 500, description: "Internal server error" },
        ],
    },
    {
        method: "GET",
        path: "/api/stats",
        title: "Global Stats",
        description: "Get aggregated dashboard statistics across all links.",
        icon: <Activity size={18} />,
        exampleRequest: `curl ${BASE_PATH}/stats`,
        exampleResponse: `{
  "data": {
    "total_links": 12,
    "total_clicks": 1458,
    "human_clicks": 1320,
    "bot_clicks": 138
  }
}`,
        statusCodes: [
            { code: 200, description: "Success" },
            { code: 500, description: "Internal server error" },
        ],
    },
];

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
    GET: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    POST: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    PATCH: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    DELETE: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

/* ── Components ───────────────────────────────── */

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-border" title="Copy">
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
    );
}

function MethodBadge({ method }: { method: string }) {
    const c = methodColors[method] || methodColors.GET;
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wider uppercase ${c.bg} ${c.text} border ${c.border}`}>
            {method}
        </span>
    );
}

function EndpointCard({ endpoint, index }: { endpoint: Endpoint; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
            id={endpoint.method.toLowerCase() + "-" + endpoint.path.replace(/[/:]/g, "-").replace(/^-/, "")}
            className="glass-panel rounded-2xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full p-5 sm:p-6 flex items-center gap-4 text-left hover:bg-surface-hover/50 transition-colors group"
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${methodColors[endpoint.method]?.bg} ${methodColors[endpoint.method]?.text} border ${methodColors[endpoint.method]?.border}`}>
                    {endpoint.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                        <MethodBadge method={endpoint.method} />
                        <code className="text-sm font-bold text-text-primary font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-text-muted">{endpoint.title}</p>
                </div>
                <ChevronDown size={18} className={`text-text-muted transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-border/50 px-5 sm:px-6 pb-6 pt-4 space-y-5"
                >
                    <p className="text-sm text-text-secondary leading-relaxed">{endpoint.description}</p>

                    {/* URL Params */}
                    {endpoint.params && endpoint.params.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">URL Parameters</h4>
                            <div className="space-y-2">
                                {endpoint.params.map((p) => (
                                    <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/50">
                                        <code className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md shrink-0">{p.name}</code>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs text-text-muted">{p.type}</span>
                                            {p.required && <span className="text-[10px] text-rose-400 font-bold ml-2">REQUIRED</span>}
                                            <p className="text-xs text-text-secondary mt-0.5">{p.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Query Params */}
                    {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Query Parameters</h4>
                            <div className="space-y-2">
                                {endpoint.queryParams.map((p) => (
                                    <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/50">
                                        <code className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md shrink-0">{p.name}</code>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs text-text-muted">{p.type}</span>
                                            {p.required && <span className="text-[10px] text-rose-400 font-bold ml-2">REQUIRED</span>}
                                            <p className="text-xs text-text-secondary mt-0.5">{p.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Body Fields */}
                    {endpoint.bodyFields && endpoint.bodyFields.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Request Body <span className="text-text-muted/60 font-normal">(JSON)</span></h4>
                            <div className="space-y-2">
                                {endpoint.bodyFields.map((f) => (
                                    <div key={f.name} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/50">
                                        <code className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-md shrink-0">{f.name}</code>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs text-text-muted">{f.type}</span>
                                            {f.required && <span className="text-[10px] text-rose-400 font-bold ml-2">REQUIRED</span>}
                                            <p className="text-xs text-text-secondary mt-0.5">{f.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Example Request */}
                    {endpoint.exampleRequest && (
                        <div>
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Example Request</h4>
                            <div className="relative rounded-xl bg-background border border-border overflow-hidden">
                                <CopyButton text={endpoint.exampleRequest} />
                                <pre className="p-4 pr-12 text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap break-all">
                                    {endpoint.exampleRequest}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Example Response */}
                    <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Example Response</h4>
                        <div className="relative rounded-xl bg-background border border-border overflow-hidden">
                            <CopyButton text={endpoint.exampleResponse} />
                            <pre className="p-4 pr-12 text-xs font-mono text-emerald-400/80 overflow-x-auto whitespace-pre-wrap break-all">
                                {endpoint.exampleResponse}
                            </pre>
                        </div>
                    </div>

                    {/* Status Codes */}
                    <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Status Codes</h4>
                        <div className="flex flex-wrap gap-2">
                            {endpoint.statusCodes.map((s) => (
                                <div key={s.code} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${s.code < 300
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : s.code < 500
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    }`}>
                                    <span>{s.code}</span>
                                    <span className="font-medium opacity-70">{s.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

/* ── Page ──────────────────────────────────────── */
export default function ApiDocsPage() {
    return (
        <div className="min-h-dvh bg-background text-text-primary">
            <div className="max-w-[900px] mx-auto px-3 sm:px-6 py-6 sm:py-10 md:py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Zap size={22} className="text-white fill-white" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                            <Book size={12} />
                            API Docs
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight mb-3">
                        REST API Reference
                    </h1>
                    <p className="text-base text-text-muted max-w-2xl leading-relaxed">
                        Public API for creating and managing short links, retrieving analytics,
                        and accessing global statistics. <strong className="text-text-secondary">No authentication required.</strong>
                    </p>
                </motion.div>

                {/* Base URL */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="glass-panel rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider shrink-0">Base URL</span>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ArrowRight size={14} className="text-indigo-400 shrink-0" />
                        <code className="text-sm font-mono font-bold text-text-primary break-all">
                            {"https://<your-domain>"}
                        </code>
                    </div>
                </motion.div>

                {/* Quick Nav */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="glass-panel rounded-2xl p-5 mb-10"
                >
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Endpoints</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {endpoints.map((ep) => (
                            <a
                                key={ep.method + ep.path}
                                href={"#" + ep.method.toLowerCase() + "-" + ep.path.replace(/[/:]/g, "-").replace(/^-/, "")}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-hover transition-colors group"
                            >
                                <MethodBadge method={ep.method} />
                                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors font-mono">{ep.path}</span>
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Endpoints */}
                <div className="space-y-4">
                    {endpoints.map((ep, i) => (
                        <EndpointCard key={ep.method + ep.path} endpoint={ep} index={i} />
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 pt-8 border-t border-border/50 text-center"
                >
                    <p className="text-xs text-text-muted">
                        HOP Analytics API &middot; All endpoints are public &middot; No rate limiting applied
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
