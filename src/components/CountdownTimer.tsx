import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Bell, Play, Sparkles, Check, Hourglass, CalendarRange } from 'lucide-react';
import { Countdown } from '../types';

export default function CountdownTimer() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<Countdown['category']>('personal');
  const [color, setColor] = useState('indigo');
  
  // Storage
  useEffect(() => {
    const saved = localStorage.getItem('toolnest-countdowns');
    if (saved) {
      try {
        setCountdowns(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Default timers
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(tomorrow.getHours() + 2);
      
      const testCountdown: Countdown[] = [
        {
          id: '1',
          title: 'Product Launch Deadline',
          targetDate: tomorrow.toISOString().substring(0, 16),
          category: 'work',
          color: 'indigo'
        }
      ];
      setCountdowns(testCountdown);
      localStorage.setItem('toolnest-countdowns', JSON.stringify(testCountdown));
    }
  }, []);

  const saveTimers = (updated: Countdown[]) => {
    setCountdowns(updated);
    localStorage.setItem('toolnest-countdowns', JSON.stringify(updated));
  };

  const handleAddCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) return;

    const newCountdown: Countdown = {
      id: Date.now().toString(),
      title,
      targetDate,
      category,
      color
    };

    const updated = [newCountdown, ...countdowns];
    saveTimers(updated);
    setTitle('');
    setTargetDate('');
    
    // Play synthetic validation chime
    playNotificationSound('success');
  };

  const handleDelete = (id: string) => {
    const updated = countdowns.filter(c => c.id !== id);
    saveTimers(updated);
  };

  // Synthetic sound generator using standard web browser AudioContext
  const playNotificationSound = (type: 'success' | 'alarm' = 'alarm') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      
      if (type === 'success') {
        // Quick high synth chirp
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        // Futuristic sci-fi alarm siren
        const duration = 1.2;
        const mainOsc = audioCtx.createOscillator();
        const subOsc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        mainOsc.type = 'sawtooth';
        subOsc.type = 'sine';
        
        mainOsc.frequency.setValueAtTime(600, audioCtx.currentTime);
        // Frequency modulation
        mainOsc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.3);
        mainOsc.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.6);
        mainOsc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.9);
        mainOsc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.2);

        subOsc.frequency.setValueAtTime(150, audioCtx.currentTime);

        mainOsc.connect(gainNode);
        subOsc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        mainOsc.start();
        subOsc.start();
        mainOsc.stop(audioCtx.currentTime + duration);
        subOsc.stop(audioCtx.currentTime + duration);
      }
    } catch (e) {
      console.warn('AudioContext synth not supported or blocked by browser user gesture policies:', e);
    }
  };

  return (
    <div id="countdown-timer-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Create Countdown form Panel */}
      <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 font-display">
            <Clock className="w-5 h-5 text-indigo-400" />
            Launch Countdown
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Register custom target checkpoints to monitor remaining time in millisecond accuracy.
          </p>
        </div>

        <form onSubmit={handleAddCountdown} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
              Event Title
            </label>
            <input
              type="text"
              placeholder="e.g. Server Launch, Birthday, Exams..."
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-sans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
              Target Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
                Category
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                value={category}
                onChange={(e) => setCategory(e.target.value as Countdown['category'])}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="holiday">Holiday</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider">
                Accent Theme
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs capitalize"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="indigo">indigo</option>
                <option value="purple">purple</option>
                <option value="emerald">emerald</option>
                <option value="rose">rose</option>
                <option value="amber">amber</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            Set Event Timer
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
          <span className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-indigo-400" />
            Audio Engine Notification
          </span>
          <button
            onClick={() => playNotificationSound('alarm')}
            className="text-xs bg-slate-950/60 hover:bg-slate-950 border border-slate-850 px-3 py-2 text-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Play className="w-3 h-3 text-indigo-400" />
            Test synthetic synth alert signal
          </button>
        </div>
      </div>

      {/* Grid displays Countdown outputs */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-4">
        <h3 className="text-xs text-slate-400 font-mono font-medium uppercase tracking-wider flex items-center justify-between">
          <span>Active Timeline Milestones ({countdowns.length})</span>
          <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">Live Sync</span>
        </h3>

        {countdowns.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/70 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-12 text-slate-600 flex-1">
            <CalendarRange className="w-10 h-10 mb-2 text-slate-700" />
            <p className="text-sm font-medium">No deadlines active</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Use the creator settings panel to build interactive tick blocks with customizable alert chimes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {countdowns.map((item) => (
              <CountdownCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onAlert={() => playNotificationSound('alarm')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponent to trigger tickers efficiently
function CountdownCard({ item, onDelete, onAlert }: { item: Countdown; onDelete: (id: string) => void; onAlert: () => void; key?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: false });
  const [didAlertTrigger, setDidAlertTrigger] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(item.targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
        
        // Siren sound once if hasn't been triggered in card state
        if (!didAlertTrigger) {
          onAlert();
          setDidAlertTrigger(true);
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        completed: false,
      });
    };

    calculateTime();
    const intervalRef = setInterval(calculateTime, 1000);

    return () => clearInterval(intervalRef);
  }, [item.targetDate, didAlertTrigger, onAlert]);

  const colorStylesObj: Record<string, { border: string; bg: string; text: string; accent: string }> = {
    indigo: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/10', text: 'text-indigo-400', accent: 'bg-indigo-500' },
    purple: { border: 'border-purple-500/20', bg: 'bg-purple-500/10', text: 'text-purple-400', accent: 'bg-purple-500' },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400', accent: 'bg-emerald-400' },
    rose: { border: 'border-rose-500/20', bg: 'bg-rose-500/10', text: 'text-rose-400', accent: 'bg-rose-500' },
    amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-400', accent: 'bg-amber-500' },
  };

  const style = colorStylesObj[item.color] || colorStylesObj.indigo;

  return (
    <div className={`bg-slate-900 border ${style.border} rounded-2xl p-5 flex flex-col justify-between transition-all hover:bg-slate-900/80`}>
      <div className="flex justify-between items-start gap-3">
        <div>
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded capitalize bg-slate-950 border border-slate-800 ${style.text}`}>
            {item.category}
          </span>
          <h4 className="text-sm font-semibold text-slate-100 mt-2 truncate max-w-[180px]">{item.title}</h4>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 rounded bg-slate-950 hover:bg-slate-850 text-slate-500 hover:text-rose-400 border border-slate-900 transition-colors cursor-pointer"
          title="Dismiss Countdown"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 py-2 border-y border-slate-950 flex justify-between gap-1">
        {timeLeft.completed ? (
          <div className="w-full py-2 flex flex-col items-center justify-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Deadline Achieved
            </span>
            <span className="text-slate-400 text-[10px] uppercase font-mono mt-0.5">
              {new Date(item.targetDate).toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 w-full text-center font-mono">
            <div>
              <div className="text-base font-semibold text-white bg-slate-950 rounded-lg py-1.5 border border-slate-850">{timeLeft.days}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Days</div>
            </div>
            <div>
              <div className="text-base font-semibold text-white bg-slate-950 rounded-lg py-1.5 border border-slate-850">{timeLeft.hours}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Hrs</div>
            </div>
            <div>
              <div className="text-base font-semibold text-white bg-slate-950 rounded-lg py-1.5 border border-slate-850">{timeLeft.minutes}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Min</div>
            </div>
            <div>
              <div className="text-base font-semibold text-white bg-slate-950 rounded-lg py-1.5 border border-slate-850 transition-all animation-pulse">{timeLeft.seconds}</div>
              <div className="text-[9px] text-slate-500 uppercase mt-1">Sec</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-3">
        <span className="flex items-center gap-1">
          <Hourglass className="w-3 h-3 text-slate-600 animate-spin" />
          Target: {new Date(item.targetDate).toLocaleDateString()}
        </span>
        <span className={`w-2.5 h-2.5 rounded-full ${style.accent} animate-ping`} />
      </div>
    </div>
  );
}
