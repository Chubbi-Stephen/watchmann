import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-surface/50 border border-white/5 rounded-[2rem] p-8 text-center" role="alert" aria-live="assertive">
          <AlertTriangle size={48} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-black text-white tracking-tighter mb-4">Node Synchronization Failure</h2>
          <p className="text-slate-500 mb-8 max-w-md">The telemetry connection was interrupted or a critical module failed to execute. Recommend manual resync.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-sm transition-colors border border-white/10"
          >
            <RefreshCw size={16} /> Resync Node
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const LoadingSpinner = ({ label = "Synchronizing..." }) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[300px] w-full" aria-busy="true" aria-live="polite">
    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_4s_linear_infinite]" />
      <div className="absolute inset-1 rounded-full border-t flex-1 border-primary/60 animate-[spin_1.5s_ease-in-out_infinite]" />
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
    </div>
    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 italic animate-pulse">
      {label}
    </div>
  </div>
);
