import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
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

  const inputClasses = "w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-slate-600 font-medium";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#030303] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass max-w-xl w-full p-8 md:p-16 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 font-black text-2xl text-primary mb-6 italic tracking-tighter">
            <Zap fill="currentColor" size={28} /> WATCHMANN
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white uppercase italic">
            {isLogin ? 'Access Core' : 'Init System'}
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            {isLogin ? 'Satellite sync required' : 'Establishing new creator node'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest flex items-center gap-3"
            >
              <ShieldCheck size={18} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-primary transition-colors ml-2">Operator Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="COMMANDER"
                  required
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-primary transition-colors ml-2">Satellite Link (Email)</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
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

          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-primary transition-colors ml-2">Access Key (Password)</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
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

          <div className="pt-6">
            <button 
              disabled={loading} 
              type="submit" 
              className="glow-btn w-full flex items-center justify-center gap-4 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-4">
                {loading ? 'Processing Sync...' : (isLogin ? 'Establish Link' : 'Register Node')} 
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
              </span>
            </button>
          </div>
        </form>

        <div className="text-center mt-12 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-white/5"></span>
            OR
            <span className="w-8 h-px bg-white/5"></span>
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-black hover:text-primary transition-all uppercase tracking-widest text-[11px] hover:scale-105"
          >
            {isLogin ? 'Execute New Registration' : 'Return to Authorized Login'}
          </button>
        </div>
      </motion.div>

      {/* Floating Sparkles Decor */}
      <div className="hidden xl:block absolute top-[20%] left-[15%] text-primary/20 blur-[1px]"><Sparkles size={60} /></div>
      <div className="hidden xl:block absolute bottom-[20%] right-[15%] text-secondary/20 blur-[1px]"><Sparkles size={40} /></div>
    </div>
  );
};

export default Auth;
