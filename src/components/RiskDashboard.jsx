import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { TrendingUp, DollarSign, Target, Activity, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="clay-panel" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, var(--clay-bg), rgba(66, 133, 244, 0.05))' }}
      >
        <div>
          <h2 style={{ fontSize: '2.4rem', letterSpacing: '-1px' }}>{jobTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{industry}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Career Risk Index</div>
           <motion.div 
             initial={{ scale: 0.5 }}
             animate={{ scale: 1 }}
             transition={{ type: 'spring', stiffness: 200, damping: 12 }}
             style={{ fontSize: '4rem', fontWeight: '900', color: getRiskColor(globalRiskScore), lineHeight: 1 }}
           >
             {globalRiskScore}%
           </motion.div>
        </div>
      </motion.div>

      <div className="stats-grid">
        
        {/* Skill Gap Analysis */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="clay-panel"
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={18} color="var(--accent-color)"/> Skill Gap</h4>
             <span style={{ fontWeight: 700, color: getRiskColor(skillGapScore) }}>{skillGapScore}% Severity</span>
           </div>
           
           <div className="gauge-container"><motion.div initial={{ width: 0 }} animate={{ width: `${skillGapScore}%` }} transition={{ duration: 1, delay: 0.5 }} className="gauge-fill" style={{ background: getRiskColor(skillGapScore) }}></motion.div></div>
           
           <div style={{ marginTop: '1.5rem' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>Time to readiness: <strong style={{ color: 'var(--text-primary)'}}>{timeToAchieve}</strong></p>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.5rem' }}>Upskill Requirements:</p>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
               {missingSkills && missingSkills.length > 0 ? missingSkills.map((s, i) => (
                 <a 
                   key={i} 
                   href={`https://www.google.com/search?q=how+to+learn+${encodeURIComponent(s)}+for+${encodeURIComponent(jobTitle)}`}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="clay-btn" 
                   style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', textDecoration: 'none', background: 'rgba(66, 133, 244, 0.1)', border: 'none', borderRadius: '8px' }}
                 >
                   {s} <Search size={12} style={{ marginLeft: '4px' }} />
                 </a>
               )) : <span style={{ color: 'var(--success-color)' }}>Expert Level Reached</span>}
             </div>
           </div>
        </motion.div>

        {/* Financial Risk Details */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="clay-panel"
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={18} color="var(--danger-color)"/> Financial Risk</h4>
             <span style={{ fontWeight: 700, color: getRiskColor(financeRiskScore) }}>{financeLevel}</span>
           </div>
           
           <div className="gauge-container"><motion.div initial={{ width: 0 }} animate={{ width: `${financeRiskScore}%` }} transition={{ duration: 1, delay: 0.6 }} className="gauge-fill" style={{ background: getRiskColor(financeRiskScore) }}></motion.div></div>
           
           <div style={{ marginTop: '1.5rem' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>Estimated Investment: <strong style={{ color: 'var(--text-primary)'}}>${userData.eduCost || 0}</strong></p>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Projected ROI: <strong style={{ color: 'var(--text-primary)'}}>{roiTimeline}</strong></p>
           </div>
        </motion.div>

        {/* Personal Alignment Score */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="clay-panel"
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} color="var(--success-color)"/> Role Fit</h4>
             <span style={{ fontWeight: 700, color: getRiskColorInverse(personalAlignment) }}>{personalAlignment}/100</span>
           </div>
           
           <div className="gauge-container"><motion.div initial={{ width: 0 }} animate={{ width: `${personalAlignment}%` }} transition={{ duration: 1, delay: 0.7 }} className="gauge-fill" style={{ background: getRiskColorInverse(personalAlignment) }}></motion.div></div>
           
           <div style={{ marginTop: '1.5rem' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Your background aligns with this career path's core requirements. High scores indicate lower chance of burnout.</p>
           </div>
        </motion.div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Automation Risk Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="clay-panel" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h4 style={{ fontWeight: 700 }}>Automation Impact</h4>
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '2rem 0' }}>
            <Doughnut data={{
              labels: ['Exposure', 'Security'],
              datasets: [{ 
                data: [automationRiskScore, 100 - automationRiskScore], 
                backgroundColor: [getRiskColor(automationRiskScore), 'rgba(66, 133, 244, 0.1)'], 
                borderWidth: 0,
                hoverOffset: 4
              }]
            }} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: getRiskColor(automationRiskScore), display: 'block' }}>{automationRiskScore}%</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Risk</span>
            </div>
          </div>
        </motion.div>

        {/* Demand Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="clay-panel"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 700 }}>Search Demand Forecast</h4>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(66, 133, 244, 0.1)' }}>
              <TrendingUp size={20} color="var(--accent-color)"/>
            </div>
          </div>
          <div style={{ height: '200px' }}>
            <Line data={lineData} options={{ ...chartOptions, animation: { duration: 2000, easing: 'easeOutQuart' } }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RiskDashboard;
