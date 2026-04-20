import React, { memo } from 'react';
import { motion } from 'framer-motion';

export const ArchiveTab = memo(({ posts = [] }) => (
  <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
    <header className="space-y-6">
      <h1 className="text-super-scale italic uppercase">Archives</h1>
      <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">Deep Ingestion Vault: Historical Matrix Records.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" role="list">
      {posts.length === 0 ? (
        <div className="col-span-full py-12 text-center text-slate-500 italic">No historical records found in vault.</div>
      ) : (
        posts.map((post, idx) => (
          <motion.div 
            key={post.id} 
            role="listitem"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.05 }} 
            className="premium-card flex flex-col gap-10 group h-full"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 italic">{post.platformTarget} PROTOCOL</span>
              <div aria-label={`Status: ${post.status}`} className={`text-[9px] font-bold uppercase tracking-[0.4em] px-4 py-2 rounded-full ${post.status === 'Live' ? 'text-primary bg-primary/10' : 'text-slate-700 bg-white/5'}`}>
                {post.status}
              </div>
            </div>
            <p className="text-slate-300 text-base leading-relaxed font-medium italic group-hover:not-italic transition-all line-clamp-8 px-2 lowercase first-letter:uppercase">"{post.content}"</p>
            <div className="text-[10px] text-slate-800 font-extrabold uppercase tracking-[0.2em] mt-auto pt-8 border-t border-white/5 opacity-40">
              {new Date(post.createdAt).toLocaleDateString()} TS_RECORD
            </div>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
));

ArchiveTab.displayName = 'ArchiveTab';
