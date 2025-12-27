import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium';
    size?: 'sm' | 'md';
}

const variants = {
    default: 'bg-astro-gold/10 border-astro-gold/20 text-astro-gold',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    premium: 'bg-gradient-to-r from-astro-gold to-orange-500 text-black border-none shadow-[0_0_15px_rgba(255,215,0,0.4)]',
};

const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'md',
    className,
    children,
    ...props
}) => {
    return (
        <span
            className={cn(
                'inline-flex items-center font-bold uppercase tracking-wide border rounded-lg',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

// Status Badge with dot indicator
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: 'active' | 'inactive' | 'offline' | 'pending' | 'working' | 'idle' | 'paused';
}

const statusConfig = {
    active: { color: 'bg-green-500', text: 'Actif', textColor: 'text-green-400' },
    inactive: { color: 'bg-yellow-500', text: 'Inactif', textColor: 'text-yellow-400' },
    offline: { color: 'bg-neutral-500', text: 'Hors-ligne', textColor: 'text-neutral-400' },
    pending: { color: 'bg-blue-500', text: 'En attente', textColor: 'text-blue-400' },
    working: { color: 'bg-purple-500', text: 'En cours', textColor: 'text-purple-400' },
    idle: { color: 'bg-cyan-500', text: 'Au repos', textColor: 'text-cyan-400' },
    paused: { color: 'bg-orange-500', text: 'En pause', textColor: 'text-orange-400' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    className,
    ...props
}) => {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 text-xs uppercase font-bold',
                config.textColor,
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    config.color,
                    status === 'active' && 'animate-pulse'
                )}
            />
            {config.text}
        </span>
    );
};
