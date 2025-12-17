
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GeneratedVideo } from '../types';

// Fix: Removed the local 'declare global' block to avoid conflicts with the existing environment-defined AIStudio type.
// We will access window.aistudio using type casting to 'any' for safety.

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    // Fix: Using type casting to access the pre-configured window.aistudio
    const selected = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleOpenKey = async () => {
    // Fix: Using type casting to access the pre-configured window.aistudio
    await (window as any).aistudio.openSelectKey();
    setHasKey(true); // Assume success per guidelines
  };

  const generateVideo = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setStatusMessage('Igniting cinematic engine...');

    const statuses = [
      'Simulating particle motion...',
      'Synthesizing temporal textures...',
      'Refining fluid dynamics...',
      'Finalizing neural renders...',
      'Preparing high-definition stream...'
    ];

    let statusIdx = 0;
    const interval = setInterval(() => {
      setStatusMessage(statuses[statusIdx % statuses.length]);
      statusIdx++;
    }, 15000);

    try {
      // Fix: Create a new GoogleGenAI instance right before making an API call to use the latest selected key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        setVideos(prev => [{ url: fetchUrl, prompt, timestamp: Date.now() }, ...prev]);
      }
    } catch (error: any) {
      console.error("Video Gen Error:", error);
      // Fix: Reset key selection state if the request fails with a 404/expired error
      if (error?.message?.includes('Requested entity was not found')) {
        alert("API Key session expired. Please re-select your key.");
        setHasKey(false);
      } else {
        alert("Video generation failed. Please try a different prompt.");
      }
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
        <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center text-4xl shadow-xl border border-indigo-500/30">🎬</div>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-4">Visionary Mode Requires Authentication</h2>
          <p className="text-slate-400 text-sm mb-6">
            To generate high-quality cinematic videos using Veo 3.1, you must select an API key from a paid Google Cloud project.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleOpenKey}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Select Paid API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="block text-xs text-indigo-400 hover:underline"
            >
              Learn more about Gemini API billing
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="glass rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold gradient-text">The Visionary</h2>
          <span className="px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-400 text-[10px] font-bold border border-indigo-800/50 tracking-widest uppercase">Veo 3.1 Fast</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cinematic Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Cinematic drone shot of a neon cyberpunk dragon flying through storm clouds at night..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none text-slate-200 transition-all resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={generateVideo}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-white text-slate-950 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-4 px-8 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>{statusMessage}</span>
              </>
            ) : (
              <>
                <span>Generate Cinematics</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid, i) => (
          <div key={i} className="glass rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 group">
            <video 
              src={vid.url} 
              controls 
              className="w-full aspect-video object-cover" 
              poster="https://picsum.photos/800/450"
            />
            <div className="p-6">
              <p className="text-sm text-slate-300 italic mb-4 line-clamp-2">"{vid.prompt}"</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">{new Date(vid.timestamp).toLocaleString()}</span>
                <a 
                  href={vid.url} 
                  download 
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Save Clip
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGenerator;
