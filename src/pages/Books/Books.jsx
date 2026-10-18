import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  getStoredReadList,
  getStoredWishlist,
  removeFromReadList,
  removeFromWishlist,
  getBookNotes,
  saveBookNote,
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
} from "lucide-react";
import TiltCard from "../../components/Effects/TiltCard";

const Books = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("read"); // 'read' | 'wishlist'
  const [sortBy, setSortBy] = useState("none");
  const [readBooks, setReadBooks] = useState(() => getStoredReadList());
  const [wishlistBooks, setWishlistBooks] = useState(() => getStoredWishlist());
  const [editingNotesFor, setEditingNotesFor] = useState(null);
  const [currentNoteText, setCurrentNoteText] = useState("");

  const handleRemove = (bookId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeTab === "read") {
      const updated = removeFromReadList(bookId, showToast);
      setReadBooks(updated);
    } else {
      const updated = removeFromWishlist(bookId, showToast);
      setWishlistBooks(updated);
    }
  };

  const openNotesModal = (book, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNotesFor(book);
    setCurrentNoteText(getBookNotes(book.bookId));
  };

  const handleSaveNote = () => {
    if (editingNotesFor) {
      saveBookNote(editingNotesFor.bookId, currentNoteText, showToast);
      setEditingNotesFor(null);
    }
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
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Page Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-10 px-6 text-center text-white shadow-xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-900/40 px-3.5 py-1 text-xs font-bold text-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Reading Headquarters
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Listed Books Catalog
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Track your literary milestones, organize wishlist treasures, and preserve personal reflections.
            </p>
          </div>
        </div>

        {/* Sort Dropdown Section */}
        <div className="my-8 flex justify-center">
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-2xl bg-[#23BE0A] hover:bg-[#1fa509] px-6 py-3.5 pr-12 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 cursor-pointer outline-none transition"
              aria-label="Sort listed books"
            >
              <option value="none">Sort By: Default</option>
              <option value="rating">Sort By: Rating (Highest)</option>
              <option value="pages">Sort By: Number of Pages</option>
              <option value="year">Sort By: Publisher Year</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 pb-px gap-2">
          <button
            onClick={() => setActiveTab("read")}
            className={`flex items-center gap-2 rounded-t-2xl px-6 py-3.5 text-sm font-bold transition ${
              activeTab === "read"
                ? "border-b-2 border-emerald-500 bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Read Books</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-800 font-extrabold">
              {readBooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 rounded-t-2xl px-6 py-3.5 text-sm font-bold transition ${
              activeTab === "wishlist"
                ? "border-b-2 border-rose-500 bg-white text-rose-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Wishlist Books</span>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs text-rose-800 font-extrabold">
              {wishlistBooks.length}
            </span>
          </button>
        </div>

        {/* Book List Output */}
        <div className="mt-8 space-y-5">
          {sortedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <span className="text-6xl">
                {activeTab === "read" ? "📖" : "✨"}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-slate-800">
                {activeTab === "read"
                  ? "No books marked as read yet"
                  : "Your wishlist is empty"}
              </h3>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500">
                {activeTab === "read"
                  ? "Browse through our collection of classics and click 'Mark as Read' to record your accomplishments."
                  : "Save titles you yearn to read soon by clicking the heart button on any book card."}
              </p>
              <Link
                to="/"
                className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700"
              >
                Explore Books Now
              </Link>
            </div>
          ) : (
            sortedList.map((book) => {
              const note = getBookNotes(book.bookId);

              return (
                <TiltCard key={book.bookId} maxTilt={4} scale={1.01}>
                  <div className="group relative flex flex-col sm:flex-row gap-6 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md transition-all duration-300 hover:border-violet-300 hover:shadow-xl">
                    {/* Book Image */}
                    <div className="relative flex h-48 w-full sm:w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-3">
                      <img
                        src={book.image}
                        alt={book.bookName}
                        className="h-full w-full rounded-md object-contain shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-violet-700 shadow-sm">
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
                              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 transition hover:text-violet-600">
                                {book.bookName}
                              </h3>
                            </Link>
                            <p className="mt-0.5 text-xs text-slate-500">
                              By <span className="font-semibold text-slate-700">{book.author}</span>
                            </p>
                          </div>

                          {/* Quick Remove Button */}
                          <button
                            onClick={(e) => handleRemove(book.bookId, e)}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Remove from list"
                            aria-label="Remove book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Tags & Metadata Row */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 mr-1">Tags:</span>
                          {book.tags &&
                            book.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700"
                              >
                                #{tag}
                              </span>
                            ))}

                          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>Year of Publishing: {book.yearOfPublishing}</span>
                          </div>
                        </div>

                        {/* Publisher & Page Count */}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>Publisher: {book.publisher}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            <span>Page: {book.totalPages}</span>
                          </div>
                        </div>

                        {/* Personal Note Preview if exists */}
                        {note && (
                          <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/60 p-2.5 text-xs text-violet-900">
                            <span className="font-bold">📝 Personal Note:</span> {note}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            Category: {book.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="h-4 w-4 fill-amber-400" />
                            <span>Rating: {Number(book.rating).toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => openNotesModal(book, e)}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-violet-600" />
                            <span>{note ? "Edit Notes" : "Add Notes"}</span>
                          </button>

                          <Link
                            to={`/bookDetails/${book.bookId}`}
                            className="rounded-xl bg-[#23BE0A] px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-[#1fa509]"
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

      {/* Personal Notes Modal */}
      {editingNotesFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Personal Reflection: {editingNotesFor.bookName}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Record your thoughts, quotes to remember, or key educational insights.
            </p>

            <textarea
              rows={5}
              value={currentNoteText}
              onChange={(e) => setCurrentNoteText(e.target.value)}
              placeholder="What did you learn from this masterpiece? Write your notes here..."
              className="mt-4 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingNotesFor(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-violet-700 transition"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Books;