import React, { useEffect, useState } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LocalTimeBadgeProps {
    timezone?: string;
    location?: string;
    className?: string;
}

export const LocalTimeBadge: React.FC<LocalTimeBadgeProps> = ({ timezone, location, className }) => {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        // Initial set
        setTime(new Date());

        // Update every minute
        const timer = setInterval(() => {
            setTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    if (!timezone) return null;

    // Calculate time in target timezone
    let localTimeStr = '';
    let hour = 0;

    try {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const formatter = new Intl.DateTimeFormat('fr-FR', options);
        localTimeStr = formatter.format(time);

        // Parse hour for business logic
        const hourStr = localTimeStr.split(':')[0];
        hour = parseInt(hourStr, 10);
    } catch (e) {
        console.warn('Invalid timezone', timezone);
        return null;
    }

    // Determine Status
    // Business hours: 8:00 - 18:00
    const isBusinessHours = hour >= 8 && hour < 18;
    const isLateNight = hour >= 22 || hour < 6;

    let variantClasses = '';
    let Icon = Clock;

    if (isBusinessHours) {
        variantClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        Icon = Sun;
    } else if (isLateNight) {
        variantClasses = 'bg-red-500/10 text-red-400 border-red-500/20';
        Icon = Moon;
    } else {
        // Evening / Morning
        variantClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        Icon = Clock;
    }

    return (
        <div className={cn('flex flex-col items-end', className)}>
            <div
                className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors",
                    variantClasses
                )}
                title={`Heure locale à ${location || timezone}`}
            >
                <Icon size={12} />
                <span>{localTimeStr}</span>
            </div>
            {location && (
                <span className="text-[10px] text-neutral-500 mt-0.5">
                    {location}
                </span>
            )}
        </div>
    );
};
