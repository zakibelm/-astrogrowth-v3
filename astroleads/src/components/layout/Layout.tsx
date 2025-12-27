import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '@/components/ui';
import { useUIStore } from '@/stores';
import { cn } from '@/utils/cn';

export const Layout: React.FC = () => {
    const { isSidebarCollapsed } = useUIStore();

    return (
        <div className="flex min-h-screen bg-astro-900 text-slate-200 font-sans selection:bg-astro-accent selection:text-white">
            <Sidebar />
            <div
                className={cn(
                    'flex-1 flex flex-col transition-all duration-300 ease-in-out',
                    isSidebarCollapsed ? 'ml-20' : 'ml-64'
                )}
            >
                <Header />
                <main className="flex-1 p-8 overflow-y-auto relative">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};
