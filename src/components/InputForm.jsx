import React, { useState } from 'react';
import { Bot, Building, Briefcase, Coins, Rocket, Code, Clock } from 'lucide-react';
import { calculateV2Analysis } from '../services/aiService';

const InputForm = ({ onAnalyze }) => {
  const [formData, setFormData] = useState({
    jobTitle: '', industry: '', experience: '', currentSkills: '', requiredSkills: '', eduCost: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.industry) return;

    setLoading(true);
    try {
      const dataToProcess = {
        ...formData,
        currentSkills: formData.currentSkills.split(',').map(s => s.trim()).filter(Boolean),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      };

      const analysisResult = await calculateV2Analysis(dataToProcess);
      
      const history = JSON.parse(localStorage.getItem('careerHistory') || '[]');
      history.unshift({ ...dataToProcess, riskScore: analysisResult.globalRiskScore, date: new Date().toISOString() });
      localStorage.setItem('careerHistory', JSON.stringify(history.slice(0, 10)));
      
      onAnalyze(dataToProcess, analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed: ' + (error.message || 'Check console.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clay-panel fade-in">
      <h2>Comprehensive Risk Analyzer</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Fill out your profile to calculate your global risk score.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="input-row">
          <div className="input-group">
            <label><Briefcase size={18} strokeWidth={2.5} style={{display:'inline', marginBottom:'-4px', marginRight:'6px', color: 'var(--accent-color)'}}/> Current Job Title <span style={{color: 'var(--danger-color)'}}>*</span></label>
            <input className="clay-input" type="text" name="jobTitle" placeholder="Software Engineer" value={formData.jobTitle} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label><Building size={18} strokeWidth={2.5} style={{display:'inline', marginBottom:'-4px', marginRight:'6px', color: 'var(--accent-color)'}}/> Industry <span style={{color: 'var(--danger-color)'}}>*</span></label>
            <input className="clay-input" type="text" name="industry" placeholder="Technology" value={formData.industry} onChange={handleChange} required />
          </div>
        </div>

        <div className="input-group">
          <label><Code size={18} strokeWidth={2.5} style={{display:'inline', marginBottom:'-4px', marginRight:'6px', color: 'var(--accent-color)'}}/> Current Skills (Optional)</label>
          <input className="clay-input" type="text" name="currentSkills" placeholder="React, Node.js" value={formData.currentSkills} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label><Rocket size={18} strokeWidth={2.5} style={{display:'inline', marginBottom:'-4px', marginRight:'6px', color: 'var(--accent-color)'}}/> Required Next-Level Skills (Optional)</label>
          <input className="clay-input" type="text" name="requiredSkills" placeholder="Rust, Cloud Architecture" value={formData.requiredSkills} onChange={handleChange} />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label><Coins size={18} strokeWidth={2.5} style={{display:'inline', marginBottom:'-4px', marginRight:'6px', color: 'var(--accent-color)'}}/> Upskill Cost ($) (Optional)</label>
            <input className="clay-input" type="number" name="eduCost" placeholder="5000" value={formData.eduCost} onChange={handleChange} />
          </div>
          <div className="input-group">
             <label><Clock size={18} strokeWidth={2.5} style={{display:'inline', marginBottom:'-4px', marginRight:'6px', color: 'var(--accent-color)'}}/> Years of Experience <span style={{color: 'var(--danger-color)'}}>*</span></label>
             <input className="clay-input" type="number" name="experience" placeholder="5" value={formData.experience} onChange={handleChange} required />
          </div>
        </div>

        {/* Interests field removed */}

        <button type="submit" className="clay-btn primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Analyzing Data...' : <><Bot size={20} /> Calculate Global Risk Score</>}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
