/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, BrainCircuit, BarChart } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import AIChatBot from '../components/AIChatBot';
import { Boxes } from '../components/ui/background-boxes';
import { TextRotate } from '../components/ui/text-rotate';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-in">

      {/* ===== HERO SECTION — Boxes background inside this section only ===== */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #b8d4f5 0%, #cddff8 40%, #deeafc 100%)',
      }}>
        {/* Animated boxes grid — sits at z-index 0, FULLY receives pointer events */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Boxes />
        </div>

        {/* Radial vignette overlay — pointerEvents:none so it doesn't block boxes hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse 75% 55% at 50% 45%, transparent 25%, rgba(196,220,250,0.65) 60%, rgba(185,215,248,0.9) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Edge fade — top */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'140px', zIndex:1, background:'linear-gradient(to bottom, #cddff8 0%, transparent 100%)', pointerEvents:'none' }} />
        {/* Edge fade — bottom */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'160px', zIndex:1, background:'linear-gradient(to top, #cddff8 0%, transparent 100%)', pointerEvents:'none' }} />
        {/* Edge fade — left */}
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'160px', zIndex:1, background:'linear-gradient(to right, #cddff8 0%, transparent 100%)', pointerEvents:'none' }} />
        {/* Edge fade — right */}
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'160px', zIndex:1, background:'linear-gradient(to left, #cddff8 0%, transparent 100%)', pointerEvents:'none' }} />

        {/* Hero content — pointerEvents:none on wrapper, restored on interactive children */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '2rem',
          pointerEvents: 'none',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.6)',
            border: '1.5px solid rgba(64,144,247,0.35)',
            borderRadius: '100px',
            padding: '0.45rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#4090f7',
            marginBottom: '1.75rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(64,144,247,0.15)',
          }}>
            🚀 AI-Powered Career Intelligence
          </div>

          {/* ── Animated headline ── */}
          <LayoutGroup>
            <motion.h1
              layout
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-2.5px',
                color: '#16213e',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0 0.35em',
              }}
            >
              <motion.span layout transition={{ type: 'spring', damping: 30, stiffness: 400 }}>
                Navigate Your Career
              </motion.span>

              {/* Rotating highlighted word */}
              <TextRotate
                texts={[
                  'with Certainty',
                  'with Confidence',
                  'with AI 🤖',
                  'Smarter 🧠',
                  'to Success',
                  'Fearlessly ⚡',
                  'with Data',
                  'like a Pro',
                ]}
                mainClassName={undefined}
                splitLevelClassName={undefined}
                staggerFrom="last"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-110%', opacity: 0 }}
                staggerDuration={0.028}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2200}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'linear-gradient(140deg, #56b0ff 0%, #3d82f4 100%)',
                  color: '#ffffff',
                  padding: '0.15em 0.5em',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 24px rgba(61,130,244,0.45)',
                  lineHeight: 1.2,
                  verticalAlign: 'middle',
                }}
              />
            </motion.h1>
          </LayoutGroup>

          <p style={{
            fontSize: '1.2rem',
            color: '#4e6080',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            lineHeight: 1.85,
          }}>
            The job market is shifting fast. Use AI to analyze your career trajectory,
            discover skill gaps, and measure the real ROI of upskilling.
          </p>

          {/* Button MUST have pointerEvents:all since parent is none */}
          <button
            className="clay-btn primary"
            onClick={() => navigate('/analyzer')}
            style={{
              fontSize: '1.15rem',
              padding: '1.2rem 3rem',
              borderRadius: '100px',
              pointerEvents: 'all',
              cursor: 'pointer',
            }}
          >
            Check Your Future →
          </button>
        </div>
      </section>

      {/* ===== AI CHATBOT ===== */}
      <div style={{
        width: '100%',
        maxWidth: '820px',
        margin: '4rem auto 4rem auto',
        padding: '0 1.5rem',
        height: '500px',
      }} className="float-anim">
        <AIChatBot isLanding={true} />
      </div>

      {/* ===== FEATURES ===== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        padding: '0 2rem 6rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div className="clay-panel feature-card">
          <Cpu size={56} strokeWidth={2.5} color="var(--danger-color)" style={{ margin: '0 auto' }} />
          <h3>Automation Risk</h3>
          <p>We analyze your skills against the latest AI developments to calculate how likely your current role is to be automated in the next 5 years.</p>
        </div>
        <div className="clay-panel feature-card">
          <BrainCircuit size={56} strokeWidth={2.5} color="var(--accent-color)" style={{ margin: '0 auto' }} />
          <h3>Skill Gap Engine</h3>
          <p>Input your desired role, and our AI calculates precisely which skills you're missing, mapping out an achievable learning timeline.</p>
        </div>
        <div className="clay-panel feature-card">
          <BarChart size={56} strokeWidth={2.5} color="var(--success-color)" style={{ margin: '0 auto' }} />
          <h3>Financial ROI</h3>
          <p>Education is expensive. We compute your financial risk by evaluating the cost of upskilling alongside market demand trends.</p>
        </div>
      </div>

      {/* ===== BOTTOM GRADIENT CTA ===== */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '420px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5rem 2rem',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(125% 125% at 50% 10%, rgba(255,255,255,0.9) 35%, rgba(64,144,247,0.8) 100%)',
          backgroundSize: '100% 100%',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Your Future Starts Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '540px', margin: '0 auto 2.5rem auto', lineHeight: 1.8 }}>
            Don't leave your career to chance. Let AI guide your next move with precision and data.
          </p>
          <button
            className="clay-btn primary"
            onClick={() => navigate('/analyzer')}
            style={{ fontSize: '1.1rem', padding: '1.1rem 2.75rem', borderRadius: '100px' }}
          >
            Start Your Free Analysis →
          </button>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
