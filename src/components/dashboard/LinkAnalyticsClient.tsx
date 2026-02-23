"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MousePointerClick,
    Users,
    Bot,
    Globe,
    Smartphone,
    Share2,
    Copy,
    Check,
    ExternalLink,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import type { Link, LinkStats } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRealtimeClicks } from "@/hooks/useRealtime";

interface LinkAnalyticsClientProps {
    link: Link;
    stats: LinkStats;
}

const PIE_COLORS = ["#0f172a", "#94a3b8", "#cbd5e1"];

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

const breakdownHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
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

export default function LinkAnalyticsClient({ link, stats }: LinkAnalyticsClientProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    useRealtimeClicks(link.id);

    const handleCopy = async () => {
        const url = `${window.location.origin}/${link.short_code}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const botHumanData = [
        { name: "Human", value: stats.human_clicks },
        { name: "Bot", value: stats.bot_clicks },
    ].filter((d) => d.value > 0);

    const smallBtnStyle: React.CSSProperties = {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        background: "#f1f5f9",
        color: "#64748b",
        transition: "all 0.15s ease",
    };

    return (
        <PageTransition>
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/links")}
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "#f1f5f9",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        flexShrink: 0,
                    }}
                >
                    <ArrowLeft size={18} />
                </motion.button>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <h1 className="text-xl md:text-2xl" style={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                            /{link.short_code}
                        </h1>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} style={smallBtnStyle}>
                                {copied ? <Check size={14} style={{ color: "#059669" }} /> : <Copy size={14} />}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => window.open(link.original_url, "_blank")} style={smallBtnStyle}>
                                <ExternalLink size={14} />
                            </motion.button>
                        </div>
                    </div>
                    <p className="hidden sm:block" style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {link.original_url}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                <StatCard icon={MousePointerClick} label="Total Clicks" value={stats.total_clicks} delay={0} />
                <StatCard icon={Users} label="Human Clicks" value={stats.human_clicks} delay={0.1} />
                <StatCard icon={Bot} label="Bot Hits" value={stats.bot_clicks} delay={0.2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 md:gap-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>Clicks Over Time</h3>
                    {stats.clicks_over_time.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={stats.clicks_over_time}>
                                <defs>
                                    <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={{ stroke: "#f1f5f9" }}
                                    tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={chartTooltipStyle} />
                                <Area type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} fill="url(#clickGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No click data yet</p>
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>Bot vs Human</h3>
                    {botHumanData.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={botHumanData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value">
                                        {botHumanData.map((_, index) => (<Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
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
                        <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>No data yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <div style={breakdownHeaderStyle}>
                        <div style={iconBoxStyle}><Globe size={16} style={{ color: "#64748b" }} /></div>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Top Countries</h3>
                    </div>
                    {stats.top_countries.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {stats.top_countries.slice(0, 5).map((item) => (
                                <div key={item.country} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "13px", color: "#334155" }}>{item.country}</span>
                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>{item.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (<p style={{ fontSize: "13px", color: "#cbd5e1", textAlign: "center", padding: "16px 0" }}>No data yet</p>)}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <div style={breakdownHeaderStyle}>
                        <div style={iconBoxStyle}><Smartphone size={16} style={{ color: "#64748b" }} /></div>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Devices</h3>
                    </div>
                    {stats.top_devices.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {stats.top_devices.slice(0, 5).map((item) => (
                                <div key={item.device} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "13px", color: "#334155" }}>{item.device}</span>
                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>{item.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (<p style={{ fontSize: "13px", color: "#cbd5e1", textAlign: "center", padding: "16px 0" }}>No data yet</p>)}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
                    className="p-5 md:p-6" style={cardStyle}
                >
                    <div style={breakdownHeaderStyle}>
                        <div style={iconBoxStyle}><Share2 size={16} style={{ color: "#64748b" }} /></div>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Top Referrers</h3>
                    </div>
                    {stats.top_referrers.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {stats.top_referrers.slice(0, 5).map((item) => (
                                <div key={item.referrer} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "13px", color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }}>{item.referrer}</span>
                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>{item.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (<p style={{ fontSize: "13px", color: "#cbd5e1", textAlign: "center", padding: "16px 0" }}>No data yet</p>)}
                </motion.div>
            </div>
        </PageTransition>
    );
}
