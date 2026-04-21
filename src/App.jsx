import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Shield, Moon, Sun, History } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// We abstract the Nav and App layout inside a component under Router and Provider
const AppContent = () => {
  const navigate = useNavigate();
  const { currentUser, login, signup, logout, loginWithGoogle, isFirebaseReady } = useAuth();
  
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(JSON.parse(localStorage.getItem('careerHistory') || '[]'));
  }, [isHistoryModalOpen]); // refresh when opened

  const handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      if (isFirebaseReady) {
        await login(email, password);
      }
      setAuthModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const navToHome = () => navigate('/');

  return (
    <>
      {/* Fixed floating capsule navbar - inline styles guarantee fixed position */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 2rem',
        pointerEvents: 'none',
      }}>
        <nav style={{
          pointerEvents: 'all',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1.75rem',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '100px',
          maxWidth: '1100px',
          width: '100%',
          border: '1.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 16px 48px rgba(120,160,210,0.4), 0 4px 16px rgba(180,210,240,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}>
          <div className="nav-brand" onClick={navToHome}>
            <Shield color="var(--accent-color)" size={28} />
            SafeCareer AI
          </div>
          <div className="nav-links">
            <button className="clay-btn" onClick={() => navigate('/about')} style={{ padding: '0.75rem 1.25rem' }}>About</button>
            <button className="clay-btn" onClick={() => navigate('/pricing')} style={{ padding: '0.75rem 1.25rem' }}>Pricing</button>
            <button className="clay-btn" onClick={() => setHistoryModalOpen(true)} style={{ padding: '0.75rem 1.25rem' }}>
               <History size={18}/> History
            </button>
            
            {currentUser ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                 <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{currentUser.email}</span>
                 <button className="clay-btn primary" onClick={logout}>Sign Out</button>
              </div>
            ) : (
              <button className="clay-btn primary" onClick={() => setAuthModalOpen(true)}>Sign In / Sign Up</button>
            )}
          </div>
        </nav>
      </div>

      <div className="app-container">
        <Routes>
           <Route path="/" element={<LandingPage />} />
           <Route path="/analyzer" element={<AnalyzerPage />} />
           <Route path="/about" element={<AboutPage />} />
           <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </div>

      {isAuthModalOpen && (
        <div className="auth-modal fade-in" onClick={(e) => e.target.className.includes('auth-modal') && setAuthModalOpen(false)}>
           <div className="clay-panel auth-box">
              <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Sign In to SafeCareer</h2>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <input className="clay-input" type="email" name="email" placeholder="Email Address" required />
                 <input className="clay-input" type="password" name="password" placeholder="Password" required />
                 <button type="submit" className="clay-btn primary" style={{ width: '100%', marginTop: '0.5rem' }}>Continue</button>
                 {isFirebaseReady && (
                   <button type="button" onClick={loginWithGoogle} className="clay-btn" style={{ background: 'rgba(66, 133, 244, 0.1)', border: 'none' }}>
                     Continue with Google
                   </button>
                 )}
              </form>
           </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="auth-modal fade-in" onClick={(e) => e.target.className.includes('auth-modal') && setHistoryModalOpen(false)}>
           <div className="clay-panel auth-box" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Your Analysis History</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>View past calculations. (Read-only)</p>
              
              {history.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No history found. Run an analysis first!</p> : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {history.map((h, i) => (
                       <div key={i} className="clay-input" style={{ cursor: 'pointer' }} onClick={() => setHistoryModalOpen(false)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                             <strong style={{ fontSize: '1.1rem' }}>{h.jobTitle}</strong>
                             <span style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '1.1rem' }}>Risk: {h.riskScore}%</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                             {new Date(h.date).toLocaleDateString()} • {h.industry}
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
