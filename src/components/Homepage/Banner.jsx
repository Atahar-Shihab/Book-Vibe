import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Sparkles, BookOpen, Compass, Search, Volume2, ArrowRight, X, Shuffle } from "lucide-react";
import { speakText, stopSpeaking } from "../../utils/audio";
import TiltCard from "../Effects/TiltCard";

const quotes = [
  {
    quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
  },
  {
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    quote: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
  },
  {
    quote: "You never really understand a person until you climb into his skin and walk around in it.",
    author: "Harper Lee",
  },
  {
    quote: "It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
    author: "Antoine de Saint-Exupéry",
  },
];

const Banner = ({ onSearch, searchQuery = "" }) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isSpeakingQuote, setIsSpeakingQuote] = useState(false);
  const searchInputRef = useRef(null);

  const currentQuote = quotes[quoteIdx];

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(localSearch);
    const el = document.getElementById("all-books-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    if (onSearch) onSearch("");
  };

  const handleShuffleQuote = () => {
    stopSpeaking();
    setIsSpeakingQuote(false);
    setQuoteIdx((prev) => (prev + 1) % quotes.length);
  };

  const handleSpeakQuote = () => {
    if (isSpeakingQuote) {
      stopSpeaking();
      setIsSpeakingQuote(false);
    } else {
      setIsSpeakingQuote(true);
      speakText(`${currentQuote.quote} - by ${currentQuote.author}`, () => {
        setIsSpeakingQuote(false);
      });
    }
  };

  return (
    <section className="relative my-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-12 sm:px-10 sm:py-16 text-white shadow-2xl">
      {/* 5D Cinematic Ambient Light Beams */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-cyan-500/25 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/3 top-10 h-72 w-72 rounded-full bg-amber-500/15 blur-[100px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Headlines & Interaction */}
        <div className="lg:col-span-7">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-950/60 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
              Free Open Educational Library
            </span>
          </div>

          {/* Majestic Hero Title */}
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
            Books to freshen up <br />
            <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              your bookshelf & mind
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Explore 30 timeless masterpieces of classic literature, science, and philosophy.
            Experience our 3D Virtual Bookshelf, audio narration, and deep educational insights.
          </p>

          {/* Live Search Form with Clear & Hotkey */}
          <form onSubmit={handleSearchSubmit} className="mt-7 flex max-w-md items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-xl shadow-xl">
            <Search className="ml-3 h-5 w-5 text-slate-300 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, author, or genre... (Press '/' to focus)"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full bg-transparent px-2 py-1.5 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 rounded-full text-slate-300 hover:text-white transition"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 transition shadow-md shrink-0"
            >
              Explore
            </button>
          </form>

          {/* Quick Metrics & Call to Action */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#all-books-section"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-600/30 transition hover:scale-105"
            >
              <Compass className="h-4 w-4" />
              <span>Browse Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              to="/pages-to-read"
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Pages to Read</span>
            </Link>
          </div>

          {/* Daily Literary Quote Widget with Shuffle & Narration */}
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 backdrop-blur-md">
            <div>
              <p className="font-serif italic text-xs sm:text-sm text-amber-200">
                "{currentQuote.quote}"
              </p>
              <span className="text-[11px] font-bold text-amber-400/80">
                — {currentQuote.author}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleShuffleQuote}
                className="rounded-xl p-2.5 bg-white/10 text-amber-300 hover:bg-white/20 transition"
                title="Shuffle Quote"
                aria-label="Shuffle Quote"
              >
                <Shuffle className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleSpeakQuote}
                className={`rounded-xl p-2.5 transition shrink-0 ${
                  isSpeakingQuote
                    ? "bg-amber-400 text-slate-950 animate-pulse"
                    : "bg-white/10 text-amber-300 hover:bg-white/20"
                }`}
                title="Listen to Quote"
                aria-label="Listen to Quote"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Floating Book Showcase */}
        <div className="lg:col-span-5 flex justify-center">
          <TiltCard maxTilt={15} scale={1.04} className="w-full max-w-sm">
            <div
              className="relative rounded-3xl border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-6 backdrop-blur-2xl shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Floating Status Badges */}
              <div
                className="absolute -top-3 -right-3 rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-[11px] font-extrabold text-slate-950 shadow-xl"
                style={{ transform: "translateZ(40px)" }}
              >
                ✨ 3D Flip Enabled
              </div>

              {/* 3D Physical Book Card Mockup */}
              <div
                className="relative mx-auto flex h-72 w-52 flex-col justify-between rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-stone-950 p-5 text-white shadow-2xl border-l-4 border-amber-500/80"
                style={{
                  transform: "translateZ(30px) rotateY(-10deg) rotateX(6deg)",
                  transformStyle: "preserve-3d",
                  boxShadow: "-15px 20px 30px rgba(0, 0, 0, 0.6)",
                }}
              >
                <div className="flex items-center justify-between text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                  <span>Open Edition</span>
                  <span>100% Free</span>
                </div>

                <div className="my-auto text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 shadow-inner">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-amber-100 leading-tight">
                    World Classics & Modern Science
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Curated for curious minds
                  </p>
                </div>

                <div className="border-t border-amber-500/20 pt-2 flex items-center justify-between text-[10px] text-amber-200">
                  <span>30 Books</span>
                  <span>★ 4.8 Rating</span>
                </div>
              </div>

              {/* Stat Counters Row */}
              <div
                className="mt-6 grid grid-cols-3 gap-2 text-center text-xs"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="rounded-xl bg-white/5 p-2.5">
                  <span className="block text-base font-black text-amber-400">30+</span>
                  <span className="text-[10px] text-slate-300 font-medium">Free Works</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <span className="block text-base font-black text-emerald-400">0$</span>
                  <span className="text-[10px] text-slate-300 font-medium">Cost</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <span className="block text-base font-black text-cyan-400">5D</span>
                  <span className="text-[10px] text-slate-300 font-medium">Cinematic</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

export default Banner;