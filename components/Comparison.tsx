
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const Comparison: React.FC = () => {
  const [careerA, setCareerA] = useState('');
  const [careerB, setCareerB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleCompare = async () => {
    if (!careerA.trim() || !careerB.trim()) return;
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Compare Career A: ${careerA} vs Career B: ${careerB}.
        Respond in JSON format only: 
        {
          "salaryA": "Freshers: 5-8 LPA, Seniors: 25+ LPA",
          "salaryB": "Freshers: 4-6 LPA, Seniors: 15+ LPA",
          "diffA": 85,
          "diffB": 60,
          "studyA": "4 Years (Degree) + 2 Years (Masters)",
          "studyB": "3 Years (Degree)",
          "summary": "Short paragraph comparing both."
        }`,
        config: { responseMimeType: "application/json" }
      });

      setData(JSON.parse(response.text || '{}'));
    } catch (e) {
      console.error(e);
      alert("Something went wrong with the comparison.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black gradient-text">Career Battleground</h2>
        <p className="text-slate-500 font-medium">Head-to-head analysis of your dream paths.</p>
      </div>

      <div className="glass p-10 rounded-[3rem] border-white/60 space-y-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Career Option A</label>
            <input 
              value={careerA}
              onChange={e => setCareerA(e.target.value)}
              placeholder="e.g. Software Developer"
              className="w-full p-6 bg-white border border-slate-100 rounded-3xl shadow-inner outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Career Option B</label>
            <input 
              value={careerB}
              onChange={e => setCareerB(e.target.value)}
              placeholder="e.g. Data Scientist"
              className="w-full p-6 bg-white border border-slate-100 rounded-3xl shadow-inner outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        </div>

        <button 
          onClick={handleCompare}
          disabled={isLoading}
          className="w-full btn-primary text-white font-bold py-6 rounded-[2rem] text-xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
        >
          {isLoading ? 'Synthesizing Battle Data...' : 'Compare Side-by-Side'}
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top duration-500">
          {/* Card A */}
          <div className="bg-white p-8 rounded-[3rem] border-l-8 border-purple-500 shadow-xl space-y-6">
            <h3 className="text-3xl font-black text-purple-700">{careerA}</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estimated Income</p>
                <p className="text-lg font-bold text-slate-700">{data.salaryA}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Difficulty Index ({data.diffA}/100)</p>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{width: `${data.diffA}%`}}></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Typical Study Time</p>
                <p className="text-lg font-bold text-slate-700">{data.studyA}</p>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="bg-white p-8 rounded-[3rem] border-l-8 border-pink-500 shadow-xl space-y-6">
            <h3 className="text-3xl font-black text-pink-700">{careerB}</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estimated Income</p>
                <p className="text-lg font-bold text-slate-700">{data.salaryB}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Difficulty Index ({data.diffB}/100)</p>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500" style={{width: `${data.diffB}%`}}></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Typical Study Time</p>
                <p className="text-lg font-bold text-slate-700">{data.studyB}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 glass p-8 rounded-[2.5rem] border-white/60">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">The Verdict</h4>
            <p className="text-slate-700 font-medium italic leading-relaxed">{data.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;
