"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    delay?: number;
}

const defaultAccents: Record<string, { bg: string; fg: string; glow: string; border: string }> = {
    "Total Clicks": { bg: "bg-blue-500/10", fg: "text-blue-400", glow: "group-hover:bg-blue-500/25", border: "group-hover:border-blue-500/20" },
    "Active Links": { bg: "bg-emerald-500/10", fg: "text-emerald-400", glow: "group-hover:bg-emerald-500/25", border: "group-hover:border-emerald-500/20" },
    "Human Clicks": { bg: "bg-purple-500/10", fg: "text-purple-400", glow: "group-hover:bg-purple-500/25", border: "group-hover:border-purple-500/20" },
    "Bot Hits": { bg: "bg-rose-500/10", fg: "text-rose-400", glow: "group-hover:bg-rose-500/25", border: "group-hover:border-rose-500/20" },
};

function AnimatedNumber({ value }: { value: string | number }) {
    const [displayValue, setDisplayValue] = useState("0");
    const prevValue = useRef<string | number>(0);

    useEffect(() => {
        const numericValue = typeof value === "string" ? parseInt(value.replace(/,/g, ""), 10) : value;
        const prevNumeric = typeof prevValue.current === "string"
            ? parseInt(String(prevValue.current).replace(/,/g, ""), 10)
            : prevValue.current;

        if (isNaN(numericValue)) {
            setDisplayValue(String(value));
            prevValue.current = value;
            return;
        }

        const controls = animate(prevNumeric || 0, numericValue, {
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            onUpdate(latest) {
                setDisplayValue(Math.round(latest).toLocaleString());
            },
        });

        prevValue.current = value;
        return () => controls.stop();
    }, [value]);

    return <>{displayValue}</>;
}

export default function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
    const accents = defaultAccents[label] || { bg: "bg-surface-hover", fg: "text-icon-muted", glow: "group-hover:bg-surface-active", border: "group-hover:border-border-hover" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`group relative glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent-glow/10 ${accents.border}`}
        >
            {/* Ambient glow blob */}
            <div className={`absolute -top-12 -right-12 w-36 h-36 blur-[60px] rounded-full transition-all duration-700 opacity-50 group-hover:opacity-100 ${accents.bg} ${accents.glow}`} />

            {/* Shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-8">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border border-border/50 shadow-inner ${accents.bg} transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${accents.fg}`} strokeWidth={2.5} />
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <p className="text-2xl sm:text-4xl font-bold tracking-tighter text-text-primary leading-none mb-1 sm:mb-2 tabular-nums">
                    <AnimatedNumber value={value} />
                </p>
                <p className="text-xs sm:text-sm font-medium text-text-muted">
                    {label}
                </p>
            </div>
        </motion.div>
    );
}
