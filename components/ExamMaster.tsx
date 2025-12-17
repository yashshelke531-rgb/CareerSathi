
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ExamMaster: React.FC = () => {
  const [exam, setExam] = useState('');
  const [guide, setGuide] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getGuide = async () => {
    if (!exam.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Create a 'Real-Life' comprehensive success roadmap for the ${exam} exam. 
        Include:
        1. EXAM OVERVIEW: Difficulty level and competition stats.
        2. SYLLABUS & BOOKS: Exactly what to study.
        3. REAL-LIFE ROADMAP: A 12-month month-by-month preparation calendar.
        4. THE PRIZE: Once you pass, what is the 'Day 1' salary and career growth like?
        5. STRATEGIES: Pro-tips from toppers. Use Markdown.`,
        config: { thinkingConfig: { thinkingBudget: 4000 } }
      });
      setGuide(response.text || '');
    } catch (err) {
      setGuide("Failed to generate plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/40 p-10 rounded-3xl border border-slate-800 text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">Real-Life Success Roadmaps</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Don't just study hard, study smart. Get a full 12-month plan for your target exam and see the rewards waiting for you.</p>
        <div className="flex max-w-2xl mx-auto gap-4">
          <input
            value={exam}
            onChange={e => setExam(e.target.value)}
            placeholder="e.g. UPSC CSE, JEE Advanced, SAT, GMAT..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button onClick={getGuide} className="bg-blue-600 px-10 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all">
            {isLoading ? 'Crafting Roadmap...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>

      {guide && (
        <div className="glass p-10 rounded-3xl border border-slate-800">
          <div className="prose prose-invert max-w-none prose-blue">
             <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-light">
                {guide}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamMaster;
