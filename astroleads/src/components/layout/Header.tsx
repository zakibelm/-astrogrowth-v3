import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/stores';

export const Header: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-20 bg-astro-950/80 backdrop-blur-md border-b border-astro-800 sticky top-0 z-10 flex items-center justify-between px-8">
            {/* Search */}
            <div className="flex items-center bg-astro-900 rounded-full px-5 py-2.5 w-96 border border-astro-800 focus-within:border-astro-gold/50 focus-within:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all">
                <Search size={16} className="text-neutral-500 mr-3" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-neutral-600"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <button className="relative text-neutral-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-astro-950 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-astro-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">
                            {user?.name || 'Guest'}
                        </p>
                        <p className="text-xs text-astro-gold/80">
                            {user?.role === 'admin' ? 'Premium Admin' : 'User'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-astro-gold to-orange-500 p-[1px] shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                        <div className="w-full h-full rounded-full bg-astro-900 flex items-center justify-center text-xs font-bold text-astro-gold">
                            {user?.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase() || 'G'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
