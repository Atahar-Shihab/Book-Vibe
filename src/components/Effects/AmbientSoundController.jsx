import { useState } from "react";
import { Volume2, VolumeX, CloudRain, Flame } from "lucide-react";
import { startAmbientSound, stopAmbientSound } from "../../utils/audio";
import AudioVisualizerWave from "./AudioVisualizerWave";

const AmbientSoundController = () => {
  const [ambientMode, setAmbientMode] = useState("off"); // 'off' | 'rain' | 'fireplace'
  const [isOpen, setIsOpen] = useState(false);

  const setMode = (mode) => {
    if (mode === "off" || mode === ambientMode) {
      stopAmbientSound();
      setAmbientMode("off");
    } else {
      startAmbientSound(mode, 0.22);
      setAmbientMode(mode);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Live Audio Visualizer Canvas */}
      <AudioVisualizerWave
        isActive={ambientMode !== "off"}
        color={ambientMode === "rain" ? "#06b6d4" : "#f59e0b"}
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-sm ${
          ambientMode !== "off"
            ? "bg-violet-600/10 border-violet-500/40 text-violet-700 shadow-violet-200"
            : "bg-base-100 border-base-300 text-base-content hover:border-violet-300"
        }`}
        title="Toggle Ambient Audio Atmosphere"
      >
        {ambientMode !== "off" ? (
          <>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <Volume2 className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            <span className="capitalize hidden sm:inline">{ambientMode}</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 opacity-60" />
            <span className="hidden sm:inline">Ambience</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
            <p className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              Audio Atmosphere (5D)
            </p>
            <button
              onClick={() => {
                setMode("rain");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                ambientMode === "rain"
                  ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              }`}
            >
              <CloudRain className="w-4 h-4 text-cyan-500" />
              <span>Cozy Library Rain</span>
            </button>

            <button
              onClick={() => {
                setMode("fireplace");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                ambientMode === "fireplace"
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Hearth Fireplace</span>
            </button>

            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

            <button
              onClick={() => {
                setMode("off");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 font-medium"
            >
              <VolumeX className="w-4 h-4" />
              <span>Mute Ambience</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AmbientSoundController;
