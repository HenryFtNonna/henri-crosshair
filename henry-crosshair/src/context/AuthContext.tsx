import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/SupabaseClient";
import type { Session, User } from "@supabase/supabase-js";


type AuthContextType = {
  user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error ? : Error}>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null > (null);
    const [session, setSession] = useState<Session | null > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            const session = data?.session ?? null;
            setSession(session ?? null);
            setUser(session?.user ?? null);
            setLoading(false);
        }); 

        const { data: listener } = supabase.auth.onAuthStateChange((_event, data) => { 
                const session = data?.session ?? null;
                setSession(session);
                setUser(session?.user ?? null);
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe?.();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (data?.user) {
            setUser(data.user);
            setSession(data.session ?? null);
        }
            return { error }
        };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

            useEffect(() => {
        console.log("Session changed:", session);
        console.log("User changed:", user);
        }, [session, user]);


    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}; 

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
