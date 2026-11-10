import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { getStoredReadList, getReadingStreak } from "../../utils/storage";
import {
  BarChart3,
  BookOpen,
  Clock,
  Trophy,
  Flame,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import TiltCard from "../../components/Effects/TiltCard";
import AnnualReadingChallenge from "../../components/Challenge/AnnualReadingChallenge";

const PagesToRead = () => {
  const [readBooks, setReadBooks] = useState(() => getStoredReadList());
  const [streak, setStreak] = useState(() => getReadingStreak());
  const [hoveredBook, setHoveredBook] = useState(null);
  const [chartSortBy, setChartSortBy] = useState("pages"); // 'pages' | 'rating' | 'year'

  // Educational seed data if user hasn't marked any as read yet
  const sampleBooks = useMemo(
    () => [
      { bookId: 1, bookName: "The Great Gatsby", totalPages: 180, category: "Classic", rating: 4.7, yearOfPublishing: 1925 },
      { bookId: 2, bookName: "To Kill a Mockingbird", totalPages: 281, category: "Fiction", rating: 4.9, yearOfPublishing: 1960 },
      { bookId: 3, bookName: "1984", totalPages: 328, category: "Science", rating: 4.8, yearOfPublishing: 1949 },
      { bookId: 6, bookName: "The Hobbit", totalPages: 310, category: "Fantasy", rating: 4.9, yearOfPublishing: 1937 },
      { bookId: 7, bookName: "Meditations", totalPages: 204, category: "Philosophy", rating: 4.9, yearOfPublishing: 180 },
      { bookId: 16, bookName: "The Little Prince", totalPages: 96, category: "Philosophy", rating: 4.9, yearOfPublishing: 1943 },
    ],
    []
  );

  // Sync with global storage updates
  useEffect(() => {
    const handleSync = () => {
      setReadBooks(getStoredReadList());
      setStreak(getReadingStreak());
    };
    window.addEventListener("bookvibe_storage_updated", handleSync);
    return () => window.removeEventListener("bookvibe_storage_updated", handleSync);
  }, []);

  const isDemo = readBooks.length === 0;
  const rawList = isDemo ? sampleBooks : readBooks;

  // Sorted list for chart display
  const displayBooks = useMemo(() => {
    const list = [...rawList];
    if (chartSortBy === "pages") {
      return list.sort((a, b) => b.totalPages - a.totalPages);
    }
    if (chartSortBy === "rating") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (chartSortBy === "year") {
      return list.sort((a, b) => b.yearOfPublishing - a.yearOfPublishing);
    }
    return list;
  }, [rawList, chartSortBy]);

  // Aggregate stats
  const totalPagesRead = displayBooks.reduce((sum, b) => sum + (b.totalPages || 0), 0);
  const totalBooksCount = displayBooks.length;
  const estimatedHours = (totalPagesRead / 40).toFixed(1); // 40 pages per hour average
  const maxPages = Math.max(...displayBooks.map((b) => b.totalPages || 0), 350);

  // Elegant gradients
  const barGradients = [
    { from: "#10b981", to: "#059669", shadow: "rgba(16, 185, 129, 0.35)" }, // Emerald
    { from: "#0d9488", to: "#0f766e", shadow: "rgba(13, 148, 136, 0.35)" }, // Teal
    { from: "#3b82f6", to: "#2563eb", shadow: "rgba(59, 130, 246, 0.35)" }, // Blue
    { from: "#8b5cf6", to: "#6d28d9", shadow: "rgba(139, 92, 246, 0.35)" }, // Violet
    { from: "#f59e0b", to: "#d97706", shadow: "rgba(245, 158, 11, 0.35)" }, // Amber
    { from: "#06b6d4", to: "#0891b2", shadow: "rgba(6, 182, 212, 0.35)" }, // Cyan
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="container mx-auto max-w-6xl">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 py-10 px-6 sm:px-10 text-center text-white shadow-xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-teal-600/20 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Reading Progress & Analytics
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Pages to Read Visualizer
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Interactive analytical visualization comparing pages conquered across your completed library.
            </p>
          </div>
        </div>

        {/* Demo Mode Notice if user has no read books */}
        {isDemo && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/20 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>
                <strong>Sample Preview Mode:</strong> You currently have no books marked as read.
                Showing sample classic literature metrics below!
              </span>
            </div>
            <Link
              to="/books"
              className="font-bold text-amber-800 dark:text-amber-300 underline hover:text-amber-950"
            >
              Go to Listed Books →
            </Link>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TiltCard maxTilt={5}>
            <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Books Conquered</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalBooksCount}</h3>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5}>
            <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Total Pages Read</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalPagesRead}</h3>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5}>
            <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Immersion Time</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">~{estimatedHours} hrs</h3>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5}>
            <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Reading Streak</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {streak.count} Days 🔥
                </h3>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* 3D Interactive Custom Shape Bar Chart Section */}
        <section className="mt-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
                  Custom Shape Bar Chart: Pages per Title
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Hover over any 3D bar to view detailed completion analytics.
              </p>
            </div>

            {/* Chart Sorting Controls */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-500">Sort:</span>
              <select
                value={chartSortBy}
                onChange={(e) => setChartSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                aria-label="Sort chart columns"
              >
                <option value="pages" className="dark:bg-slate-900">Most Pages</option>
                <option value="rating" className="dark:bg-slate-900">Highest Rating</option>
                <option value="year" className="dark:bg-slate-900">Publish Year</option>
              </select>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="relative pt-8 pb-12 overflow-x-auto no-scrollbar">
            {/* Grid horizontal guideline markers */}
            <div className="absolute inset-x-0 top-8 bottom-12 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
            </div>

            {/* Custom SVG / 3D Shape Bars */}
            <div className="relative flex items-end justify-around gap-4 sm:gap-8 h-80 min-w-[500px] px-6">
              {displayBooks.map((book, idx) => {
                const heightPercent = Math.max(12, Math.round((book.totalPages / maxPages) * 100));
                const colors = barGradients[idx % barGradients.length];
                const isHovered = hoveredBook?.bookId === book.bookId;

                return (
                  <div
                    key={book.bookId}
                    onMouseEnter={() => setHoveredBook(book)}
                    onMouseLeave={() => setHoveredBook(null)}
                    className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                  >
                    {/* Hover Tooltip */}
                    <div
                      className={`absolute -top-12 z-20 flex flex-col items-center rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-700 px-3 py-1.5 text-white shadow-xl transition-all duration-200 ${
                        isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <span className="text-xs font-bold whitespace-nowrap">{book.totalPages} Pages</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{book.category}</span>
                      <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-slate-900 dark:bg-slate-800" />
                    </div>

                    {/* 3D Custom Shape Column with Top Cap */}
                    <div
                      style={{
                        height: `${heightPercent}%`,
                        background: `linear-gradient(180deg, ${colors.from} 0%, ${colors.to} 100%)`,
                        boxShadow: isHovered
                          ? `0 12px 28px ${colors.shadow}, 0 0 15px ${colors.from}`
                          : `0 4px 12px ${colors.shadow}`,
                      }}
                      className="relative w-full max-w-[64px] rounded-t-2xl transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                    >
                      {/* 3D Cylinder Top Highlight Cap */}
                      <div
                        className="absolute top-0 inset-x-0 h-3 rounded-full bg-white/40 blur-[0.5px]"
                        style={{ transform: "translateY(-50%)" }}
                      />

                      {/* Side reflection highlight */}
                      <div className="absolute inset-y-0 left-1 w-1 bg-white/30 rounded-full" />

                      {/* Embedded Page Number on bar */}
                      <div className="absolute top-2 inset-x-0 text-center text-[11px] font-black text-white/90 drop-shadow">
                        {book.totalPages}
                      </div>
                    </div>

                    {/* Book Title Label Below Axis */}
                    <div className="mt-4 text-center">
                      <p
                        className="truncate text-xs font-bold text-slate-700 dark:text-slate-300 transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400 max-w-[80px] sm:max-w-[100px]"
                        title={book.bookName}
                      >
                        {book.bookName}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        ★ {Number(book.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Annual Reading Challenge Quest */}
        <section className="mt-8">
          <AnnualReadingChallenge readCount={readBooks.length} />
        </section>

        {/* Reading Milestone & Literary Scholar Rank */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                  Literary Scholar Rank
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalPagesRead >= 1000
                    ? "Grandmaster of the Library"
                    : totalPagesRead >= 500
                    ? "Voracious Scholar"
                    : "Passionate Explorer"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every chapter you absorb expands your worldview, builds critical empathy, and deepens knowledge.
              Keep reading to unlock new milestones!
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Next Tier Goal: 1,500 Pages</span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {Math.min(100, Math.round((totalPagesRead / 1500) * 100))}%
              </span>
            </div>

            <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round((totalPagesRead / 1500) * 100))}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                  Ready to conquer another chapter?
                </h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Discover next readings from our collection of classic and educational titles.
                Listen to narrations or flip through them in 3D.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-xs transition"
              >
                <span>Browse All Books</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/books"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>Manage Read List</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PagesToRead;
