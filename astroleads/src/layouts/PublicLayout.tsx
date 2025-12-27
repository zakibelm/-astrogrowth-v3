
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-astro-950 text-white font-outfit relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-astro-900 via-astro-950 to-black -z-10" />
            <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 pointer-events-none" />

            <Outlet />
        </div>
    );
};

export default PublicLayout;
