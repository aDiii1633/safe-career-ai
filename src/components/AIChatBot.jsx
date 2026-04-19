import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { chatWithAgent } from '../services/aiService';

const AIChatBot = ({ userData, analysisData, isLanding = false }) => {
  const initialMsg = isLanding
    ? `Hi! I'm SafeCareer AI — your expert career strategist. 🤖\n\nI can help you with:\n• Career automation risk by role & industry\n• In-demand skills and salary benchmarks\n• Upskilling ROI and course recommendations\n• Career pivot strategies\n\nAsk me anything, or fill the form to get your personalized Risk Score!`
    : `I've analyzed your profile as a **${userData?.jobTitle}** in ${userData?.industry}.\n\nYour Global Risk Score is **${analysisData?.globalRiskScore}%**. Ask me anything about your results, next steps, or how to lower your risk! 💡`;

  const [messages, setMessages] = useState([{ role: 'assistant', content: initialMsg }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      // Always call real AI — both landing and analyzer pages
      const response = await chatWithAgent(newMsgs, userData || {}, analysisData || {});
      setMessages([...newMsgs, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMsgs, { role: 'assistant', content: "⚠️ Connection issue. Please check your API key in .env.local and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clay-panel chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid var(--clay-shadow-outer-dark)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <Sparkles color="var(--accent-color)" />
        <h3 style={{ margin: 0 }}>Career Coach AI</h3>
      </div>

      <div className="messages-area" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%', display: 'flex', gap: '0.5rem',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
          }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '18px', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--clay-shadow-outer-dark)' : 'var(--clay-bg)',
              boxShadow: 'inset 2px 2px 4px var(--clay-shadow-inner-light), inset -2px -2px 4px var(--clay-shadow-inner-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} color="var(--accent-color)" />}
            </div>
            <div style={{ 
              background: 'var(--clay-bg)',
              boxShadow: '4px 4px 8px var(--clay-shadow-outer-dark), -4px -4px 8px var(--clay-shadow-outer-light)',
              padding: '1rem', borderRadius: '16px',
              borderTopRightRadius: msg.role === 'user' ? 0 : '16px',
              borderTopLeftRadius: msg.role === 'assistant' ? 0 : '16px',
              fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem' }}>
             <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'var(--clay-bg)', boxShadow: 'inset 2px 2px 4px var(--clay-shadow-inner-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink:0 }}>
                <Sparkles size={18} color="var(--accent-color)" />
             </div>
             <div style={{ background: 'var(--clay-bg)', boxShadow: '4px 4px 8px var(--clay-shadow-outer-dark)', padding: '1rem', borderRadius: '16px', borderTopLeftRadius: 0, color: 'var(--text-secondary)' }}>
               Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem' }}>
        <input 
          className="clay-input"
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          style={{ flex: 1, borderRadius: '24px' }}
        />
        <button type="submit" disabled={isLoading} className="clay-btn primary" style={{ width: '56px', height: '56px', borderRadius: '28px', padding: 0 }}>
          <Send size={20} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
    </div>
  );
};

export default AIChatBot;
