import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { TrendingUp, DollarSign, Target, Activity } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const RiskDashboard = ({ userData, analysisData }) => {
  const { jobTitle, industry } = userData;
  const { 
    globalRiskScore, automationRiskScore, demandTrend, skillGapScore, missingSkills, timeToAchieve, financeRiskScore, financeLevel, roiTimeline, personalAlignment
  } = analysisData;

  const getRiskColor = (score, inverse = false) => {
    let s = score;
    if (inverse) s = 100 - score; 
    if (s > 70) return 'var(--danger-color)';
    if (s > 40) return 'var(--warning-color)';
    return 'var(--success-color)';
  };

  const getRiskColorInverse = (score) => {
    if (score > 70) return 'var(--success-color)';
    if (score > 40) return 'var(--warning-color)';
    return 'var(--danger-color)';
  }

  const lineData = {
    labels: ['2024', '2025', '2026', '2027', '2028'],
    datasets: [{
      label: 'Market Demand',
      data: demandTrend,
      borderColor: 'var(--accent-color)',
      backgroundColor: 'transparent',
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)' } }
    }
  };

  return (
    <div className="dashboard-main fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Global Risk Header */}
      <div className="clay-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>{jobTitle}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{industry}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Global Career Risk</div>
           <div style={{ fontSize: '3.5rem', fontWeight: '800', color: getRiskColor(globalRiskScore), lineHeight: 1 }}>{globalRiskScore}%</div>
        </div>
      </div>

      <div className="stats-grid">
        
        {/* Skill Gap Analysis */}
        <div className="clay-panel">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={18} color="var(--accent-color)"/> Skill Gap</h4>
             <span style={{ fontWeight: 600, color: getRiskColor(skillGapScore) }}>{skillGapScore}% Severity</span>
           </div>
           
           <div className="gauge-container"><div className="gauge-fill" style={{ width: `${skillGapScore}%`, background: getRiskColor(skillGapScore) }}></div></div>
           
           <div style={{ marginTop: '1.5rem' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Time to readiness: <strong style={{ color: 'var(--text-primary)'}}>{timeToAchieve}</strong></p>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Missing Critical Skills:</p>
             <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
               {missingSkills && missingSkills.length > 0 ? missingSkills.map((s, i) => <li key={i}>{s}</li>) : <li>None! You are ready.</li>}
             </ul>
           </div>
        </div>

        {/* Financial Risk Details */}
        <div className="clay-panel">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={18} color="var(--danger-color)"/> Financial Risk</h4>
             <span style={{ fontWeight: 600, color: getRiskColor(financeRiskScore) }}>{financeLevel}</span>
           </div>
           
           <div className="gauge-container"><div className="gauge-fill" style={{ width: `${financeRiskScore}%`, background: getRiskColor(financeRiskScore) }}></div></div>
           
           <div style={{ marginTop: '1.5rem' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Upskill Cost: <strong style={{ color: 'var(--text-primary)'}}>${userData.eduCost || 0}</strong></p>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ROI Timeline: <strong style={{ color: 'var(--text-primary)'}}>{roiTimeline}</strong></p>
           </div>
        </div>

        {/* Personal Alignment Score */}
        <div className="clay-panel">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} color="var(--success-color)"/> Alignment Score</h4>
             <span style={{ fontWeight: 600, color: getRiskColorInverse(personalAlignment) }}>{personalAlignment} / 100</span>
           </div>
           
           <div className="gauge-container"><div className="gauge-fill" style={{ width: `${personalAlignment}%`, background: getRiskColorInverse(personalAlignment) }}></div></div>
           
           <div style={{ marginTop: '1.5rem' }}>
             <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Your expressed interests highly align with this path. Motivation loss risk is evaluated based on this score.</p>
           </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Automation Risk Chart */}
        <div className="clay-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4>Automation Risk Component</h4>
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '2rem 0' }}>
            <Doughnut data={{
              labels: ['Risk', 'Safe'],
              datasets: [{ data: [automationRiskScore, 100 - automationRiskScore], backgroundColor: [getRiskColor(automationRiskScore), 'var(--clay-shadow-outer-dark)'], borderWidth: 0 }]
            }} options={{ cutout: '80%', plugins: { legend: { display: false } } }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: getRiskColor(automationRiskScore) }}>{automationRiskScore}%</span>
            </div>
          </div>
        </div>

        {/* Demand Trend Chart */}
        <div className="clay-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4>Market Demand Trend</h4>
            <TrendingUp size={20} color="var(--accent-color)"/>
          </div>
          <div style={{ height: '200px' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;
