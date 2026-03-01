"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createSupabaseBrowser();

        // Get initial session
        supabase.auth.getUser().then(({ data: { user: u } }) => {
            setUser(u);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        // Use the server-side signout route to clear cookies properly
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/auth/signout";
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
