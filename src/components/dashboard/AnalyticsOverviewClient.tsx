"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import ChartErrorBoundary from "@/components/ui/ChartErrorBoundary";
import { motion } from "framer-motion";
import {
    MousePointerClick,
    Link2,
    Bot,
    Users,
    BarChart3,
    ArrowRight,
    Activity,
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
import { useTheme } from "@/components/ThemeProvider";

interface AnalyticsOverviewClientProps {
    stats: DashboardStats;
    links: (LinkType & { click_count: number })[];
}

const PIE_COLORS = ["#8b5cf6", "#6366f1"];

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

export default function AnalyticsOverviewClient({ stats, links }: AnalyticsOverviewClientProps) {
    const router = useRouter();

    useRealtimeClicks();
    useRealtimeLinks();

    const { theme } = useTheme();
    const chartTooltipStyle = theme === "light" ? lightTooltipStyle : darkTooltipStyle;
    const tickFill = theme === "light" ? "#94a3b8" : "#71717a";
    const gridStroke = theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";

    const topLinks = [...links].sort((a, b) => b.click_count - a.click_count).slice(0, 8);

    const botHumanData = [
        { name: "Human", value: stats.human_clicks },
        { name: "Bot", value: stats.bot_clicks },
    ].filter((d) => d.value > 0);

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                        Analytics
                    </h1>
                    <p className="text-sm md:text-base text-text-muted mt-2">
                        In-depth traffic insights and link performance metrics
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                    <StatCard icon={Link2} label="Active Links" value={formatNumber(stats.total_links)} delay={0.1} />
                    <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.2} />
                    <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                        className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col lg:col-span-2 relative overflow-hidden"
                    >
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-surface-hover flex items-center justify-center border border-border shrink-0 shadow-inner">
                                <BarChart3 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">Top Performing Links</h3>
                                <p className="text-xs text-text-muted mt-0.5">Highest click volume across your network</p>
                            </div>
                        </div>

                        {topLinks.length > 0 ? (
                            <div className="h-80 w-full mt-auto min-w-0 min-h-0 relative z-10">
                                <ChartErrorBoundary>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart data={topLinks} barSize={32} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                                        <XAxis dataKey="short_code" tick={{ fontSize: 12, fill: tickFill }} tickLine={false} axisLine={false} tickFormatter={(val) => `/${val}`} dy={12} />
                                        <YAxis tick={{ fontSize: 12, fill: tickFill }} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)", radius: 6 }} />
                                        <Bar dataKey="click_count" fill="url(#colorClicks)" radius={[6, 6, 0, 0]} name="Clicks" />
                                    </BarChart>
                                </ResponsiveContainer>
                                </ChartErrorBoundary>
                            </div>
                        ) : (
                            <div className="h-80 flex flex-col items-center justify-center relative z-10">
                                <div className="w-16 h-16 rounded-full bg-surface mb-4 flex items-center justify-center border border-border">
                                    <BarChart3 className="w-6 h-6 text-icon-muted" />
                                </div>
                                <p className="text-sm font-semibold text-text-primary">No data available</p>
                                <p className="text-xs text-text-muted mt-1">Charts will generate once links receive traffic</p>
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                        className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <div>
                            <h3 className="text-xl font-bold text-text-primary tracking-tight">Traffic Quality</h3>
                            <p className="text-xs text-text-muted mt-0.5">Bot vs Human validation</p>
                        </div>

                        {botHumanData.length > 0 ? (
                            <div className="flex flex-col items-center flex-1 justify-center min-w-0 min-h-0 mt-8 relative z-10">
                                <div className="h-[220px] w-full min-w-0 min-h-0 relative">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-50" />
                                    <ChartErrorBoundary>
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                        <PieChart>
                                            <Pie
                                                data={botHumanData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={85}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={4}
                                            >
                                                {botHumanData.map((_, index) => (
                                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#fff' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    </ChartErrorBoundary>
                                </div>
                                <div className="flex w-full justify-center gap-6 mt-6 bg-surface px-4 py-3 rounded-2xl border border-border">
                                    {botHumanData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ background: PIE_COLORS[index], boxShadow: `0 0 12px ${PIE_COLORS[index]}80` }} />
                                            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{entry.name}</span>
                                            <span className="text-sm font-bold text-text-primary ml-1">{formatNumber(entry.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center mt-8 relative z-10">
                                <div className="w-48 h-48 rounded-full border-4 border-dashed border-border/50 flex items-center justify-center">
                                    <Bot className="w-8 h-8 text-icon-muted opacity-50" />
                                </div>
                                <p className="text-sm text-text-muted mt-6">Awaiting validation data</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                    className="glass-panel rounded-[2rem] overflow-hidden flex flex-col"
                >
                    <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-surface/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
                                <Activity className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Links Directory</h3>
                        </div>
                    </div>

                    {links.length > 0 ? (
                        <div className="divide-y divide-border/30 bg-surface-hover/20">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    onClick={() => router.push(`/analytics/${link.id}`)}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(`/analytics/${link.id}`); }}
                                    role="button"
                                    tabIndex={0}
                                    className="px-8 py-4 flex items-center justify-between hover:bg-surface-hover/50 cursor-pointer transition-all duration-300 group"
                                    onMouseEnter={() => router.prefetch(`/analytics/${link.id}`)}
                                >
                                    <div className="flex items-center gap-5 min-w-0 flex-1">
                                        <div className="hidden sm:flex w-10 h-10 rounded-xl glass-panel items-center justify-center shrink-0 border-border group-hover:border-indigo-500/30 transition-colors">
                                            <Link2 className="w-4 h-4 text-icon-muted group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-text-primary truncate font-mono">
                                                <span className="text-text-muted select-none">/</span>{link.short_code}
                                            </p>
                                            <p className="hidden sm:block text-xs text-text-muted truncate mt-1 group-hover:text-text-secondary transition-colors">{link.original_url}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 ml-4">
                                        <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border group-hover:border-indigo-500/20 transition-colors">
                                            <span className="text-sm font-bold text-text-primary group-hover:text-indigo-400 transition-colors">{link.click_count.toLocaleString()}</span>
                                            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-text-muted">clicks</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white text-icon-muted transition-colors border border-border group-hover:border-indigo-500">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mb-4">
                                <Link2 className="w-6 h-6 text-icon-muted" />
                            </div>
                            <p className="text-sm font-semibold text-text-primary">Directory empty</p>
                            <p className="text-xs text-text-muted mt-1">Create links to populate this table</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </PageTransition>
    );
}
