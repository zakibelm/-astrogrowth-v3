import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'featured' | 'flat';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const variants = {
    default: 'neon-glass-card',
    featured: 'neon-glass-card-featured',
    flat: 'bg-astro-800 border border-astro-700 rounded-xl',
};

const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'md',
            hover = true,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    variants[variant],
                    paddings[padding],
                    !hover && 'hover:transform-none hover:shadow-none hover:border-white/[0.08]',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardHeader: React.FC<CardHeaderProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn('mb-4 pb-4 border-b border-white/10', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

export const CardTitle: React.FC<CardTitleProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <h3
            className={cn('text-lg font-semibold text-white', className)}
            {...props}
        >
            {children}
        </h3>
    );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardContent: React.FC<CardContentProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardFooter: React.FC<CardFooterProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn('mt-4 pt-4 border-t border-white/10', className)}
            {...props}
        >
            {children}
        </div>
    );
};
