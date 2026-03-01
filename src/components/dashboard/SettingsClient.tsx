"use client";

import PageTransition from "@/components/ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database,
    ShieldCheck,
    Bell,
    Palette,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ExternalLink,
    Sun,
    Moon,
    LogOut,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

interface SettingsClientProps {
    supabaseUrl: string;
    isConnected: boolean;
}

export default function SettingsClient({ supabaseUrl, isConnected }: SettingsClientProps) {
    const [notifications, setNotifications] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    return (
        <PageTransition>
            <div className="max-w-[1000px] mx-auto space-y-6 sm:space-y-8">
                <div className="flex flex-col mb-6 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm md:text-base text-text-muted mt-1 sm:mt-2">
                        Configure your workspace and integrations
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }}
                        className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl relative group/section"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
                        <div onClick={() => toggleSection("supabase")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleSection("supabase"); }} role="button" tabIndex={0} className="p-4 sm:p-6 md:px-8 flex items-center justify-between cursor-pointer hover:bg-surface-hover/50 transition-colors group">
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner border border-border transition-all duration-300 ${isConnected ? 'bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10' : 'bg-red-500/10 group-hover:border-red-500/30'}`}>
                                    <Database size={20} className={isConnected ? "text-emerald-400" : "text-red-400"} />
                                </div>
                                <div>
                                    <p className="text-base sm:text-lg font-bold text-text-primary tracking-tight">Supabase Connection</p>
                                    <p className="text-xs sm:text-sm text-text-muted mt-0.5 group-hover:text-text-secondary transition-colors hidden sm:block">Database and authentication sync</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {isConnected ? (
                                    <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                                        <CheckCircle2 size={14} /> Healthy
                                    </span>
                                ) : (
                                    <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
                                        <XCircle size={14} /> Disconnected
                                    </span>
                                )}
                                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-border">
                                    <ChevronRight size={16} className={`text-icon-muted transition-transform duration-300 ${expandedSection === "supabase" ? "rotate-90" : ""}`} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {expandedSection === "supabase" && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t border-border/50 bg-surface/50">
                                        <div className="flex flex-col gap-4 max-w-2xl">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-surface border border-border">
                                                <span className="text-sm font-semibold text-text-secondary">Project URL</span>
                                                <span className="text-sm font-mono text-text-primary px-3 py-1.5 rounded-xl bg-surface-hover border border-border max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {supabaseUrl || "Not configured"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-surface border border-border">
                                                <span className="text-sm font-semibold text-text-secondary">Anon Key</span>
                                                <span className="text-sm font-mono text-text-primary px-3 py-1.5 rounded-xl bg-surface-hover border border-border tracking-widest">
                                                    ••••••••••••••••
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-surface border border-border">
                                                <span className="text-sm font-semibold text-text-secondary">Service Role Key</span>
                                                <span className="text-sm font-mono text-text-primary px-3 py-1.5 rounded-xl bg-surface-hover border border-border tracking-widest">
                                                    ••••••••••••••••
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-surface border border-border">
                                                <span className="text-sm font-semibold text-text-secondary">Status</span>
                                                <span className={`text-sm font-bold ${isConnected ? "text-emerald-400" : "text-red-400"}`}>
                                                    {isConnected ? "Connected & Synchronized" : "Connection Failed"}
                                                </span>
                                            </div>
                                        </div>
                                        <a href={supabaseUrl ? supabaseUrl.replace(".supabase.co", ".supabase.co/project/default") : "#"} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl glass-panel text-sm font-bold text-text-primary hover:text-white hover:border-indigo-500/50 hover:bg-surface-hover transition-all group w-fit"
                                        >
                                            <ExternalLink size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                            Open Supabase Dashboard
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                        className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl relative group/section"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
                        <div onClick={() => toggleSection("bot")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleSection("bot"); }} role="button" tabIndex={0} className="p-4 sm:p-6 md:px-8 flex items-center justify-between cursor-pointer hover:bg-surface-hover/50 transition-colors group">
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-inner border border-border group-hover:border-blue-500/30 group-hover:shadow-blue-500/10 transition-all duration-300">
                                    <ShieldCheck size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-base sm:text-lg font-bold text-text-primary tracking-tight">Link Mode System</p>
                                    <p className="text-xs sm:text-sm text-text-muted mt-0.5 group-hover:text-text-secondary transition-colors hidden sm:block">Manual Real/Bot mode per link</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="hidden sm:flex px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                    Per-Link Toggle
                                </span>
                                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-border">
                                    <ChevronRight size={16} className={`text-icon-muted transition-transform duration-300 ${expandedSection === "bot" ? "rotate-90" : ""}`} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {expandedSection === "bot" && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t border-border/50 bg-surface/50">
                                        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                                            Each link has a manual <strong className="text-text-primary">Real</strong> / <strong className="text-text-primary">Bot</strong> mode toggle. In <strong className="text-emerald-400">Real mode</strong>, all visitors are redirected to the destination URL. In <strong className="text-orange-400">Bot mode</strong>, all visitors see the social preview page with OG meta tags. Toggle the mode from the Links page or the Edit modal.
                                        </p>
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {["Real Mode → Redirect", "Bot Mode → Meta Page", "Per-Link Toggle", "User Agent Tracking", "Both Modes Analytics"].map((feature) => (
                                                <span key={feature} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 cursor-default">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                        className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl relative group/section"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
                        <div className="p-4 sm:p-6 md:px-8 flex items-center justify-between">
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-500/10 flex items-center justify-center shadow-inner border border-border group-hover/section:border-purple-500/30 transition-all duration-300">
                                    <Bell size={20} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-base sm:text-lg font-bold text-text-primary tracking-tight">Push Notifications</p>
                                    <p className="text-xs sm:text-sm text-text-muted mt-0.5 hidden sm:block">Alerts for significant traffic spikes</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                                    Coming Soon
                                </span>
                                <button
                                    onClick={() => setNotifications(!notifications)}
                                    disabled
                                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 outline-none flex items-center p-1 opacity-50 cursor-not-allowed ${notifications ? 'bg-indigo-500' : 'bg-surface-active'}`}
                                    aria-label="Toggle notifications"
                                >
                                    <motion.div layout className={`w-4 h-4 rounded-full bg-white shadow-md ${notifications ? 'ml-auto' : 'mr-auto'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
                        className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl relative group/section"
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
                        <div className="p-4 sm:p-6 md:px-8 flex items-center justify-between">
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/10 flex items-center justify-center shadow-inner border border-border group-hover/section:border-orange-500/30 transition-all duration-300">
                                    <Palette size={20} className="text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-base sm:text-lg font-bold text-text-primary tracking-tight">Appearance</p>
                                    <p className="text-xs sm:text-sm text-text-muted mt-0.5 hidden sm:block">Switch between dark &amp; light mode</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="hidden sm:block text-xs font-bold text-text-secondary uppercase tracking-wider">
                                    {theme === "dark" ? "Dark" : "Light"}
                                </span>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-14 h-7 rounded-full relative transition-colors duration-300 outline-none flex items-center px-1 ${theme === "light" ? "bg-indigo-500" : "bg-surface-active"}`}
                                    aria-label="Toggle theme"
                                >
                                    <motion.div
                                        layout
                                        className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center ${theme === "light" ? "ml-auto" : "mr-auto"}`}
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                                    >
                                        {theme === "dark" ? <Moon size={12} className="text-zinc-700" /> : <Sun size={12} className="text-amber-500" />}
                                    </motion.div>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sign Out — visible on all devices, especially useful on mobile where bottom nav has no logout */}
                    {user && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
                            className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl relative group/section hover:border-red-500/20 transition-all duration-300"
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover/section:opacity-100 transition-opacity duration-500" />
                            <button
                                onClick={signOut}
                                className="w-full p-4 sm:p-6 md:px-8 flex items-center gap-3 sm:gap-5 hover:bg-red-500/5 transition-colors group"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-500/10 flex items-center justify-center shadow-inner border border-border group-hover:border-red-500/20 transition-colors">
                                    <LogOut size={20} className="text-red-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-base sm:text-lg font-bold text-red-400 tracking-tight">Sign Out</p>
                                    <p className="text-xs sm:text-sm text-text-muted mt-0.5 hidden sm:block">{user.email}</p>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
