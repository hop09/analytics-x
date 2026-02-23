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
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)",
};

const sectionHeadingStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
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
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Analytics</h1>
                <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "6px" }}>In-depth performance insights</p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
            }}>
                <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                <StatCard icon={Link2} label="Active Links" value={formatNumber(stats.total_links)} delay={0.1} />
                <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.2} />
                <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.3} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={cardStyle}>
                    <div style={sectionHeadingStyle}>
                        <div style={iconBoxStyle}><BarChart3 size={16} style={{ color: "#64748b" }} /></div>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Top Performing Links</h3>
                    </div>
                    {topLinks.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={topLinks} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="short_code" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={{ stroke: "#f1f5f9" }} tickFormatter={(val) => `/${val}`} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "#f8fafc" }} />
                                <Bar dataKey="click_count" fill="#0f172a" radius={[6, 6, 0, 0]} name="Clicks" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No links yet</p>
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={cardStyle}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>Bot vs Human</h3>
                    {botHumanData.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={botHumanData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                        {botHumanData.map((_, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={chartTooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
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
                        <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No click data yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                style={{ ...cardStyle, padding: 0, overflow: "hidden" }}
            >
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>All Links</h3>
                </div>
                {links.length > 0 ? (
                    <div>
                        {links.map((link) => (
                            <div
                                key={link.id}
                                onClick={() => router.push(`/analytics/${link.id}`)}
                                style={{
                                    padding: "14px 24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f8fafc",
                                    transition: "background 0.15s ease",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#fafbfc"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                                    <div style={{ ...iconBoxStyle, flexShrink: 0 }}>
                                        <Link2 size={14} style={{ color: "#94a3b8" }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>/{link.short_code}</p>
                                        <p style={{ fontSize: "11px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.original_url}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{link.click_count.toLocaleString()}</span>
                                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>clicks</span>
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
