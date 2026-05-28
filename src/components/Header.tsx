import React, { useState } from 'react';
import { Search, User as UserIcon, Bell, Sparkles, LogOut, Check, ChevronDown, Award } from 'lucide-react';
import { User, Tool } from '../types';

interface HeaderProps {
  user: User;
  onLogin: (username: string, email: string) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentlyUsed: Tool[];
  onSelectTool: (id: Tool['id']) => void;
}

export default function Header({
  user,
  onLogin,
  onLogout,
  searchQuery,
  setSearchQuery,
  recentlyUsed,
  onSelectTool,
}: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUsername || !tempEmail) return;
    onLogin(tempUsername, tempEmail);
    setShowAuthModal(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-[#0d0e12]/80 backdrop-blur-md border-b border-slate-900 z-40 flex items-center justify-between px-6">
      {/* Search block */}
      <div className="relative w-72 max-w-full hidden sm:block">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Type 'notes', 'qr', 'dns'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-850 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/80 transition-all"
        />
      </div>
      
      <div className="sm:hidden text-indigo-400 font-display font-semibold text-sm tracking-wider">
        TOOLNEST
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Recently used items strip */}
        {recentlyUsed.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 pr-2 border-r border-slate-900 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mr-1">Recent:</span>
            {recentlyUsed.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="px-2 py-0.5 roundedbg-slate-950 border border-slate-850/60 text-[10px] text-slate-400 hover:text-indigo-300 hover:bg-slate-950 transition-all font-mono cursor-pointer"
              >
                {tool.name}
              </button>
            ))}
          </div>
        )}

        {/* Auth profile segment */}
        {user.isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer text-xs font-mono"
            >
              <div className="w-5 h-5 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase font-sans">
                {user.username.substring(0, 2)}
              </div>
              <span className="text-slate-300 hidden md:inline">{user.username}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-850 rounded-xl p-2.5 shadow-2xl glow-blue z-50 text-xs font-mono">
                <div className="px-2 py-1.5 border-b border-slate-850 mb-1.5">
                  <div className="text-slate-300 font-semibold truncate leading-none">{user.username}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-1">{user.email}</div>
                </div>
                <div className="px-2 py-1 text-[10px] text-indigo-400 flex items-center gap-1 mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Pro Member Access</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-slate-950 rounded bg-transparent hover:text-rose-400 text-slate-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  Logout Account
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-1.5 rounded-xl transition-all shadow-md text-xs cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>

      {/* Auth Modal dynamic overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl glow-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-linear-to-bl from-indigo-500/10 to-transparent rounded-full filter blur-xl pointer-events-none" />
            
            <h3 className="text-lg font-semibold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Access ToolNest Pro
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Unlock synchronized local persistence, customized theme tags, metrics backup, and priority support.
            </p>

            <form onSubmit={handleLoginFormSubmit} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1.5 text-xs text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Username</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. dev_sar"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Email Address</span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 py-2.5 rounded-xl cursor-pointer text-xs font-medium font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2.5 rounded-xl cursor-pointer text-xs font-semibold shadow-lg shadow-indigo-500/15"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
