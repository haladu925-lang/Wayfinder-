import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

interface CatalystTimerProps {
  initialMinutes?: number;
  actionTitle?: string;
  onFinish?: () => void;
}

export const CatalystTimer: React.FC<CatalystTimerProps> = ({
  initialMinutes = 15,
  actionTitle = "The 15-Minute Foothold",
  onFinish,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setTimeLeft(initialMinutes * 60);
    setIsActive(false);
    setIsCompleted(false);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      if (soundEnabled) {
        playChime();
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
      if (onFinish) onFinish();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, soundEnabled, onFinish]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100;

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
    setIsCompleted(false);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-xl p-4 sm:p-5 border border-stone-800 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Catalyst Focus Timer
          </span>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-stone-400 hover:text-stone-200 transition-colors p-1"
          title={soundEnabled ? "Mute chime" : "Enable chime"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="text-xs text-stone-300 font-medium line-clamp-1 mb-3">
        {actionTitle}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Time display */}
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-50">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-stone-400 ml-1">remaining</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            id="catalyst-toggle-btn"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isActive
                ? "bg-amber-500 hover:bg-amber-600 text-stone-950"
                : "bg-amber-400 hover:bg-amber-300 text-stone-950"
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? "Pause" : "Start Now"}</span>
          </button>

          <button
            id="catalyst-reset-btn"
            onClick={handleReset}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-stone-800 rounded-full h-1.5 mt-4 overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-300 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isCompleted && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Inertia broken! First foothold completed. Keep the momentum going!</span>
        </div>
      )}
    </div>
  );
};
