
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const CampusFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const findPlaces = async () => {
    if (!query.trim()) return;
    setIsLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find educational institutions related to ${query} near me.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          }
        }
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks.filter((c: any) => c.maps).map((c: any) => ({
        title: c.maps.title,
        uri: c.maps.uri
      }));

      setResults({ text: response.text, links });
    } catch (err) {
      console.error(err);
      alert("Please enable location access to find nearby campuses.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-3xl border border-slate-800">
        <h2 className="text-2xl font-bold mb-4 gradient-text">Campus Finder</h2>
        <p className="text-slate-400 mb-6 text-sm">Locate the best coaching centers, libraries, and universities near your current location.</p>
        <div className="flex gap-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="What are you looking for? (e.g., 'Law Colleges' or 'Physics Coaching')"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none"
          />
          <button onClick={findPlaces} className="bg-rose-600 px-8 rounded-xl font-bold text-white hover:bg-rose-500 transition-colors">
            {isLoading ? 'Locating...' : 'Find on Map'}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-slate-300 whitespace-pre-wrap">
            {results.text}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.links.map((link: any, i: number) => (
              <a key={i} href={link.uri} target="_blank" className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-rose-500/50 transition-all group">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Campus/Institution</p>
                <h4 className="text-slate-200 font-bold group-hover:text-rose-400 truncate">{link.title}</h4>
                <p className="text-[10px] text-rose-500 mt-2 font-bold tracking-widest uppercase">View on Google Maps →</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusFinder;
