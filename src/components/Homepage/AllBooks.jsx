import { useState, useEffect, useMemo } from "react";
import BookCard from "../BookCard/BookCard";
import VirtualBookShelf from "../BookShelf/VirtualBookShelf";
import BookFlipModal from "../BookReader/BookFlipModal";
import LiteraryTrivia from "./LiteraryTrivia";
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
    <div id="all-books-section" className="my-12 relative">
      {/* 3D Virtual Bookshelf Section */}
      {!loading && books.length > 0 && (
        <VirtualBookShelf
          books={books}
          onQuickRead={(book) => setSelectedBookForFlip(book)}
        />
      )}

      {/* Main Grid Header & Controls */}
      <div className="mt-14 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600 animate-spin" style={{ animationDuration: "8s" }} />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
                Curated Collection
              </span>
            </div>
            <h2 className="mt-1 text-3xl sm:text-4xl font-serif font-black text-slate-900">
              Explore All Books
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredAndSortedBooks.length} educational & literary masterpieces
            </p>
          </div>

          {/* Right Controls: Length, Sort, & View Mode */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Reading Length Filter */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm text-xs">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={lengthFilter}
                onChange={(e) => setLengthFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
                aria-label="Filter by reading length"
              >
                <option value="all">All Lengths</option>
                <option value="quick">Quick (&lt; 250 p)</option>
                <option value="medium">Standard (250–400 p)</option>
                <option value="epic">Epic (400+ p)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
                aria-label="Sort books by"
              >
                <option value="rating-desc">Rating: Highest First</option>
                <option value="rating-asc">Rating: Lowest First</option>
                <option value="pages-desc">Pages: Most First</option>
                <option value="pages-asc">Pages: Least First</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="year-asc">Year: Historical First</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode("shelf")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === "shelf"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Virtual Shelf View"
              >
                <Library className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">3D Shelf</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Books Display */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-96 rounded-3xl bg-slate-100 p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="h-48 rounded-2xl bg-slate-200" />
              <div className="space-y-3">
                <div className="h-4 rounded bg-slate-200 w-3/4" />
                <div className="h-3 rounded bg-slate-200 w-1/2" />
              </div>
              <div className="h-8 rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedBooks.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-slate-50">
          <span className="text-5xl">🔍</span>
          <h3 className="mt-4 text-xl font-bold text-slate-800">
            No books matched your criteria
          </h3>
          <p className="mt-2 text-xs text-slate-500 max-w-sm">
            Try adjusting your search query, reading length filter, or category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setLengthFilter("all");
              setSearch("");
            }}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700"
          >
            Reset Filters
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

      {/* Literary Trivia Lab Section */}
      <LiteraryTrivia />

      {/* Open Educational Resources Links Hub */}
      <section className="my-12 rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-6 sm:p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              Open Educational Knowledge Hub
            </span>
            <h3 className="mt-3 text-2xl font-serif font-black text-slate-900 sm:text-3xl">
              100% Free & Legal Public Domain Reading
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Book Vibe champions accessible education. Access over 70,000 free digital classics
              through our curated educational partners without logins or subscription fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://www.gutenberg.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-600 hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>Project Gutenberg</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-cyan-300 bg-white px-4 py-2.5 text-xs font-bold text-cyan-800 shadow-sm transition hover:bg-cyan-600 hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>Open Library</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/90 text-white shadow-2xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:bg-violet-600"
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
    </div>
  );
};

export default AllBooks;