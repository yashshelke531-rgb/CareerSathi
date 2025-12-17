
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);

  const generateImage = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: aspectRatio as any }
        }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const url = `data:image/png;base64,${part.inlineData.data}`;
          setResults(prev => [{ url, prompt, timestamp: Date.now() }, ...prev]);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        alert("The model didn't return an image. It might have triggered safety filters.");
      }
    } catch (error) {
      console.error("Image Gen Error:", error);
      alert("Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="glass rounded-3xl p-8 border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 gradient-text">The Dreamer</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Visual Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic solarpunk city with floating botanical gardens..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none text-slate-200 transition-all resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Aspect Ratio</label>
              <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['1:1', '4:3', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      aspectRatio === ratio ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={isLoading || !prompt.trim()}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Dreaming...</span>
                </>
              ) : (
                <>
                  <span>Manifest Visual</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((img, i) => (
          <div key={i} className="group relative glass rounded-2xl overflow-hidden border border-slate-800 transition-transform hover:scale-[1.02] duration-500">
            <img src={img.url} alt={img.prompt} className="w-full h-auto object-cover aspect-square" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-xs text-slate-200 line-clamp-2 italic">"{img.prompt}"</p>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = img.url;
                  link.download = `lumina-${Date.now()}.png`;
                  link.click();
                }}
                className="mt-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300"
              >
                Download
              </button>
            </div>
          </div>
        ))}
        {results.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="text-5xl opacity-20">🌫️</div>
            <p className="text-slate-500 font-medium italic">The gallery is currently empty. Start dreaming above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
