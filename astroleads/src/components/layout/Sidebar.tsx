import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/stores';
import { APP_NAME, NAV_ITEMS } from '@/lib/constants';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();

    return (
        <aside
            className={cn(
                'bg-astro-950 border-r border-astro-800 h-screen fixed left-0 top-0 flex flex-col z-20 transition-all duration-300 ease-in-out',
                isSidebarCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header */}
            <div
                className={cn(
                    'p-6 flex items-center border-b border-astro-800 relative transition-all duration-300',
                    isSidebarCollapsed ? 'justify-center' : 'gap-3'
                )}
            >
                <div className="w-8 h-8 shrink-0 bg-astro-gold/10 border border-astro-gold/20 rounded-lg flex items-center justify-center text-astro-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                    <Rocket size={20} />
                </div>

                <div
                    className={cn(
                        'overflow-hidden transition-all duration-300',
                        isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    )}
                >
                    <h1 className="text-xl font-bold text-white tracking-tight neon-text-glow-small whitespace-nowrap">
                        {APP_NAME}
                    </h1>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-astro-800 border border-astro-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-astro-gold hover:bg-astro-900 transition-all shadow-lg z-30"
                    aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isSidebarCollapsed ? (
                        <ChevronRight size={12} />
                    ) : (
                        <ChevronLeft size={12} />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={isSidebarCollapsed ? item.label : ''}
                            className={cn(
                                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                                isActive
                                    ? 'bg-astro-gold/10 text-astro-gold border border-astro-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                    : 'text-neutral-400 hover:bg-astro-800 hover:text-white border border-transparent',
                                isSidebarCollapsed ? 'justify-center' : ''
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    'shrink-0 transition-colors',
                                    isActive
                                        ? 'text-astro-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]'
                                        : 'text-neutral-500 group-hover:text-white'
                                )}
                            />

                            <span
                                className={cn(
                                    'font-medium text-sm relative z-10 whitespace-nowrap transition-all duration-300',
                                    isSidebarCollapsed
                                        ? 'w-0 opacity-0 translate-x-10 hidden'
                                        : 'w-auto opacity-100 translate-x-0'
                                )}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-astro-gold/5 to-transparent pointer-events-none" />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer / Usage Limit */}
            <div className="p-4 border-t border-astro-800">
                <div
                    className={cn(
                        'bg-astro-900/50 rounded-xl border border-astro-800 transition-all duration-300',
                        isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-4'
                    )}
                >
                    {!isSidebarCollapsed ? (
                        <>
                            <p className="text-xs text-neutral-400 mb-2 font-medium uppercase tracking-wider whitespace-nowrap">
                                Limite d'utilisation
                            </p>
                            <div className="w-full bg-astro-950 rounded-full h-1.5 mb-2 overflow-hidden">
                                <div
                                    className="bg-astro-gold h-1.5 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    style={{ width: '65%' }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                                <span>12,450</span>
                                <span>20,000</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-1 group relative">
                            <div className="w-1.5 h-12 bg-astro-950 rounded-full overflow-hidden">
                                <div
                                    className="bg-astro-gold w-full rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    style={{ height: '65%' }}
                                />
                            </div>
                            <div className="absolute left-full ml-4 bg-astro-900 border border-white/10 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                65% Utilisé
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
