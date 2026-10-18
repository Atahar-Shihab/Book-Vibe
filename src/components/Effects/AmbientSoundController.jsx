import { useState } from "react";
import { Volume2, VolumeX, CloudRain, Flame, Sparkles, Clock, Sliders } from "lucide-react";
import { startAmbientSound, stopAmbientSound, setAmbientVolume } from "../../utils/audio";
import AudioVisualizerWave from "./AudioVisualizerWave";

const soundPresets = [
  {
    id: "rain",
    name: "Cozy Library Rain",
    desc: "Pink-filtered soft rain on windows",
    icon: CloudRain,
    color: "#06b6d4",
    tagClass: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50",
  },
  {
    id: "fireplace",
    name: "Hearth Fireplace",
    desc: "Crackling ember pops & warm rumble",
    icon: Flame,
    color: "#f59e0b",
    tagClass: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
  },
  {
    id: "alpha",
    name: "10Hz Alpha Focus",
    desc: "Binaural stereo beats for deep flow",
    icon: Sparkles,
    color: "#8b5cf6",
    tagClass: "text-violet-500 bg-violet-50 dark:bg-violet-950/50",
  },
  {
    id: "clock",
    name: "Midnight Library Clock",
    desc: "Rhythmic pendulum tick & room resonance",
    icon: Clock,
    color: "#10b981",
    tagClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
  },
];

const AmbientSoundController = () => {
  const [ambientMode, setAmbientMode] = useState("off");
  const [volume, setVolume] = useState(0.22);
  const [isOpen, setIsOpen] = useState(false);

  const activePreset = soundPresets.find((p) => p.id === ambientMode);

  const setMode = (mode) => {
    if (mode === "off" || mode === ambientMode) {
      stopAmbientSound();
      setAmbientMode("off");
    } else {
      startAmbientSound(mode, volume);
      setAmbientMode(mode);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Live Audio Visualizer Canvas */}
      <AudioVisualizerWave
        isActive={ambientMode !== "off"}
        color={activePreset ? activePreset.color : "#8b5cf6"}
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-sm ${
          ambientMode !== "off"
            ? "bg-violet-600/10 border-violet-500/40 text-violet-700 shadow-violet-200 dark:text-violet-300"
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
          <div className="absolute right-0 top-10 mt-2 w-64 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Audio Atmosphere (5D)
              </span>
              <span className="text-[10px] text-violet-500 font-semibold">Web Audio API</span>
            </div>

            {/* Presets List */}
            <div className="mt-1 space-y-1">
              {soundPresets.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = ambientMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setMode(preset.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-start gap-2.5 px-3 py-2 rounded-2xl transition text-left ${
                      isSelected
                        ? `${preset.tagClass} font-bold shadow-sm`
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-xs">{preset.name}</div>
                      <div className="text-[10px] opacity-75">{preset.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Control Slider */}
            {ambientMode !== "off" && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 px-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sliders className="w-3 h-3" /> Volume
                  </span>
                  <span className="font-bold text-violet-600">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  aria-label="Atmospheric sound volume"
                />
              </div>
            )}

            <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

            {/* Mute Button */}
            <button
              onClick={() => {
                setMode("off");
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 font-semibold text-xs transition"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Mute All Audio Ambience</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AmbientSoundController;
