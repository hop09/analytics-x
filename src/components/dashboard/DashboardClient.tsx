"use client";

import PageTransition from "@/components/ui/PageTransition";
import StatCard from "@/components/ui/StatCard";
import { motion } from "framer-motion";
import { MousePointerClick, Link2, Bot, Users, Globe, Activity } from "lucide-react";
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
            <div className="flex flex-col mb-6 sm:mb-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3 sm:mb-4 w-max shimmer-border"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    Live Analytics
                </motion.div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                    Overview
                </h1>
                <p className="text-sm md:text-base text-text-muted mt-1 sm:mt-2">
                    Real-time insights across your entire link network
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="lg:col-span-1">
                    <StatCard icon={MousePointerClick} label="Total Clicks" value={formatNumber(stats.total_clicks)} delay={0} />
                </div>
                <div className="lg:col-span-1">
                    <StatCard icon={Link2} label="Active Links" value={formatNumber(stats.total_links)} delay={0.1} />
                </div>
                <div className="lg:col-span-1">
                    <StatCard icon={Users} label="Human Clicks" value={formatNumber(stats.human_clicks)} delay={0.2} />
                </div>
                <div className="lg:col-span-1">
                    <StatCard icon={Bot} label="Bot Hits" value={formatNumber(stats.bot_clicks)} delay={0.3} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="glass-panel overflow-hidden rounded-[2rem] lg:col-span-4 flex flex-col min-h-[400px] relative"
                >
                    {/* Top shimmer line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                    <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-border/50 flex items-center justify-between bg-surface/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
                                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-text-primary">Global Activity Stream</h2>
                        </div>
                    </div>

                    <div className="flex-1 w-full bg-surface-hover/20">
                        {recentClicks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center py-20">
                                <div className="relative">
                                    <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full" />
                                    <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center relative z-10 border-border">
                                        <MousePointerClick className="w-6 h-6 text-icon-muted" />
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-text-primary mt-6">Awaiting Traffic</p>
                                <p className="text-sm text-text-muted mt-2">Live clicks will stream here instantly</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {recentClicks.map((click, index) => (
                                    <motion.div
                                        key={click.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className="group px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between hover:bg-surface-hover/50 transition-all duration-300 cursor-default relative"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                                            <div className="relative shrink-0 hidden xs:block">
                                                <div className={`absolute inset-0 blur-md rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${click.is_bot ? "bg-rose-500" : "bg-emerald-500"}`} />
                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl glass-panel flex items-center justify-center relative z-10 ${click.is_bot ? "text-rose-400 border-rose-500/20" : "text-emerald-400 border-emerald-500/20"}`}>
                                                    {click.is_bot ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-text-primary truncate font-mono">
                                                    <span className="text-text-muted select-none">/</span>
                                                    {click.links?.short_code || "unknown"}
                                                </p>
                                                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                                                    <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-muted" />
                                                    <span className="text-[11px] sm:text-xs font-medium text-text-secondary">{click.country || "Unknown"}</span>
                                                    <span className="text-text-muted/50 text-[10px] hidden sm:inline">&bull;</span>
                                                    <span className="text-[11px] sm:text-xs font-medium text-text-secondary truncate hidden sm:inline">{click.referrer || "Direct"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 sm:gap-1.5 shrink-0 ml-2 sm:ml-4">
                                            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${click.is_bot
                                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                }`}>
                                                {click.is_bot ? "Bot" : click.device_type || "Human"}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-medium text-text-muted font-mono opacity-60">
                                                {timeAgo(click.created_at)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
