import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/stores';
import type { Toast as ToastType, ToastType as ToastVariant } from '@/types';

const toastConfig: Record<ToastVariant, { icon: typeof CheckCircle; iconClass: string; borderClass: string }> = {
    success: {
        icon: CheckCircle,
        iconClass: 'text-green-400',
        borderClass: 'border-green-500/30',
    },
    error: {
        icon: XCircle,
        iconClass: 'text-red-400',
        borderClass: 'border-red-500/30',
    },
    warning: {
        icon: AlertTriangle,
        iconClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
    },
    info: {
        icon: Info,
        iconClass: 'text-blue-400',
        borderClass: 'border-blue-500/30',
    },
};

interface ToastItemProps {
    toast: ToastType;
    onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 bg-astro-900/95 backdrop-blur-lg rounded-xl border shadow-lg animate-slide-up',
                config.borderClass
            )}
            role="alert"
        >
            <Icon className={cn('shrink-0 mt-0.5', config.iconClass)} size={20} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-neutral-400 mt-1">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-1 text-neutral-500 hover:text-white transition-colors rounded"
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useUIStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
            aria-live="polite"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onDismiss={removeToast} />
                </div>
            ))}
        </div>
    );
};

// Hook for easier toast usage (alternative to store direct access)
export const useToast = () => {
    const { showSuccess, showError, showWarning, showInfo } = useUIStore();

    return {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
    };
};
