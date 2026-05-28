import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Palette, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://toolnest.com');
  const [fgColor, setFgColor] = useState('#6366f1'); // Indigo
  const [bgColor, setBgColor] = useState('#ffffff'); // White
  const [margin, setMargin] = useState(2);
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const [rendering, setRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorsPreset = [
    { name: 'Indigo', fg: '#6366f1', bg: '#ffffff' },
    { name: 'Dark Indigo', fg: '#6366f1', bg: '#0d0e12' },
    { name: 'Cyberpunk', fg: '#a855f7', bg: '#1e1b4b' },
    { name: 'Emerald', fg: '#10b981', bg: '#ffffff' },
    { name: 'Sunset', fg: '#f97316', bg: '#fffbeb' },
    { name: 'Neon Pink', fg: '#ec4899', bg: '#000000' },
    { name: 'Classic Black', fg: '#000000', bg: '#ffffff' },
  ];

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    setRendering(true);

    const timer = setTimeout(() => {
      QRCode.toCanvas(
        canvasRef.current,
        text,
        {
          width: size,
          margin: margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        },
        (error) => {
          if (error) console.error('QR Generator Error: ', error);
          setRendering(false);
        }
      );
    }, 150);

    return () => clearTimeout(timer);
  }, [text, fgColor, bgColor, margin, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolnest-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error('Failed to copy image: ', err);
      // Fallback url copy
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div id="qr-generator-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input & Customization Panel */}
      <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 font-display">
            <QrCode className="w-5 h-5 text-indigo-400" />
            QR Code Settings
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Encode URLs, clean text or WiFi strings into a fully styled response.
          </p>
        </div>

        {/* Input Text */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-300 font-mono font-medium uppercase tracking-wider">
            Target URL / Text Content
          </label>
          <textarea
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm resize-none h-24"
            placeholder="Enter web link, email, or simple text string..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
              <span>QR Size</span>
              <span>{size}px</span>
            </div>
            <input
              type="range"
              min={128}
              max={384}
              step={16}
              className="w-full accent-indigo-500 h-1.5 bg-slate-850 rounded-lg cursor-pointer"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
              <span>Quiet Zone (Margin)</span>
              <span>{margin}</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              className="w-full accent-indigo-500 h-1.5 bg-slate-850 rounded-lg cursor-pointer"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4">
          <label className="text-xs text-slate-300 font-mono font-medium uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            Color Configuration
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400">Foreground</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300">{fgColor}</span>
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400">Background</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300">{bgColor}</span>
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
            Styling Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {colorsPreset.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-950 text-xs text-slate-300 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                onClick={() => {
                  setFgColor(p.fg);
                  setBgColor(p.bg);
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fg }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Visual Output Panel */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/85">
        <div className="relative p-6 rounded-2xl flex items-center justify-center transition-all bg-slate-950/60 border border-slate-800/50 mix-blend-normal">
          <canvas ref={canvasRef} className="rounded-xl max-w-full h-auto object-contain glow-blue" />
          {rendering && (
            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center rounded-2xl backdrop-blur-sm">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full flex flex-col gap-2 mt-6">
          <button
            onClick={handleDownload}
            disabled={!text}
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download high-res PNG
          </button>
          
          <button
            onClick={handleCopyImage}
            disabled={!text}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 animate-pulse" />
                Copied to clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy QR as image PNG
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-1 text-slate-500 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time adaptive vector graphics</span>
        </div>
      </div>
    </div>
  );
}
