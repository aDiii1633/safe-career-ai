import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Cpu, Users, Globe, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="fade-in" style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6 }}
           style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(66, 133, 244, 0.1)', borderRadius: '24px', marginBottom: '2rem' }}
        >
           <Shield size={64} color="var(--accent-color)" />
        </motion.div>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1.5rem' }}>
          Future-Proof Your <span style={{ color: 'var(--accent-color)' }}>Career</span>
        </h1>
        <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '800px', margin: '0 auto' }}>
          SafeCareer AI was born out of a simple observation: the world is changing faster than our ability to adapt. 
          Our mission is to democratize career intelligence using cutting-edge Google Gemini AI.
        </p>
      </section>

      {/* Mission Grid */}
      <div className="pricing-grid" style={{ marginBottom: '6rem' }}>
        <div className="clay-panel feature-card">
          <Target size={40} color="var(--danger-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3>Precision Analysis</h3>
          <p>We don't just guess. We analyze market trends, automation indexes, and skill graphs to give you data-driven certainty.</p>
        </div>
        <div className="clay-panel feature-card">
          <Cpu size={40} color="var(--accent-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3>Gemini Intelligence</h3>
          <p>Powered by the world's most advanced AI, we provide insights that were previously only available to elite consultants.</p>
        </div>
        <div className="clay-panel feature-card">
          <Globe size={40} color="var(--success-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3>Global Scale</h3>
          <p>Whether you're in tech, healthcare, or trades, our engine adapts to your industry's unique regional and global shifts.</p>
        </div>
      </div>

      {/* Detailed Story */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="clay-panel" 
        style={{ padding: '4rem', lineHeight: 2, fontSize: '1.1rem' }}
      >
        <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800 }}>Our Vision</h2>
        <p style={{ marginBottom: '2rem' }}>
          Since our inception, we have believed that every individual deserves a roadmap to success that isn't based on hearsay or outdated advice. 
          By combining **real-time automation data** with **personalized skill mapping**, we empower users to make decisions today that will keep them relevant a decade from now.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem' }}>
           <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}><Users size={20} color="var(--accent-color)"/> Community First</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>We build for the people. Our tools are designed to be intuitive, accessible, and inclusive for all career stages.</p>
           </div>
           <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}><Zap size={20} color="var(--warning-color)"/> Rapid Innovation</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>As AI evolves, so do we. We ship updates daily to ensure our risk models account for the latest breakthroughs.</p>
           </div>
        </div>
      </motion.section>

      <div style={{ textAlign: 'center', marginTop: '6rem', paddingBottom: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Ready to see where your path leads?</p>
        <button className="clay-btn primary" onClick={() => window.location.href='/analyzer'}>Analyze Your Career →</button>
      </div>

    </div>
  );
};

export default AboutPage;
