import { useState } from "react";
import { X, ArrowRightLeft, Star, FileText, Calendar, Compass, Quote } from "lucide-react";

const BookComparatorModal = ({ books = [], isOpen, onClose }) => {
  const [bookId1, setBookId1] = useState(() => (books[0] ? books[0].bookId : 1));
  const [bookId2, setBookId2] = useState(() => (books[2] ? books[2].bookId : 3));

  if (!isOpen || books.length < 2) return null;

  const b1 = books.find((b) => Number(b.bookId) === Number(bookId1)) || books[0];
  const b2 = books.find((b) => Number(b.bookId) === Number(bookId2)) || books[1];

  const pageDiff = Math.abs(b1.totalPages - b2.totalPages);
  const yearDiff = Math.abs(b1.yearOfPublishing - b2.yearOfPublishing);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border border-slate-700 bg-slate-900 text-slate-100 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-white">
                Literature Comparison Studio
              </h3>
              <p className="text-xs text-slate-400">
                Compare themes, eras, and literary scope side-by-side.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Close comparator"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selection Selectors */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-violet-500/30 bg-violet-950/30 p-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
              Select Book A:
            </label>
            <select
              value={bookId1}
              onChange={(e) => setBookId1(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
            >
              {books.map((b) => (
                <option key={b.bookId} value={b.bookId}>
                  {b.bookName} ({b.author})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              Select Book B:
            </label>
            <select
              value={bookId2}
              onChange={(e) => setBookId2(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
            >
              {books.map((b) => (
                <option key={b.bookId} value={b.bookId}>
                  {b.bookName} ({b.author})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BOOK A COLUMN */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={b1.image}
                  alt={b1.bookName}
                  className="h-28 w-20 rounded-xl object-cover shadow-lg border border-white/10 shrink-0"
                />
                <div>
                  <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 uppercase">
                    {b1.category}
                  </span>
                  <h4 className="mt-1 font-serif text-lg font-bold text-white leading-tight">
                    {b1.bookName}
                  </h4>
                  <p className="text-xs text-slate-400">By {b1.author}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{Number(b1.rating).toFixed(1)} / 5</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-900/60 p-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
                    <FileText className="h-3 w-3 text-violet-400" />
                    Pages
                  </span>
                  <p className="mt-1 text-sm font-black text-white">{b1.totalPages}</p>
                </div>

                <div className="rounded-xl bg-slate-900/60 p-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
                    <Calendar className="h-3 w-3 text-violet-400" />
                    Published
                  </span>
                  <p className="mt-1 text-sm font-black text-white">{b1.yearOfPublishing}</p>
                </div>
              </div>

              {/* Notable Quote */}
              <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-950/20 p-3 text-xs italic text-violet-200">
                <Quote className="h-3.5 w-3.5 text-violet-400 mb-1" />
                "{b1.quote || "A timeless classic of human thought."}"
              </div>
            </div>
          </div>

          {/* BOOK B COLUMN */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={b2.image}
                  alt={b2.bookName}
                  className="h-28 w-20 rounded-xl object-cover shadow-lg border border-white/10 shrink-0"
                />
                <div>
                  <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
                    {b2.category}
                  </span>
                  <h4 className="mt-1 font-serif text-lg font-bold text-white leading-tight">
                    {b2.bookName}
                  </h4>
                  <p className="text-xs text-slate-400">By {b2.author}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{Number(b2.rating).toFixed(1)} / 5</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-900/60 p-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
                    <FileText className="h-3 w-3 text-cyan-400" />
                    Pages
                  </span>
                  <p className="mt-1 text-sm font-black text-white">{b2.totalPages}</p>
                </div>

                <div className="rounded-xl bg-slate-900/60 p-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
                    <Calendar className="h-3 w-3 text-cyan-400" />
                    Published
                  </span>
                  <p className="mt-1 text-sm font-black text-white">{b2.yearOfPublishing}</p>
                </div>
              </div>

              {/* Notable Quote */}
              <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs italic text-cyan-200">
                <Quote className="h-3.5 w-3.5 text-cyan-400 mb-1" />
                "{b2.quote || "An enduring contribution to world literature."}"
              </div>
            </div>
          </div>
        </div>

        {/* Quick Comparative Synthesis Note */}
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs text-slate-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Historical Context:</strong> These works were published{" "}
              <span className="text-amber-300 font-bold">{yearDiff} years apart</span>, with a page difference of{" "}
              <span className="text-amber-300 font-bold">{pageDiff} pages</span>.
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-700 transition shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookComparatorModal;
