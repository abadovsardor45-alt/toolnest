import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, BarChart3, Clock, Sparkles, Plus, ExternalLink, Smartphone, Monitor, Globe } from 'lucide-react';
import { ShortLink } from '../types';

export default function LinkShortener() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('toolnest-links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLinks(parsed);
        if (parsed.length > 0) {
          setSelectedLinkId(parsed[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Seed default link
      const seed: ShortLink[] = [
        {
          id: 's-1',
          originalUrl: 'https://github.com/google-gemini/gemini-ai',
          shortCode: 'gemini',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          clicks: 142,
          analytics: {
            device: { desktop: 82, mobile: 52, tablet: 8 },
            browser: { chrome: 90, safari: 32, firefox: 14, edge: 6 },
            traffic: [
              { date: 'May 25', clicks: 24 },
              { date: 'May 26', clicks: 39 },
              { date: 'May 27', clicks: 45 },
              { date: 'May 28', clicks: 34 },
            ]
          }
        }
      ];
      setLinks(seed);
      setSelectedLinkId(seed[0].id);
      localStorage.setItem('toolnest-links', JSON.stringify(seed));
    }
  }, []);

  const saveLinks = (updated: ShortLink[]) => {
    setLinks(updated);
    localStorage.setItem('toolnest-links', JSON.stringify(updated));
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) return;

    // Basic URL validation
    let validUrl = longUrl;
    if (!/^https?:\/\//i.test(longUrl)) {
      validUrl = `https://${longUrl}`;
    }

    const code = customSlug.trim() || Math.random().toString(36).substring(2, 8);
    
    // Check if code already exists
    if (links.some(l => l.shortCode === code)) {
      alert('This short slug is already registered. Please specify a unique alias.');
      return;
    }

    // Generate simulated realistic analytics payload
    const simulatedClicks = Math.floor(Math.random() * 40) + 5;
    const desktopClicks = Math.floor(simulatedClicks * 0.6);
    const mobileClicks = Math.floor(simulatedClicks * 0.35);
    const tabletClicks = simulatedClicks - desktopClicks - mobileClicks;

    const chrome = Math.floor(simulatedClicks * 0.55);
    const safari = Math.floor(simulatedClicks * 0.25);
    const firefox = Math.floor(simulatedClicks * 0.15);
    const edge = simulatedClicks - chrome - safari - firefox;

    const newLink: ShortLink = {
      id: Date.now().toString(),
      originalUrl: validUrl,
      shortCode: code.toLowerCase(),
      createdAt: new Date().toISOString(),
      clicks: simulatedClicks,
      analytics: {
        device: { desktop: desktopClicks, mobile: mobileClicks, tablet: tabletClicks },
        browser: { chrome, safari, firefox, edge },
        traffic: [
          { date: 'May 25', clicks: Math.floor(simulatedClicks * 0.2) },
          { date: 'May 26', clicks: Math.floor(simulatedClicks * 0.3) },
          { date: 'May 27', clicks: Math.floor(simulatedClicks * 0.35) },
          { date: 'May 28', clicks: simulatedClicks - Math.floor(simulatedClicks * 0.85) },
        ]
      }
    };

    const updated = [newLink, ...links];
    saveLinks(updated);
    setSelectedLinkId(newLink.id);
    setLongUrl('');
    setCustomSlug('');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`https://nest.sh/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const currentLink = links.find(l => l.id === selectedLinkId) || null;

  return (
    <div id="link-shortener-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input & Caching section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 font-display">
              <Link2 className="w-5 h-5 text-indigo-400" />
              Shorten Deep Link
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Convert long parameters into highly clean marketing links.
            </p>
          </div>

          <form onSubmit={handleShorten} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
                Destination URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/deep/page?id=123"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-light"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
                  Vanity Slash (Optional)
                </label>
                <span className="text-[10px] text-slate-600 font-mono">Custom Alias</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-500 text-xs font-mono select-none">
                  nest.sh/
                </span>
                <input
                  type="text"
                  placeholder="slug"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-17 pr-4 py-2.5 text-slate-300 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              Compress Address
            </button>
          </form>
        </div>

        {/* Shortenings log list */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 flex flex-col gap-3 flex-1 overflow-hidden">
          <span className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
            Shortened Registry ({links.length})
          </span>
          {links.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600">
              <p className="text-xs font-mono">Add variables to compile analytics indicators.</p>
            </div>
          ) : (
            <div className="flex-col gap-2 flex flex-1 overflow-y-auto max-h-56 lg:max-h-[220px]">
              {links.map((link) => (
                <div
                  key={link.id}
                  onClick={() => setSelectedLinkId(link.id)}
                  className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                    selectedLinkId === link.id
                      ? 'bg-slate-950 border-indigo-500/50 glow-blue'
                      : 'bg-slate-950/20 border-slate-850 hover:bg-slate-950/50 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-indigo-400 font-medium">nest.sh/{link.shortCode}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded">
                      {link.clicks} clicks
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-1.5 font-light" title={link.originalUrl}>
                    {link.originalUrl}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column Analytics dashboard */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {currentLink ? (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-6 flex-1">
            {/* Top overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
              <div>
                <span className="text-xs text-indigo-400 font-mono font-medium">Interactive Console</span>
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mt-1 font-display">
                  nest.sh/{currentLink.shortCode}
                </h3>
                <a
                  href={currentLink.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-300 mt-1.5 items-center gap-1.5 break-all max-w-[280px] md:max-w-lg inline-flex"
                >
                  <span className="truncate">{currentLink.originalUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(currentLink.shortCode)}
                  className="px-4 py-2 text-xs bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode === currentLink.shortCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Short URL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/70 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Total Click Logs</span>
                <div className="text-3xl font-display font-semibold text-white mt-1.5">{currentLink.clicks}</div>
                <div className="text-[10px] font-mono text-indigo-400 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live update
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-850 p-4 rounded-xl col-span-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Core Platforms</span>
                <div className="flex flex-col gap-1.5 mt-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-slate-500" /> Desktop
                    </span>
                    <span className="text-white font-medium">{currentLink.analytics.device.desktop}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-slate-500" /> Mobile
                    </span>
                    <span className="text-white font-medium">{currentLink.analytics.device.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-850 p-4 rounded-xl col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Top Browsers</span>
                <div className="flex flex-col gap-1.5 mt-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Chrome</span>
                    <span className="text-white font-medium">{currentLink.analytics.browser.chrome}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Safari</span>
                    <span className="text-white font-medium">{currentLink.analytics.browser.safari}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated interactive traffic visual graphs built with purely reliable raw CSS/SVG (100% stable!) */}
            <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3 flex-grow justify-end min-h-[160px]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                  Traffic volume dates
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Updated: Real-time</span>
              </div>
              <div className="flex justify-between items-end gap-2 h-28 pt-2">
                {currentLink.analytics.traffic.map((pt, idx) => {
                  const maxClicks = Math.max(...currentLink.analytics.traffic.map(p => p.clicks)) || 1;
                  const percentHeight = Math.max(12, (pt.clicks / maxClicks) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="text-[10px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-semibold">
                        {pt.clicks}
                      </div>
                      <div className="w-full bg-slate-900 border border-slate-800 rounded-t-lg h-24 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-linear-to-t from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all rounded-t-md"
                          style={{ height: `${percentHeight}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-2">{pt.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-850 p-3 rounded-lg bg-slate-950/20 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>Registered: {new Date(currentLink.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-12 text-slate-600 flex-1">
            <Globe className="w-10 h-10 mb-2 text-slate-700" />
            <p className="text-sm font-medium">No Link Analytics Active</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Enter long URLs in the converter form to analyze device fractions, browsers and traffic charts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
