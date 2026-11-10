import { useState, useEffect, useMemo } from "react";
import BookCard from "../BookCard/BookCard";
import VirtualBookShelf from "../BookShelf/VirtualBookShelf";
import BookFlipModal from "../BookReader/BookFlipModal";
import BookComparatorModal from "../BookComparator/BookComparatorModal";
import LiteraryTrivia from "./LiteraryTrivia";
import LiteraryGalaxyExplorer from "../Galaxy/LiteraryGalaxyExplorer";
import {
  LayoutGrid,
  Library,
  ArrowUpDown,
  Filter,
  BookOpen,
  ExternalLink,
  Sparkles,
  ArrowUp,
  Clock,
  ArrowRightLeft,
  X,
  SlidersHorizontal,
} from "lucide-react";

const categories = [
  "All",
  "Classic",
  "Fiction",
  "Fantasy",
  "Philosophy",
  "Science",
  "History",
  "Mystery",
  "Non-Fiction",
];

const AllBooks = ({ externalSearch = "" }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lengthFilter, setLengthFilter] = useState("all"); // 'all' | 'quick' | 'medium' | 'epic'
  const [sortBy, setSortBy] = useState("rating-desc");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'shelf'
  const [selectedBookForFlip, setSelectedBookForFlip] = useState(null);
  const [showComparator, setShowComparator] = useState(false);
  const [search, setSearch] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const effectiveSearch = (externalSearch || search || "").trim();

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load books:", err);
        setLoading(false);
      });
  }, []);

  // Monitor scroll for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Live count per category
  const categoryCounts = useMemo(() => {
    const counts = { All: books.length };
    categories.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = books.filter(
          (b) => b.category?.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [books]);

  // Check if any filters are active
  const hasActiveFilters =
    selectedCategory !== "All" ||
    lengthFilter !== "all" ||
    Boolean(effectiveSearch) ||
    sortBy !== "rating-desc";

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setLengthFilter("all");
    setSortBy("rating-desc");
    setSearch("");
  };

  // Filter & Sort
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (b) => b.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Length filter
    if (lengthFilter === "quick") {
      result = result.filter((b) => b.totalPages < 250);
    } else if (lengthFilter === "medium") {
      result = result.filter((b) => b.totalPages >= 250 && b.totalPages <= 400);
    } else if (lengthFilter === "epic") {
      result = result.filter((b) => b.totalPages > 400);
    }

    // Search query filter
    if (effectiveSearch) {
      const q = effectiveSearch.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookName.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "pages-desc") return b.totalPages - a.totalPages;
      if (sortBy === "pages-asc") return a.totalPages - b.totalPages;
      if (sortBy === "year-desc") return b.yearOfPublishing - a.yearOfPublishing;
      if (sortBy === "year-asc") return a.yearOfPublishing - b.yearOfPublishing;
      if (sortBy === "title-asc") return a.bookName.localeCompare(b.bookName);
      return 0;
    });

    return result;
  }, [books, selectedCategory, lengthFilter, effectiveSearch, sortBy]);

  return (
    <div id="all-books-section" className="my-14 relative">
      {/* 3D Virtual Bookshelf Section */}
      {!loading && books.length > 0 && (
        <VirtualBookShelf
          books={books}
          onQuickRead={(book) => setSelectedBookForFlip(book)}
        />
      )}

      {/* Main Catalog Header & Controls */}
      <div className="mt-16 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="uppercase tracking-widest text-[11px]">Curated Library</span>
            </div>
            <h2 className="mt-2.5 text-3xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
              Explore Literary Masterpieces
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-800 dark:text-slate-200 font-bold">{filteredAndSortedBooks.length}</strong> of {books.length} curated classics and educational treasures.
            </p>
          </div>

          {/* Right Controls: Length, Sort, View Mode, Compare */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Reading Length Filter */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-xs text-xs">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={lengthFilter}
                onChange={(e) => setLengthFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                aria-label="Filter by reading length"
              >
                <option value="all" className="dark:bg-slate-900">All Lengths</option>
                <option value="quick" className="dark:bg-slate-900">Quick (&lt; 250 p)</option>
                <option value="medium" className="dark:bg-slate-900">Standard (250–400 p)</option>
                <option value="epic" className="dark:bg-slate-900">Epic (400+ p)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 shadow-xs text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                aria-label="Sort books by"
              >
                <option value="rating-desc" className="dark:bg-slate-900">Rating: Highest</option>
                <option value="rating-asc" className="dark:bg-slate-900">Rating: Lowest</option>
                <option value="pages-desc" className="dark:bg-slate-900">Pages: Most</option>
                <option value="pages-asc" className="dark:bg-slate-900">Pages: Least</option>
                <option value="year-desc" className="dark:bg-slate-900">Year: Newest</option>
                <option value="year-asc" className="dark:bg-slate-900">Year: Historical</option>
                <option value="title-asc" className="dark:bg-slate-900">Title: A to Z</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode("shelf")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  viewMode === "shelf"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Virtual Shelf View"
              >
                <Library className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Shelf</span>
              </button>
            </div>

            {/* Compare Books Button */}
            <button
              onClick={() => setShowComparator(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 transition shadow-xs"
              title="Compare 2 Books Side-by-Side"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            {/* Reset Filters Quick Button if active */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 px-3 py-2 text-xs font-bold transition shadow-xs"
                title="Clear all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills Bar with Live Volume Counts */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Category:</span>
          </div>

          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition shrink-0 border ${
                  isSelected
                    ? "bg-slate-900 dark:bg-emerald-600 text-white border-transparent shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Books Display */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800/50 p-4 animate-pulse flex flex-col justify-between border border-slate-200/50 dark:border-slate-800"
            >
              <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-700/50" />
              <div className="space-y-3">
                <div className="h-4 rounded bg-slate-200 dark:bg-slate-700/50 w-3/4" />
                <div className="h-3 rounded bg-slate-200 dark:bg-slate-700/50 w-1/2" />
              </div>
              <div className="h-8 rounded-xl bg-slate-200 dark:bg-slate-700/50" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedBooks.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-slate-50/80 dark:bg-slate-900/40">
          <span className="text-5xl">🔍</span>
          <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">
            No books matched your criteria
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Try adjusting your search query, reading length filter, or selected category.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm shadow-emerald-500/25"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="my-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedBooks.map((book) => (
            <BookCard
              key={book.bookId}
              book={book}
              onQuickRead={(b) => setSelectedBookForFlip(b)}
            />
          ))}
        </div>
      ) : (
        <VirtualBookShelf
          books={filteredAndSortedBooks}
          onQuickRead={(b) => setSelectedBookForFlip(b)}
        />
      )}

      {/* Literary Galaxy 2,700-Year Historical Timeline Explorer */}
      <LiteraryGalaxyExplorer
        books={books}
        onSelectBook={(book) => setSelectedBookForFlip(book)}
      />

      {/* Literary Trivia Lab Section */}
      <LiteraryTrivia />

      {/* Open Educational Resources Links Hub */}
      <section className="my-14 rounded-3xl border border-emerald-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-cyan-50/60 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Open Educational Knowledge Hub
            </span>
            <h3 className="mt-3 text-2xl font-serif font-black text-slate-900 dark:text-white sm:text-3xl">
              100% Free & Legal Public Domain Reading
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Book Vibe champions accessible education. Access over 70,000 free digital classics
              through our curated educational partners without paywalls or subscription fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://www.gutenberg.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-emerald-300/80 dark:border-emerald-700/60 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs transition hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>Project Gutenberg</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>

            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-teal-300/80 dark:border-teal-700/60 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-teal-800 dark:text-teal-300 shadow-xs transition hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>Open Library</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/90 dark:bg-emerald-600 text-white shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 dark:hover:bg-emerald-500"
          title="Scroll back to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* 3D Flip Reader Modal */}
      {selectedBookForFlip && (
        <BookFlipModal
          book={selectedBookForFlip}
          onClose={() => setSelectedBookForFlip(null)}
        />
      )}

      {/* Book Comparison Studio Modal */}
      <BookComparatorModal
        books={books}
        isOpen={showComparator}
        onClose={() => setShowComparator(false)}
      />
    </div>
  );
};

export default AllBooks;
