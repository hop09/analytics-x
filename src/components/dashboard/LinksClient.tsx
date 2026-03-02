"use client";

import PageTransition from "@/components/ui/PageTransition";
import CreateLinkModal from "@/components/forms/CreateLinkModal";
import EditLinkModal from "@/components/forms/EditLinkModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, Search, Link2, Check, BarChart3, Globe, AlertTriangle, Pencil, Users, Bot, Radar } from "lucide-react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { deleteLink, toggleLinkMode } from "@/lib/actions";
import type { Link, LinkMode } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRealtimeClicks, useRealtimeLinks } from "@/hooks/useRealtime";

interface LinksClientProps {
    initialLinks: (Link & { click_count: number })[];
}

export default function LinksClient({ initialLinks }: LinksClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingLink, setEditingLink] = useState<(Link & { click_count: number }) | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useRealtimeClicks();
    useRealtimeLinks();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredLinks = useMemo(
        () =>
            initialLinks.filter(
                (link) =>
                    link.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (link.custom_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    link.original_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (link.bot_redirect_url || "").toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [initialLinks, searchQuery]
    );

    const handleCopy = async (shortCode: string, id: string) => {
        const url = `${window.location.origin}/${shortCode}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = useCallback(async (id: string) => {
        setDeletingId(id);
        await deleteLink(id);
        router.refresh();
        setDeletingId(null);
        setConfirmDeleteId(null);
    }, [router]);

    const handleToggleMode = useCallback(async (id: string, currentMode: LinkMode) => {
        setTogglingId(id);
        const newMode: LinkMode = currentMode === "real" ? "bot" : currentMode === "bot" ? "auto" : "real";
        await toggleLinkMode(id, newMode);
        router.refresh();
        setTogglingId(null);
    }, [router]);

    return (
        <PageTransition>
            <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                            Link Center
                        </h1>
                        <p className="text-sm text-text-muted mt-1 sm:mt-2">
                            Manage and track your shortened URLs
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between w-full">
                    <div className="relative w-full sm:max-w-lg group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-10" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                            <Search className="w-5 h-5 text-text-muted group-focus-within:text-accent-indigo transition-colors duration-300" />
                        </div>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search links..."
                            className="w-full h-12 sm:h-14 pl-12 pr-4 bg-surface/50 border border-border rounded-2xl focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 text-sm sm:text-base text-text-primary shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-text-muted/50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                            <kbd className="px-2 py-1 bg-surface-hover rounded-md text-[10px] font-mono text-text-muted border border-border">Ctrl</kbd>
                            <kbd className="px-2 py-1 bg-surface-hover rounded-md text-[10px] font-mono text-text-muted border border-border">K</kbd>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl flex items-center justify-center gap-2.5 text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:via-indigo-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:shadow-[0_0_32px_rgba(99,102,241,0.45)] font-semibold text-sm sm:text-base shrink-0"
                    >
                        <Plus size={20} />
                        <span>Create Link</span>
                    </motion.button>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredLinks.map((link, index) => (
                            <motion.div
                                key={link.id}
                                layout
                                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                animate={{ opacity: deletingId === link.id ? 0.4 : 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="glass-panel p-3 sm:p-5 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3 sm:gap-5 sm:flex-row sm:items-center justify-between group hover:border-border-hover relative overflow-hidden"
                            >
                                <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                                    {/* Hover glow line */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-hover flex items-center justify-center shrink-0 border border-border relative overflow-hidden transition-all duration-300 group-hover:border-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/5">
                                        <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 relative z-10" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap mb-1.5">
                                            <span className="text-base font-bold text-text-primary tracking-tight">
                                                <span className="text-text-muted font-normal select-none">/</span>{link.short_code}
                                            </span>
                                            {(() => {
                                                const m = link.mode || "real";
                                                const title = m === "bot" || m === "auto"
                                                    ? (link.bot_custom_title || link.custom_title)
                                                    : link.custom_title;
                                                return title ? (
                                                    <span className="text-xs font-semibold text-text-secondary">
                                                        {title}
                                                    </span>
                                                ) : null;
                                            })()}
                                        </div>
                                        <p className="text-sm text-text-muted truncate mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            {((link.mode || "real") === "bot" || (link.mode || "real") === "auto") && link.bot_redirect_url
                                                ? link.bot_redirect_url
                                                : link.original_url}
                                        </p>
                                        <div className="flex items-center gap-4 flex-wrap text-[11px] font-medium text-text-muted/60">
                                            <span className="flex items-center gap-1.5">
                                                <BarChart3 className="w-3.5 h-3.5" />
                                                <span className="text-indigo-400">{link.click_count.toLocaleString()} clicks</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 font-mono">
                                                {timeAgo(link.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto overflow-x-touch">
                                    {/* Mode Toggle */}
                                    <button
                                        onClick={() => handleToggleMode(link.id, link.mode || "real")}
                                        disabled={togglingId === link.id}
                                        className={`h-9 sm:h-10 px-3 sm:px-4 flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border hover:scale-105 active:scale-95 disabled:opacity-50 ${
                                            (link.mode || "real") === "real"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
                                                : (link.mode || "real") === "bot"
                                                ? "bg-orange-500/10 text-orange-400 border-orange-500/25 hover:bg-orange-500/20"
                                                : "bg-sky-500/10 text-sky-400 border-sky-500/25 hover:bg-sky-500/20"
                                        }`}
                                        title={`Mode: ${(link.mode || "real") === "real" ? "Real Visitor" : (link.mode || "real") === "bot" ? "Bot" : "Auto Detect"} — click to toggle`}
                                    >
                                        {(link.mode || "real") === "real" ? <Users className="w-3.5 h-3.5" /> : (link.mode || "real") === "bot" ? <Bot className="w-3.5 h-3.5" /> : <Radar className="w-3.5 h-3.5" />}
                                        <span>{(link.mode || "real") === "real" ? "Real" : (link.mode || "real") === "bot" ? "Bot" : "Auto"}</span>
                                    </button>
                                    <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />
                                    <button
                                        onClick={() => handleCopy(link.short_code, link.id)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-surface-active hover:text-text-primary text-text-muted transition-all duration-200 border border-transparent hover:border-border hover:scale-105 active:scale-95"
                                        title="Copy Link"
                                    >
                                        {copiedId === link.id ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                    </button>
                                    <button
                                        onClick={() => setEditingLink(link)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-surface-active hover:text-text-primary text-text-muted transition-all duration-200 border border-transparent hover:border-border hover:scale-105 active:scale-95"
                                        title="Edit Link"
                                    >
                                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/analytics/${link.id}`)}
                                        onMouseEnter={() => router.prefetch(`/analytics/${link.id}`)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-indigo-500/10 hover:text-accent-indigo text-text-muted transition-all duration-200 border border-transparent hover:border-indigo-500/20 hover:scale-105 active:scale-95"
                                        title="View Analytics"
                                    >
                                        <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const m = link.mode || "real";
                                            const url = (m === "bot" || m === "auto") && link.bot_redirect_url
                                                ? link.bot_redirect_url
                                                : link.original_url;
                                            window.open(url, "_blank", "noopener,noreferrer");
                                        }}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-surface-active hover:text-text-primary text-text-muted transition-all duration-200 border border-transparent hover:border-border hover:scale-105 active:scale-95"
                                        title="Open Original URL"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />
                                    <button
                                        onClick={() => setConfirmDeleteId(link.id)}
                                        disabled={deletingId === link.id}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all duration-200 border border-transparent hover:border-rose-500/20 disabled:opacity-50 hover:scale-105 active:scale-95"
                                        title="Delete Link"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredLinks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-panel rounded-3xl text-center py-24 flex flex-col items-center justify-center border-dashed border-2 border-border/50"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 blur-2xl bg-indigo-500/10 rounded-full" />
                                <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center relative z-10 border border-border shadow-inner">
                                    {searchQuery ? (
                                        <Search className="w-6 h-6 text-icon-muted" />
                                    ) : (
                                        <Link2 className="w-6 h-6 text-indigo-400" />
                                    )}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">
                                {searchQuery ? "No matching links" : "You have no active links"}
                            </h3>
                            <p className="text-sm text-text-muted max-w-sm">
                                {searchQuery
                                    ? "Try adjusting your search query or command to find what you're looking for."
                                    : "Create a powerful short link to get started tracking your traffic."}
                            </p>
                            {!searchQuery && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowModal(true)}
                                    className="mt-8 px-6 py-2.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-semibold hover:bg-indigo-500/20 transition-colors"
                                >
                                    Create Link +
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </div>
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

            <AnimatePresence>
                {editingLink && (
                    <EditLinkModal
                        link={editingLink}
                        onClose={() => setEditingLink(null)}
                        onSuccess={() => {
                            setEditingLink(null);
                            router.refresh();
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmDeleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setConfirmDeleteId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-sm glass-panel rounded-3xl p-8 flex flex-col items-center gap-5 text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                <AlertTriangle className="w-7 h-7 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">Delete Link?</h3>
                                <p className="text-sm text-text-muted mt-1.5">This action cannot be undone. All analytics data for this link will be permanently removed.</p>
                            </div>
                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="flex-1 h-11 rounded-xl bg-surface-hover border border-border text-sm font-semibold text-text-primary hover:bg-surface-active transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmDeleteId)}
                                    disabled={deletingId === confirmDeleteId}
                                    className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    {deletingId === confirmDeleteId ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
