
import React, { useState, useEffect } from 'react';
import { ToolType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  onNavigate: (tool: ToolType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [dailyTip, setDailyTip] = useState("Loading your career spark...");

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Give a one-sentence inspiring and practical career tip for a student in 2024.",
        });
        setDailyTip(resp.text || "Dream big, but build your skills step by step.");
      } catch (e) {
        setDailyTip("Focus on building 'stacks' of skills rather than just one.");
      }
    };
    fetchTip();
  }, []);

  const powerCards = [
    { 
      id: ToolType.MIND_DISCOVERY, 
      title: "Mind Discovery", 
      desc: "Map your cognitive strengths", 
      icon: "🔮", 
      color: "from-purple-500 to-indigo-600" 
    },
    { 
      id: ToolType.INTEREST_TEST, 
      title: "Success Matrix", 
      desc: "12-question core career quiz", 
      icon: "🎯", 
      color: "from-pink-500 to-rose-600" 
    },
    { 
      id: ToolType.INDIA_HUB, 
      title: "Bharat Hub", 
      desc: "JEE, NEET & Govt Jobs specialist", 
      icon: "🇮🇳", 
      color: "from-orange-500 to-amber-600" 
    },
    { 
      id: ToolType.COMPARISON, 
      title: "Battleground", 
      desc: "Compare careers side-by-side", 
      icon: "⚔️", 
      color: "from-blue-500 to-cyan-600" 
    }
  ];

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden glass p-12 rounded-[3.5rem] border-white/40 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl pointer-events-none">🚀</div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h2 className="text-5xl font-black text-slate-800 leading-tight">
            Welcome back, <span className="gradient-text">Pioneer</span>.
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Your intelligence partner for navigating the modern workforce. Where do we head today?
          </p>
          <div className="pt-4 flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">"{dailyTip}"</p>
          </div>
        </div>
      </section>

      {/* Grid of Tools */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {powerCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group relative h-64 glass rounded-[2.5rem] p-8 text-left border-white/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-95"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
            <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        ))}
      </section>

      {/* Quick Action Banner */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-bold">Unsure about your future?</h3>
          <p className="text-slate-400 text-sm font-medium">Launch the AI Mentor for a personalized deep-dive conversation.</p>
        </div>
        <button 
          onClick={() => onNavigate(ToolType.MENTOR)}
          className="relative z-10 px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95"
        >
          Start Mentoring →
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
