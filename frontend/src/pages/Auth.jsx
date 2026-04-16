import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
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
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-md w-full p-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 font-black text-xl text-primary mb-4">
            <Zap fill="var(--primary)" size={20} /> WATCHMANN
          </div>
          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400">{isLogin ? 'Enter your credentials to continue' : 'Join the watch for viral trends'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  required
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="name@example.com"
                required
                className={inputClasses}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
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

          <button 
            disabled={loading} 
            type="submit" 
            className="glow-btn w-full flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')} <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline ml-1"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
