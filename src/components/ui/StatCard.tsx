"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    delay?: number;
}

const defaultAccents: Record<string, { bg: string; fg: string; glow: string }> = {
    "Total Clicks": { bg: "bg-blue-500/10", fg: "text-blue-400", glow: "group-hover:bg-blue-500/20" },
    "Active Links": { bg: "bg-emerald-500/10", fg: "text-emerald-400", glow: "group-hover:bg-emerald-500/20" },
    "Human Clicks": { bg: "bg-purple-500/10", fg: "text-purple-400", glow: "group-hover:bg-purple-500/20" },
    "Bot Hits": { bg: "bg-rose-500/10", fg: "text-rose-400", glow: "group-hover:bg-rose-500/20" },
};

export default function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
    const accents = defaultAccents[label] || { bg: "bg-surface-hover", fg: "text-icon-muted", glow: "group-hover:bg-surface-active" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative glass-panel p-6 rounded-3xl flex flex-col justify-between overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1"
        >
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-500 ${accents.bg} ${accents.glow}`} />

            <div className="relative z-10 flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-border/50 shadow-inner ${accents.bg}`}>
                    <Icon className={`w-5 h-5 ${accents.fg}`} strokeWidth={2.5} />
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <p className="text-4xl font-bold tracking-tighter text-text-primary leading-none mb-2">
                    {value}
                </p>
                <p className="text-sm font-medium text-text-muted">
                    {label}
                </p>
            </div>
        </motion.div>
    );
}
