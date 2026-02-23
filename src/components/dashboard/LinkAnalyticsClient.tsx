"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import ChartErrorBoundary from "@/components/ui/ChartErrorBoundary";
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
    BarChart3,
    Activity,
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
import { formatNumber } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

interface LinkAnalyticsClientProps {
    link: Link;
    stats: LinkStats;
}

const PIE_COLORS = ["#8b5cf6", "#6366f1", "#4f46e5"];

const darkTooltipStyle = {
    backgroundColor: "rgba(24, 24, 27, 0.8)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#f4f4f5",
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
    fontWeight: 500,
};

const lightTooltipStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "16px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#0f172a",
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
    fontWeight: 500,
};

export default function LinkAnalyticsClient({ link, stats }: LinkAnalyticsClientProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();

    useRealtimeClicks(link.id);

    const chartTooltipStyle = theme === "light" ? lightTooltipStyle : darkTooltipStyle;
    const tickFill = theme === "light" ? "#94a3b8" : "#71717a";
    const gridStroke = theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";

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

    const smallBtnStyle = "w-10 h-10 rounded-xl flex items-center justify-center border border-transparent hover:border-border bg-surface-hover hover:bg-surface-active text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0";

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/links")}
                        className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center hover:bg-surface-hover hover:border-indigo-500/30 text-text-muted hover:text-indigo-400 transition-colors shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 flex-wrap">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight font-mono">
                                <span className="text-text-muted select-none">/</span>{link.short_code}
                            </h1>
                            <div className="flex gap-2">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCopy} className={smallBtnStyle}>
                                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.open(link.original_url, "_blank", "noopener,noreferrer")} className={smallBtnStyle}>
                                    <ExternalLink size={16} />
                                </motion.button>
                            </div>
                        </div>
                        <p className="hidden sm:block text-sm text-text-muted mt-2 truncate max-w-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                            {link.original_url}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                    <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.1} />
                    <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.2} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                        className="glass-panel p-6 lg:p-8 rounded-3xl lg:col-span-2 relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-surface-hover flex items-center justify-center border border-border shrink-0 shadow-inner">
                                <BarChart3 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">Clicks Over Time</h3>
                                <p className="text-xs text-text-muted mt-0.5">Rolling aggregated traffic</p>
                            </div>
                        </div>

                        {stats.clicks_over_time.length > 0 ? (
                            <div className="h-[280px] w-full relative z-10">
                                <ChartErrorBoundary>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart data={stats.clicks_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: tickFill }} tickLine={false} axisLine={false} dy={10}
                                            tickFormatter={(val) => { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
                                        <YAxis tick={{ fontSize: 11, fill: tickFill }} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                                        <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fill="url(#areaColor)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                                </ChartErrorBoundary>
                            </div>
                        ) : (
                            <div className="h-[280px] flex flex-col items-center justify-center relative z-10">
                                <Activity className="w-8 h-8 text-icon-muted mb-4 opacity-50" />
                                <p className="text-sm font-semibold text-text-primary">No traffic data yet</p>
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                        className="glass-panel p-6 lg:p-8 rounded-3xl relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-text-primary tracking-tight">Traffic Quality</h3>
                            <p className="text-xs text-text-muted mt-0.5">Bot vs Human ratio</p>
                        </div>

                        {botHumanData.length > 0 ? (
                            <div className="flex flex-col items-center flex-1 justify-center min-w-0 min-h-0 relative z-10">
                                <div className="h-[200px] w-full relative">
                                    <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full scale-50" />
                                    <ChartErrorBoundary>
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                        <PieChart>
                                            <Pie
                                                data={botHumanData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={75}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={4}
                                            >
                                                {botHumanData.map((_, index) => (<Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }} />))}
                                            </Pie>
                                            <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#fff' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    </ChartErrorBoundary>
                                </div>
                                <div className="flex gap-6 mt-6 bg-surface px-4 py-3 rounded-2xl border border-border w-full justify-center">
                                    {botHumanData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ background: PIE_COLORS[index], boxShadow: `0 0 10px ${PIE_COLORS[index]}80` }} />
                                            <span className="text-xs font-semibold text-text-secondary uppercase">{entry.name}</span>
                                            <span className="text-sm font-bold text-text-primary ml-1">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                                <Bot className="w-8 h-8 text-icon-muted opacity-50 mb-4" />
                                <p className="text-sm text-text-muted">Awaiting validation data</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                        className="glass-panel p-6 rounded-[2rem]"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center border border-border"><Globe size={18} className="text-indigo-400" /></div>
                            <h3 className="text-base font-bold text-text-primary tracking-tight">Top Countries</h3>
                        </div>
                        {stats.top_countries.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.top_countries.slice(0, 5).map((item) => (
                                    <div key={item.country} className="flex items-center justify-between group">
                                        <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.country}</span>
                                        <span className="text-sm font-bold text-text-primary py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-indigo-500/30 transition-colors">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No data yet</p>)}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                        className="glass-panel p-6 rounded-[2rem]"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center border border-border"><Smartphone size={18} className="text-indigo-400" /></div>
                            <h3 className="text-base font-bold text-text-primary tracking-tight">Devices</h3>
                        </div>
                        {stats.top_devices.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.top_devices.slice(0, 5).map((item) => (
                                    <div key={item.device} className="flex items-center justify-between group">
                                        <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.device}</span>
                                        <span className="text-sm font-bold text-text-primary py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-indigo-500/30 transition-colors">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No data yet</p>)}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
                        className="glass-panel p-6 rounded-[2rem]"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                            <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center border border-border"><Share2 size={18} className="text-indigo-400" /></div>
                            <h3 className="text-base font-bold text-text-primary tracking-tight">Top Referrers</h3>
                        </div>
                        {stats.top_referrers.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.top_referrers.slice(0, 5).map((item) => (
                                    <div key={item.referrer} className="flex items-center justify-between group">
                                        <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]" title={item.referrer}>{item.referrer}</span>
                                        <span className="text-sm font-bold text-text-primary py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-indigo-500/30 transition-colors">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No data yet</p>)}
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
