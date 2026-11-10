import { useState } from "react";
import { NavLink, Link } from "react-router";
import { BookOpen, Flame, Menu, X, Search } from "lucide-react";
import AmbientSoundController from "../../Effects/AmbientSoundController";
import ThemeSwitcher from "../../Theme/ThemeSwitcher";
import { getReadingStreak } from "../../../utils/storage";

const Navbar = ({ onOpenCommand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [streak] = useState(() => getReadingStreak());

  const navLinks = [
    { name: "Explore", path: "/" },
    { name: "Listed Books", path: "/books" },
    { name: "Reading Analytics", path: "/pages-to-read" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl transition-colors duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black tracking-tight text-slate-900 dark:text-white transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Book<span className="text-emerald-500">Vibe</span>
              </span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                PRO
              </span>
            </div>
            <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Curated Educational Library
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Command Palette Button */}
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-slate-900 dark:hover:text-white transition shadow-xs"
              title="Quick Search & Navigation (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search</span>
              <kbd className="rounded-md bg-slate-100 dark:bg-slate-700/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200/70 dark:border-slate-600">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Ambient Sound Controller */}
          <AmbientSoundController />

          {/* Reading Atmosphere Theme Switcher */}
          <ThemeSwitcher />

          {/* Reading Streak Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-300/60 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-xs"
            title={`${streak.count} Day Reading Streak`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{streak.count}d Streak</span>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 lg:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-5 py-5 backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {onOpenCommand && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCommand();
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-3 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Search className="h-4 w-4" />
                <span>Search Books (⌘K)</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
