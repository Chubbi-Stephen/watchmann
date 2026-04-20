import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, TrendingUp, BarChart3, Infinity as InfinityIcon, Zap } from 'lucide-react';
import { TrendCard } from '../TrendCard';

export const OperationalTab = memo(({ trends = [], posts = [], analytics, loading, handleGenerate, generating, fetchDashboardData }) => {
  const scheduledPosts = posts.filter(p => p.status === 'Scheduled');

  return (
    <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="space-y-6">
          <h1 className="text-super-scale italic">
            Ready, <span className="text-primary not-italic underline decoration-white/5 decoration-[12px] underline-offset-[12px]">NODE</span>
          </h1>
          <div className="flex items-center gap-5 text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px]" aria-live="polite">
            <div className="flex gap-1.5 h-3 items-end" aria-hidden="true">
              {[1,2,3].map(i => <motion.div key={i} animate={{height: [4, 12, 4]}} transition={{duration: 0.6 + (i*0.2), repeat: Infinity}} className="w-1 bg-primary/40 rounded-full" />)}
            </div>
            Neural Synchronisation Stable
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10 items-start">
        {/* Pulse Ingestion Feed */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-8 lg:space-y-10 min-w-0" aria-label="Pulse Intercept Feed">
          <div className="flex items-center justify-between gap-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic shrink-0">Pulse Intercept</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="px-6 py-2 rounded-full border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-[0.4em] italic">Active Scan</div>
          </div>
          <div className="grid grid-cols-1 gap-10" role="list">
            {trends.length === 0 && !loading ? (
              <p className="text-slate-500 italic">No trends incoming at the moment.</p>
            ) : (
              trends.map((trend, idx) => (
                <div role="listitem" key={trend.id || idx}>
                  <TrendCard trend={trend} idx={idx} generating={generating} onGenerate={handleGenerate} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Secondary Command Nodes */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-8 lg:space-y-10 min-w-0 sticky top-10">
           {/* Relay Slat */}
           <section className="premium-card space-y-8 !p-6 lg:!p-8" aria-labelledby="relay-slat-title">
              <div className="flex items-center gap-4 text-white border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Calendar size={18} className="text-primary" aria-hidden="true" />
                </div>
                <h3 id="relay-slat-title" className="text-lg font-bold uppercase tracking-widest italic">Relay Slat</h3>
              </div>
              <div className="space-y-4">
                {scheduledPosts.slice(0, 3).map(post => (
                  <div key={post.id} className="group flex justify-between items-center p-5 rounded-2xl bg-surface/40 border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="space-y-1">
                       <div className="flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                         <span className="text-[11px] font-extrabold text-white uppercase tracking-wider italic">{post.platformTarget} HUB</span>
                       </div>
                       <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] ml-5">T-Minus Routing...</div>
                    </div>
                    <Clock size={16} className="text-primary/40 group-hover:text-primary transition-colors" aria-hidden="true" />
                  </div>
                ))}
                {scheduledPosts.length === 0 && (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-surface/20">
                     <InfinityIcon className="mx-auto text-slate-600 mb-4" size={24} aria-hidden="true" />
                     <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500">No Live Slats</div>
                  </div>
                )}
                <button className="w-full pt-4 text-[10px] font-extrabold uppercase tracking-[0.5em] text-slate-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Operational Vault</button>
              </div>
           </section>

           {/* Efficiency Card */}
           <section className="premium-card space-y-8 !p-8" aria-labelledby="efficiency-title">
              <div className="flex items-center gap-4 text-white border-b border-white/5 pb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <TrendingUp size={18} className="text-primary" aria-hidden="true" />
                </div>
                <h3 id="efficiency-title" className="text-lg font-bold uppercase tracking-widest italic">Efficiency</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <div className="p-6 bg-surface/40 hover:bg-surface/60 border border-white/5 hover:border-white/10 transition-colors rounded-2xl flex justify-between items-center group">
                    <div className="space-y-1">
                       <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Signals</div>
                       <div className="text-2xl font-black text-white">{analytics?.metrics?.totalPosts || 0}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 size={20} className="text-slate-400 group-hover:text-white" aria-hidden="true" />
                    </div>
                 </div>
                 <div className="p-6 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 transition-colors rounded-2xl flex justify-between items-center group shadow-[0_0_20px_rgba(190,242,100,0.02)]">
                    <div className="space-y-1">
                       <div className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Impact Avg</div>
                       <div className="text-2xl font-black text-primary italic">{analytics?.metrics?.viralityAvg || 0}%</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <Zap size={20} className="text-primary" fill="currentColor" aria-hidden="true" />
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </motion.div>
  );
});

OperationalTab.displayName = 'OperationalTab';
