
import React from 'react';
import { GoogleGenAI } from "@google/genai";

const IndiaHub: React.FC = () => {
  const sections = [
    { 
      title: "National Exams", 
      items: ["JEE Mains & Adv", "NEET UG", "CUET", "CLAT", "NDA"],
      icon: "🎓",
      color: "bg-blue-50 text-blue-600"
    },
    { 
      title: "Govt Sector", 
      items: ["UPSC CSE", "SSC CGL", "Bank PO (IBPS)", "Railway (RRB)", "State PSC"],
      icon: "🏛️",
      color: "bg-orange-50 text-orange-600"
    },
    { 
      title: "Private & IT", 
      items: ["Software Engg", "Data Science", "Digital Marketing", "Management (MBA)", "FinTech"],
      icon: "🏢",
      color: "bg-purple-50 text-purple-600"
    },
    { 
      title: "Skill Careers", 
      items: ["UX Design", "E-Sports", "Content Creation", "Aviation", "Hospitality"],
      icon: "⚡",
      color: "bg-pink-50 text-pink-600"
    }
  ];

  return (
    <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black gradient-text">Bharat Career Hub</h2>
        <p className="text-slate-500 font-medium">Your localized roadmap for India's biggest opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="glass p-8 rounded-[2.5rem] border-white/60 space-y-6 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${sec.color}`}>
                {sec.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{sec.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {sec.items.map((item, i) => (
                <button 
                  key={i}
                  className="px-4 py-2 bg-white rounded-full text-sm font-bold text-slate-600 border border-slate-100 hover:border-pink-300 hover:text-pink-600 transition-all shadow-sm"
                  onClick={() => alert(`Redirecting to ${item} insights... (Future Module)`)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-100 via-white to-green-100 p-10 rounded-[3rem] border border-white text-center shadow-xl">
        <h3 className="text-2xl font-black text-slate-800 mb-4">Confused between Engineering or Govt Jobs?</h3>
        <p className="text-slate-600 mb-8 max-w-lg mx-auto font-medium">India's job market is unique. Get a personalized roadmap by asking our AI Mentor specifically about the Indian economy.</p>
        <button className="btn-primary text-white font-bold py-4 px-10 rounded-2xl">Ask India Mentor</button>
      </div>
    </div>
  );
};

export default IndiaHub;
