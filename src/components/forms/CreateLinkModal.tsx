"use client";

import { motion } from "framer-motion";
import { X, Link2, Type, ImageIcon, Globe, Wand2 } from "lucide-react";
import { useState } from "react";
import { createLink } from "@/lib/actions";
import { generateShortCode } from "@/lib/utils";

interface CreateLinkModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateLinkModal({ onClose, onSuccess }: CreateLinkModalProps) {
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [customTitle, setCustomTitle] = useState("");
    const [customImageUrl, setCustomImageUrl] = useState("");
    const [altPageUrl, setAltPageUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = () => {
        setShortCode(generateShortCode());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!originalUrl.trim()) {
            setError("URL is required");
            return;
        }

        const code = shortCode.trim() || generateShortCode();
        setLoading(true);

        const result = await createLink({
            short_code: code,
            original_url: originalUrl.trim(),
            custom_title: customTitle.trim() || undefined,
            custom_image_url: customImageUrl.trim() || undefined,
            alt_page_url: altPageUrl.trim() || undefined,
        });

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        onSuccess();
    };

    const inputClasses = "w-full h-12 px-4 bg-surface/50 border border-border rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm text-text-primary placeholder:text-text-muted/50 transition-all font-mono";
    const labelClasses = "flex items-center gap-2 mb-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-[480px] glass-panel bg-surface border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/20 blur-[40px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between p-6 border-b border-border/50 relative z-10 shrink-0">
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Create Short Link</h2>
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
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 relative z-10 w-full">
                        <div>
                            <div className={labelClasses}>
                                <Link2 size={14} className="text-indigo-400" />
                                <span>Destination URL</span>
                            </div>
                            <input
                                type="url"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                placeholder="https://example.com/your-long-url"
                                required
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <div className={labelClasses}>
                                <Wand2 size={14} className="text-purple-400" />
                                <span>Short Code</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shortCode}
                                    onChange={(e) => setShortCode(e.target.value)}
                                    placeholder="custom-alias"
                                    className={`${inputClasses} flex-1`}
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    className="h-12 px-5 rounded-xl border border-border bg-surface-hover hover:bg-surface-active text-text-primary text-xs font-bold transition-colors shrink-0"
                                >
                                    Auto
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className={labelClasses}>
                                <Type size={14} className="text-icon-muted" />
                                <span>Meta Title (Bots)</span>
                            </div>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                placeholder="Custom OG title"
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <div className={labelClasses}>
                                <ImageIcon size={14} className="text-icon-muted" />
                                <span>Meta Image (Bots)</span>
                            </div>
                            <input
                                type="url"
                                value={customImageUrl}
                                onChange={(e) => setCustomImageUrl(e.target.value)}
                                placeholder="https://example.com/preview.jpg"
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <div className={labelClasses}>
                                <Globe size={14} className="text-icon-muted" />
                                <span>Alt Page URL (Bots)</span>
                            </div>
                            <input
                                type="url"
                                value={altPageUrl}
                                onChange={(e) => setAltPageUrl(e.target.value)}
                                placeholder="https://example.com/landing-page"
                                className={inputClasses}
                            />
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
                            {loading ? "Creating..." : "Create Link"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}
