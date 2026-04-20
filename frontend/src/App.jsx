import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './lib/api';
import { LoadingSpinner } from './components/ui/Feedback';

// Route-level code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;
  return children;
};

// Global App Error Boundary
class AppErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
          <div className="text-center p-12 bg-white/[0.02] border border-white/10 rounded-3xl">
            <h1 className="text-3xl font-black text-red-500 mb-4">CRITICAL KERNEL PANIC</h1>
            <p className="text-slate-400 mb-8 max-w-sm">
              The application encountered an irrecoverable crash. Restarting the system...
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all text-sm uppercase tracking-widest text-white"
            >
              Reboot App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Auth verify failed:", err);
          localStorage.removeItem('token'); // clear stale invalid tokens
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080808]">
        <LoadingSpinner label="BOOTING COMMAND CORE" />
      </div>
    );
  }

  return (
    <AppErrorBoundary>
      <Router>
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-[#080808]">
            <LoadingSpinner label="INITIALIZING SECTOR..." />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding user={user} setUser={setUser} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} setUser={setUser} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
