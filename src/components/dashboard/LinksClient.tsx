"use client";

import PageTransition from "@/components/ui/PageTransition";
import CreateLinkModal from "@/components/forms/CreateLinkModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, Search, Link2, Check, BarChart3, Globe, AlertTriangle } from "lucide-react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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

    const handleDelete = useCallback(async (id: string) => {
        setDeletingId(id);
        await deleteLink(id);
        router.refresh();
        setDeletingId(null);
        setConfirmDeleteId(null);
    }, [router]);

    return (
        <PageTransition>
            <div className="max-w-[1200px] mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                            Link Center
                        </h1>
                        <p className="text-sm text-text-muted mt-2">
                            Manage and track your shortened URLs
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
                    <div className="relative w-full sm:max-w-lg group">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                            <Search className="w-5 h-5 text-text-muted group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to search links..."
                            className="w-full h-14 pl-12 pr-4 bg-surface/50 border border-border rounded-2xl focus:outline-none focus:border-indigo-500/50 text-base text-text-primary shadow-inner backdrop-blur-md transition-all placeholder:text-text-muted/50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                            <kbd className="px-2 py-1 bg-surface-hover rounded-md text-[10px] font-mono text-text-muted border border-border">Ctrl</kbd>
                            <kbd className="px-2 py-1 bg-surface-hover rounded-md text-[10px] font-mono text-text-muted border border-border">K</kbd>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] font-semibold shrink-0"
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
                                className="glass-panel p-4 sm:p-5 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
                            >
                                <div className="flex items-center gap-5 min-w-0 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-surface-hover flex items-center justify-center shrink-0 border border-border relative overflow-hidden">
                                        <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Link2 className="w-5 h-5 text-indigo-400 relative z-10" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap mb-1.5">
                                            <span className="text-base font-bold text-text-primary tracking-tight">
                                                <span className="text-text-muted font-normal select-none">/</span>{link.short_code}
                                            </span>
                                            {link.custom_title && (
                                                <span className="text-xs font-semibold text-text-secondary">
                                                    {link.custom_title}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-muted truncate mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            {link.original_url}
                                        </p>
                                        <div className="flex items-center gap-4 text-[11px] font-medium text-text-muted/60">
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

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleCopy(link.short_code, link.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-surface-active hover:text-text-primary text-text-muted transition-colors border border-transparent hover:border-border"
                                        title="Copy Link"
                                    >
                                        {copiedId === link.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => router.push(`/analytics/${link.id}`)}
                                        onMouseEnter={() => router.prefetch(`/analytics/${link.id}`)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-surface-active hover:text-text-primary text-text-muted transition-colors border border-transparent hover:border-border"
                                        title="View Analytics"
                                    >
                                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                                    </button>
                                    <button
                                        onClick={() => window.open(link.original_url, "_blank", "noopener,noreferrer")}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-surface-active hover:text-text-primary text-text-muted transition-colors border border-transparent hover:border-border"
                                        title="Open Original URL"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
                                    <button
                                        onClick={() => setConfirmDeleteId(link.id)}
                                        disabled={deletingId === link.id}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors border border-transparent hover:border-rose-500/20 disabled:opacity-50"
                                        title="Delete Link"
                                    >
                                        <Trash2 className="w-4 h-4" />
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
