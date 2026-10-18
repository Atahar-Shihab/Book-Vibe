import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Star, BookOpen, Heart, CheckCircle2, Eye } from "lucide-react";
import TiltCard from "../Effects/TiltCard";
import { useToast } from "../Shared/Toast/useToast";
import {
  addToReadList,
  removeFromReadList,
  addToWishlist,
  removeFromWishlist,
  getStoredReadList,
  getStoredWishlist,
} from "../../utils/storage";

const BookCard = ({ book, onQuickRead }) => {
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    bookId,
    bookName,
    author,
    image,
    rating,
    category,
    tags = [],
    totalPages,
    yearOfPublishing,
    difficulty,
  } = book;

  const [isRead, setIsRead] = useState(() =>
    getStoredReadList().some((b) => Number(b.bookId) === Number(bookId))
  );
  const [isWishlisted, setIsWishlisted] = useState(() =>
    getStoredWishlist().some((b) => Number(b.bookId) === Number(bookId))
  );

  useEffect(() => {
    const handleSync = () => {
      setIsRead(getStoredReadList().some((b) => Number(b.bookId) === Number(bookId)));
      setIsWishlisted(getStoredWishlist().some((b) => Number(b.bookId) === Number(bookId)));
    };
    window.addEventListener("bookvibe_storage_updated", handleSync);
    return () => {
      window.removeEventListener("bookvibe_storage_updated", handleSync);
    };
  }, [bookId]);

  const handleReadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRead) {
      removeFromReadList(bookId, showToast, bookName);
      setIsRead(false);
    } else {
      const res = addToReadList(book, showToast);
      if (res.success) {
        setIsRead(true);
        if (isWishlisted) {
          removeFromWishlist(bookId);
          setIsWishlisted(false);
        }
      }
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(bookId, showToast, bookName);
      setIsWishlisted(false);
    } else {
      const res = addToWishlist(book, showToast);
      if (res.success) {
        setIsWishlisted(true);
      }
    }
  };

  const handleQuickFlip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickRead) onQuickRead(book);
  };

  return (
    <TiltCard maxTilt={8} scale={1.02} className="h-full">
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-200/60 transition-all duration-300 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-200/50 backdrop-blur-sm">
        {/* Ambient Top Glow on Hover */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

        <div>
          {/* Top Cover Display with 3D Book styling */}
          <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-violet-50/50 to-slate-200 p-4">
            {/* Realistic Book 3D Spine and Page Edge Effect */}
            <div className="relative h-44 w-32 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2 group-hover:shadow-2xl">
              {/* Spine ridge highlight */}
              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/20 to-transparent z-10 rounded-l-sm" />
              
              <img
                src={image}
                alt={`Cover of ${bookName}`}
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full rounded-r-md rounded-l-sm object-cover shadow-md transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-violet-100 rounded-md">
                  <BookOpen className="h-8 w-8 text-violet-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Category Badge */}
            <span className="absolute top-3 left-3 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-violet-700 shadow-sm backdrop-blur-md">
              {category}
            </span>

            {/* Read Status Badge on card */}
            {isRead && (
              <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" />
                <span>Read</span>
              </span>
            )}

            {/* Difficulty Badge */}
            {difficulty && (
              <span className="absolute top-3 right-3 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                {difficulty}
              </span>
            )}

            {/* Quick 3D Flip Reader Button on Hover */}
            {onQuickRead && (
              <button
                onClick={handleQuickFlip}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-amber-300 opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-105"
                title="Open 3D Flip Reader"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>3D Flip</span>
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 transition group-hover:bg-emerald-100"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Book Title & Author */}
          <Link to={`/bookDetails/${bookId}`}>
            <h3 className="mt-2.5 line-clamp-1 font-serif text-lg font-bold text-slate-800 transition-colors duration-200 group-hover:text-violet-700">
              {bookName}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-slate-500">
            By <span className="font-semibold text-slate-700">{author}</span>
          </p>

          {/* Metadata: Pages & Year */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
            <span>{totalPages} pages</span>
            <span>•</span>
            <span>{yearOfPublishing > 0 ? yearOfPublishing : `${Math.abs(yearOfPublishing)} BC`}</span>
          </div>
        </div>

        {/* Card Footer with Rating and Actions (with UNMARK capability) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">
                {Number(rating).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">/ 5.0</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Wishlist Toggle Button */}
              <button
                onClick={handleWishlistClick}
                className={`rounded-lg p-1.5 transition ${
                  isWishlisted
                    ? "bg-rose-100 text-rose-600 shadow-sm"
                    : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                aria-label="Wishlist toggle"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>

              {/* Mark / Unmark Read Button */}
              <button
                onClick={handleReadClick}
                className={`rounded-lg p-1.5 transition ${
                  isRead
                    ? "bg-emerald-100 text-emerald-700 shadow-sm hover:bg-rose-100 hover:text-rose-600"
                    : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
                title={isRead ? "Unmark as Read (Remove from Read List)" : "Mark as Read"}
                aria-label="Read status toggle"
              >
                {isRead ? (
                  <CheckCircle2 className="h-4 w-4 fill-emerald-600 text-white" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </button>

              <Link
                to={`/bookDetails/${bookId}`}
                className="rounded-lg bg-violet-600/10 px-2.5 py-1 text-xs font-bold text-violet-700 hover:bg-violet-600 hover:text-white transition"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default BookCard;
