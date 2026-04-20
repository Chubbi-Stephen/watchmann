import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, ArrowRight, ShieldCheck, Cpu, Globe, Infinity as InfinityIcon, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface text-slate-400 font-inter selection:bg-primary/30 relative overflow-hidden">
      {/* Precision Substrate */}
      <div className="fixed inset-0 grid-overlay opacity-40 pointer-events-none" />
      
      {/* Depth Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-primary/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-accent/5 blur-[160px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5 glass bg-surface/20 border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 font-black text-2xl text-white tracking-tighter group cursor-pointer">
            <div className="relative">
              <img src="/logo.png" alt="W/M" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="tracking-[-0.05em]">WATCHMANN</span>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
            <a href="#features" className="hover:text-primary transition-colors">Intelligence</a>
            <a href="#protocols" className="hover:text-primary transition-colors">Protocols</a>
            <Link to="/auth" className="btn-primary !px-8 !py-4 !text-[10px]">Command Hub</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-4 bg-white/5 rounded-2xl text-primary border border-white/5">
            <div className="flex flex-col gap-1 w-5"><div className="h-0.5 w-full bg-primary/60 rounded-full"></div><div className="h-0.5 w-full bg-primary/60 rounded-full"></div><div className="h-0.5 w-full bg-primary/60 rounded-full"></div></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/98 z-[60] backdrop-blur-3xl" />
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed top-0 inset-x-0 z-[70] p-6">
              <div className="glass p-12 space-y-12 bg-surface">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 font-black text-xl text-white tracking-tighter italic">WATCHMANN</div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-white/5 rounded-2xl text-slate-500"><X size={24} /></button>
                </div>
                <nav className="flex flex-col gap-10 text-center">
                   <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-white uppercase tracking-widest">Intelligence</a>
                   <a href="#protocols" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-white uppercase tracking-widest">Protocols</a>
                   <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="btn-primary">Initialize Link</Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-48 lg:pt-64">
        {/* Advanced Hero */}
        <section className="px-6 max-w-7xl mx-auto text-center pb-48">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-3 bg-white/[0.02] px-6 py-2 rounded-full border border-white/5 mb-14 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Signal Sync Active
            </div>
            
            <h1 className="text-super-scale mb-12 uppercase italic leading-[0.8]">
              Stay <span className="text-primary not-italic">Lethal</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-20 font-medium leading-relaxed tracking-tight px-4 opacity-80">
              The premium command bridge for technical content strategists. <br className="hidden md:block" /> 
              Forge viral narratives with industrial precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/auth" className="btn-primary w-full sm:w-auto">
                Initialise Protocol <ArrowRight size={18} className="ml-2" />
              </Link>
              <a href="#features" className="btn-secondary w-full sm:w-auto">
                Satellite Specs
              </a>
            </div>
          </motion.div>
        </section>

        {/* Feature Matrix */}
        <section id="features" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 pb-64">
          <FeatureNode 
            icon={<Globe size={28} className="text-primary" />} 
            tag="SYNC"
            title="Signal Global" 
            description="Multi-threaded tech ingestion from the industry's most vital nodes."
          />
          <FeatureNode 
            icon={<Cpu size={28} className="text-primary" />} 
            tag="FORGE"
            title="Neural Core" 
            description="Synthesis-layer generation using bespoke competitive strategies."
          />
          <FeatureNode 
            icon={<Target size={28} className="text-primary" />} 
            tag="ALPHA"
            title="Saturate" 
            description="Detect alpha-stage trends before they reach center-mass volume."
          />
        </section>

        {/* System CTA */}
        <section className="px-6 pb-64">
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }} 
            initial={{ opacity: 0, y: 40 }}
            className="premium-card relative overflow-hidden group py-32 text-center"
          >
            <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-12 border border-primary/20">
                <InfinityIcon className="text-primary" size={32} />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-10">Elite Performance</h2>
              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-16 opacity-80">
                Out-post, out-think, and out-perform the market with systematized content dominance.
              </p>
              <Link to="/auth" className="btn-primary px-16">
                Establish Command Link <Sparkles size={16} className="ml-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      
      <footer className="py-32 bg-surface/50 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4 text-white font-black text-xl tracking-tighter">
            <Zap fill="currentColor" size={20} className="text-primary" /> WATCHMANN
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-800">
             <span>System v4.0.2</span>
             <span className="hover:text-primary transition-colors cursor-pointer">Security</span>
             <span className="hover:text-primary transition-colors cursor-pointer">Terminals</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureNode = ({ icon, title, description, tag }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="premium-card group relative p-12"
  >
    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800 absolute top-10 right-12 group-hover:text-primary transition-colors">
      {tag}
    </div>
    <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight italic group-hover:not-italic transition-all">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-sm group-hover:text-slate-400 transition-colors uppercase tracking-tight">{description}</p>
    <div className="mt-12 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
  </motion.div>
);

export default Landing;
