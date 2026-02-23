"use client";

import { motion } from "framer-motion";
import { X, Link2, Type, Image, FileText, Wand2 } from "lucide-react";
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
    const [altPageContent, setAltPageContent] = useState("");
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
            alt_page_content: altPageContent.trim() || undefined,
        });

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        onSuccess();
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: "44px",
        padding: "0 16px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "13px",
        color: "#0f172a",
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
    };

    const labelStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px",
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(15,23,42,0.3)",
                    backdropFilter: "blur(8px)",
                }}
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "480px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    borderBottom: "1px solid #f1f5f9",
                }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Create Short Link</h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            cursor: "pointer",
                            background: "#f1f5f9",
                            color: "#64748b",
                            transition: "all 0.15s ease",
                        }}
                    >
                        <X size={16} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <div style={labelStyle}>
                                <Link2 size={14} style={{ color: "#94a3b8" }} />
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Destination URL</span>
                            </div>
                            <input
                                type="url"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                placeholder="https://example.com/your-long-url"
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(148,163,184,0.15)"; e.currentTarget.style.background = "#ffffff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                            />
                        </div>

                        <div>
                            <div style={labelStyle}>
                                <Wand2 size={14} style={{ color: "#94a3b8" }} />
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Short Code</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                    type="text"
                                    value={shortCode}
                                    onChange={(e) => setShortCode(e.target.value)}
                                    placeholder="custom-alias (auto-generated if empty)"
                                    style={{ ...inputStyle, flex: 1 }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(148,163,184,0.15)"; e.currentTarget.style.background = "#ffffff"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    style={{
                                        height: "44px",
                                        padding: "0 16px",
                                        borderRadius: "12px",
                                        border: "1px solid #e2e8f0",
                                        background: "#f8fafc",
                                        color: "#64748b",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div>
                            <div style={labelStyle}>
                                <Type size={14} style={{ color: "#94a3b8" }} />
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Meta Title (for bots)</span>
                            </div>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                placeholder="Custom OG title for social previews"
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(148,163,184,0.15)"; e.currentTarget.style.background = "#ffffff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                            />
                        </div>

                        <div>
                            <div style={labelStyle}>
                                <Image size={14} style={{ color: "#94a3b8" }} />
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Meta Image URL (for bots)</span>
                            </div>
                            <input
                                type="url"
                                value={customImageUrl}
                                onChange={(e) => setCustomImageUrl(e.target.value)}
                                placeholder="https://example.com/preview-image.jpg"
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(148,163,184,0.15)"; e.currentTarget.style.background = "#ffffff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                            />
                        </div>

                        <div>
                            <div style={labelStyle}>
                                <FileText size={14} style={{ color: "#94a3b8" }} />
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Alt Page Content (optional)</span>
                            </div>
                            <textarea
                                value={altPageContent}
                                onChange={(e) => setAltPageContent(e.target.value)}
                                placeholder="Alternative page HTML shown to bots..."
                                rows={3}
                                style={{
                                    ...inputStyle,
                                    height: "auto",
                                    padding: "12px 16px",
                                    resize: "none" as const,
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(148,163,184,0.15)"; e.currentTarget.style.background = "#ffffff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#f8fafc"; }}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: "16px",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                color: "#dc2626",
                                fontSize: "12px",
                                fontWeight: 500,
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "48px",
                            marginTop: "20px",
                            borderRadius: "14px",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "inherit",
                            background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                            boxShadow: "0 4px 12px rgba(15,23,42,0.3)",
                            opacity: loading ? 0.6 : 1,
                            transition: "all 0.2s ease",
                        }}
                    >
                        {loading ? "Creating..." : "Create Link"}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}
