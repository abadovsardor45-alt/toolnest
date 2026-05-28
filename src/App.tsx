import React, { useState, useEffect } from 'react';
import { Sparkles, Star, LayoutDashboard, Compass, Bell, Flame } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Homepage from './components/Homepage';
import QRCodeGenerator from './components/QRCodeGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import NotesApp from './components/NotesApp';
import CountdownTimer from './components/CountdownTimer';
import LinkShortener from './components/LinkShortener';
import CurrencyConverter from './components/CurrencyConverter';
import UnitConverter from './components/UnitConverter';

import { Tool, ToolId, User } from './types';

const coreTools: Tool[] = [
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Design fully styled vector-compatible QR structures with customized backgrounds and margins.', category: 'developer', icon: 'QrCode', popular: true },
  { id: 'password-generator', name: 'Password Generator', description: 'Compile strong random cryptographic credentials conforming to custom size structures.', category: 'utility', icon: 'Key', popular: true },
  { id: 'notes', name: 'Scratchpad Notes', description: 'Draft text data, checklist parameters and snippets securely in dynamic offline cache.', category: 'productivity', icon: 'FileText', popular: false },
  { id: 'countdown-timer', name: 'Countdown Timer', description: 'Monitor time indicators with customizable ticks, target dates and synthetic melody signals.', category: 'productivity', icon: 'Clock', popular: false },
  { id: 'link-shortener', name: 'Link Shortener', description: 'Validate and reduce custom landing parameters with precise device and browser charts.', category: 'developer', icon: 'Link2', popular: true },
  { id: 'currency-converter', name: 'Currency Converter', description: 'Recalculate global fiat exchange rates fetched in real-time from open central APIs.', category: 'finance', icon: 'Coins', popular: true },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Translate speed, meters, computer file sizes, weights, and kelvin temperatures with high safety indexes.', category: 'utility', icon: 'Ruler', popular: false },
];

export default function App() {
  const [activeToolId, setActiveToolId] = useState<ToolId>('home');
  const [favorites, setFavorites] = useState<ToolId[]>(['qr-generator', 'password-generator']);
  const [recentlyUsed, setRecentlyUsed] = useState<Tool[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulated User Auth State
  const [user, setUser] = useState<User>({
    username: 'Guest_User',
    email: 'guest@toolnest.sh',
    isLoggedIn: false,
  });

  // Track user preferences in Local Storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('toolnest-favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (err) {
        console.error(err);
      }
    }
    const savedUser = localStorage.getItem('toolnest-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectTool = (id: ToolId) => {
    setActiveToolId(id);
    setSearchQuery(''); // clear query on nav for focus
    
    if (id !== 'home') {
      const selectedTool = coreTools.find(t => t.id === id);
      if (selectedTool) {
        setRecentlyUsed(prev => {
          const filtered = prev.filter(t => t.id !== id);
          const updated = [selectedTool, ...filtered].slice(0, 4);
          return updated;
        });
        triggerToast(`Launched ${selectedTool.name} successfully`);
      }
    }
  };

  const handleToggleFavorite = (id: ToolId, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent launch on homepage
    let updated: ToolId[] = [];
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
      triggerToast('Removed utility from favorites strip');
    } else {
      updated = [...favorites, id];
      triggerToast('Added utility to favorites strip');
    }
    setFavorites(updated);
    localStorage.setItem('toolnest-favorites', JSON.stringify(updated));
  };

  const handleLogin = (username: string, email: string) => {
    const loggedUser: User = { username, email, isLoggedIn: true };
    setUser(loggedUser);
    localStorage.setItem('toolnest-user', JSON.stringify(loggedUser));
    triggerToast(`Welcome back, ${username}! Pro features unlocked.`);
  };

  const handleLogout = () => {
    const guestUser: User = { username: 'Guest_User', email: 'guest@toolnest.sh', isLoggedIn: false };
    setUser(guestUser);
    localStorage.removeItem('toolnest-user');
    triggerToast('Logged out successfully');
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    triggerToast(`Switched layout theme to ${nextTheme}`);
  };

  const currentTool = coreTools.find(t => t.id === activeToolId);

  return (
    <div className={`min-h-screen transition-all duration-300 md:pl-64 pt-16 font-sans ${
      theme === 'light' ? 'bg-[#f7f8fa] text-slate-800' : 'bg-[#0a0b0e] text-[#e2e8f0]'
    }`}>
      {/* Sidebar panel */}
      <Sidebar
        currentToolId={activeToolId}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        tools={coreTools}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOpenMobile={isMobileOpen}
        setIsOpenMobile={setIsMobileOpen}
      />

      {/* Header navbar toggle config */}
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentlyUsed={recentlyUsed}
        onSelectTool={handleSelectTool}
      />

      {/* Toast notifications pop */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1d24] border border-[#2e303d] rounded-2xl p-4 flex items-center gap-3 shadow-2xl animate-bounce glow-blue">
          <div className="p-1 px-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-medium">
            System
          </div>
          <span className="text-xs text-slate-200 font-medium font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Main Container screen area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeToolId === 'home' ? (
          <Homepage
            tools={coreTools}
            onSelectTool={handleSelectTool}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Context Back navigation strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div>
                <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span
                    onClick={() => handleSelectTool('home')}
                    className="hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    Console
                  </span>
                  <span>/</span>
                  <span className="text-slate-400 capitalize">{currentTool?.category}</span>
                </nav>
                <h1 className="text-2xl font-display font-semibold text-white mt-1.5 flex items-center gap-3">
                  {currentTool?.name}
                </h1>
              </div>

              {/* Favorites toggle action inside page */}
              {currentTool && (
                <button
                  onClick={(e) => handleToggleFavorite(currentTool.id, e)}
                  className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    favorites.includes(currentTool.id)
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                      : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${favorites.includes(currentTool.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{favorites.includes(currentTool.id) ? 'Curated Favorite' : 'Add to Favorites'}</span>
                </button>
              )}
            </div>

            {/* Render selected active tool */}
            <div className="mt-4">
              {activeToolId === 'qr-generator' && <QRCodeGenerator />}
              {activeToolId === 'password-generator' && <PasswordGenerator />}
              {activeToolId === 'notes' && <NotesApp />}
              {activeToolId === 'countdown-timer' && <CountdownTimer />}
              {activeToolId === 'link-shortener' && <LinkShortener />}
              {activeToolId === 'currency-converter' && <CurrencyConverter />}
              {activeToolId === 'unit-converter' && <UnitConverter />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
