import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { cn } from '../../../utils/cn';

export const CommandCoreTab = memo(({ user }) => (
  <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-32">
    <header className="space-y-6">
      <h1 className="text-super-scale italic uppercase">Calibrate</h1>
      <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">Node Parameter Management & Active Signatures.</p>
    </header>
    
    <div className="space-y-16">
      <div className="label-caps !mb-12 flex items-center gap-6 text-primary">
        Operational Personas 
        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/10 to-transparent" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8" role="list">
        {user?.identities?.map(identity => (
          <div 
            key={identity.id} 
            role="listitem"
            className={cn(
              "premium-card !p-10 flex items-center justify-between transition-all duration-700 group cursor-pointer",
              identity.isActive && "border-primary/40 bg-primary/[0.02]"
            )}
            aria-current={identity.isActive ? 'true' : 'false'}
          >
              <div className="flex items-center gap-8">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                  identity.isActive ? "bg-primary text-black shadow-[0_0_30px_#bef264]" : "bg-white/5 text-slate-800"
                )}>
                  <User size={24} aria-hidden="true" />
                </div>
                <div>
                    <div className="text-white font-bold text-xl uppercase tracking-tighter">{identity.identityName}</div>
                    <div className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">{identity.identityRole}</div>
                </div>
              </div>
              {identity.isActive && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" aria-label="Active identity indicator" />
              )}
          </div>
        ))}
        <button 
          className="premium-card !border-dashed !border-white/10 flex flex-col items-center justify-center gap-6 text-slate-800 hover:text-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Establish new node persona"
        >
          <div className="w-14 h-14 rounded-2xl border border-dashed border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles size={24} aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Establish Node</span>
        </button>
      </div>
    </div>
  </motion.div>
));

CommandCoreTab.displayName = 'CommandCoreTab';
