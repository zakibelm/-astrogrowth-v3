import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getCompanyDomain } from '@/utils/domain';

interface CompanyLogoProps {
    email?: string;
    companyName: string;
    className?: string;
    size?: number;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
    email,
    companyName,
    className,
    size = 24
}) => {
    const [hasError, setHasError] = useState(false);

    const domain = email ? getCompanyDomain(email) : null;
    const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;

    if (!logoUrl || hasError) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-white/5 text-neutral-400 rounded-md",
                    className
                )}
                style={{ width: size, height: size }}
                title={companyName}
            >
                <Building size={size * 0.6} />
            </div>
        );
    }

    return (
        <img
            src={logoUrl}
            alt={`${companyName} logo`}
            onError={() => setHasError(true)}
            className={cn("object-contain rounded-md bg-white", className)}
            style={{ width: size, height: size }}
            loading="lazy"
        />
    );
};
