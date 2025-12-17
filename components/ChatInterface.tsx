
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Greetings. I am your creative partner. How shall we collaborate today? I can help with coding, story building, or deep reasoning." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMessage,
        config: {
          systemInstruction: "You are Lumina, a world-class creative assistant. You are insightful, concise, and deeply knowledgeable about art, tech, and storytelling.",
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      const aiContent = response.text || "I apologize, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a ripple in the data stream. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
        <div>
          <h2 className="text-xl font-bold text-white">The Oracle</h2>
          <p className="text-xs text-slate-400">Gemini 3 Pro Advanced Reasoning</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">System Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700/50'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-700/50 space-y-2 w-32">
              <div className="h-2 w-full bg-slate-700 rounded shimmer"></div>
              <div className="h-2 w-2/3 bg-slate-700 rounded shimmer"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/40 border-t border-slate-800">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Whisper your inquiry..."
            className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-slate-200 placeholder:text-slate-600"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-4 bottom-4 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
