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
            <div className="flex flex-col mb-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 w-max"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Live Analytics
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                    Overview
                </h1>
                <p className="text-sm md:text-base text-text-muted mt-2">
                    Real-time insights across your entire link network
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                    className="glass-panel overflow-hidden rounded-[2rem] lg:col-span-4 flex flex-col min-h-[400px]"
                >
                    <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-surface/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center border border-border">
                                <Activity className="w-5 h-5 text-text-secondary" />
                            </div>
                            <h2 className="text-lg font-bold text-text-primary">Global Activity Stream</h2>
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
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        className="group px-8 py-4 flex items-center justify-between hover:bg-surface-hover/50 transition-all duration-300 cursor-default"
                                    >
                                        <div className="flex items-center gap-5 min-w-0 flex-1">
                                            <div className="relative shrink-0">
                                                <div className={`absolute inset-0 blur-md rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${click.is_bot ? "bg-rose-500" : "bg-emerald-500"}`} />
                                                <div className={`w-10 h-10 rounded-xl glass-panel flex items-center justify-center relative z-10 ${click.is_bot ? "text-rose-400 border-rose-500/20" : "text-emerald-400 border-emerald-500/20"}`}>
                                                    {click.is_bot ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-text-primary truncate font-mono">
                                                    <span className="text-text-muted select-none">/</span>
                                                    {click.links?.short_code || "unknown"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-text-muted" />
                                                    <span className="text-xs font-medium text-text-secondary">{click.country || "Unknown Origin"}</span>
                                                    <span className="text-text-muted/50 text-[10px]">&bull;</span>
                                                    <span className="text-xs font-medium text-text-secondary truncate">{click.referrer || "Direct"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${click.is_bot
                                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                }`}>
                                                {click.is_bot ? "Automated" : click.device_type || "Unknown Dev"}
                                            </span>
                                            <span className="text-xs font-medium text-text-muted font-mono opacity-60">
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
