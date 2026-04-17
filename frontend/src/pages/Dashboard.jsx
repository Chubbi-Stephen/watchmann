import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Zap, Copy, Check, Calendar, LayoutDashboard, History, Settings,
  LogOut, RefreshCw, Sparkles, ArrowRight, X, User, BarChart3, Clock, ChevronRight, Infinity as InfinityIcon
} from 'lucide-react';
import api from '../lib/api';

const Dashboard = ({ user, setUser }) => {
  const [trends, setTrends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generating, setGenerating] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTrendId, setStudioTrendId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendRes, postRes, analyticsRes] = await Promise.all([
        api.get('/trends'),
        api.get('/posts'),
        api.get('/analytics')
      ]);
      setTrends(trendRes.data.trends);
      setPosts(postRes.data.posts);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleGenerate = async (trendId) => {
    setGenerating(trendId);
    try {
      await api.post('/posts/generate', { trendId });
      await fetchDashboardData();
      setStudioTrendId(trendId);
      setStudioOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const studioPosts = useMemo(() => {
    if (studioTrendId) return posts.filter(p => p.trendId === studioTrendId);
    return posts;
  }, [posts, studioTrendId]);

  return (
    <div className="min-h-screen flex bg-surface text-slate-400 font-inter selection:bg-primary/30 relative">
      <div className="fixed inset-0 grid-overlay opacity-30 pointer-events-none" />
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-[60] px-8 py-5 flex justify-between items-center bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4 font-black text-xl text-white tracking-tighter">
          <img src="/logo.png" alt="W/M" className="w-8 h-8" /> 
          <span>Watchmann</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-4 bg-white/5 rounded-2xl text-primary border border-white/5">
          {mobileMenuOpen ? <X size={24} /> : <div className="flex flex-col gap-1.5 w-6"><div className="h-0.5 w-full bg-primary/60 rounded-full"></div><div className="h-0.5 w-full bg-primary/60 rounded-full"></div><div className="h-0.5 w-full bg-primary/60 rounded-full"></div></div>}
        </button>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/95 z-[70] backdrop-blur-3xl" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-surface/50 backdrop-blur-3xl z-[80] border-r border-white/5 p-12 flex flex-col pt-32">
              <nav className="flex-1 space-y-6">
                <SidebarItem icon={<LayoutDashboard size={20} />} label="Operational" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} />
                <SidebarItem icon={<BarChart3 size={20} />} label="Telemetry" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }} />
                <SidebarItem icon={<History size={20} />} label="Archive" active={activeTab === 'archive'} onClick={() => { setActiveTab('archive'); setMobileMenuOpen(false); }} />
                <SidebarItem icon={<Settings size={20} />} label="Command Core" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} />
              </nav>
              <button onClick={handleLogout} className="flex items-center gap-6 p-6 text-slate-800 font-bold uppercase tracking-[0.4em] text-[10px] mt-auto hover:text-red-500 transition-colors">
                <LogOut size={18} /> <span>Abort Link</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Command Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-8 lg:p-10 sticky top-0 h-screen z-40 bg-surface/20 backdrop-blur-[120px]">
        <div className="flex items-center gap-5 font-black text-2xl text-white tracking-tighter mb-24 group cursor-pointer transition-all">
          <div className="relative">
             <img src="/logo.png" alt="W/M" className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500" /> 
             <div className="absolute inset-0 bg-primary/20 blur-xl scale-0 group-hover:scale-125 transition-all opacity-0 group-hover:opacity-100" />
          </div>
          <span>WATCHMANN</span>
        </div>
        
        <nav className="flex-1 space-y-6">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Operational" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<BarChart3 size={20} />} label="Telemetry" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={<History size={20} />} label="Archive" active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
          <SidebarItem icon={<Settings size={20} />} label="Command Core" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto mb-10 p-8 premium-card space-y-6 !p-6 border-white/5">
          <div className="label-caps !mb-4">Active Profile</div>
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 shadow-inner"><User size={20} /></div>
             <div>
               <div className="text-white font-bold text-sm uppercase tracking-tight">{user?.identities?.[0]?.identityName || 'PRIMARY'}</div>
               <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">{user?.identities?.[0]?.niche || 'TECH'} SECTOR</div>
             </div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-6 p-6 text-slate-800 font-bold uppercase tracking-[0.4em] text-[11px] hover:text-red-500 transition-all rounded-2xl hover:bg-red-500/5">
          <LogOut size={18} /> <span>Abort Link</span>
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-16 xl:p-24 max-w-[1700px] mx-auto w-full pt-32 lg:pt-24 min-h-screen relative z-10 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-24">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="space-y-6">
                  <h1 className="text-super-scale italic">
                    Ready, <span className="text-primary not-italic underline decoration-white/5 decoration-[12px] underline-offset-[12px]">NODE</span>
                  </h1>
                  <div className="flex items-center gap-5 text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px]">
                    <div className="flex gap-1.5 h-3 items-end">
                      {[1,2,3].map(i => <motion.div key={i} animate={{height: [4, 12, 4]}} transition={{duration: 0.6 + (i*0.2), repeat: Infinity}} className="w-1 bg-primary/40 rounded-full" />)}
                    </div>
                    Neural Synchronisation Stable
                  </div>
                </div>
                <button onClick={fetchDashboardData} className="w-full md:w-auto px-10 py-6 glass rounded-2xl hover:bg-white/[0.04] flex items-center justify-center gap-5 group">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000 text-primary'} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Resync Intercept</span>
                </button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-12">
                {/* Pulse Ingestion Feed */}
                <div className="lg:col-span-2 xl:col-span-3 space-y-12">
                  <div className="flex items-center justify-between gap-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic shrink-0">Pulse Intercept</h2>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
                    <div className="px-6 py-2 rounded-full border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-[0.4em] italic">Active Scan</div>
                  </div>
                  <div className="grid grid-cols-1 gap-10">
                    {trends.map((trend, idx) => (
                      <TrendCard key={trend.id} trend={trend} idx={idx} generating={generating} onGenerate={handleGenerate} />
                    ))}
                  </div>
                </div>

                {/* Secondary Command Nodes */}
                <div className="lg:col-span-1 xl:col-span-2 space-y-8 lg:space-y-12">
                   <div className="premium-card space-y-8 !p-8">
                      <div className="flex items-center gap-4 text-white border-b border-white/5 pb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Calendar size={18} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-widest italic">Relay Slat</h3>
                      </div>
                      <div className="space-y-4">
                        {posts.filter(p => p.status === 'Scheduled').slice(0, 3).map(post => (
                          <div key={post.id} className="group flex justify-between items-center p-5 rounded-2xl bg-surface/40 border border-white/5 hover:border-primary/30 transition-colors">
                            <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                 <span className="text-[11px] font-extrabold text-white uppercase tracking-wider italic">{post.platformTarget} HUB</span>
                               </div>
                               <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] ml-5">T-Minus Routing...</div>
                            </div>
                            <Clock size={16} className="text-primary/40 group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                        {posts.filter(p => p.status === 'Scheduled').length === 0 && (
                          <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-surface/20">
                             <InfinityIcon className="mx-auto text-slate-600 mb-4" size={24} />
                             <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500">No Live Slats</div>
                          </div>
                        )}
                        <button className="w-full pt-4 text-[10px] font-extrabold uppercase tracking-[0.5em] text-slate-600 hover:text-primary transition-colors">Operational Vault</button>
                      </div>
                   </div>

                   <div className="premium-card space-y-8 !p-8">
                      <div className="flex items-center gap-4 text-white border-b border-white/5 pb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <TrendingUp size={18} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-widest italic">Efficiency</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                         <div className="p-6 bg-surface/40 hover:bg-surface/60 border border-white/5 hover:border-white/10 transition-colors rounded-2xl flex justify-between items-center group">
                            <div className="space-y-1">
                               <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Signals</div>
                               <div className="text-2xl font-black text-white">{analytics?.metrics?.totalPosts || 0}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BarChart3 size={20} className="text-slate-400 group-hover:text-white" />
                            </div>
                         </div>
                         <div className="p-6 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 transition-colors rounded-2xl flex justify-between items-center group shadow-[0_0_20px_rgba(190,242,100,0.02)]">
                            <div className="space-y-1">
                               <div className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Impact Avg</div>
                               <div className="text-2xl font-black text-primary italic">{analytics?.metrics?.viralityAvg || 0}%</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                              <Zap size={20} className="text-primary" fill="currentColor" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
               <header className="space-y-6">
                  <h1 className="text-super-scale italic underline decoration-white/5 decoration-[12px] underline-offset-[12px]">Telemetry</h1>
                  <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">Signal Performance Visualisation Protocol.</p>
               </header>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="premium-card !p-12 space-y-12">
                     <h3 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-5">
                       <BarChart3 size={24} className="text-primary" /> Sector Reach
                     </h3>
                     <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={analytics?.platformData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
                              <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
                              <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#080808', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '11px', color: '#fff', fontWeight: 700, textTransform: 'uppercase' }} />
                              <Bar dataKey="value" fill="#bef264" radius={[6, 6, 0, 0]} barSize={40} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="premium-card !p-12 space-y-12">
                     <h3 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-5">
                       <TrendingUp size={24} className="text-primary" /> Transmission Velocity
                     </h3>
                     <div className="h-[300px] md:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={analytics?.activityData}>
                              <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#bef264" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#bef264" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
                              <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
                              <Tooltip contentStyle={{ backgroundColor: '#080808', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '11px', color: '#fff', fontWeight: 700, textTransform: 'uppercase' }} />
                              <Area type="monotone" dataKey="count" stroke="#bef264" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'archive' && (
            <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
               <header className="space-y-6">
                 <h1 className="text-super-scale italic uppercase">Archives</h1>
                 <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">Deep Ingestion Vault: Historical Matrix Records.</p>
               </header>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post, idx) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="premium-card flex flex-col gap-10 group h-full">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 italic">{post.platformTarget} PROTOCOL</span>
                      <div className={`text-[9px] font-bold uppercase tracking-[0.4em] px-4 py-2 rounded-full ${post.status === 'Live' ? 'text-primary bg-primary/10' : 'text-slate-700 bg-white/5'}`}>{post.status}</div>
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed font-medium italic group-hover:not-italic transition-all line-clamp-8 px-2 lowercase first-letter:uppercase">"{post.content}"</p>
                    <div className="text-[10px] text-slate-800 font-extrabold uppercase tracking-[0.2em] mt-auto pt-8 border-t border-white/5 opacity-40">{new Date(post.createdAt).toLocaleDateString()} TS_RECORD</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-32">
              <header className="space-y-6">
                <h1 className="text-super-scale italic uppercase">Calibrate</h1>
                <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">Node Parameter Management & Active Signatures.</p>
              </header>
              
              <div className="space-y-16">
                 <div className="label-caps !mb-12 flex items-center gap-6 text-primary">Operational Personas <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/10 to-transparent" /></div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {user?.identities?.map(identity => (
                      <div key={identity.id} className={`premium-card !p-10 flex items-center justify-between transition-all duration-700 group cursor-pointer ${identity.isActive ? 'border-primary/40 bg-primary/[0.02]' : ''}`}>
                         <div className="flex items-center gap-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${identity.isActive ? 'bg-primary text-black shadow-[0_0_30px_#bef264]' : 'bg-white/5 text-slate-800'}`}>
                              <User size={24} />
                            </div>
                            <div>
                               <div className="text-white font-bold text-xl uppercase tracking-tighter">{identity.identityName}</div>
                               <div className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">{identity.identityRole}</div>
                            </div>
                         </div>
                         {identity.isActive && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                    ))}
                    <button className="premium-card !border-dashed !border-white/10 flex flex-col items-center justify-center gap-6 text-slate-800 hover:text-white group">
                       <div className="w-14 h-14 rounded-2xl border border-dashed border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Sparkles size={24} /></div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Establish Node</span>
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>{studioOpen && <StudioPopUp posts={studioPosts} onClose={() => setStudioOpen(false)} onCopy={() => {}} copiedId={copiedId} onEdit={setEditingPost} />}</AnimatePresence>
    </div>
  );
};

const TrendCard = ({ trend, idx, generating, onGenerate }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="premium-card !p-10 group relative bg-surface/40 overflow-hidden">
      <div className="relative z-10 flex flex-col justify-between items-start gap-10 w-full">
        <div className="space-y-6 w-full">
          <div className="flex flex-wrap items-center gap-6 text-[9px] font-bold uppercase tracking-[0.4em] text-slate-800 group-hover:text-primary transition-colors">
            <span className="px-4 py-2 border border-white/10 rounded-lg">{trend.platform} Uplink</span>
            {trend.virality && <span className="text-primary italic">Alpha Inbound: {trend.virality}% Velocity</span>}
          </div>
          <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight italic group-hover:not-italic transition-all duration-700">{trend.headline}</h3>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-4xl group-hover:text-slate-300 transition-colors lowercase first-letter:uppercase">{trend.description}</p>
        </div>
        <div className="w-full pt-6 md:pt-8 border-t border-white/5 flex justify-end">
          <button disabled={generating === trend.id} onClick={() => onGenerate(trend.id)} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-5">
            {generating === trend.id ? 'Decrypting...' : 'Forge'} <Zap size={18} fill="currentColor" />
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${active ? 'bg-primary/5 text-primary border border-primary/20 scale-[1.02]' : 'text-slate-800 hover:text-white hover:bg-white/[0.03]'}`}>
    <div className={`transition-all duration-500 relative z-10 ${active ? 'scale-110 text-primary' : 'group-hover:scale-105 group-hover:text-slate-400'}`}>{icon}</div>
    <span className={`text-[11px] font-bold uppercase tracking-[0.2em] relative z-10 transition-all ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{label}</span>
  </button>
);

const StudioPopUp = ({ posts, onClose, onCopy, copiedId, onEdit }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/98 z-[80] backdrop-blur-[120px]" />
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="fixed inset-4 sm:inset-6 md:inset-10 lg:inset-16 bg-surface border border-white/5 z-[90] rounded-[2.5rem] md:rounded-[4rem] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
      
      <header className="px-8 md:px-14 py-8 md:py-12 border-b border-white/5 flex flex-wrap gap-6 justify-between items-center bg-surface/[0.01] backdrop-blur-3xl relative z-10">
        <div className="flex items-center gap-8">
           <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Sparkles size={28} /></div>
           <div className="space-y-1">
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Strategy Forge</h2>
             <div className="text-[10px] text-primary/40 font-bold uppercase tracking-[0.5em] animate-pulse">Neural Pathing Active</div>
           </div>
        </div>
        <button onClick={onClose} className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-700 hover:text-white"><X size={32} /></button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 md:p-14 custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 auto-rows-fr relative z-10">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="premium-card flex flex-col gap-10 hover:bg-white/[0.04]"
            >
               <div className="flex justify-between items-center">
                  <div className="px-6 py-2 rounded-xl bg-primary/5 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.3em] text-primary italic">
                    {post.platformTarget} HUB
                  </div>
                  <button onClick={() => onCopy(post.content, post.id)} className={`p-4 rounded-xl transition-all ${copiedId === post.id ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-800 hover:text-white bg-white/5'}`}>
                    {copiedId === post.id ? <Check size={20} /> : <Copy size={20} />}
                  </button>
               </div>
               
               <div className="flex-1 bg-black/60 p-10 rounded-[2.5rem] border border-white/[0.02] flex items-center justify-center text-center shadow-inner group">
                 <p className="text-xl text-slate-400 leading-relaxed font-semibold italic tracking-tight lowercase first-letter:uppercase">"{post.content}"</p>
               </div>

               <div className="grid grid-cols-2 gap-6 p-1.5 rounded-[2.5rem]">
                 <button className="btn-primary !px-0 !py-6 rounded-3xl">Transmit</button>
                 <button onClick={() => onEdit(post)} className="btn-secondary !px-0 !py-6 rounded-3xl !border-white/5">Refine</button>
               </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  </>
);

export default Dashboard;
