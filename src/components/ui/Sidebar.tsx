"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Link2, BarChart3, Settings, Zap, Sun, Moon, Book, LogOut } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

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
    const { user, signOut } = useAuth();

    const isMatch = (href: string) => {
        return href === "/" ? pathname === "/" : pathname.startsWith(href);
    };

    return (
        <>
            <aside className="hidden md:flex flex-col items-center py-6 fixed left-6 top-6 bottom-6 w-16 glass-panel rounded-3xl z-50">
                <Link href="/" className="mb-10 relative group">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center relative z-10 shadow-lg shadow-indigo-500/25"
                    >
                        <Zap size={20} className="text-white fill-white" />
                    </motion.div>
                    <div className="absolute inset-0 bg-indigo-500 blur-[16px] opacity-50 group-hover:opacity-80 transition-opacity duration-500 rounded-full -z-10 animate-pulse-glow" />
                </Link>

                <nav className="flex flex-col items-center gap-3 flex-1 w-full px-2">
                    {navItems.map((item) => {
                        const isActive = isMatch(item.href);

                        return (
                            <Link key={item.href} href={item.href} prefetch={true} className="w-full flex justify-center outline-none relative group">
                                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} className="relative w-full flex justify-center">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10 ${isActive
                                        ? "text-white"
                                        : "text-text-muted hover:text-text-primary"
                                        }`}>
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className="relative z-10" />

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-active-pill"
                                                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl -z-10"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {isActive && (
                                            <div className="absolute inset-1 bg-indigo-500/25 blur-lg -z-20 rounded-full animate-pulse-glow" />
                                        )}
                                    </div>

                                    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3.5 py-2 glass-panel text-text-primary text-xs font-semibold rounded-xl whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-[100] translate-x-2 group-hover:translate-x-0">
                                        {item.label}
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={toggleTheme}
                    className="mt-auto w-10 h-10 rounded-2xl flex items-center justify-center border border-border text-icon-muted hover:text-accent-indigo hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 relative group"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {theme === "dark" ? (
                            <motion.div key="sun" initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                                <Sun size={17} />
                            </motion.div>
                        ) : (
                            <motion.div key="moon" initial={{ rotate: 90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                                <Moon size={17} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3.5 py-2 glass-panel text-text-primary text-xs font-semibold rounded-xl whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-[100] translate-x-2 group-hover:translate-x-0">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </div>
                </motion.button>

                {/* User & Logout */}
                {user && (
                    <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={signOut}
                        className="mt-2 w-10 h-10 rounded-2xl flex items-center justify-center border border-border text-icon-muted hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-300 relative group"
                        aria-label="Sign out"
                    >
                        <LogOut size={17} />
                        <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3.5 py-2 glass-panel text-text-primary text-xs font-semibold rounded-xl whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-[100] translate-x-2 group-hover:translate-x-0">
                            Sign Out
                        </div>
                    </motion.button>
                )}
            </aside>

            {/* Mobile Glass Bottom Nav */}
            <nav className="md:hidden flex fixed bottom-0 left-0 right-0 glass-panel items-center justify-around z-50 px-1 pt-2 safe-area-bottom">
                {navItems.map((item) => {
                    const isActive = isMatch(item.href);

                    return (
                        <Link key={item.href} href={item.href} prefetch={true} className="outline-none relative flex-1 flex justify-center">
                            <motion.div whileTap={{ scale: 0.85 }} className="relative">
                                <div className="flex flex-col items-center gap-0.5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10 relative ${isActive ? "text-white" : "text-text-muted"
                                        }`}>
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className="relative z-10" />

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="mobile-nav-active"
                                                    className="absolute inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg -z-10 border border-indigo-500/25"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {isActive && (
                                            <div className="absolute inset-1 bg-indigo-500/20 blur-md -z-20 rounded-full" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-medium leading-none transition-colors ${isActive ? "text-accent-indigo" : "text-text-muted"}`}>
                                        {item.label === "API Docs" ? "Docs" : item.label}
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
