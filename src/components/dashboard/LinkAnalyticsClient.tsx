"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import ChartErrorBoundary from "@/components/ui/ChartErrorBoundary";
import EditLinkModal from "@/components/forms/EditLinkModal";
import { motion, AnimatePresence } from "framer-motion";
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
    Pencil,
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
    const [showEditModal, setShowEditModal] = useState(false);
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

    const smallBtnStyle = "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border border-transparent hover:border-indigo-500/30 bg-surface-hover hover:bg-surface-active text-text-muted hover:text-accent-indigo transition-all duration-300 cursor-pointer shrink-0 hover:shadow-md hover:shadow-indigo-500/5";

    return (
        <PageTransition>
            <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-10">
                    <motion.button
                        whileHover={{ scale: 1.08, x: -2 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => router.push("/links")}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl glass-panel flex items-center justify-center hover:bg-surface-hover hover:border-indigo-500/30 text-text-muted hover:text-accent-indigo transition-all duration-300 shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </motion.button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight font-mono">
                                <span className="text-text-muted select-none">/</span>{link.short_code}
                            </h1>
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                (link.mode || "real") === "real"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            }`}>
                                {(link.mode || "real") === "real" ? <Users size={12} /> : <Bot size={12} />}
                                {(link.mode || "real") === "real" ? "Real Mode" : "Bot Mode"}
                            </span>
                            <div className="flex gap-1.5 sm:gap-2">
                                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={handleCopy} className={smallBtnStyle}>
                                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={() => setShowEditModal(true)} className={smallBtnStyle}>
                                    <Pencil size={14} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={() => window.open(link.original_url, "_blank", "noopener,noreferrer")} className={smallBtnStyle}>
                                    <ExternalLink size={14} />
                                </motion.button>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-text-muted mt-1 sm:mt-2 truncate max-w-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                            {link.original_url}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                    <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.1} />
                    <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.2} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                        className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:col-span-2 relative overflow-hidden flex flex-col group"
                    >
                        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-150" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                        <div className="flex items-center gap-3 mb-4 sm:mb-8 relative z-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface-hover flex items-center justify-center border border-border shrink-0 shadow-inner">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-xl font-bold text-text-primary tracking-tight">Clicks Over Time</h3>
                                <p className="text-xs text-text-muted mt-0.5 hidden sm:block">Rolling aggregated traffic</p>
                            </div>
                        </div>

                        {stats.clicks_over_time.length > 0 ? (
                            <div className="h-[200px] sm:h-[280px] w-full relative z-10">
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
                        className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden flex flex-col group"
                    >
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-150" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

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
                                <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-6 bg-surface px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-border w-full justify-center flex-wrap">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                        className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group/card hover:border-border-hover transition-all duration-300"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/50">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-hover rounded-lg sm:rounded-xl flex items-center justify-center border border-border group-hover/card:border-indigo-500/20 transition-colors"><Globe size={16} className="text-indigo-400" /></div>
                            <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">Top Countries</h3>
                        </div>
                        {stats.top_countries.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.top_countries.slice(0, 5).map((item) => (
                                    <div key={item.country} className="flex items-center justify-between group">
                                        <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.country}</span>
                                        <span className="text-sm font-bold text-text-primary tabular-nums py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all duration-300">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No data yet</p>)}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                        className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group/card hover:border-border-hover transition-all duration-300"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/50">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-hover rounded-lg sm:rounded-xl flex items-center justify-center border border-border group-hover/card:border-purple-500/20 transition-colors"><Smartphone size={16} className="text-indigo-400" /></div>
                            <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">Devices</h3>
                        </div>
                        {stats.top_devices.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.top_devices.slice(0, 5).map((item) => (
                                    <div key={item.device} className="flex items-center justify-between group">
                                        <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.device}</span>
                                        <span className="text-sm font-bold text-text-primary tabular-nums py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-purple-500/30 group-hover:bg-purple-500/5 transition-all duration-300">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No data yet</p>)}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
                        className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group/card hover:border-border-hover transition-all duration-300"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/50">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-hover rounded-lg sm:rounded-xl flex items-center justify-center border border-border group-hover/card:border-blue-500/20 transition-colors"><Share2 size={16} className="text-indigo-400" /></div>
                            <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">Top Referrers</h3>
                        </div>
                        {stats.top_referrers.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {stats.top_referrers.slice(0, 5).map((item) => (
                                    <div key={item.referrer} className="flex items-center justify-between group">
                                        <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]" title={item.referrer}>{item.referrer}</span>
                                        <span className="text-sm font-bold text-text-primary tabular-nums py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-300">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No data yet</p>)}
                    </motion.div>
                </div>

                {/* User Agents — Real Visitors */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}
                    className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group/card hover:border-border-hover transition-all duration-300"
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/50">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/10 rounded-lg sm:rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover/card:border-emerald-500/30 transition-colors"><Users size={16} className="text-emerald-400" /></div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">Real Visitor User Agents</h3>
                            <p className="text-[10px] text-text-muted">User agents from real visitor clicks</p>
                        </div>
                        {stats.top_user_agents && (
                            <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                                {stats.top_user_agents.filter(ua => !ua.is_bot).reduce((s, ua) => s + ua.count, 0)}
                            </span>
                        )}
                    </div>
                    {(() => {
                        const realUAs = stats.top_user_agents?.filter(ua => !ua.is_bot) || [];
                        return realUAs.length > 0 ? (
                            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {realUAs.map((item, i) => (
                                    <div key={i} className="flex items-start justify-between gap-3 group p-2 rounded-lg hover:bg-surface-hover/50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-text-secondary font-mono group-hover:text-text-primary transition-colors break-all leading-relaxed line-clamp-2" title={item.user_agent}>
                                                {item.user_agent}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-text-primary tabular-nums py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 shrink-0">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No real visitor data yet</p>);
                    })()}
                </motion.div>

                {/* User Agents — Bot Hits */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}
                    className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] relative overflow-hidden group/card hover:border-border-hover transition-all duration-300"
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/50">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/10 rounded-lg sm:rounded-xl flex items-center justify-center border border-orange-500/20 group-hover/card:border-orange-500/30 transition-colors"><Bot size={16} className="text-orange-400" /></div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">Bot User Agents</h3>
                            <p className="text-[10px] text-text-muted">User agents from bot mode clicks</p>
                        </div>
                        {stats.top_user_agents && (
                            <span className="ml-auto text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-lg">
                                {stats.top_user_agents.filter(ua => ua.is_bot).reduce((s, ua) => s + ua.count, 0)}
                            </span>
                        )}
                    </div>
                    {(() => {
                        const botUAs = stats.top_user_agents?.filter(ua => ua.is_bot) || [];
                        return botUAs.length > 0 ? (
                            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {botUAs.map((item, i) => (
                                    <div key={i} className="flex items-start justify-between gap-3 group p-2 rounded-lg hover:bg-surface-hover/50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-text-secondary font-mono group-hover:text-text-primary transition-colors break-all leading-relaxed line-clamp-2" title={item.user_agent}>
                                                {item.user_agent}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-text-primary tabular-nums py-1 px-2.5 bg-surface-hover rounded-lg border border-border group-hover:border-orange-500/30 group-hover:bg-orange-500/5 transition-all duration-300 shrink-0">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-sm text-text-muted text-center py-8">No bot data yet</p>);
                    })()}
                </motion.div>
            </div>

            <AnimatePresence>
                {showEditModal && (
                    <EditLinkModal
                        link={link}
                        onClose={() => setShowEditModal(false)}
                        onSuccess={() => {
                            setShowEditModal(false);
                            router.refresh();
                        }}
                    />
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
