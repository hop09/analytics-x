"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Zap, Eye, EyeOff, Loader2, AlertCircle, User, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const supabase = createSupabaseBrowser();
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            // If email confirmation is enabled, show success message
            // Otherwise, redirect to dashboard
            setSuccess(true);
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle2 size={32} className="text-emerald-400" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">Check your email</h2>
                    <p className="text-text-muted text-sm mb-6">
                        We&apos;ve sent a confirmation link to <span className="text-text-secondary font-medium">{email}</span>. Click the link to activate your account.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-surface border border-border text-text-primary text-sm font-medium hover:bg-surface-hover transition-colors"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px]"
        >
            {/* Logo */}
            <div className="flex flex-col items-center mb-5 sm:mb-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center mb-3 sm:mb-4 relative"
                >
                    <Zap size={24} className="text-white fill-white sm:hidden" />
                    <Zap size={28} className="text-white fill-white hidden sm:block" />
                    <div className="absolute inset-0 bg-indigo-500 blur-[20px] opacity-40 rounded-full -z-10 animate-pulse-glow" />
                </motion.div>
                <h1 className="text-xl sm:text-2xl font-bold heading-gradient">Create account</h1>
                <p className="text-text-muted text-xs sm:text-sm mt-1">Start tracking your links with HOP Analytics</p>
            </div>

            {/* Form Card */}
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden shimmer-border">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-5">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs sm:text-sm font-medium text-text-secondary">
                            Full Name
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted sm:hidden" />
                            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted hidden sm:block" />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-4 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-border-focus focus:ring-1 focus:ring-accent-indigo/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs sm:text-sm font-medium text-text-secondary">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted sm:hidden" />
                            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted hidden sm:block" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-4 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-border-focus focus:ring-1 focus:ring-accent-indigo/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-xs sm:text-sm font-medium text-text-secondary">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted sm:hidden" />
                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted hidden sm:block" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                required
                                minLength={6}
                                className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-12 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-border-focus focus:ring-1 focus:ring-accent-indigo/30 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-icon-muted hover:text-text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium text-text-secondary">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted sm:hidden" />
                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-icon-muted hidden sm:block" />
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                required
                                minLength={6}
                                className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-4 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-border-focus focus:ring-1 focus:ring-accent-indigo/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Creating account…
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </motion.button>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-5 sm:mt-6 text-center space-y-3">
                <p className="text-xs sm:text-sm text-text-muted">
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent-indigo hover:text-indigo-400 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
