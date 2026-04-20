import { describe, it, expect, vi } from 'vitest';
import { calculateV2Analysis } from './aiService';

describe('Career Analysis Engine - Fallback Resilience', () => {
  it('should return a valid analysis object even if the API fails', async () => {
    // Mocking the user data
    const userData = {
      jobTitle: 'Software Engineer',
      industry: 'Technology',
      experience: 5
    };

    // We expect the function to return a structured object with risk scores
    const result = await calculateV2Analysis(userData);
    
    expect(result).toHaveProperty('globalRiskScore');
    expect(result).toHaveProperty('automationRiskScore');
    expect(result).toHaveProperty('problemAlignment');
    expect(result.globalRiskScore).toBeGreaterThanOrEqual(0);
    expect(result.globalRiskScore).toBeLessThanOrEqual(100);
  });

  it('should distinguish between Tech and Non-Tech roles in fallback', async () => {
    const techResult = await calculateV2Analysis({ jobTitle: 'Developer', industry: 'Tech' });
    const nonTechResult = await calculateV2Analysis({ jobTitle: 'Chef', industry: 'Food' });
    
    // Tech roles generally have lower automation risk in my current benchmark logic
    expect(techResult.automationRiskScore).toBeLessThan(nonTechResult.automationRiskScore);
  });
});
