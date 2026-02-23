"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Link2, BarChart3, Settings, Zap } from "lucide-react";

const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/links", icon: Link2, label: "Links" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            <aside
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    width: "68px",
                    background: "#0f172a",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    zIndex: 50,
                }}
                className="hidden md:flex"
            >
                <Link href="/" style={{ marginBottom: "40px" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                        }}
                    >
                        <Zap size={20} color="#fff" />
                    </div>
                </Link>

                <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        return (
                            <Link key={item.href} href={item.href} prefetch={true} style={{ textDecoration: "none" }}>
                                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} className="relative group">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                                            color: isActive ? "#ffffff" : "rgba(255,255,255,0.35)",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                                            }
                                        }}
                                    >
                                        <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                                    </div>

                                    <div
                                        className="opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                        style={{
                                            position: "absolute",
                                            left: "calc(100% + 12px)",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            padding: "6px 12px",
                                            background: "#ffffff",
                                            color: "#0f172a",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            whiteSpace: "nowrap",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                            transition: "all 0.15s ease",
                                            pointerEvents: "none",
                                            zIndex: 100,
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <nav
                className="md:hidden flex"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "64px",
                    background: "#0f172a",
                    alignItems: "center",
                    justifyContent: "space-around",
                    zIndex: 50,
                    padding: "0 16px",
                }}
            >
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link key={item.href} href={item.href} prefetch={true} style={{ textDecoration: "none" }}>
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                                        color: isActive ? "#ffffff" : "rgba(255,255,255,0.35)",
                                    }}
                                >
                                    <item.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
