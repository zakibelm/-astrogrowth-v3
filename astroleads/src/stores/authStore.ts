import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, meta: { full_name: string; company_name: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Initial loading true to check session

    login: async (email, password) => {
        set({ isLoading: true });

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        // Hardcoded Admin Access for 'production test'
        if (cleanEmail === 'zakibelm66@gmail.com' && cleanPassword === 'Zaki@1204') {
            const adminUser: User = {
                id: 'admin-zaki',
                email: 'zakibelm66@gmail.com',
                name: 'Zaki Belm',
                role: 'admin',
                createdAt: new Date().toISOString(),
            };
            set({ user: adminUser, isAuthenticated: true, isLoading: false });
            return true;
        }

        // Demo fallback
        if (email === 'admin@astroleads.com' && password === 'demo') {
            const demoUser: User = {
                id: 'demo-admin',
                email: 'admin@astroleads.com',
                name: 'Demo Admin',
                role: 'admin',
                createdAt: new Date().toISOString(),
            };
            set({ user: demoUser, isAuthenticated: true, isLoading: false });
            return true;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Fetch profile data if needed, or rely on metadata
                const user: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata.full_name || 'User',
                    role: data.user.user_metadata.role || 'user',
                    createdAt: data.user.created_at,
                };
                set({ user, isAuthenticated: true, isLoading: false });
                return true;
            }
        } catch (error) {
            console.error('Login error:', error);
        }
        set({ isLoading: false, isAuthenticated: false });
        return false;
    },

    signup: async (email, password, meta) => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: meta.full_name,
                        company_name: meta.company_name,
                        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                const user: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: meta.full_name,
                    role: 'user', // Default for now
                    createdAt: data.user.created_at,
                };
                // Note: Supabase might require email confirmation by default. 
                // If so, user might not be logged in immediately depending on settings.
                // For this demo, assuming auto-confirm or session creation.
                set({ user, isAuthenticated: !!data.session, isLoading: false });
                return !!data.session;
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
        set({ isLoading: false });
        return false;
    },

    logout: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    checkSession: async () => {
        set({ isLoading: true });
        // No auto-login for production test
        set({ user: null, isAuthenticated: false, isLoading: false });

        /* 
        // Original Logic (Restored partially)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                  const user: User = {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata.full_name || 'User',
                    role: session.user.user_metadata.role || 'user',
                    createdAt: session.user.created_at,
                };
                set({ user, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            console.error('Session check error:', error);
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
        */
    }
}));
