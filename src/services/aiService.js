// SafeCareer AI Service — Gemini 2.0 Flash (v1beta) for all AI calls
// Perplexity is server-side only (CORS blocked in browser), so Gemini handles everything.

const getGeminiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('Missing VITE_GEMINI_API_KEY');
  return key;
};

const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

// ─────────────────────────────────────────────────────────────
// 1. CAREER RISK ANALYSIS — Strict JSON schema output
// ─────────────────────────────────────────────────────────────
export const calculateV2Analysis = async (userData) => {
  const apiKey = getGeminiKey();
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
    const res = await fetch(GEMINI_URL(apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.15 },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) return generateMockFallback(userData);
      const err = await res.text();
      console.error('Gemini Analysis Error:', err);
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    let content = data.candidates[0].content.parts[0].text.trim();
    if (content.startsWith('```')) content = content.replace(/```json|```/g, '').trim();

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
    if (err.message?.includes('429')) return generateMockFallback(userData);
    console.error('Analysis failed:', err);
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
// 3. AI CHAT — Gemini 2.0 Flash with expert career system prompt
// ─────────────────────────────────────────────────────────────
export const chatWithAgent = async (messages, userData = {}, analysisData = {}) => {
  const apiKey = getGeminiKey();

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

  // Build Gemini-format conversation (filter out initial bot greeting to avoid role issues)
  const conversation = messages
    .filter(m => !(m.role === 'assistant' && messages.indexOf(m) === 0))
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Ensure conversation starts with user role
  if (!conversation.length || conversation[0].role !== 'user') {
    conversation.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
  }

  try {
    const res = await fetch(GEMINI_URL(apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: conversation,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      if (res.status === 429) return '⚠️ Rate limit hit. Please wait a moment and try again!';
      const err = await res.text();
      console.error('Chat API error:', err);
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('Chat error:', err);
    throw err;
  }
};
