"use client";

import PageTransition from "@/components/ui/PageTransition";
import CreateLinkModal from "@/components/forms/CreateLinkModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, Search, Link2, Check, BarChart3 } from "lucide-react";
import { useState, useMemo } from "react";
import { deleteLink } from "@/lib/actions";
import type { Link } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRealtimeClicks, useRealtimeLinks } from "@/hooks/useRealtime";

interface LinksClientProps {
    initialLinks: (Link & { click_count: number })[];
}

export default function LinksClient({ initialLinks }: LinksClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useRealtimeClicks();
    useRealtimeLinks();

    const filteredLinks = useMemo(
        () =>
            initialLinks.filter(
                (link) =>
                    link.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (link.custom_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    link.original_url.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [initialLinks, searchQuery]
    );

    const handleCopy = async (shortCode: string, id: string) => {
        const url = `${window.location.origin}/${shortCode}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteLink(id);
        router.refresh();
        setDeletingId(null);
    };

    const iconBtnStyle: React.CSSProperties = {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        transition: "all 0.15s ease",
        background: "transparent",
        color: "#94a3b8",
    };

    return (
        <PageTransition>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Links</h1>
                    <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "6px" }}>Manage your shortened URLs</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                        boxShadow: "0 4px 12px rgba(15,23,42,0.3)",
                    }}
                >
                    <Plus size={20} />
                </motion.button>
            </div>

            <div style={{ position: "relative", marginBottom: "24px" }}>
                <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#cbd5e1" }} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search links..."
                    style={{
                        width: "100%",
                        height: "48px",
                        paddingLeft: "48px",
                        paddingRight: "16px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        fontSize: "14px",
                        color: "#0f172a",
                        outline: "none",
                        transition: "all 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#94a3b8";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(148,163,184,0.15)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                    }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <AnimatePresence mode="popLayout">
                    {filteredLinks.map((link, index) => (
                        <motion.div
                            key={link.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: deletingId === link.id ? 0.4 : 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "16px",
                                padding: "20px 24px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                                e.currentTarget.style.borderColor = "#cbd5e1";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)";
                                e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0, flex: 1 }}>
                                    <div style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "12px",
                                        background: "#f1f5f9",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        <Link2 size={20} style={{ color: "#64748b" }} />
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                                                /{link.short_code}
                                            </span>
                                            {link.custom_title && (
                                                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                                                    · {link.custom_title}
                                                </span>
                                            )}
                                            <span style={{
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                padding: "3px 8px",
                                                borderRadius: "6px",
                                                background: "#f1f5f9",
                                                color: "#64748b",
                                            }}>
                                                {link.click_count.toLocaleString()} clicks
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "4px" }}>
                                            {link.original_url}
                                        </p>
                                        <p style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
                                            {timeAgo(link.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "16px" }}>
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => handleCopy(link.short_code, link.id)}
                                        style={iconBtnStyle}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                    >
                                        {copiedId === link.id ? <Check size={16} style={{ color: "#059669" }} /> : <Copy size={16} />}
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => router.push(`/analytics/${link.id}`)}
                                        style={iconBtnStyle}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#f1f5f9";
                                            e.currentTarget.style.color = "#0f172a";
                                            router.prefetch(`/analytics/${link.id}`);
                                        }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                    >
                                        <BarChart3 size={16} />
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => window.open(link.original_url, "_blank")}
                                        style={iconBtnStyle}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                    >
                                        <ExternalLink size={16} />
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(link.id)}
                                        disabled={deletingId === link.id}
                                        style={{ ...iconBtnStyle, opacity: deletingId === link.id ? 0.3 : 1 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredLinks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: "center", padding: "60px 0" }}
                    >
                        <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}>
                            {searchQuery ? (
                                <Search size={24} style={{ color: "#cbd5e1" }} />
                            ) : (
                                <Link2 size={24} style={{ color: "#cbd5e1" }} />
                            )}
                        </div>
                        <p style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>
                            {searchQuery ? "No links found" : "No links yet"}
                        </p>
                        {!searchQuery && (
                            <p style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>
                                Create your first short link to get started
                            </p>
                        )}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <CreateLinkModal
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            setShowModal(false);
                            router.refresh();
                        }}
                    />
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
