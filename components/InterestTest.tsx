
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Question {
  id: number;
  section: 'Interests' | 'Skills' | 'Personality' | 'Work Preference';
  text: string;
  options: { text: string; category: string }[];
}

const questions: Question[] = [
  // SECTION 1: INTERESTS
  {
    id: 1,
    section: 'Interests',
    text: "Which world would you enjoy exploring most?",
    options: [
      { text: "A digital world of code and algorithms", category: "STEM" },
      { text: "A world of visual storytelling and design", category: "CREATE" },
      { text: "A world where people's health is the priority", category: "HEAL" },
      { text: "A world of business, strategy, and power", category: "LEAD" }
    ]
  },
  {
    id: 2,
    section: 'Interests',
    text: "What catches your attention in a magazine?",
    options: [
      { text: "New technology or space discoveries", category: "STEM" },
      { text: "Fashion, architecture, or art trends", category: "CREATE" },
      { text: "Psychology or medical breakthroughs", category: "HEAL" },
      { text: "Success stories of CEOs and startups", category: "LEAD" }
    ]
  },
  {
    id: 3,
    section: 'Interests',
    text: "Your ideal weekend hobby involves:",
    options: [
      { text: "Building a PC or solving puzzles", category: "STEM" },
      { text: "Photography, drawing, or playing music", category: "CREATE" },
      { text: "Counseling friends or volunteering", category: "HEAL" },
      { text: "Trading stocks or organizing a community event", category: "LEAD" }
    ]
  },
  // SECTION 2: SKILLS
  {
    id: 4,
    section: 'Skills',
    text: "What is your most developed skill?",
    options: [
      { text: "Logical reasoning and math", category: "STEM" },
      { text: "Creative thinking and ideation", category: "CREATE" },
      { text: "Active listening and empathy", category: "HEAL" },
      { text: "Public speaking and negotiation", category: "LEAD" }
    ]
  },
  {
    id: 5,
    section: 'Skills',
    text: "When working in a team, you are the one who:",
    options: [
      { text: "Fixes the technical errors", category: "STEM" },
      { text: "Makes the project look beautiful", category: "CREATE" },
      { text: "Ensures everyone is happy and included", category: "HEAL" },
      { text: "Sets the goals and takes charge", category: "LEAD" }
    ]
  },
  {
    id: 6,
    section: 'Skills',
    text: "How do you handle complex information?",
    options: [
      { text: "I break it down into data and numbers", category: "STEM" },
      { text: "I visualize it through shapes and colors", category: "CREATE" },
      { text: "I think about how it affects human lives", category: "HEAL" },
      { text: "I figure out how to profit from it", category: "LEAD" }
    ]
  },
  // SECTION 3: PERSONALITY
  {
    id: 7,
    section: 'Personality',
    text: "Which word describes your inner self?",
    options: [
      { text: "Precise", category: "STEM" },
      { text: "Original", category: "CREATE" },
      { text: "Kind-hearted", category: "HEAL" },
      { text: "Dominant", category: "LEAD" }
    ]
  },
  {
    id: 8,
    section: 'Personality',
    text: "How do you react to criticism?",
    options: [
      { text: "I analyze the logic behind the feedback", category: "STEM" },
      { text: "I take it as a challenge to be more unique", category: "CREATE" },
      { text: "I worry about the relationship dynamic", category: "HEAL" },
      { text: "I immediately figure out how to improve my position", category: "LEAD" }
    ]
  },
  {
    id: 9,
    section: 'Personality',
    text: "In a social gathering, you are usually:",
    options: [
      { text: "The quiet observer analyzing the room", category: "STEM" },
      { text: "The one wearing something eye-catching", category: "CREATE" },
      { text: "The one having a deep 1-on-1 conversation", category: "HEAL" },
      { text: "The one introducing everyone and networking", category: "LEAD" }
    ]
  },
  // SECTION 4: WORK PREFERENCE
  {
    id: 10,
    section: 'Work Preference',
    text: "What is your ideal work environment?",
    options: [
      { text: "A quiet lab or tech-focused office", category: "STEM" },
      { text: "A vibrant, messy creative studio", category: "CREATE" },
      { text: "A community center, clinic, or school", category: "HEAL" },
      { text: "A modern corporate skyscraper", category: "LEAD" }
    ]
  },
  {
    id: 11,
    section: 'Work Preference',
    text: "What motivates you to go to work?",
    options: [
      { text: "Solving unsolved mysteries", category: "STEM" },
      { text: "Expressing my inner vision", category: "CREATE" },
      { text: "Helping someone in need", category: "HEAL" },
      { text: "Building an empire or making a fortune", category: "LEAD" }
    ]
  },
  {
    id: 12,
    section: 'Work Preference',
    text: "Your preferred daily schedule is:",
    options: [
      { text: "Highly structured and predictable", category: "STEM" },
      { text: "Spontaneous and ever-changing", category: "CREATE" },
      { text: "Deeply connected with people's needs", category: "HEAL" },
      { text: "Fast-paced and high-stakes", category: "LEAD" }
    ]
  }
];

const InterestTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState<{ analysis: string, imageUrl: string, metrics: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (category: string) => {
    const nextAnswers = [...answers, category];
    setAnswers(nextAnswers);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
      generateAnalysis(nextAnswers);
    }
  };

  const generateAnalysis = async (finalAnswers: string[]) => {
    setIsLoading(true);
    const counts = finalAnswers.reduce((acc: any, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 1. Generate text analysis with embedded metrics
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on a career test, the user is dominant in: ${topCategory}. 
        Distribution: STEM: ${counts.STEM || 0}, CREATE: ${counts.CREATE || 0}, HEAL: ${counts.HEAL || 0}, LEAD: ${counts.LEAD || 0}.
        Provide a psychological analysis, 3 top careers, and include a JSON-like metric section at the end:
        METRICS: {"innovation": 80, "impact": 95, "earningPotential": "High", "stressLevel": "Medium"}`,
      });

      const text = response.text || '';
      let metrics = { innovation: 50, impact: 50, earningPotential: 'TBD', stressLevel: 'Low' };
      const metricMatch = text.match(/METRICS: (\{.*\})/);
      if (metricMatch) {
        try { metrics = JSON.parse(metricMatch[1]); } catch(e) {}
      }

      // 2. Generate relevant career visualization
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A vibrant, futuristic illustration representing a ${topCategory} career path. Concept art style, light purple and pink tones, high detail.` }] },
      });

      const part = imgResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      const imageUrl = part ? `data:image/png;base64,${part.inlineData.data}` : '';

      setResultData({
        analysis: text.replace(/METRICS: \{.*\}/, ""),
        imageUrl,
        metrics
      });
    } catch (err) {
      setResultData({
        analysis: "You are clearly a " + topCategory + " profile! Talk to our Mentor for more details.",
        imageUrl: '',
        metrics: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFinished) {
    return (
      <div className="glass p-10 rounded-[2.5rem] border border-white/50 space-y-8 animate-in fade-in duration-500">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center space-y-6">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-pink-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">Synthesizing Your Success Matrix...</h3>
              <p className="text-slate-500 animate-pulse">Analyzing Interests • Skills • Personality • Work Preference</p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-4xl font-black gradient-text">Your Career Identity</h2>
              <p className="text-slate-500 font-medium">We've mapped your cognitive pathways to these high-potential fields.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                {resultData?.imageUrl && (
                  <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={resultData.imageUrl} alt="Career Vision" className="w-full h-auto" />
                  </div>
                )}
                
                {resultData?.metrics && (
                  <div className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Innovation Index</p>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{width: `${resultData.metrics.innovation}%`}}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Social Impact</p>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{width: `${resultData.metrics.impact}%`}}></div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Earnings</p>
                       <p className="text-lg font-black text-purple-600">{resultData.metrics.earningPotential}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Stress</p>
                       <p className="text-lg font-black text-pink-600">{resultData.metrics.stressLevel}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 overflow-y-auto max-h-[600px] prose prose-slate">
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium italic">
                  {resultData?.analysis}
                </div>
                <div className="mt-10 flex justify-center pt-8 border-t border-slate-50">
                   <button 
                     onClick={() => {
                       setCurrentStep(0);
                       setAnswers([]);
                       setIsFinished(false);
                       setResultData(null);
                     }}
                     className="btn-primary text-white font-bold py-4 px-12 rounded-2xl shadow-lg"
                   >
                     Retake Success Test
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const q = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-4xl font-black gradient-text">Career Discovery Quiz</h2>
        <div className="flex justify-center gap-6">
          {['Interests', 'Skills', 'Personality', 'Work Preference'].map((sec) => (
            <span key={sec} className={`text-[10px] font-bold uppercase tracking-[0.2em] ${q.section === sec ? 'text-pink-600' : 'text-slate-300'}`}>
              {sec}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-10 h-3 w-full bg-white/50 rounded-full overflow-hidden p-1 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="glass p-12 rounded-[3rem] border border-white/50 shadow-2xl space-y-12 transition-all duration-500">
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {q.section} — {currentStep + 1} / 12
          </div>
          <h3 className="text-3xl font-bold text-slate-800 leading-tight">{q.text}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.category)}
              className="w-full text-left p-8 bg-white/80 hover:bg-white rounded-[2rem] border border-slate-100 hover:border-pink-200 transition-all shadow-sm hover:shadow-xl group hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center gap-5">
                <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm font-black text-slate-300 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all shadow-inner">
                  {String.fromCharCode(65 + idx)}
                </span>
                <p className="font-bold text-slate-700 group-hover:text-slate-900 text-lg leading-tight">{opt.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterestTest;
