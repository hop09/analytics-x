"use client";

import PageTransition from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
import {
    Database,
    ShieldCheck,
    Bell,
    Palette,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface SettingsClientProps {
    supabaseUrl: string;
    isConnected: boolean;
}

export default function SettingsClient({ supabaseUrl, isConnected }: SettingsClientProps) {
    const [notifications, setNotifications] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    const cardStyle: React.CSSProperties = {
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
    };

    return (
        <PageTransition>
            <div style={{ marginBottom: "36px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                    Settings
                </h1>
                <p style={{ fontSize: "15px", color: "#94a3b8", marginTop: "4px" }}>
                    Configure your workspace
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0 }}
                    style={cardStyle}
                >
                    <div
                        onClick={() => toggleSection("supabase")}
                        style={{
                            padding: "20px 24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#fafbfc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "12px",
                                background: isConnected ? "#f0fdf4" : "#fef2f2",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Database size={20} color={isConnected ? "#22c55e" : "#ef4444"} />
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Supabase Connection</p>
                                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Database and authentication</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {isConnected ? (
                                <span style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    fontSize: "12px", fontWeight: 600, color: "#22c55e",
                                    padding: "5px 12px", borderRadius: "20px", background: "#f0fdf4",
                                }}>
                                    <CheckCircle2 size={14} />
                                    Connected
                                </span>
                            ) : (
                                <span style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    fontSize: "12px", fontWeight: 600, color: "#ef4444",
                                    padding: "5px 12px", borderRadius: "20px", background: "#fef2f2",
                                }}>
                                    <XCircle size={14} />
                                    Not connected
                                </span>
                            )}
                            <ChevronRight
                                size={16}
                                color="#d1d5db"
                                style={{
                                    transform: expandedSection === "supabase" ? "rotate(90deg)" : "none",
                                    transition: "transform 0.2s ease",
                                }}
                            />
                        </div>
                    </div>

                    {expandedSection === "supabase" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            style={{ borderTop: "1px solid #f3f4f6", padding: "20px 24px" }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "13px", color: "#64748b" }}>Project URL</span>
                                    <span style={{
                                        fontSize: "12px", fontFamily: "monospace",
                                        color: "#0f172a", background: "#f8fafc",
                                        padding: "4px 10px", borderRadius: "6px",
                                        maxWidth: "350px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    }}>
                                        {supabaseUrl || "Not set"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "13px", color: "#64748b" }}>Anon Key</span>
                                    <span style={{
                                        fontSize: "12px", fontFamily: "monospace",
                                        color: "#0f172a", background: "#f8fafc",
                                        padding: "4px 10px", borderRadius: "6px",
                                    }}>
                                        ••••••••••••••••
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "13px", color: "#64748b" }}>Service Role Key</span>
                                    <span style={{
                                        fontSize: "12px", fontFamily: "monospace",
                                        color: "#0f172a", background: "#f8fafc",
                                        padding: "4px 10px", borderRadius: "6px",
                                    }}>
                                        ••••••••••••••••
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "13px", color: "#64748b" }}>Status</span>
                                    <span style={{
                                        fontSize: "12px", fontWeight: 600,
                                        color: isConnected ? "#22c55e" : "#ef4444",
                                    }}>
                                        {isConnected ? "Connected & Healthy" : "Connection failed"}
                                    </span>
                                </div>
                            </div>
                            <a
                                href={supabaseUrl ? supabaseUrl.replace(".supabase.co", ".supabase.co/project/default") : "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                    marginTop: "18px", padding: "8px 16px",
                                    borderRadius: "10px", border: "1px solid #e5e7eb",
                                    fontSize: "12px", fontWeight: 600, color: "#64748b",
                                    textDecoration: "none", transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "#0f172a"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#64748b"; }}
                            >
                                <ExternalLink size={14} />
                                Open Supabase Dashboard
                            </a>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 }}
                    style={cardStyle}
                >
                    <div
                        onClick={() => toggleSection("bot")}
                        style={{
                            padding: "20px 24px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#fafbfc"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ShieldCheck size={20} color="#3b82f6" />
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Bot Detection</p>
                                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Manage crawler detection rules</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#3b82f6", padding: "5px 12px", borderRadius: "20px", background: "#eff6ff" }}>
                                35+ rules active
                            </span>
                            <ChevronRight size={16} color="#d1d5db" style={{ transform: expandedSection === "bot" ? "rotate(90deg)" : "none", transition: "transform 0.2s ease" }} />
                        </div>
                    </div>

                    {expandedSection === "bot" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ borderTop: "1px solid #f3f4f6", padding: "20px 24px" }}>
                            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
                                Bot detection is active with 35+ user-agent patterns covering Facebook, TikTok, Twitter, LinkedIn, WhatsApp, Discord, Google, Bing, and more. Detected bots receive custom OG meta tags while humans get instant redirects.
                            </p>
                            <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {["Facebook", "TikTok", "Twitter", "LinkedIn", "WhatsApp", "Discord", "Google", "Bing", "Slack", "Telegram"].map((bot) => (
                                    <span key={bot} style={{
                                        fontSize: "11px", fontWeight: 500, color: "#64748b",
                                        padding: "4px 10px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #f1f5f9",
                                    }}>
                                        {bot}
                                    </span>
                                ))}
                                <span style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", padding: "4px 10px" }}>
                                    +25 more
                                </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                    style={cardStyle}
                >
                    <div
                        style={{
                            padding: "20px 24px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Bell size={20} color="#a855f7" />
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Notifications</p>
                                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Get notified on new click events</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            style={{
                                width: "48px", height: "26px",
                                borderRadius: "13px", border: "none", cursor: "pointer",
                                background: notifications ? "#22c55e" : "#e5e7eb",
                                position: "relative", transition: "background 0.2s ease",
                            }}
                        >
                            <div style={{
                                width: "22px", height: "22px",
                                borderRadius: "11px", background: "#ffffff",
                                position: "absolute", top: "2px",
                                left: notifications ? "24px" : "2px",
                                transition: "left 0.2s ease",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                            }} />
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 }}
                    style={cardStyle}
                >
                    <div
                        style={{
                            padding: "20px 24px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Palette size={20} color="#f97316" />
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Appearance</p>
                                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Customize your dashboard theme</p>
                            </div>
                        </div>
                        <span style={{
                            fontSize: "12px", fontWeight: 600, color: "#64748b",
                            padding: "5px 12px", borderRadius: "20px", background: "#f8fafc",
                        }}>
                            Light mode
                        </span>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
