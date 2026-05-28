import React from 'react';
import { Search, Sparkles, QrCode, Key, FileText, Clock, Link2, Coins, Ruler, Star, CheckSquare, BarChart, HardDrive, ShieldCheck, Heart } from 'lucide-react';
import { Tool, ToolId } from '../types';

interface HomepageProps {
  tools: Tool[];
  onSelectTool: (id: ToolId) => void;
  favorites: ToolId[];
  onToggleFavorite: (id: ToolId, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function Homepage({
  tools,
  onSelectTool,
  favorites,
  onToggleFavorite,
  searchQuery,
  setSearchQuery,
}: HomepageProps) {

  const getToolIcon = (lucideName: string) => {
    switch (lucideName) {
      case 'QrCode': return QrCode;
      case 'Key': return Key;
      case 'FileText': return FileText;
      case 'Clock': return Clock;
      case 'Link2': return Link2;
      case 'Coins': return Coins;
      case 'Ruler': return Ruler;
      default: return Sparkles;
    }
  };

  const filteredTools = tools.filter(tool => {
    return tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tool.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const statisticCards = [
    { title: 'Global API Uptime', value: '99.99%', sub: 'SLA certified connections' },
    { title: 'Daily Actions Compiled', value: '412K+', sub: 'High throughput metrics' },
    { title: 'Avg Computation Delay', value: '0.08ms', sub: 'Zero local overhead' },
    { title: 'Active Connections', value: '18,495', sub: 'Dynamic live users' },
  ];

  return (
    <div id="homepage-dashboard" className="flex flex-col gap-12 pt-6">
      {/* Hero Visual Segment */}
      <section className="relative rounded-3xl bg-linear-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 border border-slate-900 overflow-hidden px-6 py-12 md:p-14 text-center select-none flex flex-col items-center">
        {/* Absolute ambient lights */}
        <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-xs text-indigo-300 font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Platform Release v2.3</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-none max-w-3xl">
          Everything you need. <br />
          <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            All in one workspace.
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-lg mt-5 font-light leading-relaxed">
          High-performance production utilities designed for developer productivity, financial calculations, secure credentials, and data encoding.
        </p>

        {/* Central visual search bar */}
        <div className="relative w-full max-w-md mt-8">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search across all 7 daily SaaS tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-xl shadow-black/40 font-mono"
          />
        </div>
      </section>

      {/* Featured Tools catalog Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100 font-display flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            Featured Software Tools ({filteredTools.length})
          </h2>
          <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Fast navigation</span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="bg-slate-900/30 border border-slate-900 border-dashed rounded-2xl p-16 text-center text-slate-600 flex flex-col items-center">
            <Search className="w-8 h-8 mb-2 text-slate-700" />
            <p className="text-sm font-medium">No tools match your query</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for &apos;notes&apos;, &apos;qr&apos;, &apos;unit&apos;, or &apos;coin&apos;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const IconComp = getToolIcon(tool.icon);
              const isFavorite = favorites.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="bg-slate-900/50 hover:bg-[#0f111a] border border-slate-[#1c1e26] hover:border-indigo-500/20 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:-translate-y-1 cursor-pointer select-none py-6 text-left glow-blue"
                >
                  <div>
                    {/* Top strip */}
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <button
                        onClick={(e) => onToggleFavorite(tool.id, e)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                        title={isFavorite ? 'Remove favorites' : 'Mark favorites'}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-base font-semibold text-white mt-4 font-display group-hover:text-indigo-300 transition-all">
                      {tool.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 font-light leading-relaxed h-14 line-clamp-3">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-950 text-[10px] font-mono">
                    <span className="text-slate-500 uppercase tracking-widest">{tool.category}</span>
                    <span className="text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      Launch ⚡
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Statistics Section Panel */}
      <section className="bg-slate-900/40 rounded-3xl p-6 border border-slate-900">
        <h3 className="text-xs text-slate-500 font-mono font-medium uppercase tracking-wider mb-6 flex items-center gap-2 px-2">
          <BarChart className="w-4 h-4 text-indigo-400" />
          General Workspace Telemetry
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statisticCards.map((stat, idx) => (
            <div key={idx} className="bg-slate-950/70 p-4 border border-slate-850/70 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">{stat.title}</span>
              <span className="text-2xl font-bold text-white block mt-1 font-display">{stat.value}</span>
              <span className="text-[10px] text-indigo-400 font-mono mt-0.5 block">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer references */}
      <footer className="border-t border-slate-900 pt-8 pb-10 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>ToolNest Core Service © 2026. All operations sandbox contained.</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-all">System Status</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-400 transition-all">GitHub Specs</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-400 transition-all">Developer API</a>
        </div>
      </footer>
    </div>
  );
}
