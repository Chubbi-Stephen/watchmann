import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Globe,
  Activity
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
      showToast("Strategy Architected");
    } catch (err) {
      showToast("Sync Error", "error");
    } finally {
      setGenerating(null);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    try {
      await api.patch(`/posts/${editingPost.id}`, { content: editingPost.content });
      showToast("Node Updated");
      setEditingPost(null);
      fetchDashboardData();
    } catch (err) {
       showToast("Sync Failure", "error");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Buffer Copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.post('/profile/setup', settingsData);
      setUser({ ...user, profile: res.data.profile });
      showToast("System Recalibrated");
    } catch (err) {
      showToast("Save Failed", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface text-slate-400 font-inter selection:bg-primary/40 selection:text-black">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-8 sticky top-0 h-screen z-40 bg-surface">
        <div className="flex items-center gap-3 font-extrabold text-2xl text-primary mb-16 tracking-tighter">
          <Zap fill="currentColor" size={24} className="shrink-0" /> 
          <span>Watchmann</span>
        </div>
        
        <nav className="flex-1 space-y-3">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Sparkles size={20} />} label="Studio" active={studioOpen} onClick={() => setStudioOpen(true)} />
          <SidebarItem icon={<History size={20} />} label="Archive" active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-slate-600 hover:text-red-500 transition-all mt-auto rounded-xl hover:bg-red-500/5 group text-xs font-bold uppercase tracking-widest">
          <LogOut size={18} /> <span>Disconnect</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 xl:p-24 max-w-[1500px] mx-auto w-full pt-32 lg:pt-28 min-h-screen relative">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-20">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                  <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter">
                    Hello, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                  </h1>
                  <p className="text-slate-500 text-lg font-medium tracking-wide uppercase opacity-70">
                    System Hub: {user?.profile?.niche} Active
                  </p>
                </div>
                <button onClick={fetchDashboardData} className="w-full md:w-auto px-8 py-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-4 group">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Sync Data</span>
                  <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700 text-primary'} />
                </button>
              </header>
              <div className="grid grid-cols-1 gap-10">
                {trends.map((trend, idx) => (
                  <TrendCard key={trend.id} trend={trend} idx={idx} generating={generating} onGenerate={handleGenerate} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'archive' && (
            <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-20">
              <header className="space-y-4">
                <h1 className="text-7xl font-black text-white tracking-tighter">Vault <span className="text-slate-700 italic">History</span></h1>
                <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">A comprehensive log of all strategized nodes.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivePosts.map((post, idx) => (
                  <motion.div key={post.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }} className="glass p-8 border-white/5 hover:border-primary/20 transition-all flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{post.platformTarget}</span>
                      <button onClick={() => copyToClipboard(post.content, post.id)} className="p-2 text-slate-600 hover:text-white transition-all transform hover:scale-110">
                        {copiedId === post.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-6">"{post.content}"</p>
                    <div className="text-[9px] text-slate-700 font-bold uppercase mt-auto">{new Date(post.createdAt).toLocaleDateString()}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl space-y-20">
              <header className="space-y-4">
                <h1 className="text-7xl font-black text-white tracking-tighter italic">Calibration</h1>
                <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">Define your operational parameters.</p>
              </header>
              <form onSubmit={handleSaveSettings} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Operator Identity</label>
                    <input value={settingsData.identity} onChange={e => setSettingsData({...settingsData, identity: e.target.value})} className="settings-input" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Market Domain</label>
                    <input value={settingsData.niche} onChange={e => setSettingsData({...settingsData, niche: e.target.value})} className="settings-input" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Output Tone</label>
                    <input value={settingsData.tone} onChange={e => setSettingsData({...settingsData, tone: e.target.value})} className="settings-input" />
                  </div>
                </div>
                <button disabled={savingSettings} type="submit" className="glow-btn px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em]">
                  {savingSettings ? 'Writing to Disk...' : 'Commit Changes'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Persistence Elements */}
      <AnimatePresence>{studioOpen && <StudioPopUp posts={posts} onClose={() => setStudioOpen(false)} onCopy={copyToClipboard} copiedId={copiedId} onEdit={setEditingPost} />}</AnimatePresence>
      <AnimatePresence>{editingPost && <RefinementModal post={editingPost} onClose={() => setEditingPost(null)} setPost={setEditingPost} onCommit={handleUpdatePost} />}</AnimatePresence>
      <AnimatePresence>{toast && <LethalToast message={toast.message} type={toast.type} onOpenStudio={() => setStudioOpen(true)} />}</AnimatePresence>

      <style>{`
        .settings-input { width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1rem 1.5rem; font-size: 1rem; font-weight: 600; color: white; border-radius: 1rem; outline: none; transition: all 0.3s; }
        .settings-input:focus { border-color: #bef264; background: rgba(190,242,100,0.02); }
      `}</style>
    </div>
  );
};

const TrendCard = ({ trend, idx, generating, onGenerate }) => {
  const points = useMemo(() => Array.from({length: 12}, () => Math.floor(Math.random() * 30) + 5), [trend.id]);
  const polylinePoints = points.map((p, i) => `${i * 15},${50 - p}`).join(' ');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass p-10 group relative border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-full opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity">
        <svg viewBox="0 0 165 50" className="w-full h-full"><polyline fill="none" stroke="#bef264" strokeWidth="2" points={polylinePoints} /></svg>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-6 flex-1">
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg">{trend.platform}</span>
            <span>{new Date(trend.discoveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} SYNC</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight group-hover:text-primary transition-colors">{trend.headline}</h3>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-3xl">{trend.description}</p>
        </div>
        <button disabled={generating === trend.id} onClick={() => onGenerate(trend.id)} className="glow-btn px-10 py-5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
          {generating === trend.id ? 'Analyzing...' : 'Generate Strategy'} <Zap size={16} fill="currentColor" />
        </button>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-600 hover:text-white'}`}>
    <div className={`transition-all duration-500 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>{icon}</div>
    <span className={`text-[11px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

const StudioPopUp = ({ posts, onClose, onCopy, copiedId, onEdit }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/98 z-[80] backdrop-blur-[60px]" />
    <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 40, stiffness: 400 }} className="fixed inset-4 md:inset-12 lg:inset-20 bg-surface border border-white/5 z-[90] rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)]">
      <header className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-surface/80">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(190,242,100,0.1)]"><Sparkles size={24} /></div>
           <div className="space-y-1">
             <h2 className="text-3xl font-black text-white uppercase tracking-tight">Strategy Studio</h2>
             <p className="text-[9px] text-primary/50 font-bold uppercase tracking-[0.4em]">Neural Output Calibration Hub</p>
           </div>
        </div>
        <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-500"><X size={24} /></button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass p-8 border-white/5 hover:border-primary/20 flex flex-col gap-6 shadow-2xl transition-all h-full bg-white/[0.01]"
            >
               <div className="flex justify-between items-start">
                  <div className="px-4 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-[9px] font-bold uppercase tracking-widest text-primary">
                    {post.platformTarget} Protocol
                  </div>
                  <button onClick={() => onCopy(post.content, post.id)} className={`p-2.5 rounded-xl transition-all ${copiedId === post.id ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-600 hover:text-white'}`}>
                    {copiedId === post.id ? <Check size={20} /> : <Copy size={20} />}
                  </button>
               </div>
               
               <div className="flex-1 bg-black/40 p-6 rounded-2xl border border-white/[0.03] flex items-center justify-center text-center">
                 <p className="text-sm text-slate-400 leading-relaxed font-semibold italic line-clamp-8">"{post.content}"</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <button className="py-4 text-[10px] font-bold uppercase tracking-widest bg-primary text-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                   Schedule <ArrowRight size={14} />
                 </button>
                 <button onClick={() => onEdit(post)} className="py-4 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">Refine</button>
               </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  </>
);

const RefinementModal = ({ post, onClose, setPost, onCommit }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-2xl" />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass max-w-4xl w-full p-10 md:p-16 relative z-10 shadow-2xl border-primary/10">
      <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-12 italic underline decoration-primary decoration-4 underline-offset-8">Input Buffer Control</h3>
      <textarea 
        value={post.content} onChange={e => setPost({...post, content: e.target.value})}
        className="w-full h-[350px] bg-black/60 border-white/5 border rounded-2xl p-8 mb-12 text-slate-200 outline-none text-xl font-medium leading-relaxed custom-scrollbar focus:border-primary/40 transition-all font-inter"
      />
      <div className="flex flex-col sm:flex-row gap-6">
        <button onClick={onClose} className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-xl text-slate-600 hover:text-red-500 transition-all">Abort</button>
        <button onClick={onCommit} className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest bg-primary text-black rounded-xl shadow-[0_0_40px_rgba(190,242,100,0.2)] hover:scale-105 active:scale-95 transition-all">Verify Node</button>
      </div>
    </motion.div>
  </div>
);

const LethalToast = ({ message, type, onOpenStudio }) => (
  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-5 rounded-2xl z-[120] flex items-center gap-6 shadow-2xl bg-[#0a0a0a] border border-white/5">
    <div className={`w-3 h-3 rounded-full ${type === 'error' ? 'bg-red-500' : 'bg-primary shadow-[0_0_15px_#bef264]'}`} />
    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white italic">{message}</span>
    {type !== 'error' && <button onClick={onOpenStudio} className="text-[11px] font-bold uppercase tracking-widest text-primary/70 hover:text-primary transition-colors">Open Studio</button>}
  </motion.div>
);

export default Dashboard;
