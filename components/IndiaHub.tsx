
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface ExamDetail {
  syllabus: string[];
  strategy: string[];
  difficulty: string;
  timeRequired: string;
  resources: string[];
  proTips: string;
}

const IndiaHub: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [examData, setExamData] = useState<ExamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sections = [
    { 
      title: "National Exams", 
      items: ["JEE Mains & Adv", "NEET UG", "CUET", "CLAT", "NDA", "BITSAT"],
      icon: "🎓",
      color: "bg-blue-50 text-blue-600"
    },
    { 
      title: "Govt Sector", 
      items: ["UPSC CSE", "SSC CGL", "Bank PO (IBPS)", "Railway (RRB)", "State PSC", "GATE"],
      icon: "🏛️",
      color: "bg-orange-50 text-orange-600"
    },
    { 
      title: "Private & IT", 
      items: ["Software Engg", "Data Science", "Digital Marketing", "Management (MBA)", "FinTech", "CAT"],
      icon: "🏢",
      color: "bg-purple-50 text-purple-600"
    },
    { 
      title: "Skill Careers", 
      items: ["UX Design", "E-Sports", "Content Creation", "Aviation", "Hospitality", "Fashion Design"],
      icon: "⚡",
      color: "bg-pink-50 text-pink-600"
    }
  ];

  const fetchExamInsights = async (examName: string) => {
    setSelectedExam(examName);
    setIsLoading(true);
    setExamData(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a detailed success roadmap for the Indian exam: ${examName}. 
        Format your response as JSON with these keys: 
        "syllabus" (array of main subjects), 
        "strategy" (array of 4-5 steps to crack it), 
        "difficulty" (text), 
        "timeRequired" (text like '12-18 months'), 
        "resources" (array of best books/sites), 
        "proTips" (one paragraph of secret tips).`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              syllabus: { type: Type.ARRAY, items: { type: Type.STRING } },
              strategy: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: { type: Type.STRING },
              timeRequired: { type: Type.STRING },
              resources: { type: Type.ARRAY, items: { type: Type.STRING } },
              proTips: { type: Type.STRING }
            },
            required: ["syllabus", "strategy", "difficulty", "timeRequired", "resources", "proTips"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setExamData(data);
    } catch (error) {
      console.error("Exam Hub Error:", error);
      alert("Failed to load exam insights. Please try again.");
      setSelectedExam(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedExam) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
        <button 
          onClick={() => setSelectedExam(null)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-purple-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          Back to Hub
        </button>

        <div className="glass p-10 rounded-[3.5rem] border-white/60 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl pointer-events-none">🇮🇳</div>
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center space-y-6">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-black text-slate-400 uppercase tracking-widest">Mastering {selectedExam} Intelligence...</p>
            </div>
          ) : examData && (
            <>
              <div className="space-y-2">
                <div className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                  Exam Intelligence
                </div>
                <h2 className="text-5xl font-black text-slate-800">{selectedExam}</h2>
                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Difficulty:</span>
                    <span className="text-sm font-black text-pink-600">{examData.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Commitment:</span>
                    <span className="text-sm font-black text-blue-600">{examData.timeRequired}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Syllabus */}
                <div className="bg-white/50 p-8 rounded-[2.5rem] border border-white shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">📚</span>
                    Core Syllabus
                  </h3>
                  <ul className="space-y-3">
                    {examData.syllabus.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cracking Strategy */}
                <div className="bg-white/50 p-8 rounded-[2.5rem] border border-white shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">⚡</span>
                    How to Crack It
                  </h3>
                  <div className="space-y-4">
                    {examData.strategy.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-emerald-500 font-black italic">0{i+1}.</span>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-white/50 p-8 rounded-[2.5rem] border border-white shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">🔖</span>
                    Top Resources
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {examData.resources.map((res, i) => (
                      <span key={i} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-500 border border-slate-100 shadow-sm">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center italic">!</span>
                    Insider Tip
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                    "{examData.proTips}"
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <button className="btn-primary text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Find Best Coaching Near Me
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

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
                  className="px-4 py-2 bg-white rounded-full text-sm font-bold text-slate-600 border border-slate-100 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm active:scale-95"
                  onClick={() => fetchExamInsights(item)}
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
