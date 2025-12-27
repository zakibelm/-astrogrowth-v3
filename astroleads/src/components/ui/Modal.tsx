import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
}

const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
}) => {
    // Handle escape key
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className={cn(
                    'relative w-full bg-astro-900 border border-astro-gold/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden',
                    sizes[size]
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 border-b border-white/10 bg-white/5">
                        <div>
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-xl font-bold text-white neon-text-glow-small"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-sm text-neutral-400 mt-1">{description}</p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Modal sub-components
export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

export const ModalBody: React.FC<ModalBodyProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
};

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export const ModalFooter: React.FC<ModalFooterProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                'px-6 py-4 border-t border-white/10 bg-black/20 flex justify-end gap-3',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
