
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const MindDiscovery: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'testing' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ logic: 0, empathy: 0, creative: 0, leadership: 0 });
  const [resultData, setResultData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testQuestions = [
    { text: "You see an old machine broken. You think:", options: [
      { t: "How do I fix the mechanics?", s: 'logic' },
      { t: "Who owned this and what was their story?", s: 'empathy' },
      { t: "Can I turn this into an art piece?", s: 'creative' },
      { t: "Who can I gather to build a better one?", s: 'leadership' }
    ]},
    { text: "A friend is crying. You:", options: [
      { t: "Help them find a logical solution", s: 'logic' },
      { t: "Just sit and feel with them", s: 'empathy' },
      { t: "Make them a gift to cheer them up", s: 'creative' },
      { t: "Organize a plan to solve their stress", s: 'leadership' }
    ]},
    { text: "Your dream room is:", options: [
      { t: "A perfectly organized lab", s: 'logic' },
      { t: "A cozy community kitchen", s: 'empathy' },
      { t: "A wild studio with music", s: 'creative' },
      { t: "A high-rise corner office", s: 'leadership' }
    ]}
  ];

  const handleAnswer = async (skill: string) => {
    const newScores = { ...scores, [skill]: (scores as any)[skill] + 1 };
    setScores(newScores);

    if (currentQ < testQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishTest(newScores);
    }
  };

  const finishTest = async (finalScores: any) => {
    setStage('result');
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dominant = Object.keys(finalScores).reduce((a, b) => (finalScores as any)[a] > (finalScores as any)[b] ? a : b);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze a mind profile dominant in ${dominant}. Scores: Logic: ${finalScores.logic}, Empathy: ${finalScores.empathy}, Creative: ${finalScores.creative}, Leadership: ${finalScores.leadership}. Provide a deep personality analysis and 3 matching careers with visuals description.`,
      });

      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A futuristic, abstract representation of a ${dominant} mind. Artistic, high quality, purple and pink color scheme.` }] },
      });

      const part = imgResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      
      setResultData({
        analysis: response.text,
        imageUrl: part ? `data:image/png;base64,${part.inlineData.data}` : null
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (stage === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-pink-100">🔮</div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black gradient-text">Mind Discovery</h2>
          <p className="text-slate-500 max-w-md mx-auto font-medium">Step into our psychological simulator to discover the hidden strengths of your cognitive profile.</p>
        </div>
        <button onClick={() => setStage('testing')} className="btn-primary text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-pink-200">
          Enter Simulator
        </button>
      </div>
    );
  }

  if (stage === 'testing') {
    const q = testQuestions[currentQ];
    return (
      <div className="max-w-2xl mx-auto space-y-10 py-12">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-bold text-pink-500 tracking-widest uppercase">Simulation Phase {currentQ + 1}</p>
          <h3 className="text-3xl font-black text-slate-800">{q.text}</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {q.options.map((o, i) => (
            <button key={i} onClick={() => handleAnswer(o.s)} className="p-6 bg-white hover:bg-pink-50 border border-slate-100 rounded-3xl text-left font-bold text-slate-700 transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg">
              {o.t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 animate-in slide-in-from-bottom duration-700">
      <div className="glass p-10 rounded-[3rem] border-white/50 text-center space-y-8">
        <h2 className="text-4xl font-black gradient-text">Your Mind Profile</h2>
        
        {isLoading ? (
          <div className="py-20 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400">Decoding Neural Pathways...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            {resultData?.imageUrl && (
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={resultData.imageUrl} alt="Mind Map" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{resultData?.analysis}</p>
              </div>
              <button onClick={() => setStage('intro')} className="text-pink-600 font-bold hover:underline">Restart Simulation →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindDiscovery;
