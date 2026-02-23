"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Link2, BarChart3, Settings, Zap, Sun, Moon, Book } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Overview" },
    { href: "/links", icon: Link2, label: "Links" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/docs", icon: Book, label: "API Docs" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const isMatch = (href: string) => {
        return href === "/" ? pathname === "/" : pathname.startsWith(href);
    };

    return (
        <>
            <aside className="hidden md:flex flex-col items-center py-6 fixed left-6 top-6 bottom-6 w-16 glass-panel rounded-3xl z-50">
                <Link href="/" className="mb-10 relative group">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center relative z-10"
                    >
                        <Zap size={20} className="text-white fill-white" />
                    </motion.div>
                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 bg-indigo-500 blur-[14px] opacity-40 group-hover:opacity-70 transition-opacity duration-300 rounded-full -z-10" />
                </Link>

                <nav className="flex flex-col items-center gap-4 flex-1 w-full px-2">
                    {navItems.map((item) => {
                        const isActive = isMatch(item.href);

                        return (
                            <Link key={item.href} href={item.href} prefetch={true} className="w-full flex justify-center outline-none relative group">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} className="relative w-full flex justify-center">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300 relative z-10 ${isActive
                                        ? "text-white"
                                        : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                                        }`}>
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />

                                        {/* Animated Active Pill */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-active-pill"
                                                    className="absolute inset-0 bg-surface-active border border-border-hover rounded-2xl -z-10"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Subtle active glow */}
                                        {isActive && (
                                            <div className="absolute inset-2 bg-indigo-500/20 blur-md -z-20 rounded-full" />
                                        )}
                                    </div>

                                    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel text-text-primary text-sm font-medium rounded-xl whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-[100] translate-x-1 group-hover:translate-x-0">
                                        {item.label}
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="mt-auto w-10 h-10 rounded-2xl flex items-center justify-center border border-border text-icon-muted hover:text-text-primary hover:bg-surface-hover transition-colors relative group"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {theme === "dark" ? (
                            <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Sun size={18} />
                            </motion.div>
                        ) : (
                            <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Moon size={18} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel text-text-primary text-sm font-medium rounded-xl whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-[100] translate-x-1 group-hover:translate-x-0">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </div>
                </motion.button>
            </aside>

            {/* Mobile Glass Bottom Nav */}
            <nav className="md:hidden flex fixed bottom-4 left-4 right-4 h-16 glass-panel rounded-2xl items-center justify-around z-50 px-2">
                {navItems.map((item) => {
                    const isActive = isMatch(item.href);

                    return (
                        <Link key={item.href} href={item.href} prefetch={true} className="outline-none relative">
                            <motion.div whileTap={{ scale: 0.9 }} className="relative">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all z-10 relative ${isActive ? "text-white" : "text-text-muted"
                                    }`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                layoutId="mobile-nav-active"
                                                className="absolute inset-1 bg-surface-active rounded-lg -z-10 border border-border"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
                <button
                    onClick={toggleTheme}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-icon-muted transition-colors"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
                </button>
            </nav>
        </>
    );
}
