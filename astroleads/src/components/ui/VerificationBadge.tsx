import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VerificationBadgeProps {
    status?: 'valid' | 'risky' | 'invalid' | 'unknown';
    score?: number;
    className?: string;
    onClick?: () => void;
    isLoading?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    status = 'unknown',
    score,
    className,
    onClick,
    isLoading
}) => {

    if (isLoading) {
        return (
            <div className={cn("inline-flex items-center justify-center w-5 h-5 animate-spin text-slate-400", className)}>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
            </div>
        );
    }

    const getStatusConfig = () => {
        switch (status) {
            case 'valid':
                return {
                    icon: CheckCircle2,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-500/10',
                    label: 'Email Valide'
                };
            case 'risky':
                return {
                    icon: AlertTriangle,
                    color: 'text-amber-500',
                    bg: 'bg-amber-500/10',
                    label: 'Email Risqué'
                };
            case 'invalid':
                return {
                    icon: XCircle,
                    color: 'text-rose-500',
                    bg: 'bg-rose-500/10',
                    label: 'Email Invalide'
                };
            default:
                return {
                    icon: HelpCircle,
                    color: 'text-slate-400',
                    bg: 'bg-slate-500/10',
                    label: 'Non Vérifié'
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-opacity-20",
                config.color,
                config.bg,
                className
            )}
            title={`${config.label} ${score ? `(Score: ${score}%)` : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{status === 'unknown' ? 'Vérifier' : (status === 'valid' ? 'Valide' : status)}</span>
        </div>
    );
};
