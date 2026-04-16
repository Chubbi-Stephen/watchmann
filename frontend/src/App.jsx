import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import api from './lib/api';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" />;
  return children;
};

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
          console.error("Auth verify failed", err);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading Watchmann...</div>;

  return (
    <Router>
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
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
