import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, ArrowRight, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-primary selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-6 transition-all">
        <div className="glass container mx-auto flex justify-between items-center px-8 py-4 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 font-black text-2xl text-primary italic tracking-tighter">
            <Zap fill="currentColor" size={28} /> WATCHMANN
          </div>
          <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Satellite Network</a>
            <a href="#about" className="hover:text-white transition-colors">Core Intelligence</a>
            <Link to="/auth" className="glow-btn !px-8 !py-3">Interface Login</Link>
          </div>
          {/* Mobile Login - Icon only */}
          <Link to="/auth" className="md:hidden p-3 bg-primary/10 rounded-xl text-primary">
            <Zap size={20} fill="currentColor" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto relative z-10">
        <section className="pt-24 md:pt-40 pb-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white/[0.03] px-6 py-2 rounded-full border border-white/10 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <Sparkles size={16} className="text-primary animate-pulse" /> Global Trend Monitoring Active
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-8 leading-[0.85] tracking-tighter uppercase italic select-none">
              Stay <br />
              <span className="bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent drop-shadow-2xl">
                Lethal
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed italic uppercase tracking-widest px-4">
              Watchmann monitors real-time tech spikes and crafts viral content strategies tailored to your exact signature.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth" className="glow-btn w-full sm:w-auto inline-flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] px-12 py-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 transition-all">
                Initialize System <ArrowRight size={20} />
              </Link>
              <a href="#features" className="w-full sm:w-auto px-12 py-6 text-xs font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                Satellite Specs
              </a>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mt-40 md:mt-60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-40">
          <FeatureCard 
            icon={<Globe className="text-primary" size={32} />} 
            title="Satellite Feed" 
            label="Neural Hub"
            description="Real-time news aggregation from TechCrunch, Verge, and HackerNews piped directly to your studio."
          />
          <FeatureCard 
            icon={<Cpu className="text-secondary" size={32} />} 
            title="Core Forge" 
            label="Synth Engine"
            description="Convert raw headlines into high-conversion threads using our signature-matching AI architecture."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-400" size={32} />} 
            title="Peak Sync" 
            label="Time Protocol"
            description="Detect trending spikes early and schedule your response for maximum global impact."
          />
        </section>

        {/* CTA Banner */}
        <section className="px-6 pb-40">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            className="glass p-12 md:p-24 text-center border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Zap size={200} fill="currentColor" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">Ready to dominate?</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-12 font-bold uppercase tracking-widest text-xs leading-loose">
              Join the new generation of creators using systemic automation to out-post and out-think the industry.
            </p>
            <Link to="/auth" className="glow-btn inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] px-16 py-6">
              Enter The Watch <TrendingUp size={18} />
            </Link>
          </motion.div>
        </section>
      </main>
      
      <footer className="py-20 text-center border-t border-white/5 relative z-10 bg-[#030303]">
        <div className="flex items-center justify-center gap-3 font-black text-xl text-primary italic tracking-tighter mb-6">
          <Zap fill="currentColor" size={24} /> WATCHMANN
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">Built for the Lethal Content Creator &copy; 2025</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, label }) => (
  <motion.div 
    whileHover={{ y: -15 }}
    className="glass p-12 text-left relative group border-white/5 hover:border-primary/20 transition-all duration-500"
  >
    <div className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-slate-800 italic group-hover:text-primary/20 transition-colors">
      {label}
    </div>
    <div className="w-16 h-16 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-3xl font-black mb-6 italic uppercase tracking-tighter">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-lg italic">{description}</p>
    <div className="mt-10 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
  </motion.div>
);

export default Landing;
