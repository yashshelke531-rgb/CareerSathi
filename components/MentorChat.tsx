
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from '../types';

const MentorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I am Career Sarathi. Ask me anything, and I will show you the future through data and visuals." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Get reasoning and metrics
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are Career Sarathi. For every user message, analyze the career context. 
          Respond with: 1. Strategic advice. 2. A 'Data Insight' section.
          Format your response to include a JSON-like metric section at the end if applicable: 
          METRICS: {"growth": 85, "demand": 90, "salary": "$120k", "difficulty": 70}`,
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      const responseText = textResponse.text || "";
      
      // Extract metrics if present
      let metrics;
      const metricMatch = responseText.match(/METRICS: (\{.*\})/);
      if (metricMatch) {
        try { metrics = JSON.parse(metricMatch[1]); } catch(e) {}
      }

      // 2. Generate a relevant visual
      let imageUrl = '';
      try {
        const imgResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `A professional, cinematic concept art representing: ${userMessage}. High quality, futuristic educational style.` }] },
        });
        const part = imgResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part) imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      } catch (e) { console.error("Image generation failed", e); }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseText.replace(/METRICS: \{.*\}/, ""), 
        imageUrl,
        metrics
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "My neural links are stabilizing. Let's try that again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-purple-100 shadow-2xl">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <div>
          <h2 className="text-xl font-bold gradient-text">Visual Career Mentor</h2>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Data-Driven Insights</p>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl ${msg.role === 'user' ? 'message-bubble-user' : 'message-bubble-ai'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
              
              {msg.imageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img src={msg.imageUrl} alt="Career Visualization" className="w-full h-auto" />
                </div>
              )}

              {msg.metrics && (
                <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Market Growth</p>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{width: `${msg.metrics.growth}%`}}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Skill Demand</p>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{width: `${msg.metrics.demand}%`}}></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Package</p>
                    <p className="text-lg font-black text-purple-600">{msg.metrics.salary}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</p>
                    <p className="text-lg font-black text-pink-600">{msg.metrics.difficulty}/100</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="p-5 w-48 bg-white rounded-3xl shimmer h-24"></div>}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type any career to see data analysis & visuals..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none text-slate-800 placeholder:text-slate-400 font-medium text-sm"
          />
          <button onClick={handleSend} className="p-4 btn-primary text-white rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
