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

  const inputClasses = "w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-slate-600 font-medium";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-lg w-full p-8 md:p-12 relative z-10 shadow-2xl bg-surface/60"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6 tracking-tighter">
            <Zap fill="currentColor" size={20} /> Watchmann
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {isLogin ? 'Access Core' : 'Init System'}
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] mt-2">
            {isLogin ? 'Authorized Entry Required' : 'Establishing New Node'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
            >
              <ShieldCheck size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2 group">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 group-focus-within:text-primary transition-colors ml-1">Operator Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. COMMANDER"
                  required
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 group">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 group-focus-within:text-primary transition-colors ml-1">Satellite Link (Email)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
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
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 group-focus-within:text-primary transition-colors ml-1">Access Key (Password)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
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

          <div className="pt-4">
            <button 
              disabled={loading} 
              type="submit" 
              className="glow-btn w-full flex items-center justify-center gap-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]"
            >
              {loading ? 'Processing...' : (isLogin ? 'Establish Link' : 'Register Node')} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </div>
        </form>

        <div className="text-center mt-10 space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">
            OR
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 font-bold hover:text-primary transition-all uppercase tracking-widest text-[10px]"
          >
            {isLogin ? 'Execute New Registration' : 'Return to Authorized Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
