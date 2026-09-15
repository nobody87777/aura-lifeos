import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/soundGenerator';
import {
  Play,
  Pause,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Wind,
  Maximize2,
  Minimize2,
  Star,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeepWorkModeProps {
  taskTitle: string;
  initialMinutes: number;
  isOpen: boolean;
  onClose: () => void;
}

export const DeepWorkMode: React.FC<DeepWorkModeProps> = ({
  taskTitle,
  initialMinutes,
  isOpen,
  onClose
}) => {
  const { logFocusSession } = useApp();
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const [ambientSound, setAmbientSound] = useState<'silence' | 'rain' | 'lo-fi' | 'white-noise'>('rain');
  const [volume, setVolume] = useState(0.4);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Post-session rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [focusRating, setFocusRating] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) {
      const s = initialMinutes * 60;
      setTotalSeconds(s);
      setSecondsRemaining(s);
      setIsActive(true);
      setShowRatingModal(false);
      // start default ambient sound
      soundEngine.playAmbient(ambientSound, volume);
    } else {
      soundEngine.stopAmbient();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, initialMinutes]);

  // Ambient sound handler
  const handleAmbientChange = (type: 'silence' | 'rain' | 'lo-fi' | 'white-noise') => {
    setAmbientSound(type);
    soundEngine.playAmbient(type, volume);
  };

  // Timer countdown
  useEffect(() => {
    if (isOpen && isActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isActive, secondsRemaining]);

  const handleCompleteSession = () => {
    setIsActive(false);
    soundEngine.stopAmbient();
    soundEngine.playChime();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setShowRatingModal(true);
  };

  const handleFinishEarly = () => {
    handleCompleteSession();
  };

  const handleSaveRatingAndExit = () => {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    const now = new Date();
    logFocusSession({
      taskTitle: taskTitle || 'Focused Engineering Block',
      durationMinutes: elapsedMinutes,
      completed: true,
      focusRating,
      timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: now.toISOString().split('T')[0]
    });
    soundEngine.stopAmbient();
    setShowRatingModal(false);
    onClose();
  };

  const handleCancelSession = () => {
    soundEngine.stopAmbient();
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none">
      
      {/* Top Bar: Minimal controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            DEEP WORK MODE // ACTIVE
          </span>
        </div>

        {/* Ambient Sound Selector */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => handleAmbientChange('silence')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono transition-all ${
              ambientSound === 'silence' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Silence"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mute</span>
          </button>
          <button
            onClick={() => handleAmbientChange('rain')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono transition-all ${
              ambientSound === 'rain' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Rain generator"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain</span>
          </button>
          <button
            onClick={() => handleAmbientChange('lo-fi')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono transition-all ${
              ambientSound === 'lo-fi' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Warm Lo-Fi binaural chord"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Lo-Fi</span>
          </button>
          <button
            onClick={() => handleAmbientChange('white-noise')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 font-mono transition-all ${
              ambientSound === 'white-noise' ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="White noise"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Noise</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 ml-2"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Display: Focused Task & Massive Futuristic Timer */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-2xl mx-auto w-full px-4">
        
        {/* Task Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SINGLE-MINDED FOCUS</span>
        </div>

        {/* Task Name */}
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-8 tracking-tight drop-shadow-md">
          {taskTitle || 'Diploma Computer Engineering Study'}
        </h2>

        {/* Giant Timer Display */}
        <div className="relative flex items-center justify-center my-4">
          <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_0_40px_rgba(6,182,212,0.35)]">
            {formattedTime}
          </div>
        </div>

        <p className="text-sm font-mono text-slate-400 uppercase tracking-widest mt-2">
          {isActive ? 'Remaining' : 'Paused'}
        </p>

        {/* Minimal Progress Line */}
        <div className="w-full max-w-md bg-slate-900/90 h-2 rounded-full mt-8 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-white font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          {isActive ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          <span>{isActive ? 'Pause' : 'Resume'}</span>
        </button>

        <button
          onClick={handleFinishEarly}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 glow-cyan"
        >
          <CheckCircle className="w-4 h-4 text-white" />
          <span>Finish (+20 XP)</span>
        </button>

        <button
          onClick={handleCancelSession}
          className="px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-rose-400 text-sm font-medium flex items-center gap-1.5 transition-all"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Post-Session Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel border border-emerald-500/40 text-center shadow-2xl glow-emerald">
            
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Focus Session Finished!</h3>
            <p className="text-xs font-mono text-emerald-300 font-semibold mb-6">
              +20 XP REWARDED // RECORDED
            </p>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 mb-6">
              <p className="text-sm text-slate-300 font-medium mb-3">
                How focused were you?
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFocusRating(star)}
                    className={`p-2 rounded-xl transition-all ${
                      focusRating >= star
                        ? 'text-amber-400 scale-110'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <Star className="w-7 h-7 fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-xs font-mono text-slate-400 mt-2">
                {focusRating === 5 && 'Hyper-focused flow state 🔥'}
                {focusRating === 4 && 'Strong, deep focus 🚀'}
                {focusRating === 3 && 'Solid progress with few distractions 👍'}
                {focusRating === 2 && 'Slightly distracted, but stuck through 💪'}
                {focusRating === 1 && 'Struggled to focus, that’s okay 🌱'}
              </p>
            </div>

            <button
              onClick={handleSaveRatingAndExit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              SAVE & CONTINUE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
