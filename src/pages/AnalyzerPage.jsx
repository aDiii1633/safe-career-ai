import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import RiskDashboard from '../components/RiskDashboard';
import AIChatBot from '../components/AIChatBot';
import { EtherealShadow } from '../components/ui/etheral-shadow';

const AnalyzerPage = () => {
  const [userData, setUserData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = (data, analysisResult) => {
    setUserData(data);
    setAnalysisData(analysisResult);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* ===== FULL-PAGE ETHEREAL SHADOW BACKGROUND ===== */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        /* Site light-theme background gradient */
        background: 'linear-gradient(145deg, #eef4ff 0%, #dce9fc 50%, #cddff8 100%)',
        pointerEvents: 'none',
      }}>
        <EtherealShadow
          color="rgba(64, 144, 247, 0.55)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Page content above background */}
      <div style={{ position: 'relative', zIndex: 10 }} className="fade-in">
        {!userData ? (
          <>
            <button
              className="clay-btn"
              onClick={() => navigate('/')}
              style={{ marginBottom: '2rem', padding: '0.75rem 1.5rem', width: 'fit-content' }}
            >
              ← Back to Home
            </button>
            <div
              className="dashboard-layout"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}
            >
              <InputForm onAnalyze={handleAnalyze} />
              <div style={{ height: '700px', position: 'sticky', top: '100px' }}>
                <AIChatBot isLanding={true} />
              </div>
            </div>
          </>
        ) : (
          <div className="dashboard-layout fade-in">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button className="clay-btn" onClick={() => setUserData(null)}>← Edit Details</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '3rem' }}>
              <RiskDashboard userData={userData} analysisData={analysisData} />

              <div className="clay-panel">
                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center' }}>
                  Ask Your Coach About These Results
                </h3>
                <div style={{ height: '600px' }}>
                  <AIChatBot userData={userData} analysisData={analysisData} isLanding={false} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerPage;
