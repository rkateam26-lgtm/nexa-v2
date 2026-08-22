import React from 'react';
import { RestaurantInfo } from '@/types/client';

interface HeaderProps {
  restaurant: RestaurantInfo;
}

export const Header: React.FC<HeaderProps> = ({ restaurant }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Logo Nexa & Restaurant Branding */}
        <div className="flex items-center gap-3">
          {/* Nexa Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-red-500/20">
              N
            </div>
            <span className="font-extrabold tracking-wider text-white text-base font-sans">
              NEXA
            </span>
          </div>

          <div className="h-5 w-px bg-slate-800" />

          {/* Restaurant Logo & Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg">
              {restaurant.logoUrl || '🍽️'}
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-100 leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium leading-none">
                {restaurant.welcomeMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Actif</span>
        </div>
      </div>
    </header>
  );
};
