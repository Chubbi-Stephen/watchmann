import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { SidebarItem } from './Sidebar';

export const MobileHeader = ({ mobileMenuOpen, setMobileMenuOpen }) => (
  <div className="lg:hidden fixed top-0 inset-x-0 z-[60] px-8 py-5 flex justify-between items-center bg-surface/80 backdrop-blur-xl border-b border-white/5">
    <div className="flex items-center gap-4 font-black text-xl text-white tracking-tighter">
      <img src="/logo.png" alt="Watchmann Logo" className="w-8 h-8" /> 
      <span>Watchmann</span>
    </div>
    <button 
      onClick={() => setMobileMenuOpen(prev => !prev)} 
      aria-expanded={mobileMenuOpen}
      aria-label="Toggle navigation menu"
      className="p-4 bg-white/5 rounded-2xl text-primary border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {mobileMenuOpen ? (
        <X size={24} aria-hidden="true" />
      ) : (
        <div className="flex flex-col gap-1.5 w-6" aria-hidden="true">
          <div className="h-0.5 w-full bg-primary/60 rounded-full"></div>
          <div className="h-0.5 w-full bg-primary/60 rounded-full"></div>
          <div className="h-0.5 w-full bg-primary/60 rounded-full"></div>
        </div>
      )}
    </button>
  </div>
);

export const MobileNavigation = ({ items, activeTab, onTabChange, onLogout, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="fixed inset-0 bg-black/95 z-[70] backdrop-blur-3xl" 
          aria-hidden="true"
        />
        <motion.aside 
          initial={{ x: '-100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '-100%' }} 
          transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
          className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-surface/50 backdrop-blur-3xl z-[80] border-r border-white/5 p-12 flex flex-col pt-32 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <nav className="flex-1 space-y-6">
            {items.map(item => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => { onTabChange(item.id); onClose(); }} 
              />
            ))}
          </nav>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-6 p-6 text-slate-800 font-bold uppercase tracking-[0.4em] text-[10px] mt-auto hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded-xl"
          >
            <LogOut size={18} aria-hidden="true" /> <span>Abort Link</span>
          </button>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);
