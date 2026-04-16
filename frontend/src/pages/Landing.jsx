import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass container mx-auto flex justify-between items-center px-8 py-4 mt-4 sticky top-4 z-50">
        <div className="flex items-center gap-2 font-black text-2xl text-primary">
          <Zap fill="currentColor" /> WATCHMANN
        </div>
        <div className="flex items-center gap-8 font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <Link to="/auth" className="glow-btn !px-5 !py-2 text-sm">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-8 text-sm text-slate-400">
            <Sparkles size={16} className="text-primary" /> AI-Powered Trend Monitoring
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
            Never Miss a <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Viral Moment
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Watchmann monitors real-time tech trends and crafts viral content ideas tailored to your niche. Stay ahead of the curve, every single day.
          </p>

          <Link to="/auth" className="glow-btn inline-flex items-center gap-3 text-lg px-10 py-4">
            Start Creating Free <ArrowRight />
          </Link>
        </motion.div>

        {/* Features Grid */}
        <section id="features" className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <FeatureCard 
            icon={<TrendingUp className="text-primary" />} 
            title="Real-Time Trends" 
            description="We track what's happening in tech the second it breaks, so you're always first to post."
          />
          <FeatureCard 
            icon={<Zap className="text-secondary" />} 
            title="AI Generation" 
            description="Instantly convert headlines into threads, posts, and articles tailored to your voice."
          />
          <FeatureCard 
            icon={<Sparkles className="text-emerald-400" />} 
            title="Daily Highlight" 
            description="Get a curated 'Headline of the Day' with a full content strategy ready to launch."
          />
        </section>
      </main>
      
      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-slate-500">&copy; 2025 Watchmann. Built for Content Creators.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-10 text-left"
  >
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default Landing;
