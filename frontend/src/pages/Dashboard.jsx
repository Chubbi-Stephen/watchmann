import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import api from '../lib/api';

const Dashboard = ({ user }) => {
  const [trends, setTrends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null); // trendId being generated
  const [copiedId, setCopiedId] = useState(null);

  const fetchDashboardData = async () => {
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
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGenerate = async (trendId) => {
    setGenerating(trendId);
    try {
      const res = await api.post('/posts/generate', { trendId });
      setPosts([ ...res.data.posts, ...posts ]);
      // Scroll to tops section or show success
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex bg-[#030303]">
      {/* Sidebar - App-like experience */}
      <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 font-black text-xl text-primary mb-12 overflow-hidden">
          <Zap fill="currentColor" size={24} className="shrink-0" /> <span className="hidden lg:inline">WATCHMANN</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarLink icon={<History size={20} />} label="Archive" />
          <SidebarLink icon={<Settings size={20} />} label="Settings" />
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-slate-500 hover:text-white transition-colors mt-auto"
        >
          <LogOut size={20} /> <span className="hidden lg:inline">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-slate-500">Here's what's trending in {user?.profile?.niche} today.</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Trends Feed */}
          <div className="xl:col-span-2 space-y-8">
            <section>
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-6">
                <TrendingUp size={16} /> Breaking Tech Trends
              </div>

              <div className="space-y-4">
                {trends.length > 0 ? trends.map((trend, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={trend.id} 
                    className="glass p-6 group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400">
                            {trend.platform.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-500">Discovered moments ago</span>
                        </div>
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {trend.headline}
                        </h3>
                      </div>
                      <button 
                        disabled={generating === trend.id}
                        onClick={() => handleGenerate(trend.id)}
                        className={`glow-btn !py-2 !px-4 text-xs flex items-center gap-2 ${generating === trend.id ? 'opacity-50' : ''}`}
                      >
                        {generating === trend.id ? 'Generating...' : 'Craft Post'} <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500">
                    Watching for new trends...
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Generated Posts Section */}
          <div className="space-y-8">
            <section className="sticky top-6">
              <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm mb-6">
                <Sparkles size={16} /> Crafted Content
              </div>

              <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide">
                <AnimatePresence>
                  {posts.length > 0 ? posts.map((post) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={post.id} 
                      className="glass p-5 border-l-4 border-l-secondary"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                            <Zap size={14} fill="currentColor" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{post.platformTarget} Post</div>
                            <div className="text-[10px] text-slate-500">High Virality Potential</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(post.content, post.id)}
                          className={`p-2 rounded-lg transition-all ${copiedId === post.id ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                          {copiedId === post.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-6 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 border-dashed">
                        {post.content}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest bg-secondary text-white rounded-lg opacity-80 hover:opacity-100 transition-all">Schedule</button>
                        <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-lg hover:bg-white/5">Edit</button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500 text-sm">
                      Select a trend to start <br /> crafting your first post.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }) => (
  <a href="#" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5'}`}>
    {icon} <span className="hidden lg:inline font-bold text-sm tracking-wide">{label}</span>
  </a>
);

export default Dashboard;
