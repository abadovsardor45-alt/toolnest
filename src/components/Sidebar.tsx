import React from 'react';
import { Home, QrCode, Key, FileText, Clock, Link2, Coins, Ruler, Sun, Moon, Star, Sparkles, Menu, X } from 'lucide-react';
import { ToolId, Tool } from '../types';

interface SidebarProps {
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  favorites: ToolId[];
  onToggleFavorite: (id: ToolId, e: React.MouseEvent) => void;
  tools: Tool[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export default function Sidebar({
  currentToolId,
  onSelectTool,
  favorites,
  onToggleFavorite,
  tools,
  theme,
  onToggleTheme,
  isOpenMobile,
  setIsOpenMobile,
}: SidebarProps) {
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

  const mainNavItems = [
    { id: 'home' as ToolId, name: 'Main Console', icon: Home, count: null },
  ];

  const handleToolClick = (toolId: ToolId) => {
    onSelectTool(toolId);
    setIsOpenMobile(false); // Close on selection for mobile comfort
  };

  const favoriteTools = tools.filter(t => favorites.includes(t.id));

  return (
    <>
      {/* Mobile sidebar toggle button trigger */}
      <div className="fixed top-3.5 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isOpenMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar background overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#0d0e12] border-r border-[#181a21] z-40 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto pt-6 px-4 gap-6">
          {/* Logo segment */}
          <div className="flex items-center gap-2.5 px-3">
            <div className="relative w-7 h-7 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-display font-extrabold text-[#ffffff] text-sm shadow-md shadow-indigo-500/10">
              ⚡
            </div>
            <div>
              <span className="text-white font-display font-semibold text-sm tracking-wide">
                ToolNest
              </span>
              <span className="text-[9px] text-indigo-400 font-mono font-medium block leading-none mt-0.5">
                Daily SaaS Suite
              </span>
            </div>
          </div>

          {/* Navigation link group - Home */}
          <div className="flex flex-col gap-1">
            {mainNavItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = currentToolId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleToolClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                      : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Core tools catalog list */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-600 font-mono font-medium uppercase tracking-wider px-3">
              Daily Utilities
            </span>
            <div className="flex flex-col gap-1">
              {tools.map((item) => {
                const IconComp = getToolIcon(item.icon);
                const isSelected = currentToolId === item.id;
                const isFavorite = favorites.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleToolClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-medium'
                        : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 font-normal'
                    }`}
                  >
                    <span className="flex items-center gap-3 truncate">
                      <IconComp className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      <span className="truncate">{item.name}</span>
                    </span>
                    
                    <span
                      onClick={(e) => onToggleFavorite(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-amber-400 transition-all ml-1 cursor-pointer shrink-0"
                      title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Favorites tools shortcuts */}
          {favoriteTools.length > 0 && (
            <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-4">
              <span className="text-[10px] text-slate-600 font-mono font-medium uppercase tracking-wider px-3 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                Curated Favorites
              </span>
              <div className="flex flex-col gap-1">
                {favoriteTools.map((item) => {
                  const IconComp = getToolIcon(item.icon);
                  const isSelected = currentToolId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToolClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                      }`}
                    >
                      <span className="flex items-center gap-3 truncate">
                        <IconComp className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span className="truncate">{item.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Sidebar controller segment */}
        <div className="p-4 border-t border-[#181a21]/80 flex flex-col gap-3">
          {/* Light/Dark dynamic theme controller */}
          <div className="flex items-center justify-between bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl">
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5 leading-none">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              Theme: {theme === 'dark' ? 'Dark API' : 'Light Default'}
            </span>
            <button
              onClick={onToggleTheme}
              className="bg-slate-900 hover:bg-slate-850 p-1 rounded-lg text-slate-400 hover:text-slate-200 border border-slate-850 transition-colors cursor-pointer flex items-center shrink-0"
              title="Toggle theme aesthetics"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 px-1 select-none">
            <Sparkles className="w-3 h-3 text-indigo-500/80" />
            <span>Environment Local v2.3</span>
          </div>
        </div>
      </aside>
    </>
  );
}
