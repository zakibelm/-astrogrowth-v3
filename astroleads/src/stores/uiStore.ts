import { create } from 'zustand';
import type { Toast, ToastType } from '@/types';

interface UIState {
    // Sidebar
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Toasts
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Helpers
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;

    // Loading states
    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;

    // Theme
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
}

const createToast = (type: ToastType, title: string, message?: string): Toast => ({
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    duration: type === 'error' ? 5000 : 3000,
});

export const useUIStore = create<UIState>((set, get) => ({
    // Sidebar
    isSidebarCollapsed: false,

    toggleSidebar: () => {
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
    },

    setSidebarCollapsed: (collapsed) => {
        set({ isSidebarCollapsed: collapsed });
    },

    // Toasts
    toasts: [],

    addToast: (toastData) => {
        const toast: Toast = {
            ...toastData,
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
            toasts: [...state.toasts, toast],
        }));

        // Auto-remove after duration
        const duration = toast.duration || 3000;
        setTimeout(() => {
            get().removeToast(toast.id);
        }, duration);
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },

    clearToasts: () => {
        set({ toasts: [] });
    },

    // Toast helpers
    showSuccess: (title, message) => {
        const toast = createToast('success', title, message);
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => get().removeToast(toast.id), toast.duration);
    },

    showError: (title, message) => {
        const toast = createToast('error', title, message);
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => get().removeToast(toast.id), toast.duration);
    },

    showWarning: (title, message) => {
        const toast = createToast('warning', title, message);
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => get().removeToast(toast.id), toast.duration);
    },

    showInfo: (title, message) => {
        const toast = createToast('info', title, message);
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => get().removeToast(toast.id), toast.duration);
    },

    // Global loading
    globalLoading: false,

    setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
    },

    // Theme
    theme: 'dark',

    setTheme: (theme) => {
        set({ theme });
    },
}));
