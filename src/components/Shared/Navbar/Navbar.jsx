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
    { name: "Home", path: "/" },
    { name: "Listed Books", path: "/books" },
    { name: "Pages to Read", path: "/pages-to-read" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#23BE0A] via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="font-serif text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition">
              Book<span className="text-[#23BE0A]">Vibe</span>
            </span>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Cinematic Educational Library
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "border border-[#23BE0A] bg-emerald-50 text-[#23BE0A] shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Tools: Command Palette, Audio Ambiance, Reading Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Command Palette Button */}
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-violet-300 hover:bg-white hover:text-slate-800 transition shadow-xs"
              title="Quick Search & Navigation (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search</span>
              <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
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
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm"
            title={`${streak.count} Day Reading Streak`}
          >
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{streak.count} Days</span>
          </div>

          {/* Educational Action CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/books"
              className="rounded-2xl bg-[#23BE0A] hover:bg-[#1fa509] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition hover:scale-105"
            >
              My Library
            </Link>

            <Link
              to="/pages-to-read"
              className="rounded-2xl bg-[#59C6D2] hover:bg-[#4ab8c4] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/25 transition hover:scale-105"
            >
              Analytics
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 lg:hidden text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-5 py-5 backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "border border-[#23BE0A] bg-emerald-50 text-[#23BE0A]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/books"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-xl bg-[#23BE0A] py-2.5 text-xs font-bold text-white"
              >
                My Library
              </Link>
              <Link
                to="/pages-to-read"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-xl bg-[#59C6D2] py-2.5 text-xs font-bold text-white"
              >
                Analytics Dashboard
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;