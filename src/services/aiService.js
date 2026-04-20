import OpenAI from 'openai';

// SafeCareer AI Service — Migrated to OpenAI (GPT-4o-mini)

const getOpenAIClient = () => {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) throw new Error('Missing VITE_OPENAI_API_KEY. Please add your OpenAI key.');
  return new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true // For purely client-side MVP without backend
  });
};

// ─────────────────────────────────────────────────────────────
// 1. CAREER RISK ANALYSIS — Strict JSON schema output
// ─────────────────────────────────────────────────────────────
export const calculateV2Analysis = async (userData) => {
  const openai = getOpenAIClient();
  const { jobTitle, industry, experience, currentSkills, requiredSkills, eduCost } = userData;

  const systemPrompt = `You are a Career Risk Analysis Engine with deep knowledge of global job markets, AI automation trends, and workforce economics.
Output ONLY raw JSON matching this schema exactly. No markdown, no explanation:
{
  "automationRiskScore": <0-100>,
  "skillGapScore": <0-100>,
  "demandTrend": [<5 numbers 0-100 showing 5-year demand trajectory>],
  "financeRiskScore": <0-100>,
  "financeLevel": "<Low|Medium|High>",
  "roiTimeline": "<e.g. 1-2 Years>",
  "personalAlignmentScore": <0-100>,
  "keyVulnerabilities": ["<specific risk 1>", "<specific risk 2>", "<specific risk 3>"],
  "safeSkills": ["<transferable skill 1>", "<skill 2>", "<skill 3>"],
  "missingSkills": ["<critical missing skill 1>", "<skill 2>", "<skill 3>"],
  "timeToAchieve": "<e.g. 6-9 Months>"
}`;

  const userPrompt = `Analyze this career profile and return realistic risk scores:
- Role: ${jobTitle}
- Industry: ${industry}
- Experience: ${experience || 0} years
- Current Skills: ${(currentSkills || []).join(', ') || 'Not specified'}
- Target Skills: ${(requiredSkills || []).join(', ') || 'Not specified'}
- Upskill Budget: $${eduCost || 0}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.15,
    });

    let content = response.choices[0].message.content.trim();
    const ai = JSON.parse(content);

    const autoRisk    = ai.automationRiskScore || 0;
    const skillGap    = ai.skillGapScore || 0;
    const lastDemand  = ai.demandTrend?.at(-1) ?? 50;
    const finRisk     = ai.financeRiskScore || 0;
    const misalign    = 100 - (ai.personalAlignmentScore || 50);

    const globalRisk = Math.round(
      0.30 * autoRisk + 0.25 * skillGap + 0.20 * (100 - lastDemand) + 0.15 * finRisk + 0.10 * misalign
    );

    return {
      globalRiskScore:     globalRisk,
      automationRiskScore: autoRisk,
      demandTrend:         ai.demandTrend || [50,55,60,65,70],
      skillGapScore:       skillGap,
      missingSkills:       ai.missingSkills || [],
      timeToAchieve:       ai.timeToAchieve || '6 Months',
      financeRiskScore:    finRisk,
      financeLevel:        ai.financeLevel || 'Medium',
      roiTimeline:         ai.roiTimeline || '2 Years',
      personalAlignment:   ai.personalAlignmentScore || 50,
      keyVulnerabilities:  ai.keyVulnerabilities || [],
      safeSkills:          ai.safeSkills || [],
    };
  } catch (err) {
    if (err?.error?.code === 'insufficient_quota' || err?.error?.type === 'insufficient_quota' || String(err).includes('429')) {
       return generateMockFallback(userData);
    }
    console.error('OpenAI Analysis Error:', err);
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────
// 2. MOCK FALLBACK
// ─────────────────────────────────────────────────────────────
const generateMockFallback = ({ jobTitle = '', industry = '' }) => {
  const isTech = /tech|software|engineer|developer|data|cloud/i.test(`${jobTitle} ${industry}`);
  const autoRisk = isTech ? 22 : 65;
  const skillGap = isTech ? 28 : 52;
  const demand   = isTech ? 80 : 38;
  const finRisk  = 40;
  const misalign = 20;
  const global   = Math.round(0.30*autoRisk + 0.25*skillGap + 0.20*(100-demand) + 0.15*finRisk + 0.10*misalign);
  return {
    globalRiskScore: global, automationRiskScore: autoRisk,
    demandTrend: isTech ? [60,65,70,75,80] : [55,50,45,40,40],
    skillGapScore: skillGap, missingSkills: ['AI Integration','Data Analysis','Cloud Architecture'],
    timeToAchieve: '6–8 Months', financeRiskScore: finRisk, financeLevel: 'Medium',
    roiTimeline: '1.5 Years', personalAlignment: 80,
    keyVulnerabilities: ['Manual Workflows','Legacy Systems'], safeSkills: ['Strategic Thinking','Problem Solving'],
  };
};

// ─────────────────────────────────────────────────────────────
// 3. AI CHAT — GPT-4o-mini with expert career system prompt
// ─────────────────────────────────────────────────────────────
export const chatWithAgent = async (messages, userData = {}, analysisData = {}) => {
  const openai = getOpenAIClient();

  const hasProfile = !!(userData?.jobTitle);
  const systemPrompt = hasProfile
    ? `You are SafeCareer AI — an expert career strategist and coach with deep knowledge of global job markets, AI automation trends, salary benchmarks, and upskilling ROI.

User Profile:
• Role: ${userData.jobTitle} | Industry: ${userData.industry} | Experience: ${userData.experience || 0} yrs
• Global Risk Score: ${analysisData.globalRiskScore ?? 'N/A'}% | Automation Risk: ${analysisData.automationRiskScore ?? 'N/A'}%
• Skill Gap: ${analysisData.skillGapScore ?? 'N/A'}% | Missing Skills: ${(analysisData.missingSkills || []).slice(0,4).join(', ') || 'N/A'}
• Key Vulnerabilities: ${(analysisData.keyVulnerabilities || []).join(', ') || 'N/A'}
• Safe Skills: ${(analysisData.safeSkills || []).join(', ') || 'N/A'}

Your mission: Give concise, specific, data-backed advice to help lower their risk score and advance their career. Reference their actual data. Keep responses under 200 words unless asked for detail. Use bullet points for clarity. Be encouraging but honest about risks.`
    : `You are SafeCareer AI — an expert career strategist and coach with deep knowledge of:
- AI automation impact on jobs (which roles are at risk and why)
- In-demand skills by industry and region
- Upskilling ROI, course recommendations, and timelines
- Salary benchmarks and job market demand trends
- Career pivoting strategies and portfolio building

Help users understand their career risk, find safe paths forward, and make smart upskilling decisions.
Keep answers concise, specific, and actionable. Use bullet points. Be encouraging.
Invite them to fill in the Risk Analyzer form for a personalized score.`;

  // Build OpenAI-format conversation map 
  const conversation = messages
    .filter(m => m.content.trim()) // filter empty out
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversation
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    return response.choices[0].message.content;
  } catch (err) {
    if (err?.error?.code === 'insufficient_quota' || err?.error?.type === 'insufficient_quota' || String(err).includes('429')) {
       return '⚠️ Rate limit / Quota hit on API key. Please wait a moment or check your OpenAI account balance.';
    }
    console.error('Chat error:', err);
    throw err;
  }
};
