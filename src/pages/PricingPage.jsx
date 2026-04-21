import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Rocket, Star, Crown } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for a quick career health check.",
      icon: <Star size={32} color="var(--text-secondary)" />,
      features: ["Global Risk Index", "Automation Exposure Score", "Limited Analysis History", "Basic Skill Tags"],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Explorer",
      price: "$19",
      description: "Detailed insights for career transitioners.",
      icon: <Rocket size={32} color="var(--accent-color)" />,
      features: ["Everything in Free", "Detailed Skill Gap Engine", "Market Demand Trends", "Personalized Roadmap", "Priority AI Processing"],
      cta: "Go Explorer",
      featured: true
    },
    {
      name: "Visionary",
      price: "$49",
      description: "Complete strategic planning for professionals.",
      icon: <Crown size={32} color="var(--warning-color)" />,
      features: ["Everything in Explorer", "Upskilling ROI Calculator", "Unlimited Analysis History", "Relocation Risk Maps", "Direct AI Career Coach"],
      cta: "Become Visionary",
      featured: false
    }
  ];

  return (
    <div className="fade-in" style={{ padding: '4rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      
      <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px' }}>
          Simplicity in <span style={{ color: 'var(--accent-color)' }}>Pricing</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Choose the plan that fits your career goals. Whether you're just curious or ready to dominate your field.
        </p>
      </section>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`clay-panel pricing-card ${plan.featured ? 'featured' : ''}`}
            style={{ 
              background: plan.featured ? 'var(--clay-bg)' : 'rgba(255,255,255,0.7)',
              padding: '3rem 2.5rem'
            }}
          >
            {plan.featured && (
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                background: 'var(--accent-color)',
                color: 'white',
                padding: '0.4rem 1.2rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Most Popular</div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>{plan.icon}</div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{plan.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', minHeight: '40px' }}>{plan.description}</p>
            
            <div className="pricing-price">
              {plan.price}<span>/mo</span>
            </div>

            <ul className="pricing-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <Check size={18} color="var(--success-color)" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`clay-btn ${plan.featured ? 'primary' : ''}`} style={{ width: '100%', marginTop: 'auto' }}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '6rem', padding: '3rem', background: 'rgba(66, 133, 244, 0.05)', borderRadius: '32px' }}>
         <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Need an Enterprise solution?</h4>
         <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Custom models for organizations focusing on workforce planning and transitions.</p>
         <button className="clay-btn">Contact Sales</button>
      </div>

    </div>
  );
};

export default PricingPage;
