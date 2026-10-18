import { useState, useRef } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, BookOpen, Star, Eye } from "lucide-react";
import { playPageFlipSound } from "../../utils/audio";

const spineColors = [
  "from-amber-800 via-amber-900 to-amber-950",
  "from-emerald-800 via-emerald-900 to-emerald-950",
  "from-violet-800 via-violet-900 to-violet-950",
  "from-blue-800 via-blue-900 to-blue-950",
  "from-rose-800 via-rose-900 to-rose-950",
  "from-indigo-800 via-indigo-900 to-indigo-950",
  "from-teal-800 via-teal-900 to-teal-950",
  "from-cyan-800 via-cyan-900 to-cyan-950",
];

const VirtualBookShelf = ({ books, onQuickRead }) => {
  const [activeBook, setActiveBook] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      playPageFlipSound();
    }
  };

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-amber-900/20 bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-950 p-6 text-white shadow-2xl">
      {/* Shelf Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              3D Interactive Library
            </span>
          </div>
          <h3 className="text-2xl font-black text-stone-100 sm:text-3xl">
            Virtual Bookshelf Experience
          </h3>
          <p className="mt-1 text-xs text-stone-400">
            Hover over physical spines to examine them in 3D space, or click to open.
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll library left"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-700 bg-stone-800/80 text-stone-200 transition hover:bg-amber-600 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll library right"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-700 bg-stone-800/80 text-stone-200 transition hover:bg-amber-600 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3D Shelf Container with Perspective */}
      <div
        className="relative py-8"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-6 pt-12 px-4 no-scrollbar scroll-smooth"
          style={{ transformStyle: "preserve-3d" }}
        >
          {books.map((book, idx) => {
            const spineGradient = spineColors[idx % spineColors.length];
            const heightVariation = 230 + (book.bookId % 4) * 22; // Natural height difference
            const widthVariation = 48 + (book.bookId % 3) * 8; // Spine thickness
            const isSelected = activeBook?.bookId === book.bookId;

            return (
              <div
                key={book.bookId}
                onMouseEnter={() => {
                  setActiveBook(book);
                  playPageFlipSound();
                }}
                className="group relative cursor-pointer select-none transition-all duration-300"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isSelected
                    ? "translateZ(70px) translateY(-24px) rotateY(-12deg) scale(1.05)"
                    : "translateZ(0) translateY(0) rotateY(0deg)",
                }}
              >
                {/* 3D Physical Spine */}
                <div
                  style={{
                    height: `${heightVariation}px`,
                    width: `${widthVariation}px`,
                    transformStyle: "preserve-3d",
                  }}
                  className={`relative flex flex-col justify-between rounded-t-sm bg-gradient-to-r ${spineGradient} p-2 shadow-2xl border-l border-white/20 border-r border-black/50 transition-all duration-300 group-hover:brightness-125`}
                >
                  {/* Gold Ribs on Spine */}
                  <div className="absolute top-4 left-0 right-0 h-1 bg-amber-400/40 shadow-sm" />
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-amber-400/30" />
                  <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-amber-400/30" />
                  <div className="absolute bottom-4 left-0 right-0 h-1 bg-amber-400/40 shadow-sm" />

                  {/* Top Spine Category Tag */}
                  <div className="text-center">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-amber-300/80">
                      {book.category.slice(0, 4)}
                    </span>
                  </div>

                  {/* Rotated Book Title on Spine */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden my-6">
                    <p
                      className="whitespace-nowrap text-xs font-black tracking-wider text-amber-100/90"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        maxHeight: `${heightVariation - 80}px`,
                      }}
                    >
                      {book.bookName}
                    </p>
                  </div>

                  {/* Bottom Spine Star Rating */}
                  <div className="flex flex-col items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[9px] font-bold text-stone-300">
                      {Number(book.rating).toFixed(1)}
                    </span>
                  </div>

                  {/* Spine edge lighting reflection */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-white/30 blur-[1px]" />
                  <div className="absolute inset-y-0 right-0 w-1 bg-black/60" />
                </div>

                {/* 3D Book Cast Shadow on Shelf */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-3 bg-black/80 blur-md transition-all duration-300 group-hover:blur-lg group-hover:opacity-60"
                  style={{ transform: "rotateX(90deg)" }}
                />
              </div>
            );
          })}
        </div>

        {/* Realistic Wooden Shelf Ledge with Depth */}
        <div className="relative mt-1">
          {/* Top shelf face */}
          <div className="h-4 w-full bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 shadow-inner" />
          {/* Front shelf edge with wood grain bevel */}
          <div className="h-6 w-full rounded-b-xl border-t border-amber-600/30 bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 shadow-2xl flex items-center px-6">
            <span className="text-[10px] font-bold tracking-widest text-amber-500/50 uppercase">
              • Section {activeBook ? activeBook.category : "Curated Classics"} •
            </span>
          </div>
        </div>
      </div>

      {/* Active Book Detail Drawer */}
      {activeBook && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-stone-800 bg-stone-900/90 p-5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-4">
            <img
              src={activeBook.image}
              alt={activeBook.bookName}
              className="h-20 w-14 rounded-lg object-cover shadow-lg border border-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {activeBook.category}
                </span>
                <span className="text-xs text-stone-400">
                  {activeBook.yearOfPublishing} • {activeBook.totalPages} pages
                </span>
              </div>
              <h4 className="mt-1 text-lg font-bold text-stone-100">
                {activeBook.bookName}
              </h4>
              <p className="text-xs text-stone-400">
                by <span className="text-stone-200">{activeBook.author}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onQuickRead && (
              <button
                onClick={() => onQuickRead(activeBook)}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500 hover:text-black"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D Flip Reader</span>
              </button>
            )}

            <Link
              to={`/bookDetails/${activeBook.bookId}`}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-900/30 transition hover:scale-105"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Details</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualBookShelf;
