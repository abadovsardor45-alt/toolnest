import { useState, useEffect, useCallback } from 'react';
import { Key, Copy, Check, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('Select at least one set');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    setPassword(result);
    
    // Add to history
    setPasswordHistory((prev) => {
      const updated = [result, ...prev.slice(0, 4)];
      return updated;
    });
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, generatePassword]);

  const copyToClipboard = () => {
    if (password === 'Select at least one set') return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (includeUppercase) score += 1;
    if (includeLowercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;

    if (score < 4) return { text: 'Weak', color: 'bg-red-500 text-red-400 border-red-500/20', percent: 'w-1/4' };
    if (score === 4 || score === 5) return { text: 'Medium', color: 'bg-amber-500 text-amber-400 border-amber-500/20', percent: 'w-2/4' };
    if (score === 6) return { text: 'Strong', color: 'bg-emerald-500 text-emerald-400 border-emerald-500/20', percent: 'w-3/4' };
    return { text: 'Excellent', color: 'bg-indigo-500 text-indigo-400 border-indigo-500/20', percent: 'w-full' };
  };

  const strength = getStrength();

  return (
    <div id="password-generator-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 font-display">
            <Key className="w-5 h-5 text-indigo-400" />
            Password Matrix Settings
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Produce random hashes built with custom layouts to guard your web credentials.
          </p>
        </div>

        {/* Display screen */}
        <div className="relative group">
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 pr-24 text-slate-100 font-mono text-lg break-all select-all flex items-center h-16">
            {showPassword ? password : '•'.repeat(password.length)}
          </div>
          <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={generatePassword}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sliders and custom triggers */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono uppercase tracking-wider">
            <span>Character Length</span>
            <span className="text-indigo-400 text-sm font-semibold">{length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            className="w-full accent-indigo-500 h-1.5 bg-slate-850 rounded-lg cursor-pointer"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        {/* Flags grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-800/80 pt-4">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/45 border border-slate-800/85 hover:border-slate-700/80 cursor-pointer select-none transition-all">
            <span className="text-sm text-slate-300">Uppercase (A-Z)</span>
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/45 border border-slate-800/85 hover:border-slate-700/80 cursor-pointer select-none transition-all">
            <span className="text-sm text-slate-300">Lowercase (a-z)</span>
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/45 border border-slate-800/85 hover:border-slate-700/80 cursor-pointer select-none transition-all">
            <span className="text-sm text-slate-300">Include Numbers (0-9)</span>
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/45 border border-slate-800/85 hover:border-slate-700/80 cursor-pointer select-none transition-all">
            <span className="text-sm text-slate-300">Symbols (Special)</span>
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
          </label>
        </div>

        <button
          onClick={generatePassword}
          className="w-full mt-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate custom password
        </button>
      </div>

      {/* Right Column strength parameters & history details */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
            Strength Analysis
          </h3>
          <div className="flex items-center gap-3">
            {strength.text === 'Weak' || strength.text === 'Medium' ? (
              <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="text-base font-semibold text-white flex items-center gap-2">
                {strength.text} Quality
                <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${strength.color} font-normal bg-opacity-10 capitalize`}>
                  {length} chars
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {strength.text === 'Weak' && 'Highly vulnerable to standard dictionary attacks. Increase length.'}
                {strength.text === 'Medium' && 'Appropriate for lightweight accounts. Add symbols to strengthen.'}
                {strength.text === 'Strong' && 'Robust security matrix. Hardened against parallel GPU testing.'}
                {strength.text === 'Excellent' && 'Enterprise-grade entropy level. Guaranteed high reliability.'}
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 rounded-full ${strength.color} ${strength.percent}`} />
          </div>
        </div>

        {/* Recently logged credentials */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-3 flex-1">
          <span className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            Interactive Session History
          </span>
          {passwordHistory.length <= 1 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600 border border-slate-850/60 border-dashed rounded-xl">
              <Sparkles className="w-5 h-5 mb-2 text-slate-700" />
              <p className="text-xs font-mono">Run code updates to append security history logs.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {passwordHistory.slice(1).map((hist, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs font-mono transition-colors group"
                >
                  <span className="text-slate-400 truncate max-w-[200px]">{hist}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hist);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-indigo-400 text-slate-500 cursor-pointer"
                    title="Copy historical item"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
