"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import { motion } from "framer-motion";
import { MousePointerClick, Link2, Bot, Users, ArrowUpRight, Globe } from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";
import { useRealtimeClicks } from "@/hooks/useRealtime";

interface RecentClick {
    id: string;
    link_id: string;
    user_agent: string | null;
    country: string | null;
    device_type: string | null;
    is_bot: boolean;
    referrer: string | null;
    created_at: string;
    links: { short_code: string } | null;
}

interface DashboardClientProps {
    stats: DashboardStats;
    recentClicks: RecentClick[];
}

export default function DashboardClient({ stats, recentClicks }: DashboardClientProps) {
    useRealtimeClicks();

    return (
        <PageTransition>
            <div style={{ marginBottom: "28px" }}>
                <h1 className="text-2xl md:text-[28px]" style={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
                    Overview of your link performance
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                <StatCard icon={Link2} label="Active Links" value={formatNumber(stats.total_links)} delay={0.05} />
                <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.1} />
                <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.15} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
            >
                <div className="px-5 py-4 md:px-6 md:py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Recent Activity</h2>
                </div>

                {recentClicks.length === 0 ? (
                    <div className="px-5 py-12 md:py-16" style={{ textAlign: "center" }}>
                        <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "#f8fafc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}>
                            <MousePointerClick size={24} color="#d1d5db" />
                        </div>
                        <p style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 500 }}>No clicks recorded yet</p>
                        <p style={{ fontSize: "13px", color: "#d1d5db", marginTop: "4px" }}>Activity will appear here once links get traffic</p>
                    </div>
                ) : (
                    <div>
                        {recentClicks.map((click, index) => (
                            <motion.div
                                key={click.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.04 }}
                                className="px-4 py-3.5 md:px-6 md:py-4"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottom: index < recentClicks.length - 1 ? "1px solid #f9fafb" : "none",
                                    transition: "background 0.15s ease",
                                    gap: "8px",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#fafbfc"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
                                    <div className="hidden sm:flex" style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "10px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: click.is_bot ? "#fff7ed" : "#f0fdf4",
                                        flexShrink: 0,
                                    }}>
                                        {click.is_bot ? (
                                            <Bot size={18} color="#f97316" />
                                        ) : (
                                            <ArrowUpRight size={18} color="#22c55e" />
                                        )}
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                                            /{click.links?.short_code || "unknown"}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                            <Globe size={11} color="#d1d5db" />
                                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{click.country || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                    <span className="hidden sm:inline" style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        padding: "4px 10px",
                                        borderRadius: "8px",
                                        background: click.is_bot ? "#fff7ed" : "#f8fafc",
                                        color: click.is_bot ? "#ea580c" : "#64748b",
                                    }}>
                                        {click.is_bot ? "Bot" : click.device_type || "Unknown"}
                                    </span>
                                    <span style={{ fontSize: "11px", color: "#d1d5db" }}>
                                        {timeAgo(click.created_at)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </PageTransition>
    );
}
