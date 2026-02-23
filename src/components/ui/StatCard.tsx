"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    delay?: number;
}

const defaultAccents: Record<string, { bg: string; fg: string }> = {
    "Total Clicks": { bg: "#eff6ff", fg: "#3b82f6" },
    "Active Links": { bg: "#f0fdf4", fg: "#22c55e" },
    "Human Clicks": { bg: "#faf5ff", fg: "#a855f7" },
    "Bot Hits": { bg: "#fff7ed", fg: "#f97316" },
};

export default function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
    const colors = defaultAccents[label] || { bg: "#f1f5f9", fg: "#64748b" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="p-4 md:p-6"
            style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                transition: "all 0.25s ease",
                cursor: "default",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0px)";
            }}
        >
            <div
                className="w-9 h-9 md:w-11 md:h-11 mb-4 md:mb-5"
                style={{
                    borderRadius: "12px",
                    background: colors.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Icon className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" color={colors.fg} strokeWidth={2} />
            </div>
            <p
                className="text-[28px] md:text-[36px]"
                style={{
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                }}
            >
                {value}
            </p>
            <p
                style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#94a3b8",
                    marginTop: "6px",
                }}
            >
                {label}
            </p>
        </motion.div>
    );
}
