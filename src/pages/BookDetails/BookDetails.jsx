import { useState, useEffect } from "react";
import { useLoaderData, useParams, Link } from "react-router";
import {
  BookOpen,
  Heart,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Star,
  CheckCircle2,
  Share2,
  Eye,
  Save,
  RotateCcw,
  Clock,
  Compass,
} from "lucide-react";
import TiltCard from "../../components/Effects/TiltCard";
import BookFlipModal from "../../components/BookReader/BookFlipModal";
import { useToast } from "../../components/Shared/Toast/useToast";
import {
  addToReadList,
  removeFromReadList,
  addToWishlist,
  removeFromWishlist,
  getStoredReadList,
  getStoredWishlist,
  getBookNotes,
  saveBookNote,
} from "../../utils/storage";
import { speakText, stopSpeaking } from "../../utils/audio";

const BookDetails = () => {
  const { bookId } = useParams();
  const books = useLoaderData();
  const { showToast } = useToast();

  // Find book
  const book = Array.isArray(books)
    ? books.find((item) => String(item.bookId) === String(bookId))
    : null;

  const [expanded, setExpanded] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [personalNote, setPersonalNote] = useState(() =>
    book ? getBookNotes(book.bookId) : ""
  );
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [pagesPerDay, setPagesPerDay] = useState(25);

  // Local state checks
  const [isRead, setIsRead] = useState(() =>
    book ? getStoredReadList().some((b) => Number(b.bookId) === Number(book.bookId)) : false
  );
  const [isWishlisted, setIsWishlisted] = useState(() =>
    book ? getStoredWishlist().some((b) => Number(b.bookId) === Number(book.bookId)) : false
  );

  useEffect(() => {
    const handleSync = () => {
      if (book) {
        setIsRead(getStoredReadList().some((b) => Number(b.bookId) === Number(book.bookId)));
        setIsWishlisted(getStoredWishlist().some((b) => Number(b.bookId) === Number(book.bookId)));
      }
    };
    window.addEventListener("bookvibe_storage_updated", handleSync);
    return () => {
      window.removeEventListener("bookvibe_storage_updated", handleSync);
      stopSpeaking();
    };
  }, [book]);

  if (!book) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center bg-slate-50">
        <span className="text-7xl">📚</span>
        <h2 className="mt-6 font-serif text-3xl font-extrabold text-slate-800">
          Book Not Found
        </h2>
        <p className="mt-3 max-w-md text-xs sm:text-sm text-slate-500">
          Looks like this book has wandered off the shelf or into another library section.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-violet-700"
        >
          Return to Library
        </Link>
      </div>
    );
  }

  const {
    bookName,
    author,
    image,
    review,
    totalPages,
    rating,
    category,
    tags = [],
    publisher,
    yearOfPublishing,
    quote,
    difficulty,
    readingTime,
    freeReadUrl,
  } = book;

  const score = Number(rating) || 0;
  const estimatedDays = Math.max(1, Math.ceil(totalPages / pagesPerDay));

  const toggleNarration = () => {
    if (isNarrating) {
      stopSpeaking();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const text = `${bookName} by ${author}. ${review}`;
      speakText(text, () => setIsNarrating(false));
    }
  };

  const handleToggleRead = () => {
    if (isRead) {
      removeFromReadList(book.bookId, showToast, bookName);
      setIsRead(false);
    } else {
      const res = addToReadList(book, showToast);
      if (res.success) {
        setIsRead(true);
        // If it was in wishlist, also remove from wishlist smoothly
        if (isWishlisted) {
          removeFromWishlist(book.bookId);
          setIsWishlisted(false);
        }
      }
    }
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(book.bookId, showToast, bookName);
      setIsWishlisted(false);
    } else {
      const res = addToWishlist(book, showToast);
      if (res.success) {
        setIsWishlisted(true);
      }
    }
  };

  const handleSaveNotes = () => {
    setIsSavingNote(true);
    saveBookNote(book.bookId, personalNote, showToast);
    setTimeout(() => setIsSavingNote(false), 400);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: bookName,
          text: `Check out "${bookName}" by ${author} on Book Vibe!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("📋 Link copied to clipboard!", "info");
    }
  };

  // Recommendations: books in same category
  const relatedBooks = Array.isArray(books)
    ? books.filter(
        (b) => b.category === category && String(b.bookId) !== String(bookId)
      ).slice(0, 3)
    : [];

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-violet-300/30 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-cyan-300/30 blur-[130px]" />

      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb Navigation & Share */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="transition hover:text-violet-600 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Catalog</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-none">
              {bookName}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            title="Share Book"
          >
            <Share2 className="h-3.5 w-3.5 text-violet-600" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Main 3D Card Section */}
        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT: 3D Book Presentation (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <TiltCard maxTilt={12} scale={1.03}>
                <div className="group relative flex min-h-[380px] sm:min-h-[460px] items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-100 via-violet-50/60 to-indigo-100/40 p-8 shadow-inner">
                  {/* Decorative orbital rings */}
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-violet-300/40 transition-transform duration-700 group-hover:scale-125" />
                  <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />

                  {/* 3D Book Cover Artwork */}
                  <div
                    className="relative z-10 max-h-[380px] w-full max-w-[260px] rounded-r-xl rounded-l-sm overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2 border-l-4 border-amber-600/70"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={image}
                      alt={`Cover of ${bookName}`}
                      className="h-full w-full object-cover"
                    />
                    {/* Realistic book page ridge */}
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/20 to-transparent" />
                  </div>

                  {/* Category Pill */}
                  <span className="absolute left-5 top-5 z-20 rounded-full border border-white/70 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-violet-700 shadow-sm backdrop-blur-md">
                    {category}
                  </span>

                  {/* Reading Status Ribbon if Read */}
                  {isRead && (
                    <span className="absolute left-5 bottom-5 z-20 flex items-center gap-1 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-bold shadow-md animate-in fade-in">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Completed</span>
                    </span>
                  )}

                  {/* Rating Tag */}
                  <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5 rounded-2xl border border-white/80 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-md">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-slate-800 text-sm">
                      {score.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ 5</span>
                  </div>
                </div>
              </TiltCard>

              {/* 3D Reader Modal Trigger & Audio Narration */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowFlipModal(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-xs font-bold text-amber-800 transition hover:bg-amber-500 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                  <span>Open 3D Flip Reader</span>
                </button>

                <button
                  onClick={toggleNarration}
                  className={`flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-bold transition ${
                    isNarrating
                      ? "bg-violet-600 text-white animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                  title="Narrate Synopsis with AI voice"
                >
                  {isNarrating ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span>{isNarrating ? "Playing..." : "Audio"}</span>
                </button>
              </div>

              {/* Interactive Reading Pace Estimator */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Clock className="h-3.5 w-3.5 text-violet-600" />
                    <span>Reading Pace Calculator</span>
                  </div>
                  <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                    {pagesPerDay} pages / day
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={pagesPerDay}
                    onChange={(e) => setPagesPerDay(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                    aria-label="Target pages per day"
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-600">
                  🎯 At this pace, you will finish this book in approximately{" "}
                  <strong className="text-violet-700 font-bold">{estimatedDays} days</strong>!
                </p>
              </div>
            </div>

            {/* RIGHT: Book Information & Educational Details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
                    Curated Classic
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Published {yearOfPublishing > 0 ? yearOfPublishing : `${Math.abs(yearOfPublishing)} BC`}
                  </span>
                  {difficulty && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Level: {difficulty}
                    </span>
                  )}
                </div>

                {/* Title and Author */}
                <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  {bookName}
                </h1>

                <p className="mt-2 text-base text-slate-500">
                  Written by <span className="font-bold text-slate-800">{author}</span>
                </p>

                {/* Rating Bar */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          score >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {score.toFixed(1)} / 5.0 Rating
                  </span>
                </div>

                {/* Notable Quote Box */}
                {quote && (
                  <div className="my-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 font-serif text-xs sm:text-sm italic text-amber-950 leading-relaxed shadow-inner">
                    "{quote}"
                  </div>
                )}

                {/* Synopsis / Review */}
                <div className="mt-5">
                  <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <span className="h-4 w-1 rounded-full bg-violet-600" />
                    Educational Review & Plot Summary
                  </h2>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {expanded || review.length <= 340
                      ? review
                      : `${review.slice(0, 340).trimEnd()}...`}
                  </p>

                  {review.length > 340 && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition"
                    >
                      {expanded ? "Show less ↑" : "Read full synopsis ↓"}
                    </button>
                  )}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 mr-1">Tags:</span>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Key Spec Grid */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="text-[11px] text-slate-400 font-medium">Total Pages</p>
                    <p className="mt-1 text-lg font-black text-slate-800">{totalPages}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="text-[11px] text-slate-400 font-medium">Est. Read Time</p>
                    <p className="mt-1 text-lg font-black text-slate-800">{readingTime || "6.5 hrs"}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="text-[11px] text-slate-400 font-medium">Publisher</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-800">{publisher}</p>
                  </div>
                </div>

                {/* Student Personal Notes Area */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                      Personal Reflections & Notes
                    </span>
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:text-violet-800"
                    >
                      <Save className="h-3 w-3" />
                      <span>{isSavingNote ? "Saved!" : "Save"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="Write key takeaways, memorable quotes, or reflections on this book..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons Row with UNMARK / REMOVE option */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleToggleRead}
                  className={`group flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-bold transition duration-200 shadow-lg ${
                    isRead
                      ? "bg-emerald-600 hover:bg-rose-600 text-white shadow-emerald-500/20"
                      : "bg-[#23BE0A] hover:bg-[#1fa509] text-white shadow-emerald-500/25"
                  }`}
                  title={isRead ? "Click to remove from Read list" : "Mark as completed"}
                >
                  {isRead ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 group-hover:hidden" />
                      <RotateCcw className="h-4 w-4 hidden group-hover:inline" />
                      <span className="group-hover:hidden">✓ Marked as Read</span>
                      <span className="hidden group-hover:inline">Remove from Read</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Mark as Read</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-xs font-bold transition duration-200 ${
                    isWishlisted
                      ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "border-slate-300 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  title={isWishlisted ? "Click to remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
                  <span>{isWishlisted ? "Wishlisted (Click to Remove)" : "Add to Wishlist"}</span>
                </button>

                {freeReadUrl && (
                  <a
                    href={freeReadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#59C6D2] px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-105 transition"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Free Digital Copy</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <Compass className="h-5 w-5 text-violet-600" />
              <h3 className="font-serif text-2xl font-black text-slate-900">
                More from the {category} Collection
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((relBook) => (
                <Link
                  key={relBook.bookId}
                  to={`/bookDetails/${relBook.bookId}`}
                  className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-300 hover:shadow-lg"
                >
                  <img
                    src={relBook.image}
                    alt={relBook.bookName}
                    className="h-20 w-14 rounded-lg object-cover shadow-sm transition group-hover:scale-105"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-violet-600 uppercase">
                      {relBook.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-violet-600">
                      {relBook.bookName}
                    </h4>
                    <p className="text-xs text-slate-500">{relBook.author}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{Number(relBook.rating).toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 3D Flip Reader Modal */}
      {showFlipModal && (
        <BookFlipModal book={book} onClose={() => setShowFlipModal(false)} />
      )}
    </main>
  );
};

export default BookDetails;
