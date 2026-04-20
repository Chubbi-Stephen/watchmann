import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BarChart3, History, Settings } from 'lucide-react';
import api from '../lib/api';

// Components
import { DesktopSidebar } from '../components/layout/Sidebar';
import { MobileHeader, MobileNavigation } from '../components/layout/MobileMenu';
import { StudioPopUp } from '../components/dashboard/StudioPopUp';
import { ErrorBoundary, LoadingSpinner } from '../components/ui/Feedback';
import { OperationalTab } from '../components/dashboard/tabs/OperationalTab';

// Lazy loading to optimize bundle size
const TelemetryTab = lazy(() => import('../components/dashboard/tabs/TelemetryTab').then(module => ({ default: module.TelemetryTab })));
const ArchiveTab = lazy(() => import('../components/dashboard/tabs/ArchiveTab').then(module => ({ default: module.ArchiveTab })));
const CommandCoreTab = lazy(() => import('../components/dashboard/tabs/CommandCoreTab').then(module => ({ default: module.CommandCoreTab })));

const NAVIGATION_ITEMS = [
  { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: "Operational" },
  { id: 'analytics', icon: <BarChart3 size={20} />, label: "Telemetry" },
  { id: 'archive', icon: <History size={20} />, label: "Archive" },
  { id: 'settings', icon: <Settings size={20} />, label: "Command Core" },
];

const Dashboard = ({ user, setUser }) => {
  const [data, setData] = useState({ trends: [], posts: [], analytics: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generating, setGenerating] = useState(null);
  
  // UI states
  const [copiedId, setCopiedId] = useState(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTrendId, setStudioTrendId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendRes, postRes, analyticsRes] = await Promise.allSettled([
        api.get('/trends'),
        api.get('/posts'),
        api.get('/analytics')
      ]);

      setData({
        trends: trendRes.status === 'fulfilled' ? trendRes.value.data.trends : [],
        posts: postRes.status === 'fulfilled' ? postRes.value.data.posts : [],
        analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : null,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleGenerate = useCallback(async (trendId) => {
    setGenerating(trendId);
    try {
      await api.post('/posts/generate', { trendId });
      await fetchDashboardData();
      setStudioTrendId(trendId);
      setStudioOpen(true);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(null);
    }
  }, [fetchDashboardData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Simple hard redirect is sufficient, alternatively replace state in App Router
  }, []);

  const handleCopy = useCallback(async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }, []);

  const studioPosts = useMemo(() => {
    if (studioTrendId) return data.posts.filter(p => p.trendId === studioTrendId);
    return data.posts;
  }, [data.posts, studioTrendId]);

  return (
    <div className="min-h-screen flex bg-surface text-slate-400 font-inter selection:bg-primary/30 relative">
      <div className="fixed inset-0 grid-overlay opacity-30 pointer-events-none" />
      
      <MobileHeader 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <MobileNavigation 
        items={NAVIGATION_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <DesktopSidebar 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
        items={NAVIGATION_ITEMS}
      />

      <main className="flex-1 p-6 md:p-8 lg:px-10 lg:py-16 xl:p-16 max-w-[1700px] mx-auto w-full pt-32 lg:pt-16 min-h-screen relative z-10 overflow-x-hidden min-w-0" id="main-content">
        <ErrorBoundary fallback={
          <div className="text-center p-12 bg-red-500/10 rounded-2xl border border-red-500/20">
            <h2 className="text-xl font-bold text-red-500 mb-4">Module Rendering Failure</h2>
            <p className="text-slate-400">An unexpected error occurred while loading this module.</p>
          </div>
        }>
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner label={`INITIALIZING ${activeTab.toUpperCase()} SUB-ROUTINE`} />}>
              {activeTab === 'dashboard' && (
                <OperationalTab 
                  trends={data.trends} 
                  posts={data.posts} 
                  analytics={data.analytics} 
                  loading={loading}
                  handleGenerate={handleGenerate} 
                  generating={generating} 
                  fetchDashboardData={fetchDashboardData}
                />
              )}
              {activeTab === 'analytics' && <TelemetryTab analytics={data.analytics} />}
              {activeTab === 'archive' && <ArchiveTab posts={data.posts} />}
              {activeTab === 'settings' && <CommandCoreTab user={user} />}
            </Suspense>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <AnimatePresence>
        {studioOpen && (
          <StudioPopUp 
            posts={studioPosts} 
            onClose={() => setStudioOpen(false)} 
            onCopy={handleCopy} 
            copiedId={copiedId} 
            onEdit={setEditingPost} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
