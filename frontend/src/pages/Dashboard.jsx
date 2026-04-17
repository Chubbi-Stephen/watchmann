import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Copy, 
  Check, 
  Calendar, 
  LayoutDashboard, 
  History, 
  Settings,
  LogOut,
  RefreshCw,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
  Save,
  Menu,
  Eye,
  User,
  Hash,
  MessageSquare,
  Globe
} from 'lucide-react';
import api from '../lib/api';

const Dashboard = ({ user, setUser }) => {
  const [trends, setTrends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [archivePosts, setArchivePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generating, setGenerating] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

  // Settings state
  const [settingsData, setSettingsData] = useState({
    identity: user?.profile?.identity || '',
    niche: user?.profile?.niche || '',
    tone: user?.profile?.tone || '',
    targetPlatforms: user?.profile?.targetPlatforms || []
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendRes, postRes] = await Promise.all([
        api.get('/trends'),
        api.get('/posts')
      ]);
      setTrends(trendRes.data.trends);
      setPosts(postRes.data.posts);
    } catch (err) {
      console.error("Fetch dashboard failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArchiveData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/all');
      setArchivePosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboardData();
    if (activeTab === 'archive') fetchArchiveData();
  }, [activeTab, fetchDashboardData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async (trendId) => {
    setGenerating(trendId);
    try {
      await api.post('/posts/generate', { trendId });
      await fetchDashboardData();
      setStudioOpen(true);
      showToast("Strategy crafted successfully!");
    } catch (err) {
      showToast("Generation failed", "error");
    } finally {
      setGenerating(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleUpdatePost = () => {
    setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
    setEditingPost(null);
    showToast("Buffer updated");
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.post('/profile/setup', settingsData);
      setUser({ ...user, profile: res.data.profile });
      showToast("System preferences updated");
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const togglePlatform = (p) => {
    const fresh = settingsData.targetPlatforms.includes(p)
      ? settingsData.targetPlatforms.filter(item => item !== p)
      : [...settingsData.targetPlatforms, p];
    setSettingsData({ ...settingsData, targetPlatforms: fresh });
  };

  return (
    <div className="min-h-screen flex bg-[#030303] text-slate-200 font-inter">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-8 sticky top-0 h-screen z-40 bg-[#030303]">
        <div className="flex items-center gap-3 font-black text-2xl text-primary mb-16 italic tracking-tighter">
          <Zap fill="currentColor" size={28} className="shrink-0" /> <span>WATCHMANN</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Sparkles size={20} />} label="Studio" active={studioOpen} onClick={() => setStudioOpen(true)} />
          <SidebarItem icon={<History size={20} />} label="Archive" active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 p-5 text-slate-600 hover:text-red-400 transition-all mt-auto rounded-3xl hover:bg-red-500/5 group">
          <LogOut size={20} /> <span className="font-black text-[10px] uppercase tracking-[0.4em]">Disconnect</span>
        </button>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 xl:p-24 max-w-[1400px] mx-auto w-full pt-28 lg:pt-24 min-h-screen">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-16">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
              <div className="space-y-4">
                <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">HELLO, <span className="text-primary">{user?.name?.split(' ')[0]}</span></h1>
                <p className="text-slate-500 text-xl font-medium tracking-tight italic opacity-70 uppercase tracking-widest">Neural Link: {user?.profile?.niche} HUB ACTIVE</p>
              </div>
              <button onClick={fetchDashboardData} className="w-full md:w-auto p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-all shadow-2xl flex items-center justify-center gap-6 group">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">RECALIBRATE FEED</span>
                <RefreshCw size={24} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'} />
              </button>
            </header>

            <section>
              <div className="flex items-center gap-6 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-12">
                <span className="w-16 h-[2px] bg-primary"></span> System Spikes
              </div>
              <div className="grid grid-cols-1 gap-8">
                {trends.map((trend, idx) => (
                  <TrendCard key={trend.id} trend={trend} idx={idx} generating={generating} onGenerate={handleGenerate} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ARCHIVE TAB */}
        {activeTab === 'archive' && (
          <div className="space-y-16">
            <header className="mb-20">
              <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">Historical <span className="text-secondary">Vault</span></h1>
              <p className="text-slate-500 text-xl font-medium tracking-tight italic opacity-70 uppercase tracking-widest mt-4">Database Log of All Synthesized Strategies</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archivePosts.length > 0 ? archivePosts.map((post, idx) => (
                <motion.div 
                  key={post.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}
                  className="glass p-8 border-l-4 border-l-slate-800 hover:border-l-primary transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-white/10 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                        {post.platformTarget}
                      </div>
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => copyToClipboard(post.content, post.id)} className="p-2 text-slate-600 hover:text-white transition-colors">
                      {copiedId === post.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-4 line-clamp-1 italic text-slate-500">{post.trend?.headline}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed italic bg-white/[0.02] p-6 rounded-2xl border border-white/5 line-clamp-6">"{post.content}"</p>
                </motion.div>
              )) : (
                <div className="col-span-full py-40 text-center glass border-dashed opacity-40 italic font-black uppercase tracking-[0.3em] text-slate-600">Archive Buffer Empty</div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-20">
            <header>
              <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase italic">System <span className="text-primary">Preferences</span></h1>
              <p className="text-slate-500 text-xl font-medium tracking-tight italic opacity-70 uppercase tracking-widest mt-4">Hardware & Strategy Calibration</p>
            </header>

            <form onSubmit={handleSaveSettings} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <SettingsGroup icon={<User />} label="Identity Signature" description="Who is the AI writing as?">
                  <input 
                    value={settingsData.identity} onChange={e => setSettingsData({...settingsData, identity: e.target.value})}
                    placeholder="e.g. SOLOPRENEUR" className="settings-input" 
                  />
                </SettingsGroup>

                <SettingsGroup icon={<Globe />} label="Niche Sector" description="Market focus domain">
                  <input 
                    value={settingsData.niche} onChange={e => setSettingsData({...settingsData, niche: e.target.value})}
                    placeholder="e.g. FINTECH & AI" className="settings-input" 
                  />
                </SettingsGroup>

                <SettingsGroup icon={<MessageSquare />} label="Voice Tone" description="Content personality index">
                  <input 
                    value={settingsData.tone} onChange={e => setSettingsData({...settingsData, tone: e.target.value})}
                    placeholder="e.g. PROVOCATIVE & BOLD" className="settings-input" 
                  />
                </SettingsGroup>

                <SettingsGroup icon={<Hash />} label="Target Nodes" description="Active transmission channels">
                  <div className="flex flex-wrap gap-3 mt-4">
                    {['X', 'LinkedIn', 'Instagram', 'Facebook'].map(p => (
                      <button 
                        key={p} type="button" onClick={() => togglePlatform(p)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${settingsData.targetPlatforms.includes(p) ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </SettingsGroup>
              </div>

              <div className="pt-10">
                <button 
                  disabled={savingSettings} type="submit"
                  className="glow-btn w-full md:w-max px-16 py-6 text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 group shadow-2xl"
                >
                  {savingSettings ? 'Writing to Disk...' : 'Commit Preferences'} <Save size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* STRATEGY STUDIO MODAL - Same logic as before but ensured persistence */}
      <AnimatePresence>
        {studioOpen && (
          <StudioModal posts={posts} onClose={() => setStudioOpen(false)} onCopy={copyToClipboard} copiedId={copiedId} onEdit={setEditingPost} />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingPost && (
          <EditModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleUpdatePost} setPost={setEditingPost} />
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onStudio={() => setStudioOpen(true)} />}
      </AnimatePresence>
    </div>
  );
};

// Sub-components for cleaner Dashboard.jsx
const TrendCard = ({ trend, idx, generating, onGenerate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
    className="glass p-10 md:p-14 group border-white/5 hover:border-primary/20 transition-all duration-700 bg-gradient-to-br from-white/[0.01] to-transparent"
  >
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-6">
        <span className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">{trend.platform}</span>
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{new Date(trend.discoveredAt).toLocaleTimeString()} SYNC</span>
      </div>
      <h3 className="text-3xl md:text-5xl font-black leading-tight text-white tracking-tighter italic uppercase group-hover:text-primary transition-colors duration-500">{trend.headline}</h3>
      <p className="text-slate-400 text-lg leading-relaxed max-w-4xl font-medium opacity-80">{trend.description}</p>
      <div className="pt-6 flex flex-wrap gap-6">
        <button 
          disabled={generating === trend.id} onClick={() => onGenerate(trend.id)}
          className="glow-btn px-10 py-5 text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-5 group/btn shadow-2xl"
        >
          {generating === trend.id ? 'SYNTHESIZING...' : 'CRAFT STRATEGY'} 
          <Zap size={20} className={generating === trend.id ? 'animate-pulse' : 'group-hover:scale-125 transition-transform'} fill="currentColor" />
        </button>
        <a href={JSON.parse(trend.metadata || '{}').link || '#'} target="_blank" rel="noreferrer" className="px-10 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">Source Feed <ExternalLink size={16} /></a>
      </div>
    </div>
  </motion.div>
);

const SettingsGroup = ({ icon, label, description, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">{icon}</div>
      <div>
        <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{label}</h4>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-6 p-6 rounded-[1.5rem] transition-all group ${active ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'text-slate-600 hover:text-white hover:bg-white/[0.02] border border-transparent'}`}>
    <div className={`transition-transform duration-700 ${active ? 'scale-125 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className="font-black text-[11px] uppercase tracking-[0.3em] italic">{label}</span>
  </button>
);

const StudioModal = ({ posts, onClose, onCopy, copiedId, onEdit }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/98 z-[80] backdrop-blur-3xl" />
    <motion.div 
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#050505] border border-white/10 z-[90] rounded-[3rem] flex flex-col overflow-hidden"
    >
      <header className="p-10 border-b border-white/5 flex justify-between items-center bg-[#070707]">
        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">Strategy <span className="text-secondary">Studio</span></h2>
        <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400"><X size={24} /></button>
      </header>
      <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="glass p-8 border-l-[6px] border-l-secondary flex flex-col gap-8 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary italic underline decoration-secondary decoration-2 underline-offset-4">{post.platformTarget} Output</span>
                <button onClick={() => onCopy(post.content, post.id)} className={`p-3 rounded-2xl transition-all ${copiedId === post.id ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                  {copiedId === post.id ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 shadow-inner">"{post.content}"</p>
              <div className="flex gap-4">
                <button className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest bg-secondary text-white rounded-2xl italic">Schedule</button>
                <button onClick={() => onEdit(post)} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-2xl text-slate-500 italic">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </>
);

const EditModal = ({ post, onClose, onSave, setPost }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/99 backdrop-blur-3xl" />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass max-w-4xl w-full p-10 md:p-20 relative z-10 shadow-2xl">
      <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase italic mb-12 underline decoration-primary decoration-4 underline-offset-8">Overwrite Strategy</h3>
      <textarea 
        value={post.content} onChange={e => setPost({...post, content: e.target.value})}
        className="w-full h-80 bg-white/[0.02] border-white/10 border rounded-[2rem] p-10 mb-16 text-slate-200 outline-none text-xl italic font-medium leading-relaxed custom-scrollbar shadow-inner"
      />
      <div className="flex gap-6">
        <button onClick={onClose} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 rounded-2xl hover:text-red-400 transition-all italic">Discard</button>
        <button onClick={onSave} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] bg-primary text-white rounded-2xl glow-btn shadow-2xl italic">Commit Buffer</button>
      </div>
    </motion.div>
  </div>
);

const Toast = ({ message, type, onStudio }) => (
  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 lg:w-max px-10 py-6 rounded-[2rem] z-[120] flex items-center gap-8 shadow-2xl bg-[#080808] border border-white/10 border-l-4 border-l-primary">
    <div className={`w-4 h-4 rounded-full ${type === 'error' ? 'bg-red-500 animate-pulse' : 'bg-primary shadow-[0_0_15px_#a855f7]'}`} />
    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">{message}</span>
    {type !== 'error' && <button onClick={onStudio} className="text-[11px] font-black uppercase tracking-[0.3em] text-primary hover:underline underline-offset-8">Open Studio</button>}
  </motion.div>
);

export default Dashboard;
