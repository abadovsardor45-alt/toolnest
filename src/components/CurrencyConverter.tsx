import { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw, Sparkles, Coins, DollarSign, Euro, Globe } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

const currenciesList: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'AED' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
];

// High fidelity fallback rate table (Relative to USD)
const fallbackRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.40,
  AUD: 1.51,
  CAD: 1.36,
  CHF: 0.91,
  CNY: 7.24,
  INR: 83.30,
  AED: 3.67,
  BRL: 5.15,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Fallback Table');

  const fetchExchangeRates = async () => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('API server returned bad status');
      const data = await res.json();
      
      if (data && data.rates) {
        // Intersect fetched rates with fallback list to keep code tight
        const intersectedRates: Record<string, number> = {};
        currenciesList.forEach(curr => {
          if (data.rates[curr.code] !== undefined) {
            intersectedRates[curr.code] = data.rates[curr.code];
          } else {
            intersectedRates[curr.code] = fallbackRates[curr.code];
          }
        });
        setRates(intersectedRates);
        setLastUpdated(new Date(data.time_last_update_utc).toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Could not contact live exchange API. Utilizing offline safety rates matrix:', err);
      setRates(fallbackRates);
      setErrorStatus('Offline rates matrix loaded');
      setLastUpdated('Cached locally');
    } finally {
      setTimeout(() => setLoading(false), 300); // Smooth visual feedback transition
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Compute conversion
  const getConversionValue = () => {
    if (!amount) return 0;
    // convert fromCurrency to USD baseline first
    const rateFrom = rates[fromCurrency] || fallbackRates[fromCurrency];
    const rateTo = rates[toCurrency] || fallbackRates[toCurrency];
    const valInUSD = amount / rateFrom;
    return valInUSD * rateTo;
  };

  const currentFrom = currenciesList.find(c => c.code === fromCurrency) || currenciesList[0];
  const currentTo = currenciesList.find(c => c.code === toCurrency) || currenciesList[1];
  const outputValue = getConversionValue();

  return (
    <div id="currency-converter-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Front Conversion container */}
      <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 font-display">
              <Coins className="w-5 h-5 text-indigo-400" />
              SaaS Currency Exchange
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Live global quotes synchronized with central European exchanges.
            </p>
          </div>
          <button
            onClick={fetchExchangeRates}
            disabled={loading}
            className="p-2 bg-slate-950 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-850"
            title="Update quotes from API"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
            Source Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-emerald-400 font-medium font-mono text-base">
              {currentFrom.symbol}
            </span>
            <input
              type="number"
              min={0}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 text-white font-mono text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Currency Select Toggles with Swap link */}
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-3">
          <div className="md:col-span-5 flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">From Currency</span>
            <div className="relative">
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans cursor-pointer"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currenciesList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} &nbsp;{c.code} &nbsp;• &nbsp;{c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-1 flex items-center justify-center p-1 md:pt-6">
            <button
              onClick={handleSwap}
              type="button"
              className="p-2.5 rounded-full bg-slate-950 hover:bg-slate-850 text-indigo-400 border border-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Reverse layout"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90 md:rotate-0" />
            </button>
          </div>

          <div className="md:col-span-5 flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">To Currency</span>
            <div className="relative">
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans cursor-pointer"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currenciesList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} &nbsp;{c.code} &nbsp;• &nbsp;{c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Output values Display */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between items-start gap-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-linear-to-bl from-indigo-500/10 to-transparent rounded-full filter blur-xl pointer-events-none" />
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Converted Quote Target</span>
          <div className="text-3xl font-display font-semibold text-white flex items-baseline gap-1.5 mt-2 truncate max-w-full">
            <span className="text-indigo-400 font-semibold">{currentTo.symbol}</span>
            <span className="text-white font-bold">{outputValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
            <span className="text-xs text-slate-500 font-mono font-normal ml-1 bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded capitalize">
              {currentTo.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
            <span className="text-indigo-400">1 {currentFrom.code}</span> = {((rates[toCurrency] || fallbackRates[toCurrency]) / (rates[fromCurrency] || fallbackRates[fromCurrency])).toFixed(5)} {currentTo.code}
          </p>
        </div>
      </div>

      {/* Right Information index details */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-4 flex-1">
          <h3 className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
            Exchange State
          </h3>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                Live Server Synced
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quotes refreshed: <span className="text-indigo-400 font-mono">{lastUpdated}</span>
              </p>
            </div>
          </div>

          {errorStatus ? (
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-300 font-mono flex items-center gap-2">
              ⚠️ {errorStatus} (API rate exceeded or offline)
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/10 p-3 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Central Exchange quotes secure
            </div>
          )}

          {/* Table index for fast conversion reading */}
          <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">USD Baseline Index</span>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {currenciesList.slice(1, 7).map((curr) => {
                const rt = rates[curr.code] || fallbackRates[curr.code];
                return (
                  <div key={curr.code} className="flex justify-between items-center text-xs font-mono py-1 border-b border-slate-850/60 pb-1.5 bg-slate-950/20 px-2 rounded">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </span>
                    <span className="text-slate-300 font-medium">{rt.toFixed(4)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
