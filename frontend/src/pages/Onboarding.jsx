import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Globe, MessageSquare, ArrowRight, Check } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-radial from-primary/10 via-dark to-dark">
      <div className="max-w-xl w-full">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>

        <motion.div layout className="glass p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Tell us about yourself</h2>
                  <p className="text-slate-400">What best describes your role in content creation?</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {identities.map(id => (
                    <button
                      key={id}
                      onClick={() => setData({ ...data, identity: id })}
                      className={`p-4 rounded-xl text-left border transition-all ${data.identity === id ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20'}`}
                    >
                      {id}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!data.identity}
                  onClick={() => setStep(2)}
                  className="glow-btn w-full flex items-center justify-center gap-2 !mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Select your platforms</h2>
                  <p className="text-slate-400">Where do you usually publish your content?</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`p-6 rounded-2xl flex flex-col items-center gap-3 border transition-all ${data.targetPlatforms.includes(p) ? 'border-secondary bg-secondary/10 text-white' : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.targetPlatforms.includes(p) ? 'bg-secondary text-white' : 'bg-white/10'}`}>
                        {data.targetPlatforms.includes(p) ? <Check size={20} /> : < Globe size={20} />}
                      </div>
                      <span className="font-bold">{p}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 !mt-12">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5">Back</button>
                  <button 
                    disabled={data.targetPlatforms.length === 0}
                    onClick={() => setStep(3)}
                    className="glow-btn flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Refine your niche</h2>
                  <p className="text-slate-400">What specific topics do you cover? (e.g. AI, SaaS, Crypto)</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Your Niche</label>
                    <input 
                      type="text"
                      placeholder="e.g. AI and Software Development"
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary/50"
                      value={data.niche}
                      onChange={(e) => setData({...data, niche: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Preferred Tone</label>
                    <select 
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-primary/50"
                      value={data.tone}
                      onChange={(e) => setData({...data, tone: e.target.value})}
                    >
                      <option className="bg-dark">Professional</option>
                      <option className="bg-dark">Quirky & Fun</option>
                      <option className="bg-dark">Deeply Technical</option>
                      <option className="bg-dark">Educational</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 !mt-12">
                  <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5">Back</button>
                  <button 
                    disabled={!data.niche || loading}
                    onClick={handleFinish}
                    className="glow-btn flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Finalizing...' : 'Start My Journey'} <Check size={18} />
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
