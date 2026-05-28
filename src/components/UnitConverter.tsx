import { useState, useEffect } from 'react';
import { Ruler, Scale, Thermometer, Gauge, HardDrive, ArrowLeftRight, Sparkles } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'speed' | 'storage';

interface UnitOption {
  value: string;
  name: string;
}

const unitsMap: Record<UnitCategory, UnitOption[]> = {
  length: [
    { value: 'm', name: 'Meters (m)' },
    { value: 'km', name: 'Kilometers (km)' },
    { value: 'mi', name: 'Miles (mi)' },
    { value: 'yd', name: 'Yards (yd)' },
    { value: 'ft', name: 'Feet (ft)' },
    { value: 'in', name: 'Inches (in)' },
  ],
  weight: [
    { value: 'g', name: 'Grams (g)' },
    { value: 'kg', name: 'Kilograms (kg)' },
    { value: 'lb', name: 'Pounds (lbs)' },
    { value: 'oz', name: 'Ounces (oz)' },
  ],
  temperature: [
    { value: 'C', name: 'Celsius (°C)' },
    { value: 'F', name: 'Fahrenheit (°F)' },
    { value: 'K', name: 'Kelvin (K)' },
  ],
  speed: [
    { value: 'mps', name: 'Meters per second (m/s)' },
    { value: 'kmh', name: 'Kilometers per hour (km/h)' },
    { value: 'mph', name: 'Miles per hour (mph)' },
    { value: 'knot', name: 'Knots' },
  ],
  storage: [
    { value: 'B', name: 'Bytes (B)' },
    { value: 'KB', name: 'Kilobytes (KB)' },
    { value: 'MB', name: 'Megabytes (MB)' },
    { value: 'GB', name: 'Gigabytes (GB)' },
    { value: 'TB', name: 'Terabytes (TB)' },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [sourceValue, setSourceValue] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [outputValue, setOutputValue] = useState<number>(32.8084);

  // Sync state when category changes
  useEffect(() => {
    const list = unitsMap[category];
    if (list && list.length >= 2) {
      setFromUnit(list[0].value);
      setToUnit(list[1].value);
    }
  }, [category]);

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Convert math functions
  const performConversion = (val: number, cat: UnitCategory, from: string, to: string): number => {
    if (isNaN(val)) return 0;
    if (from === to) return val;

    switch (cat) {
      case 'length': {
        // base meter coefficients
        const factors: Record<string, number> = {
          m: 1,
          km: 1000,
          mi: 1609.344,
          yd: 0.9144,
          ft: 0.3048,
          in: 0.0254,
        };
        const meters = val * (factors[from] || 1);
        return meters / (factors[to] || 1);
      }
      case 'weight': {
        // base gram factors
        const factors: Record<string, number> = {
          g: 1,
          kg: 1000,
          lb: 453.59237,
          oz: 28.349523,
        };
        const grams = val * (factors[from] || 1);
        return grams / (factors[to] || 1);
      }
      case 'temperature': {
        // compute via baseline kelvin
        let kelvin = 0;
        if (from === 'C') kelvin = val + 273.15;
        else if (from === 'F') kelvin = ((val - 32) * 5) / 9 + 273.15;
        else kelvin = val;

        if (to === 'C') return kelvin - 273.15;
        if (to === 'F') return ((kelvin - 273.15) * 9) / 5 + 32;
        return kelvin;
      }
      case 'speed': {
        // base speed factor m/s
        const factors: Record<string, number> = {
          mps: 1,
          kmh: 0.277778,
          mph: 0.44704,
          knot: 0.514444,
        };
        const mps = val * (factors[from] || 1);
        return mps / (factors[to] || 1);
      }
      case 'storage': {
        // base byte coefficients
        const factors: Record<string, number> = {
          B: 1,
          KB: 1024,
          MB: 1024 * 1024,
          GB: 1024 * 1024 * 1024,
          TB: 1024 * 1024 * 1024 * 1024,
        };
        const bytes = val * (factors[from] || 1);
        return bytes / (factors[to] || 1);
      }
      default:
        return val;
    }
  };

  useEffect(() => {
    const result = performConversion(sourceValue, category, fromUnit, toUnit);
    setOutputValue(result);
  }, [sourceValue, category, fromUnit, toUnit]);

  const categoriesConfig = [
    { value: 'length', name: 'Length', icon: Ruler, text: 'Linear, standard metrical parameters' },
    { value: 'weight', name: 'Weight', icon: Scale, text: 'Mass parameters metrics ounces to lbs' },
    { value: 'temperature', name: 'Temperature', icon: Thermometer, text: 'Kelvin, Celsius, Fahrenheit units' },
    { value: 'speed', name: 'Speed', icon: Gauge, text: 'Metrical speed acceleration parameters' },
    { value: 'storage', name: 'Storage', icon: HardDrive, text: 'Computer files, digital block storage metrics' },
  ];

  const currentConfig = categoriesConfig.find(c => c.value === category) || categoriesConfig[0];

  return (
    <div id="unit-converter-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Category Selection Sidebar Slider */}
      <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white font-display">
            Select Unit Category
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Choose metric category to customize target source variables.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 mt-2">
          {categoriesConfig.map((catItem) => {
            const IconComponent = catItem.icon;
            const isSelected = category === catItem.value;

            return (
              <button
                key={catItem.value}
                onClick={() => setCategory(catItem.value as UnitCategory)}
                className={`flex items-start gap-4 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 border-indigo-500/50 glow-blue'
                    : 'bg-slate-950/20 border-slate-850/60 hover:bg-slate-950/40 hover:border-slate-800'
                }`}
              >
                <div className={`p-2 rounded-lg border ${
                  isSelected ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-950 border-slate-850 text-slate-400'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {catItem.name}
                  </div>
                  <p className="text-[11px] text-slate-500 font-light mt-0.5">{catItem.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs and Converter logic grid */}
      <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 font-display">
            {<currentConfig.icon className="w-5 h-5 text-indigo-400" />}
            {currentConfig.name} Dimension
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Compute linear dimension offsets instantly relative to core constants.
          </p>
        </div>

        {/* Input Field */}
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
          <div className="md:col-span-5 flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Source Dimension</span>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={sourceValue || ''}
              onChange={(e) => setSourceValue(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>

          <div className="md:col-span-1 flex items-center justify-center pt-2 md:pt-4">
            <button
              onClick={handleSwapUnits}
              className="p-2.5 rounded-full bg-slate-950 hover:bg-slate-850 text-indigo-400 border border-slate-800 transition-all cursor-pointer"
              title="Reverse layout directions"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90 md:rotate-0" />
            </button>
          </div>

          <div className="md:col-span-5 flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Result Dimension</span>
            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-indigo-400 font-mono text-sm leading-[22px] font-semibold h-11.5 overflow-hidden truncate select-all">
              {outputValue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 6 })}
            </div>
          </div>
        </div>

        {/* Unit Selectors dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850/80 pt-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-mono uppercase">Translate From</span>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans cursor-pointer"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {unitsMap[category].map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-mono uppercase">Translate Into</span>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans cursor-pointer"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {unitsMap[category].map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Extra details indicator */}
        <div className="bg-slate-950/60 border border-slate-850 p-4.5 rounded-xl flex items-center gap-3 mt-auto">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
            kX
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> High-precision math multipliers
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              1 {fromUnit === 'C' || fromUnit === 'F' || fromUnit === 'K' ? 'unit' : fromUnit} converts exactly to {performConversion(1, category, fromUnit, toUnit).toFixed(6)} {toUnit}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
