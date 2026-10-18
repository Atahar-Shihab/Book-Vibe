import { useState, useEffect } from "react";
import { Palette, Check, Sun, Moon, Sparkles, Feather } from "lucide-react";

const themes = [
  {
    id: "light",
    name: "Daylight Library",
    desc: "Crisp white paper & emerald",
    icon: Sun,
    bgClass: "bg-white",
    dotClass: "bg-[#23BE0A]",
  },
  {
    id: "dark",
    name: "Moonlight Study",
    desc: "Deep nebula midnight & violet",
    icon: Moon,
    bgClass: "bg-slate-900 text-white",
    dotClass: "bg-violet-500",
  },
  {
    id: "sepia",
    name: "Antique Parchment",
    desc: "Warm vintage linen & amber",
    icon: Feather,
    bgClass: "bg-[#fbf5e6] text-[#38281a]",
    dotClass: "bg-amber-600",
  },
  {
    id: "forest",
    name: "Emerald Study",
    desc: "Velvet botanical & warm gold",
    icon: Sparkles,
    bgClass: "bg-emerald-950 text-emerald-100",
    dotClass: "bg-emerald-400",
  },
];

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bookvibe_theme") || "light";
    }
    return "light";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark" || currentTheme === "forest") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("bookvibe_theme", currentTheme);
  }, [currentTheme]);

  const activeThemeObj = themes.find((t) => t.id === currentTheme) || themes[0];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-violet-300 transition"
        title="Change Reading Atmosphere Theme"
        aria-label="Change theme"
      >
        <ActiveIcon className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
        <span className="hidden xl:inline text-[11px]">{activeThemeObj.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 z-50 shadow-2xl text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Palette className="h-3 w-3" />
              <span>Reading Atmosphere</span>
            </div>

            <div className="mt-1 space-y-1">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 transition text-left ${
                      isSelected
                        ? "bg-violet-50 dark:bg-violet-950/60 font-bold text-violet-900 dark:text-violet-200"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                      <div>
                        <div className="text-xs font-semibold">{theme.name}</div>
                        <div className="text-[10px] opacity-75">{theme.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
