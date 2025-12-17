
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const CareerExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide detailed information about the career field or course: ${query}. 
        CRITICAL: You must include:
        1. Top Global & Local Colleges.
        2. Key subjects and skills needed.
        3. Real-world job prospects.
        4. APPROXIMATE ANNUAL INCOME PACKAGES (Freshers, Mid-Level, and Senior Executives) in both INR and USD.
        5. Growth trends for the next 5 years.`,
        config: { tools: [{ googleSearch: {} }] }
      });

      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Related Source',
        uri: chunk.web?.uri || '#'
      })) || [];

      setResults({ role: 'assistant', content: response.text || '', links });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-3xl border border-slate-800">
        <h2 className="text-2xl font-bold mb-4 gradient-text">Career & Income Insight</h2>
        <p className="text-slate-400 mb-6 text-sm">Discover courses and see how much you can potentially earn in the real world.</p>
        <div className="flex gap-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Try 'Full Stack Developer' or 'Aeronautical Engineering'..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button onClick={handleSearch} className="bg-emerald-600 px-8 rounded-xl font-bold text-white hover:bg-emerald-500 transition-colors">
            {isLoading ? 'Searching...' : 'Explore Insights'}
          </button>
        </div>
      </div>

      {results && (
        <div className="glass p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {results.content}
            </div>
          </div>
          {results.links && results.links.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Grounding Sources</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.links.map((link, i) => (
                  <a key={i} href={link.uri} target="_blank" className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-sm text-emerald-400 hover:bg-slate-800 transition-all flex items-center gap-2">
                    <span className="truncate">{link.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 22 3 22 10"/><line x1="10" y1="14" x2="22" y2="2"/></svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerExplorer;
