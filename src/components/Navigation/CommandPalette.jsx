import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Search, BookOpen, Sparkles, X, Volume2, CloudRain, Flame, VolumeX } from "lucide-react";
import { startAmbientSound, stopAmbientSound } from "../../utils/audio";

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBooks = query.trim()
    ? books.filter(
        (b) =>
          b.bookName.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()) ||
          b.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : books.slice(0, 4);

  const handleSelectBook = (bookId) => {
    onClose();
    navigate(`/bookDetails/${bookId}`);
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleSetSound = (mode) => {
    if (mode === "off") {
      stopAmbientSound();
    } else {
      startAmbientSound(mode, 0.22);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/95 text-slate-100 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <Search className="h-5 w-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a book name, author, genre, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white transition"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[380px] overflow-y-auto p-3 no-scrollbar space-y-4">
          {/* Quick Books Matching */}
          <div>
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {query.trim() ? "Matching Classics" : "Curated Recommendations"}
            </p>
            <div className="mt-1 space-y-1">
              {filteredBooks.map((b) => (
                <button
                  key={b.bookId}
                  onClick={() => handleSelectBook(b.bookId)}
                  className="flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.image}
                      alt={b.bookName}
                      className="h-10 w-7 rounded object-cover shadow"
                    />
                    <div>
                      <p className="font-serif text-xs font-bold text-slate-100 line-clamp-1">
                        {b.bookName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {b.author} • <span className="text-violet-400 font-semibold">{b.category}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">
                    ★ {Number(b.rating).toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Navigation Commands */}
          <div>
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Navigation
            </p>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleNavigate("/")}
                className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Home Catalog</span>
              </button>
              <button
                onClick={() => handleNavigate("/books")}
                className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <BookOpen className="h-4 w-4 text-violet-400" />
                <span>Listed Books</span>
              </button>
              <button
                onClick={() => handleNavigate("/pages-to-read")}
                className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <Volume2 className="h-4 w-4 text-cyan-400" />
                <span>Pages Analytics</span>
              </button>
              <button
                onClick={() => handleSetSound("rain")}
                className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <CloudRain className="h-4 w-4 text-blue-400" />
                <span>Play Library Rain</span>
              </button>
              <button
                onClick={() => handleSetSound("fireplace")}
                className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <Flame className="h-4 w-4 text-amber-400" />
                <span>Play Fireplace</span>
              </button>
              <button
                onClick={() => handleSetSound("off")}
                className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-rose-400 hover:bg-white/10 transition"
              >
                <VolumeX className="h-4 w-4" />
                <span>Mute Ambience</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Shortcut Guide */}
        <div className="border-t border-slate-800 px-5 py-2.5 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with ↵ Enter</span>
          <span>
            Press <kbd className="rounded bg-slate-800 px-1 py-0.5 text-[10px]">ESC</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
