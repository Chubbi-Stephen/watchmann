import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Globe, MessageSquare, ArrowRight, Check, Zap, Target, Star, Infinity as InfinityIcon } from 'lucide-react';
import api from '../lib/api';

const Onboarding = ({ user, setUser }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    identityName: 'Main Persona',
    identityRole: '',
    targetPlatforms: [],
    niche: '',
    tone: 'Professional'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const identities = ['Content Creator', 'Tech Blogger', 'Social Media Manager', 'Entrepreneur', 'SaaS Hacker'];
  const platforms = ['X / Twitter', 'LinkedIn', 'Instagram', 'Threads'];

  const togglePlatform = (p) => {
    if (data.targetPlatforms.includes(p)) {
      setData({ ...data, targetPlatforms: data.targetPlatforms.filter(item => item !== p) });
    } else {
      setData({ ...data, targetPlatforms: [...data.targetPlatforms, p] });
    }
  };

  const handleFinish = async () => {
    if (!data.identityRole || data.targetPlatforms.length === 0 || !data.niche) return;
    setLoading(true);
    try {
      const res = await api.post('/profile/setup', { ...data, isActive: true });
      setUser({ ...user, identities: [res.data.profile] });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-surface overflow-hidden relative selection:bg-primary/40 selection:text-black font-outfit">
      {/* Precision Grid Substrate */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/5 blur-[180px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-accent/5 blur-[180px] rounded-full animate-pulse-slow" />

      <div className="max-w-3xl w-full relative z-10">
        {/* Progress Tracker */}
        <div className="flex justify-center gap-4 md:gap-6 mb-16 md:mb-24">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-4 group">
               <div className={`h-2 w-24 rounded-full transition-all duration-1000 ${step >= i ? 'bg-primary shadow-[0_0_30px_#bef264]' : 'bg-white/5'}`} />
               <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 ${step >= i ? 'text-primary opacity-100' : 'text-slate-800 opacity-40'}`}>Phase 0{i}</span>
            </div>
          ))}
        </div>

        <motion.div layout className="glass p-8 sm:p-12 md:p-16 lg:p-24 border-white/5 bg-surface/40 backdrop-blur-[120px] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-16"
              >
                <div className="space-y-6">
                  <div className="text-primary font-bold uppercase tracking-[0.6em] text-[10px] mb-4 flex items-center gap-4">
                    <div className="w-10 h-[1px] bg-primary/20"></div> System Initialization
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tighter leading-tight italic">Define Your <br className="hidden sm:block" /><span className="text-primary not-italic underline decoration-white/5 decoration-8 underline-offset-8">Operating Identity</span></h2>
                  <p className="text-slate-500 font-medium text-xl max-w-lg tracking-tight">Establishing your unique persona signature within the Watchmann grid.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {identities.map(id => (
                    <button
                      key={id}
                      onClick={() => setData({ ...data, identityRole: id })}
                      className={`p-10 rounded-[2.5rem] text-left border transition-all duration-700 group flex items-center gap-8 ${data.identityRole === id ? 'border-primary bg-primary/5 text-primary shadow-2xl' : 'border-white/5 bg-white/[0.01] text-slate-700 hover:bg-white/[0.03] hover:border-white/10'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${data.identityRole === id ? 'bg-primary text-black shadow-[0_0_20px_#bef264]' : 'bg-white/5'}`}>
                         <User size={24} />
                      </div>
                      <span className="font-bold text-[13px] uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all">{id}</span>
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!data.identityRole}
                  onClick={() => setStep(2)}
                  className="btn-primary w-full flex items-center justify-center gap-5 !mt-20 disabled:opacity-20"
                >
                  Verify Selection <ArrowRight size={24} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-16"
              >
                <div className="space-y-6">
                  <div className="text-primary font-black uppercase tracking-[0.6em] text-[11px] mb-4 flex items-center gap-4">
                    <div className="w-10 h-[1px] bg-primary/20"></div> Communication Array
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight italic">Target <span className="text-primary not-italic underline decoration-white/10 decoration-8 underline-offset-8">Endpoints</span></h2>
                  <p className="text-slate-500 font-bold text-xl max-w-lg tracking-tight">Activate the signal channels where your strategy will be broadcast.</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`p-12 rounded-[3.5rem] flex flex-col items-center gap-6 border transition-all duration-700 group ${data.targetPlatforms.includes(p) ? 'border-primary bg-primary/5 text-primary shadow-2xl' : 'border-white/5 bg-white/[0.01] text-slate-800 hover:bg-white/[0.03]'}`}
                    >
                      <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-1000 ${data.targetPlatforms.includes(p) ? 'bg-primary text-black shadow-[0_0_40px_#bef264] rotate-[360deg]' : 'bg-white/5'}`}>
                        {data.targetPlatforms.includes(p) ? <Check size={32} /> : <Globe size={32} />}
                      </div>
                      <span className="font-black uppercase tracking-[0.4em] text-[12px] group-hover:tracking-[0.6em] transition-all italic">{p}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 !mt-16 md:!mt-24">
                  <button onClick={() => setStep(1)} className="px-10 md:px-14 py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 text-slate-800 font-black uppercase text-[11px] md:text-[12px] tracking-widest hover:text-white transition-all hover:bg-white/5 italic w-full sm:w-auto">Abort</button>
                  <button 
                    disabled={data.targetPlatforms.length === 0}
                    onClick={() => setStep(3)}
                    className="btn-primary flex-1 flex items-center justify-center gap-5 disabled:opacity-20 w-full sm:w-auto"
                  >
                    Sync Relay <ArrowRight size={24} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-16"
              >
                <div className="space-y-6">
                  <div className="text-primary font-black uppercase tracking-[0.6em] text-[11px] mb-4 flex items-center gap-4">
                    <div className="w-10 h-[1px] bg-primary/20"></div> Signal Calibration
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight italic underline decoration-white/10 decoration-8 underline-offset-8">Payload Config</h2>
                  <p className="text-slate-500 font-bold text-xl max-w-lg tracking-tight">Define your sector focus and transmission vocal signature.</p>
                </div>

                <div className="space-y-12">
                  <div className="space-y-4 group">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 ml-2 flex items-center gap-4">
                      <Target size={18} className="text-primary" /> Sector Domain
                    </label>
                    <input 
                      type="text" placeholder="E.G. NEURAL_SYNTH_AI"
                      className="w-full p-8 bg-black/40 border border-white/5 rounded-[2.5rem] outline-none focus:border-primary/50 text-white font-black uppercase tracking-[0.3em] text-lg placeholder:text-slate-900 transition-all shadow-inner"
                      value={data.niche}
                      onChange={(e) => setData({...data, niche: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-4 group">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 ml-2 flex items-center gap-4">
                      <Star size={18} className="text-primary" /> Vocal Tone Signature
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full p-8 bg-surface border border-white/5 rounded-[2.5rem] outline-none focus:border-primary/50 text-white font-black uppercase tracking-[0.3em] text-lg appearance-none cursor-pointer pr-16 shadow-inner italic"
                        value={data.tone}
                        onChange={(e) => setData({...data, tone: e.target.value})}
                      >
                        <option value="Professional">Surgical Prof.</option>
                        <option value="Industrial">Nuclear Indust.</option>
                        <option value="Deeply Technical">Technical Deep</option>
                        <option value="Viral Hook">Hyper Viral</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-800">▼</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 !mt-16 md:!mt-24">
                  <button onClick={() => setStep(2)} className="px-10 md:px-14 py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 text-slate-800 font-black uppercase text-[11px] md:text-[12px] tracking-widest hover:text-white transition-all italic w-full sm:w-auto">Back</button>
                  <button 
                    disabled={!data.niche || loading}
                    onClick={handleFinish}
                    className="btn-primary flex-1 flex items-center justify-center gap-6 disabled:opacity-20 w-full sm:w-auto"
                  >
                    {loading ? 'Initializing Core...' : 'Activate WATCHMANN'} <Zap size={24} fill="currentColor" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
