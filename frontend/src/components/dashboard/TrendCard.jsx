import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const TrendCard = memo(({ trend, idx, generating, onGenerate }) => {
  const isGenerating = generating === trend.id;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: idx * 0.08 }} 
      className="premium-card !p-5 lg:!p-6 group relative bg-surface/40 overflow-hidden"
    >
      <div className="relative z-10 flex flex-col justify-between items-start gap-4 lg:gap-5 w-full">
        <div className="space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-3 text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] text-slate-800 group-hover:text-primary transition-colors break-words">
            <span className="px-3 py-1.5 border border-white/10 rounded-lg whitespace-nowrap bg-surface/20">{trend.platform} Uplink</span>
            {trend.virality && <span className="text-primary italic whitespace-nowrap">Alpha: {trend.virality}% Velocity</span>}
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-white leading-snug tracking-tight italic group-hover:not-italic transition-all duration-700 break-words">
            {trend.headline}
          </h3>
          <p className="text-slate-500 font-medium text-xs lg:text-sm leading-relaxed w-full group-hover:text-slate-300 transition-colors lowercase first-letter:uppercase break-words">
            {trend.description}
          </p>
        </div>
        <div className="w-full pt-4 border-t border-white/5 flex justify-end">
          <button 
            disabled={generating !== null} 
            onClick={() => onGenerate(trend.id)} 
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 !px-5 !py-2.5 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            aria-label={`Generate strategy for ${trend.headline}`}
          >
            {isGenerating ? 'Decrypting...' : 'Forge'} 
            <Zap size={14} fill="currentColor" className={isGenerating ? "animate-pulse" : "group-hover/btn:scale-110 transition-transform"} />
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
});

TrendCard.displayName = 'TrendCard';
