import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, ArrowRight, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface text-white selection:bg-primary selection:text-black">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-6 transition-all">
        <div className="glass container mx-auto flex justify-between items-center px-8 py-4 border border-white/5 shadow-2xl bg-surface/40 backdrop-blur-3xl">
          <div className="flex items-center gap-4 font-extrabold text-2xl text-primary tracking-tighter group cursor-pointer">
            <img src="/logo.png" alt="W/M" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" /> Watchmann
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">Intelligence</a>
            <Link to="/auth" className="glow-btn !px-6 !py-3 !text-[10px]">Login</Link>
          </div>
          <Link to="/auth" className="md:hidden p-3 bg-primary/10 rounded-xl text-primary">
            <Zap size={18} fill="currentColor" />
          </Link>
        </div>
      </nav>

      <main className="container mx-auto relative z-10">
        <section className="pt-24 md:pt-40 pb-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white/[0.03] px-6 py-2 rounded-full border border-white/10 mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <Sparkles size={14} className="text-primary" /> Multi-Source Trend Monitoring Active
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tighter text-white uppercase select-none">
              Stay <br />
              <span className="text-primary drop-shadow-[0_0_80px_rgba(190,242,100,0.2)]">
                Lethal
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed px-4">
              Monitor real-time tech spikes and craft viral content strategies tailored to your unique creator signature.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/auth" className="glow-btn w-full sm:w-auto inline-flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-5 shadow-[0_0_50px_rgba(190,242,100,0.1)] hover:scale-105 active:scale-95 transition-all">
                Initialize <ArrowRight size={18} />
              </Link>
              <a href="#features" className="w-full sm:w-auto px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400">
                Satellite Specs
              </a>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-40">
          <FeatureCard 
            icon={<Globe className="text-primary" size={28} />} 
            title="Real-time Feed" 
            label="Neural"
            description="Aggregation from TC, Verge, and HN piped directly to your studio."
          />
          <FeatureCard 
            icon={<Cpu className="text-accent" size={28} />} 
            title="Core Forge" 
            label="Synth"
            description="Convert headlines into high-conversion threads using AI architecture."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-secondary" size={28} />} 
            title="Peak Sync" 
            label="Time"
            description="Detect trends early and schedule your response for maximum impact."
          />
        </section>

        <section className="px-6 pb-40">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.98 }}
            className="glass p-12 md:p-20 text-center border-primary/10 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">Ready to dominate?</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-12 font-medium tracking-wide text-sm leading-relaxed">
              Join the next generation of content creators using systemic automation to out-post and out-think the industry.
            </p>
            <Link to="/auth" className="glow-btn inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] px-12 py-5">
              Enter The Watch <TrendingUp size={16} />
            </Link>
          </motion.div>
        </section>
      </main>
      
      <footer className="py-20 text-center border-t border-white/5 relative z-10 bg-surface">
        <div className="flex items-center justify-center gap-3 font-bold text-xl text-primary tracking-tighter mb-4">
          <Zap fill="currentColor" size={20} /> Watchmann
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-700">Built for the Elite Content Creator &copy; 2025</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, label }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-10 text-left relative group border-white/5 hover:border-primary/20 transition-all duration-300"
  >
    <div className="absolute top-6 right-8 text-[9px] font-bold uppercase tracking-widest text-slate-800">
      {label}
    </div>
    <div className="w-12 h-12 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center mb-8 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    <div className="mt-8 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
  </motion.div>
);

export default Landing;
