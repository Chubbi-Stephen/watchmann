import React from 'react';
import { LogOut, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick} 
    title={label} 
    aria-current={active ? 'page' : undefined}
    className={cn(
      "w-full flex items-center justify-center xl:justify-start gap-4 xl:gap-5 p-4 xl:p-5 rounded-2xl transition-all duration-500 group relative overflow-hidden whitespace-nowrap",
      active 
        ? "bg-primary/5 text-primary border border-primary/20 scale-[1.02]" 
        : "text-slate-800 hover:text-white hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    )}
  >
    <div className={cn(
      "transition-all duration-500 relative z-10 shrink-0",
      active ? "scale-110 text-primary" : "group-hover:scale-105 group-hover:text-slate-400"
    )}>
      {icon}
    </div>
    <span className={cn(
      "hidden xl:block text-[11px] font-bold uppercase tracking-[0.2em] relative z-10 transition-all",
      active ? "opacity-100" : "opacity-40 group-hover:opacity-100"
    )}>
      {label}
    </span>
  </button>
);

export const DesktopSidebar = ({ user, activeTab, onTabChange, onLogout, items }) => {
  return (
    <aside className="hidden lg:flex w-24 xl:w-64 border-r border-white/5 flex-col p-4 xl:p-8 sticky top-0 h-screen z-40 bg-surface/20 backdrop-blur-[120px] shrink-0 items-center xl:items-stretch overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-center xl:justify-start gap-4 font-black text-xl text-white tracking-tighter mb-16 xl:mb-20 group cursor-pointer transition-all">
        <div className="relative shrink-0 w-10 h-10 flex items-center justify-center">
           <img src="/logo.png" alt="" aria-hidden="true" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" /> 
           <div className="absolute inset-0 bg-primary/20 blur-xl scale-0 group-hover:scale-125 transition-all opacity-0 group-hover:opacity-100" />
        </div>
        <span className="opacity-0 xl:opacity-100 transition-opacity whitespace-nowrap overflow-hidden hidden xl:block">WATCHMANN</span>
      </div>
      
      <nav aria-label="Main Navigation" className="flex-1 space-y-4 xl:space-y-6 w-full">
        {items.map(item => (
          <SidebarItem 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            active={activeTab === item.id} 
            onClick={() => onTabChange(item.id)} 
          />
        ))}
      </nav>

      <div className="mt-auto mb-6 xl:mb-10 w-full p-2 xl:p-6 premium-card space-y-0 xl:space-y-6 !border-white/5 flex justify-center xl:justify-start bg-transparent xl:bg-white/[0.015]">
        <div className="label-caps !mb-4 hidden xl:block" id="user-profile-label">Active Profile</div>
        <div className="flex items-center gap-5 justify-center" aria-labelledby="user-profile-label">
           <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 shadow-inner">
             <User size={20} aria-hidden="true" />
           </div>
           <div className="hidden xl:block whitespace-nowrap overflow-hidden">
             <div className="text-white font-bold text-sm uppercase tracking-tight">{user?.identities?.[0]?.identityName || 'PRIMARY'}</div>
             <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">{user?.identities?.[0]?.niche || 'TECH'} SECTOR</div>
           </div>
        </div>
      </div>

      <button 
        onClick={onLogout} 
        aria-label="Logout"
        className="flex items-center justify-center xl:justify-start gap-6 p-4 xl:p-6 text-slate-800 font-bold uppercase tracking-[0.4em] text-[11px] hover:text-red-500 transition-all rounded-2xl hover:bg-red-500/5 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
      >
        <LogOut size={18} className="shrink-0" aria-hidden="true" /> 
        <span className="opacity-0 xl:opacity-100 transition-opacity whitespace-nowrap overflow-hidden hidden xl:block">Abort Link</span>
      </button>
    </aside>
  );
};
