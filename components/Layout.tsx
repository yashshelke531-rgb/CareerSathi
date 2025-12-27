
import React from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTool, setActiveTool }) => {
  const navItems = [
    { id: ToolType.DASHBOARD, label: 'Dashboard', icon: '🏠', desc: 'Control Center' },
    { id: ToolType.MIND_DISCOVERY, label: 'Mind Discovery', icon: '🔮', desc: 'Cognitive Profile' },
    { id: ToolType.INTEREST_TEST, label: 'Career Quiz', icon: '🎯', desc: 'Success Matrix' },
    { id: ToolType.INDIA_HUB, label: 'India Hub', icon: '🇮🇳', desc: 'JEE/NEET/Govt' },
    { id: ToolType.COMPARISON, label: 'Comparison', icon: '⚔️', desc: 'A vs B Battle' },
    { id: ToolType.MENTOR, label: 'Mentor', icon: '🧠', desc: 'AI Counseling' },
    { id: ToolType.EXPLORER, label: 'Explorer', icon: '🌍', desc: 'Global Info' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 sidebar-glass flex flex-col z-20 shadow-2xl">
        <div className="p-8">
          <div 
            onClick={() => setActiveTool(ToolType.DASHBOARD)} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
              <span className="gradient-text">Career Sarathi</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Bharat's Career Ally</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-8 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group flex items-start gap-4 ${
                activeTool === item.id 
                  ? 'bg-white shadow-xl shadow-purple-100/40 text-purple-700 border border-purple-50/50 translate-x-1' 
                  : 'hover:bg-white/40 text-slate-500 hover:text-purple-600'
              }`}
            >
              <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <div className="overflow-hidden">
                <p className={`font-bold text-sm truncate ${activeTool === item.id ? 'text-purple-900' : 'group-hover:text-purple-700'}`}>
                  {item.label}
                </p>
                <p className="text-[9px] opacity-60 uppercase font-bold tracking-wider truncate">{item.desc}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-xl group cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[10px] text-pink-400 font-bold uppercase mb-2 tracking-widest">Advanced Intelligence</p>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed">Multimodal insights enabled by Gemini 3</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-slate-50/50">
        <div className="p-10 max-w-7xl mx-auto min-h-full flex flex-col relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
