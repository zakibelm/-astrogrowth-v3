import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
    className,
    style,
    ...props
}) => {
    const baseStyles = 'bg-astro-700/50';

    const variantStyles = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: '',
    };

    return (
        <div
            className={cn(
                baseStyles,
                variantStyles[variant],
                animationStyles[animation],
                className
            )}
            style={{
                width: width,
                height: height || (variant === 'text' ? '1em' : undefined),
                ...style,
            }}
            aria-hidden="true"
            {...props}
        />
    );
};

// Pre-built skeleton components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('neon-glass-card p-6 space-y-4', className)}>
        <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={12} />
            </div>
        </div>
        <Skeleton variant="rectangular" height={100} />
        <div className="flex gap-2">
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
        </div>
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
    rows = 5,
    className,
}) => (
    <div className={cn('neon-glass-card overflow-hidden', className)}>
        <div className="p-4 border-b border-white/10 flex gap-4">
            <Skeleton variant="text" width="20%" height={16} />
            <Skeleton variant="text" width="15%" height={16} />
            <Skeleton variant="text" width="25%" height={16} />
            <Skeleton variant="text" width="15%" height={16} />
            <Skeleton variant="text" width="10%" height={16} />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4 border-b border-white/5 flex gap-4 items-center">
                <Skeleton variant="text" width="20%" height={14} />
                <Skeleton variant="text" width="15%" height={14} />
                <Skeleton variant="text" width="25%" height={14} />
                <Skeleton variant="rectangular" width={60} height={24} />
                <Skeleton variant="text" width="10%" height={14} />
            </div>
        ))}
    </div>
);

export const SkeletonStats: React.FC<{ count?: number; className?: string }> = ({
    count = 4,
    className,
}) => (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="neon-glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                    <Skeleton variant="rectangular" width={48} height={48} />
                    <Skeleton variant="rectangular" width={60} height={24} />
                </div>
                <Skeleton variant="text" width="50%" height={12} className="mb-2" />
                <Skeleton variant="text" width="70%" height={28} />
            </div>
        ))}
    </div>
);
