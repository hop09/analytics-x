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
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface SettingsClientProps {
    supabaseUrl: string;
    isConnected: boolean;
}

export default function SettingsClient({ supabaseUrl, isConnected }: SettingsClientProps) {
    const [notifications, setNotifications] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    return (
        <PageTransition>
            <div className="max-w-[1000px] mx-auto space-y-8">
                <div className="flex flex-col mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold heading-gradient tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm md:text-base text-text-muted mt-2">
                        Configure your workspace and integrations
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }}
                        className="glass-panel overflow-hidden rounded-3xl"
                    >
                        <div onClick={() => toggleSection("supabase")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleSection("supabase"); }} role="button" tabIndex={0} className="p-6 md:px-8 flex items-center justify-between cursor-pointer hover:bg-surface-hover/50 transition-colors group">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border border-border ${isConnected ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                    <Database size={22} className={isConnected ? "text-emerald-400" : "text-red-400"} />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-primary tracking-tight">Supabase Connection</p>
                                    <p className="text-sm text-text-muted mt-0.5 group-hover:text-text-secondary transition-colors">Database and authentication sync</p>
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
                        className="glass-panel overflow-hidden rounded-3xl"
                    >
                        <div onClick={() => toggleSection("bot")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleSection("bot"); }} role="button" tabIndex={0} className="p-6 md:px-8 flex items-center justify-between cursor-pointer hover:bg-surface-hover/50 transition-colors group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-inner border border-border">
                                    <ShieldCheck size={22} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-primary tracking-tight">Bot Detection Engine</p>
                                    <p className="text-sm text-text-muted mt-0.5 group-hover:text-text-secondary transition-colors">Manage crawler identification rules</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="hidden sm:flex px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                    Active (35+ Rules)
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
                                            The advanced bot detection engine is currently monitoring traffic against 35+ known bot user-agent signatures including major social networks and search indexers. Detected bots are served custom OG metadata, while legitimate users bypass validation instantly.
                                        </p>
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {["Facebook", "TikTok", "Twitter", "LinkedIn", "WhatsApp", "Discord", "Google", "Bing", "Slack", "Telegram"].map((bot) => (
                                                <span key={bot} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-default">
                                                    {bot}
                                                </span>
                                            ))}
                                            <span className="px-3 py-1.5 rounded-lg bg-surface/30 border border-transparent text-xs font-bold text-text-muted cursor-default">
                                                +25 more signatures
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                        className="glass-panel overflow-hidden rounded-3xl"
                    >
                        <div className="p-6 md:px-8 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shadow-inner border border-border">
                                    <Bell size={22} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-primary tracking-tight">Push Notifications</p>
                                    <p className="text-sm text-text-muted mt-0.5">Alerts for significant traffic spikes</p>
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
                        className="glass-panel overflow-hidden rounded-3xl"
                    >
                        <div className="p-6 md:px-8 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shadow-inner border border-border">
                                    <Palette size={22} className="text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-primary tracking-tight">Appearance</p>
                                    <p className="text-sm text-text-muted mt-0.5">Switch between dark &amp; light mode</p>
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
                </div>
            </div>
        </PageTransition>
    );
}
