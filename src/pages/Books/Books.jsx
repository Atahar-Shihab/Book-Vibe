import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import {
  getStoredReadList,
  getStoredWishlist,
  removeFromReadList,
  removeFromWishlist,
  getBookNotes,
} from "../../utils/storage";
import { useToast } from "../../components/Shared/Toast/useToast";
import {
  BookOpen,
  Heart,
  Calendar,
  Building2,
  FileText,
  Star,
  Trash2,
  Edit3,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Download,
} from "lucide-react";
import TiltCard from "../../components/Effects/TiltCard";
import ScholarNotesModal from "../../components/Notes/ScholarNotesModal";

const Books = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("read"); // 'read' | 'wishlist'
  const [sortBy, setSortBy] = useState("none");
  const [readBooks, setReadBooks] = useState(() => getStoredReadList());
  const [wishlistBooks, setWishlistBooks] = useState(() => getStoredWishlist());
  const [editingNotesFor, setEditingNotesFor] = useState(null);

  // Keep synced with global storage events
  useEffect(() => {
    const handleSync = () => {
      setReadBooks(getStoredReadList());
      setWishlistBooks(getStoredWishlist());
    };
    window.addEventListener("bookvibe_storage_updated", handleSync);
    return () => window.removeEventListener("bookvibe_storage_updated", handleSync);
  }, []);

  const handleRemove = (book, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeTab === "read") {
      const updated = removeFromReadList(book.bookId, showToast, book.bookName);
      setReadBooks(updated);
    } else {
      const updated = removeFromWishlist(book.bookId, showToast, book.bookName);
      setWishlistBooks(updated);
    }
  };

  const openNotesModal = (book, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNotesFor(book);
  };

  // Export Reading Journal to Markdown
  const exportJournal = () => {
    const listToExport = activeTab === "read" ? readBooks : wishlistBooks;
    if (listToExport.length === 0) {
      showToast("No books available to export in this tab", "info");
      return;
    }

    const title = activeTab === "read" ? "My Completed Reading List" : "My Reading Wishlist";
    let markdown = `# 📚 Book Vibe — ${title}\n\n`;
    markdown += `*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    listToExport.forEach((b, idx) => {
      const note = getBookNotes(b.bookId);
      markdown += `### ${idx + 1}. ${b.bookName} (${b.yearOfPublishing})\n`;
      markdown += `* **Author**: ${b.author}\n`;
      markdown += `* **Category**: ${b.category}\n`;
      markdown += `* **Pages**: ${b.totalPages} | **Rating**: ${b.rating} / 5\n`;
      markdown += `* **Publisher**: ${b.publisher}\n`;
      if (note) {
        markdown += `* **Personal Reflection / Notes**:\n  > "${note}"\n`;
      }
      markdown += `\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookvibe-${activeTab}-books.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("📥 Reading journal exported successfully!", "success");
  };

  // Sort logic
  const currentList = activeTab === "read" ? readBooks : wishlistBooks;

  const sortedList = useMemo(() => {
    const list = [...currentList];
    if (sortBy === "rating") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "pages") {
      return list.sort((a, b) => b.totalPages - a.totalPages);
    }
    if (sortBy === "year") {
      return list.sort((a, b) => b.yearOfPublishing - a.yearOfPublishing);
    }
    return list;
  }, [currentList, sortBy]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="container mx-auto max-w-6xl">
        {/* Page Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 py-10 px-6 sm:px-10 text-center text-white shadow-xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-teal-500/20 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Reading Headquarters
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Listed Books Catalog
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Track your literary milestones, organize wishlist treasures, unmark or reclassify books, and preserve personal reflections.
            </p>
          </div>
        </div>

        {/* Controls Section: Sort & Export */}
        <div className="my-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 px-5 py-2.5 pr-10 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 shadow-xs cursor-pointer outline-none transition"
              aria-label="Sort listed books"
            >
              <option value="none">Sort By: Default</option>
              <option value="rating">Sort By: Rating (Highest)</option>
              <option value="pages">Sort By: Number of Pages</option>
              <option value="year">Sort By: Publisher Year</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {currentList.length > 0 && (
            <button
              onClick={exportJournal}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition"
              title="Download your reading list as Markdown file"
            >
              <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export {activeTab === "read" ? "Read List" : "Wishlist"}</span>
            </button>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-px gap-2">
          <button
            onClick={() => setActiveTab("read")}
            className={`flex items-center gap-2 rounded-t-2xl px-6 py-3.5 text-sm font-bold transition border-b-2 ${
              activeTab === "read"
                ? "border-emerald-500 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Read Books</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
              activeTab === "read"
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}>
              {readBooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 rounded-t-2xl px-6 py-3.5 text-sm font-bold transition border-b-2 ${
              activeTab === "wishlist"
                ? "border-rose-500 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Wishlist Books</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
              activeTab === "wishlist"
                ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}>
              {wishlistBooks.length}
            </span>
          </button>
        </div>

        {/* Book List Output */}
        <div className="mt-8 space-y-5">
          {sortedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xs">
              <span className="text-6xl">
                {activeTab === "read" ? "📖" : "✨"}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {activeTab === "read"
                  ? "No books currently marked as read"
                  : "Your wishlist is empty"}
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {activeTab === "read"
                  ? "Browse through our collection of classics and click 'Mark as Read' to record your accomplishments. You can also unmark them at any time."
                  : "Save titles you yearn to read soon by clicking the heart button on any book card."}
              </p>
              <Link
                to="/"
                className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition hover:bg-emerald-700"
              >
                Explore Books Now
              </Link>
            </div>
          ) : (
            sortedList.map((book) => {
              const note = getBookNotes(book.bookId);

              return (
                <TiltCard key={book.bookId} maxTilt={4} scale={1.01}>
                  <div className="group relative flex flex-col sm:flex-row gap-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xl">
                    {/* Book Image */}
                    <div className="relative flex h-48 w-full sm:w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-800/60 p-3">
                      <img
                        src={book.image}
                        alt={book.bookName}
                        className="h-full w-full rounded-md object-contain shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shadow-xs">
                        {book.category}
                      </span>
                    </div>

                    {/* Book Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        {/* Title & Author */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link to={`/bookDetails/${book.bookId}`}>
                              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition hover:text-emerald-600 dark:hover:text-emerald-400">
                                {book.bookName}
                              </h3>
                            </Link>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              By <span className="font-semibold text-slate-700 dark:text-slate-200">{book.author}</span>
                            </p>
                          </div>

                          {/* Quick Remove / Unmark Button */}
                          <button
                            onClick={(e) => handleRemove(book, e)}
                            className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title={activeTab === "read" ? "Unmark / Remove from Read List" : "Remove from Wishlist"}
                            aria-label="Remove book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Tags & Metadata Row */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-300 mr-1">Tags:</span>
                          {book.tags &&
                            book.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                              >
                                #{tag}
                              </span>
                            ))}

                          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>Year: {book.yearOfPublishing}</span>
                          </div>
                        </div>

                        {/* Publisher & Page Count */}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>Publisher: {book.publisher}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            <span>Pages: {book.totalPages}</span>
                          </div>
                        </div>

                        {/* Personal Note Preview if exists */}
                        {note && (
                          <div className="mt-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 text-xs text-emerald-950 dark:text-emerald-200">
                            <span className="font-bold">📝 Personal Reflection:</span> {note}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Actions (with EXPLICIT Unmark Option) */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {book.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="h-4 w-4 fill-amber-400" />
                            <span>{Number(book.rating).toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Unmark option for Read Books */}
                          {activeTab === "read" && (
                            <button
                              onClick={(e) => handleRemove(book, e)}
                              className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 transition"
                              title="Remove from Mark as Read"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Unmark Read</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => openNotesModal(book, e)}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{note ? "Edit Notes" : "Add Notes"}</span>
                          </button>

                          <Link
                            to={`/bookDetails/${book.bookId}`}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })
          )}
        </div>
      </div>

      {/* Scholar Notes & Journal Studio Modal */}
      <ScholarNotesModal
        book={editingNotesFor}
        isOpen={Boolean(editingNotesFor)}
        onClose={() => setEditingNotesFor(null)}
      />
    </main>
  );
};

export default Books;
