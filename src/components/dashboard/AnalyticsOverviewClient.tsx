"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import { motion } from "framer-motion";
import {
    MousePointerClick,
    Link2,
    Bot,
    Users,
    BarChart3,
    ArrowRight,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import type { DashboardStats, Link as LinkType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import { useRealtimeClicks, useRealtimeLinks } from "@/hooks/useRealtime";

interface AnalyticsOverviewClientProps {
    stats: DashboardStats;
    links: (LinkType & { click_count: number })[];
}

const PIE_COLORS = ["#0f172a", "#cbd5e1"];

const chartTooltipStyle = {
    backgroundColor: "#0f172a",
    border: "none",
    borderRadius: "12px",
    padding: "8px 14px",
    fontSize: "12px",
    color: "#fff",
};

const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const iconBoxStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

export default function AnalyticsOverviewClient({ stats, links }: AnalyticsOverviewClientProps) {
    const router = useRouter();

    useRealtimeClicks();
    useRealtimeLinks();

    const topLinks = [...links].sort((a, b) => b.click_count - a.click_count).slice(0, 8);

    const botHumanData = [
        { name: "Human", value: stats.human_clicks },
        { name: "Bot", value: stats.bot_clicks },
    ].filter((d) => d.value > 0);

    return (
        <PageTransition>
            <div style={{ marginBottom: "28px" }}>
                <h1 className="text-2xl md:text-[28px]" style={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>Analytics</h1>
                <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>In-depth performance insights</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                <StatCard icon={Link2} label="Active Links" value={formatNumber(stats.total_links)} delay={0.1} />
                <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.2} />
                <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 md:gap-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={iconBoxStyle}><BarChart3 size={16} style={{ color: "#64748b" }} /></div>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Top Performing Links</h3>
                    </div>
                    {topLinks.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={topLinks} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="short_code" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={{ stroke: "#f1f5f9" }} tickFormatter={(val) => `/${val}`} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "#f8fafc" }} />
                                <Bar dataKey="click_count" fill="#0f172a" radius={[6, 6, 0, 0]} name="Clicks" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No links yet</p>
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>Bot vs Human</h3>
                    {botHumanData.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={botHumanData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value">
                                        {botHumanData.map((_, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={chartTooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                                {botHumanData.map((entry, index) => (
                                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: PIE_COLORS[index] }} />
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>{entry.name}</span>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No click data yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                style={{ ...cardStyle, padding: 0, overflow: "hidden" }}
            >
                <div className="px-5 py-4 md:px-6" style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>All Links</h3>
                </div>
                {links.length > 0 ? (
                    <div>
                        {links.map((link) => (
                            <div
                                key={link.id}
                                onClick={() => router.push(`/analytics/${link.id}`)}
                                className="px-4 py-3.5 md:px-6 md:py-4"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f9fafb",
                                    transition: "background 0.15s ease",
                                    gap: "8px",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#fafbfc";
                                    router.prefetch(`/analytics/${link.id}`);
                                }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                                    <div className="hidden sm:flex" style={{ ...iconBoxStyle, flexShrink: 0 }}>
                                        <Link2 size={14} style={{ color: "#94a3b8" }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>/{link.short_code}</p>
                                        <p className="hidden sm:block" style={{ fontSize: "11px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.original_url}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{link.click_count.toLocaleString()}</span>
                                    <span className="hidden sm:inline" style={{ fontSize: "11px", color: "#94a3b8" }}>clicks</span>
                                    <ArrowRight size={14} style={{ color: "#cbd5e1" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: "48px 24px", textAlign: "center" }}>
                        <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No links yet</p>
                    </div>
                )}
            </motion.div>
        </PageTransition>
    );
}
