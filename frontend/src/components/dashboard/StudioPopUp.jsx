import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, Check, Copy } from 'lucide-react';

export const StudioPopUp = ({ posts = [], onClose, onCopy, copiedId, onEdit }) => {
  // Lock body scroll and trap escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="fixed inset-0 bg-black/98 z-[80] backdrop-blur-[120px]" 
        aria-hidden="true"
      />
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-title"
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.98 }} 
        className="fixed inset-4 sm:inset-6 md:inset-10 lg:inset-16 bg-surface border border-white/5 z-[90] rounded-[2.5rem] md:rounded-[4rem] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
        
        <header className="px-8 md:px-14 py-8 md:py-12 border-b border-white/5 flex flex-wrap gap-6 justify-between items-center bg-surface/[0.01] backdrop-blur-3xl relative z-10">
          <div className="flex items-center gap-8">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
               <Sparkles size={28} />
             </div>
             <div className="space-y-1">
               <h2 id="studio-title" className="text-4xl font-black text-white uppercase tracking-tighter italic">Strategy Forge</h2>
               <div className="text-[10px] text-primary/40 font-bold uppercase tracking-[0.5em] animate-pulse">Neural Pathing Active</div>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Close dialog"
          >
            <X size={32} />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 md:p-14 custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 auto-rows-fr relative z-10">
            {posts.map((post, i) => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="premium-card flex flex-col gap-10 hover:bg-white/[0.04] transition-colors"
              >
                 <div className="flex justify-between items-center">
                    <div className="px-6 py-2 rounded-xl bg-primary/5 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.3em] text-primary italic">
                      {post.platformTarget} HUB
                    </div>
                    <button 
                      onClick={() => onCopy(post.content, post.id)} 
                      aria-label="Copy post content"
                      className={`p-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${copiedId === post.id ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-800 hover:text-white bg-white/5'}`}
                    >
                      {copiedId === post.id ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                 </div>
                 
                 <div className="flex-1 bg-black/60 p-10 rounded-[2.5rem] border border-white/[0.02] flex items-center justify-center text-center shadow-inner group">
                   <p className="text-xl text-slate-400 leading-relaxed font-semibold italic tracking-tight lowercase first-letter:uppercase">"{post.content}"</p>
                 </div>
  
                 <div className="grid grid-cols-2 gap-6 p-1.5 rounded-[2.5rem]">
                   <button className="btn-primary !px-0 !py-6 rounded-3xl" aria-label="Transmit to platform">Transmit</button>
                   <button onClick={() => onEdit(post)} className="btn-secondary !px-0 !py-6 rounded-3xl !border-white/5" aria-label="Refine content">Refine</button>
                 </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </>
  );
};
