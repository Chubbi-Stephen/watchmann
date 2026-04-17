import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Globe, MessageSquare, ArrowRight, Check, Zap } from 'lucide-react';
import api from '../lib/api';

const Onboarding = ({ user, setUser }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    identity: '',
    targetPlatforms: [],
    niche: '',
    tone: 'Professional'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const identities = ['Content Creator', 'Tech Blogger', 'Social Media Manager', 'Entrepreneur'];
  const platforms = ['X', 'LinkedIn', 'Instagram', 'Facebook'];

  const togglePlatform = (p) => {
    if (data.targetPlatforms.includes(p)) {
      setData({ ...data, targetPlatforms: data.targetPlatforms.filter(item => item !== p) });
    } else {
      setData({ ...data, targetPlatforms: [...data.targetPlatforms, p] });
    }
  };

  const handleFinish = async () => {
    if (!data.identity || data.targetPlatforms.length === 0 || !data.niche) return;
    setLoading(true);
    try {
      const res = await api.post('/profile/setup', data);
      setUser({ ...user, profile: res.data.profile });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />

      <div className="max-w-xl w-full relative z-10">
        <div className="flex justify-center gap-3 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-700 ${step >= i ? 'bg-primary shadow-[0_0_15px_#bef264]' : 'bg-white/5'}`} />
          ))}
        </div>

        <motion.div layout className="glass p-10 md:p-12 border-white/5 bg-surface/60 backdrop-blur-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" init={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-2">Setup Protocol 01</div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">Identity</h2>
                  <p className="text-slate-500 font-medium text-sm">Select your primary role signature.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {identities.map(id => (
                    <button
                      key={id}
                      onClick={() => setData({ ...data, identity: id })}
                      className={`p-5 rounded-xl text-left border transition-all font-bold text-xs uppercase tracking-widest ${data.identity === id ? 'border-primary bg-primary/5 text-primary' : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/10'}`}
                    >
                      {id}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!data.identity}
                  onClick={() => setStep(2)}
                  className="glow-btn w-full flex items-center justify-center gap-3 py-5 !mt-10 disabled:opacity-20 text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" init={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-2">Setup Protocol 02</div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">Nodes</h2>
                  <p className="text-slate-500 font-medium text-sm">Target transmission endpoints.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  {platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`p-6 rounded-2xl flex flex-col items-center gap-3 border transition-all ${data.targetPlatforms.includes(p) ? 'border-primary bg-primary/5 text-primary' : 'border-white/5 bg-white/[0.02] text-slate-500'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.targetPlatforms.includes(p) ? 'bg-primary text-black shadow-[0_0_20px_#bef264]' : 'bg-white/5'}`}>
                        {data.targetPlatforms.includes(p) ? <Check size={20} /> : < Globe size={20} />}
                      </div>
                      <span className="font-bold uppercase tracking-[0.1em] text-[10px]">{p}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 !mt-10">
                  <button onClick={() => setStep(1)} className="px-8 py-4 rounded-xl border border-white/5 text-slate-600 font-bold uppercase text-[9px] tracking-widest">Back</button>
                  <button 
                    disabled={data.targetPlatforms.length === 0}
                    onClick={() => setStep(3)}
                    className="glow-btn flex-1 flex items-center justify-center gap-3 disabled:opacity-20 text-[10px] font-bold uppercase tracking-[0.3em]"
                  >
                    Sync <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" init={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="text-primary font-bold uppercase tracking-[0.3em] text-[9px] mb-2">Setup Protocol 03</div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">Focus</h2>
                  <p className="text-slate-500 font-medium text-sm">Market niche and voice calibration.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600 ml-1">Market Sector</label>
                    <input 
                      type="text" placeholder="E.G. FINTECH_AI"
                      className="w-full p-5 bg-white/[0.02] border border-white/5 rounded-xl outline-none focus:border-primary/50 text-white font-bold uppercase tracking-widest text-sm"
                      value={data.niche}
                      onChange={(e) => setData({...data, niche: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600 ml-1">Output Tone</label>
                    <select 
                      className="w-full p-5 bg-[#0c0c0c] border border-white/5 rounded-xl outline-none focus:border-primary/50 text-white font-bold uppercase tracking-widest text-sm appearance-none cursor-pointer"
                      value={data.tone}
                      onChange={(e) => setData({...data, tone: e.target.value})}
                    >
                      <option value="Professional">Professional</option>
                      <option value="Quirky & Fun">Industrial</option>
                      <option value="Deeply Technical">Technical</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 !mt-10">
                  <button onClick={() => setStep(2)} className="px-8 py-4 rounded-xl border border-white/5 text-slate-600 font-bold uppercase text-[9px] tracking-widest">Back</button>
                  <button 
                    disabled={!data.niche || loading}
                    onClick={handleFinish}
                    className="glow-btn flex-1 flex items-center justify-center gap-3 disabled:opacity-20 text-[10px] font-bold uppercase tracking-[0.3em]"
                  >
                    {loading ? 'Processing...' : 'Complete Init'} <Check size={18} />
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
