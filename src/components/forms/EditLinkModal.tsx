"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Type, ImageIcon, Wand2, Loader2, Users, Bot, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateLink } from "@/lib/actions";
import { uploadImage, compressImage } from "@/lib/image-utils";
import type { Link, LinkMode } from "@/lib/types";

interface EditLinkModalProps {
    link: Link;
    onClose: () => void;
    onSuccess: () => void;
}

interface ModeData {
    redirectUrl: string;
    title: string;
    imageUrl: string;
    imagePreview: string | null;
    imageFile: File | null;
}

export default function EditLinkModal({ link, onClose, onSuccess }: EditLinkModalProps) {
    const [mounted, setMounted] = useState(false);
    const [shortCode, setShortCode] = useState(link.short_code);
    const [mode, setMode] = useState<LinkMode>(link.mode || "real");

    // Initialize each mode with its own data from the database
    const [perMode, setPerMode] = useState<Record<LinkMode, ModeData>>({
        real: {
            redirectUrl: link.original_url || "",
            title: link.custom_title || "",
            imageUrl: link.custom_image_url || "",
            imagePreview: link.custom_image_url || null,
            imageFile: null,
        },
        bot: {
            redirectUrl: link.bot_redirect_url || "",
            title: link.bot_custom_title || "",
            imageUrl: link.bot_custom_image_url || "",
            imagePreview: link.bot_custom_image_url || null,
            imageFile: null,
        },
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // Convenience accessors for current mode
    const current = perMode[mode];
    const setCurrent = (patch: Partial<ModeData>) =>
        setPerMode((prev) => ({ ...prev, [mode]: { ...prev[mode], ...patch } }));

    const handleImageSelect = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        try {
            const previewUrl = URL.createObjectURL(file);
            setCurrent({ imagePreview: previewUrl });

            const compressed = await compressImage(file);
            setCurrent({ imageFile: compressed, imagePreview: previewUrl });

            const sizeMB = (compressed.size / 1024 / 1024).toFixed(2);
            const originalMB = (file.size / 1024 / 1024).toFixed(2);
            if (file.size !== compressed.size) {
                console.log(`Image compressed: ${originalMB}MB → ${sizeMB}MB`);
            }
        } catch {
            setError("Failed to process image");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageSelect(file);
    };

    const handleRemoveImage = () => {
        if (current.imagePreview && !current.imagePreview.startsWith("http")) {
            URL.revokeObjectURL(current.imagePreview);
        }
        setCurrent({ imagePreview: null, imageFile: null, imageUrl: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const realData = perMode.real;
        const botData = perMode.bot;

        if (!realData.redirectUrl.trim()) {
            setError("Real Visitor redirect URL is required");
            return;
        }

        if (!shortCode.trim()) {
            setError("Short code is required");
            return;
        }

        setLoading(true);

        try {
            setUploading(true);
            // Upload images for both modes if new files were selected
            let realImageUrl = realData.imageUrl;
            if (realData.imageFile) {
                realImageUrl = await uploadImage(realData.imageFile);
            }

            let botImageUrl = botData.imageUrl;
            if (botData.imageFile) {
                botImageUrl = await uploadImage(botData.imageFile);
            }
            setUploading(false);

            const result = await updateLink(link.id, {
                short_code: shortCode.trim(),
                original_url: realData.redirectUrl.trim(),
                custom_title: realData.title.trim() || null,
                custom_image_url: realImageUrl.trim() || null,
                bot_redirect_url: botData.redirectUrl.trim() || null,
                bot_custom_title: botData.title.trim() || null,
                bot_custom_image_url: botImageUrl.trim() || null,
                mode,
            });

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
            setUploading(false);
        }
    };

    const inputClasses = "w-full h-12 px-4 bg-surface/50 border border-border rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm text-text-primary placeholder:text-text-muted/50 transition-all font-mono";
    const labelClasses = "flex items-center gap-2 mb-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider";

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative w-full max-w-[480px] glass-panel bg-surface border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto"
                >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-500/20 blur-[40px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/50 relative z-10 shrink-0">
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Edit Link</h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-hover text-text-muted hover:text-text-primary transition-colors border border-transparent hover:border-border"
                    >
                        <X size={16} />
                    </motion.button>
                </div>

                <div className="overflow-y-auto w-full custom-scrollbar flex-1">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 relative z-10 w-full">
                        {/* Redirect URL (per-mode) */}
                        <div>
                            <div className={labelClasses}>
                                <Link2 size={14} className="text-indigo-400" />
                                <span>{mode === "real" ? "Real Visitor Redirect URL" : "Bot Mode Redirect URL"}</span>
                            </div>
                            <input
                                type="url"
                                value={current.redirectUrl}
                                onChange={(e) => setCurrent({ redirectUrl: e.target.value })}
                                placeholder={mode === "real" ? "https://example.com/real-destination" : "https://example.com/bot-destination"}
                                required={mode === "real"}
                                className={inputClasses}
                            />
                            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                                {mode === "real"
                                    ? "Where real visitors get redirected when clicking the link."
                                    : "Optional URL for bot/crawler landing page. Leave empty for a static preview page."}
                            </p>
                        </div>

                        {/* Short Code */}
                        <div>
                            <div className={labelClasses}>
                                <Wand2 size={14} className="text-purple-400" />
                                <span>Short Code</span>
                            </div>
                            <input
                                type="text"
                                value={shortCode}
                                onChange={(e) => setShortCode(e.target.value)}
                                placeholder="custom-alias"
                                required
                                className={inputClasses}
                            />
                        </div>

                        {/* Mode Toggle */}
                        <div>
                            <div className={labelClasses}>
                                {mode === "real" ? <Users size={14} className="text-emerald-400" /> : <Bot size={14} className="text-orange-400" />}
                                <span>Link Mode</span>
                            </div>
                            <div className="flex items-center gap-2 p-1 bg-surface/50 border border-border rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setMode("real")}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        mode === "real"
                                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                                            : "text-text-muted hover:text-text-secondary border border-transparent"
                                    }`}
                                >
                                    <Users size={14} />
                                    Real Visitor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("bot")}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        mode === "bot"
                                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-sm"
                                            : "text-text-muted hover:text-text-secondary border border-transparent"
                                    }`}
                                >
                                    <Bot size={14} />
                                    Bot Mode
                                </button>
                            </div>
                            <p className="text-[10px] text-text-muted mt-1.5 leading-relaxed">
                                {mode === "real"
                                    ? "Visitors are redirected to the URL. Social preview is shown only when the link is shared on social media."
                                    : "No redirect — everyone sees a landing page with the social preview below."}
                            </p>
                        </div>

                        {/* Social Preview Title */}
                        <div>
                            <div className={labelClasses}>
                                <Type size={14} className="text-indigo-400" />
                                <span>Social Preview Title</span>
                            </div>
                            <input
                                type="text"
                                value={current.title}
                                onChange={(e) => setCurrent({ title: e.target.value })}
                                placeholder={mode === "real" ? "Title shown in link previews" : "Title shown on landing page"}
                                className={inputClasses}
                            />
                            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                                {mode === "real"
                                    ? "Appears when the link is shared on Twitter, Discord, Slack, etc."
                                    : "Displayed as a heading on the meta landing page all visitors see."}
                            </p>
                        </div>

                        {/* Social Preview Image — file upload with compression */}
                        <div>
                            <div className={labelClasses}>
                                <ImageIcon size={14} className="text-indigo-400" />
                                <span>Social Preview Image</span>
                            </div>
                            <p className="text-[10px] text-text-muted mb-2 leading-relaxed">
                                {mode === "real"
                                    ? "Thumbnail shown in link previews on social platforms."
                                    : "Hero image displayed on the meta landing page."}
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <AnimatePresence mode="wait">
                                {current.imagePreview ? (
                                    <motion.div
                                        key={`preview-${mode}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative group rounded-xl overflow-hidden border border-border bg-surface/50"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={current.imagePreview}
                                            alt="Preview"
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold backdrop-blur-sm hover:bg-white/30 transition-colors"
                                            >
                                                Replace
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="px-3 py-1.5 rounded-lg bg-rose-500/60 text-white text-xs font-bold backdrop-blur-sm hover:bg-rose-500/80 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        {current.imageFile && (
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-mono">
                                                {(current.imageFile.size / 1024).toFixed(0)} KB
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`dropzone-${mode}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-indigo-500/40 bg-surface/30 hover:bg-surface/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                                    >
                                        <Upload size={20} className="text-text-muted group-hover:text-indigo-400 transition-colors" />
                                        <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">
                                            Click or drag image here
                                        </span>
                                        <span className="text-[10px] text-text-muted/60">
                                            Auto-compressed to optimal size
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mt-2"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={loading}
                            className="w-full h-12 mt-4 rounded-xl flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {uploading ? "Uploading image…" : "Saving…"}
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
            </div>
        </>,
        document.body
    );
}
