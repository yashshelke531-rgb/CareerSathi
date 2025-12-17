
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { decode, decodeAudioData, encode } from '../utils/audio';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const toggleSession = async () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const startSession = async () => {
    setIsActive(true);
    setStatus('connecting');
    setTranscription([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!isActive) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => [...prev, `AI: ${text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscription(prev => [...prev, `You: ${text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outAudioContextRef.current) {
              setStatus('speaking');
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          },
          onerror: (e) => {
            console.error("Live Error:", e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are Lumina Companion, a helpful and articulate voice assistant. Keep responses human-like, conversational, and relatively short.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      stopSession();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('idle');
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outAudioContextRef.current) {
      outAudioContextRef.current.close();
      outAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="glass rounded-3xl p-10 border border-slate-800 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
        {isActive && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse"></div>
        )}
        
        <div>
          <h2 className="text-3xl font-bold gradient-text">The Companion</h2>
          <p className="text-slate-400 max-w-sm mx-auto mt-2">Natural, zero-latency voice interaction. Talk to Lumina as you would a friend.</p>
        </div>

        <div className="relative">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${
            isActive ? 'bg-indigo-600/10 scale-110' : 'bg-slate-900'
          }`}>
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              status === 'speaking' ? 'border-indigo-400 scale-105 shadow-[0_0_50px_rgba(129,140,248,0.3)]' : 
              status === 'listening' ? 'border-emerald-400 animate-pulse' :
              status === 'connecting' ? 'border-slate-700 border-t-indigo-500 animate-spin' : 'border-slate-800'
            }`}>
              <button
                onClick={toggleSession}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all ${
                  isActive ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isActive ? '⏹️' : '🎙️'}
              </button>
            </div>
          </div>
          {isActive && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              {status}
            </div>
          )}
        </div>

        <div className="w-full max-w-lg glass bg-slate-950/50 rounded-2xl p-6 h-48 overflow-y-auto text-left space-y-2 border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Live Transcription</p>
          {transcription.length === 0 ? (
            <p className="text-slate-600 text-sm italic">Words will appear here as you speak...</p>
          ) : (
            transcription.map((t, i) => (
              <p key={i} className={`text-sm ${t.startsWith('You:') ? 'text-slate-400' : 'text-indigo-300 font-medium'}`}>{t}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
