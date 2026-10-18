import { useState, useEffect, useCallback } from "react";
import { X, Volume2, VolumeX, ExternalLink, Bookmark, Sparkles, BookOpen } from "lucide-react";
import { playPageFlipSound, speakText, stopSpeaking } from "../../utils/audio";

const BookFlipModal = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNarrating, setIsNarrating] = useState(false);

  const handleClose = useCallback(() => {
    stopSpeaking();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stopSpeaking();
    };
  }, [handleClose]);

  const toggleNarration = () => {
    if (isNarrating) {
      stopSpeaking();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const textToRead = `${book.bookName} by ${book.author}. ${book.excerpt || book.review}`;
      speakText(textToRead, () => setIsNarrating(false));
    }
  };

  const nextPage = () => {
    playPageFlipSound();
    setCurrentPage((prev) => (prev === 1 ? 2 : 1));
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Main 3D Book Container */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-3xl bg-amber-950/40 p-3 sm:p-6 border border-amber-500/20 shadow-2xl"
        style={{ perspective: "1500px" }}
      >
        {/* Top Header Controls */}
        <div className="mb-4 flex items-center justify-between text-amber-100">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              📖 3D Educational Flip Reader
            </span>
            <span className="text-xs text-amber-200/60 hidden sm:inline">
              Page {currentPage} of 2
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleNarration}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                isNarrating
                  ? "bg-violet-600 text-white animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="Read aloud using speech synthesis"
            >
              {isNarrating ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{isNarrating ? "Narrating..." : "Listen Aloud"}</span>
            </button>

            <button
              onClick={handleClose}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Close reader"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3D Realistic Open Two-Page Spread */}
        <div
          className="relative grid min-h-[460px] grid-cols-1 md:grid-cols-2 rounded-2xl bg-[#faf6eb] text-slate-800 shadow-2xl overflow-hidden border border-amber-900/10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Central Book Spine Shadow Crease */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 -ml-6 hidden md:block w-12 bg-gradient-to-r from-transparent via-amber-950/20 to-transparent z-20" />

          {/* LEFT PAGE */}
          <div className="relative flex flex-col justify-between p-6 sm:p-8 border-b md:border-b-0 md:border-r border-amber-900/10 bg-gradient-to-tr from-[#f5eedc] to-[#faf6eb]">
            <div>
              {/* Category & Year */}
              <div className="flex items-center justify-between text-xs text-amber-900/60">
                <span className="font-bold uppercase tracking-wider">
                  {book.category}
                </span>
                <span>Published {book.yearOfPublishing}</span>
              </div>

              {/* Title & Author */}
              <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {book.bookName}
              </h2>
              <p className="mt-1 font-serif italic text-sm text-amber-950/70">
                by {book.author}
              </p>

              {/* Gold Ornament Divider */}
              <div className="my-5 flex items-center justify-center gap-2 text-amber-600">
                <span className="h-px flex-1 bg-amber-400/40" />
                <Sparkles className="h-4 w-4" />
                <span className="h-px flex-1 bg-amber-400/40" />
              </div>

              {/* Key Literary Quote */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 font-serif text-sm italic text-amber-950/90 leading-relaxed shadow-inner">
                "{book.quote || "A book is a dream that you hold in your hand."}"
                <p className="mt-2 text-right text-xs font-sans font-bold not-italic text-amber-700">
                  — Notable Passage
                </p>
              </div>

              {/* Educational Metadata */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="rounded-lg bg-amber-100/60 p-2">
                  <span className="block text-[10px] text-amber-800 uppercase font-bold">Difficulty</span>
                  <span className="font-bold text-slate-800">{book.difficulty || "Intermediate"}</span>
                </div>
                <div className="rounded-lg bg-amber-100/60 p-2">
                  <span className="block text-[10px] text-amber-800 uppercase font-bold">Est. Reading</span>
                  <span className="font-bold text-slate-800">{book.readingTime || "6.5 hrs"}</span>
                </div>
              </div>
            </div>

            {/* Left Page Footer */}
            <div className="mt-6 flex items-center justify-between text-[11px] text-amber-950/50 font-mono">
              <span>BOOK VIBE CLASSICS</span>
              <span>• I •</span>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="relative flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-tl from-[#f5eedc] to-[#faf6eb]">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-900/60">
                <span className="flex items-center gap-1 font-semibold">
                  <Bookmark className="h-3.5 w-3.5 text-amber-600" />
                  Chapter Excerpt
                </span>
                <span className="font-mono text-[11px] text-amber-900/40">
                  {book.totalPages} Pages Total
                </span>
              </div>

              {/* First Letter Drop Cap & Text */}
              <div className="mt-5 font-serif text-sm leading-relaxed text-slate-800">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-black first-letter:text-amber-800">
                  {book.excerpt || book.review}
                </p>
              </div>

              {/* Extended Review Insight */}
              <div className="mt-4 border-l-2 border-amber-600 pl-3 font-sans text-xs text-slate-600 leading-normal">
                <strong className="text-slate-800">Curator Note:</strong> {book.review}
              </div>
            </div>

            {/* Right Page Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-900/10">
              {book.freeReadUrl && (
                <a
                  href={book.freeReadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Read Free Online</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              )}

              <button
                onClick={nextPage}
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-amber-900/20 bg-amber-100/60 px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-200 transition"
              >
                <span>Turn Page</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <p className="mt-3 text-center text-xs text-amber-200/50">
          💡 Press <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px]">ESC</kbd> to return to shelf.
        </p>
      </div>
    </div>
  );
};

export default BookFlipModal;
