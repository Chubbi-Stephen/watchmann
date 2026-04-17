import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap, ShieldCheck, Sparkles, Orbit } from 'lucide-react';
import api from '../lib/api';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, formData);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      if (res.data.hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication sequence failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-14 pr-7 py-5 bg-white/[0.01] border border-white/5 rounded-2xl focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-slate-800 font-bold uppercase tracking-widest text-xs";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-surface overflow-hidden relative selection:bg-primary/40 selection:text-black">
      {/* Precision Grid Substrate */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-accent/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-slow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass max-w-xl w-full p-8 sm:p-12 md:p-16 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-white/5 bg-surface/40 backdrop-blur-[120px]"
      >
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-5 font-black text-2xl text-white tracking-tighter mb-10 cursor-pointer group">
            <div className="relative">
              <img src="/logo.png" alt="W/M" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 blur-xl scale-0 group-hover:scale-150 transition-all opacity-0 group-hover:opacity-100" />
            </div>
            <span className="tracking-[-0.05em]">WATCHMANN</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tighter italic">
            {isLogin ? 'Access Core' : 'Init System'}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
             <div className="w-12 h-[1px] bg-white/5"></div>
             <p className="text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px]">
               {isLogin ? 'Mission Verification' : 'Establishing Node'}
             </p>
             <div className="w-12 h-[1px] bg-white/5"></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/5 border border-red-500/10 text-red-500 p-6 rounded-2xl mb-10 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 italic"
            >
              <ShieldCheck size={18} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          {!isLogin && (
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 group-focus-within:text-primary transition-colors ml-1 italic">Operator Call-Sign</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="E.G. COMMANDER_01"
                  required
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-3 group">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 group-focus-within:text-primary transition-colors ml-1 italic">Satellite Uplink</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="HQ@WATCHMANN.IO"
                required
                className={inputClasses}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3 group">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 group-focus-within:text-primary transition-colors ml-1 italic">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className={inputClasses}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-8">
            <button 
            disabled={loading} 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center gap-5 py-6"
          >
            {loading ? 'Processing Sequence...' : (isLogin ? 'Establish Link' : 'Register Protocol')} 
            {!loading && <ArrowRight size={20} />}
          </button>
          </div>
        </form>

        <div className="text-center mt-12 space-y-6">
          <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
             <span className="relative px-4 bg-transparent text-[10px] font-black text-slate-800 uppercase tracking-[0.6em]">OR</span>
          </div>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 font-black hover:text-white transition-all uppercase tracking-[0.4em] text-[11px] italic underline decoration-transparent hover:decoration-primary decoration-2 underline-offset-8"
          >
            {isLogin ? 'Request New Node Entry' : 'Return to Core Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
