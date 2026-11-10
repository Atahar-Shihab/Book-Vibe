import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Star, BookOpen, Heart, CheckCircle2, Eye, Sparkles, Clock } from "lucide-react";
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

const DEFAULT_COVER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

const BookCard = ({ book, onQuickRead }) => {
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(book.image || DEFAULT_COVER);

  const {
    bookId,
    bookName,
    author,
    rating,
    category,
    tags = [],
    totalPages,
    yearOfPublishing,
    readingTime,
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

  const isTopPick = Number(rating) >= 4.9;

  return (
    <TiltCard maxTilt={6} scale={1.015} className="h-full">
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-emerald-950/20 transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700/60 backdrop-blur-md">
        <div>
          {/* Top Book Showcase Sleeve */}
          <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 p-4">
            {/* 3D Physical Book Mockup Frame */}
            <div className="relative h-44 w-32 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-rotate-1">
              {/* Realistic book spine shadow & highlight */}
              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/15 to-transparent z-10 rounded-l-sm" />

              <img
                src={imgSrc}
                alt={`Cover of ${bookName}`}
                onError={() => setImgSrc(DEFAULT_COVER)}
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full rounded-r-md rounded-l-sm object-cover shadow-lg transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-md">
                  <BookOpen className="h-7 w-7 text-slate-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Category Badge */}
            <span className="absolute top-3 left-3 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
              {category}
            </span>

            {/* Read Status Chip */}
            {isRead && (
              <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                <CheckCircle2 className="h-3 w-3" />
                <span>Read</span>
              </span>
            )}

            {/* Top Pick Badge */}
            {isTopPick && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-amber-300/60 dark:border-amber-600/60 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 shadow-xs">
                <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>Top Pick</span>
              </span>
            )}

            {/* Hover 3D Flip Reader Button */}
            {onQuickRead && (
              <button
                onClick={handleQuickFlip}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-slate-900/90 text-emerald-400 px-3 py-1.5 text-xs font-bold opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:scale-105"
                title="Open 3D Flip Reader"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Quick Read</span>
              </button>
            )}
          </div>

          {/* Tags Row */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Book Title & Author */}
          <Link to={`/bookDetails/${bookId}`} className="block mt-2">
            <h3 className="line-clamp-1 font-serif text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {bookName}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            By <span className="font-semibold text-slate-700 dark:text-slate-300">{author}</span>
          </p>

          {/* Metadata: Pages & Reading Time */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span>{totalPages} pages</span>
              <span>•</span>
              <span>{yearOfPublishing > 0 ? yearOfPublishing : `${Math.abs(yearOfPublishing)} BC`}</span>
            </div>

            {readingTime && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3 text-emerald-500" />
                <span>{readingTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer with Rating and Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {Number(rating).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 5.0</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              {/* Wishlist Toggle Button */}
              <button
                onClick={handleWishlistClick}
                className={`rounded-xl p-2 transition ${
                  isWishlisted
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500"
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                aria-label="Wishlist toggle"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>

              {/* Mark as Read Button */}
              <button
                onClick={handleReadClick}
                className={`rounded-xl p-2 transition ${
                  isRead
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-rose-50 hover:text-rose-600"
                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600"
                }`}
                title={isRead ? "Unmark as Read" : "Mark as Read"}
                aria-label="Read status toggle"
              >
                <CheckCircle2 className={`h-4 w-4 ${isRead ? "fill-emerald-600 text-white" : ""}`} />
              </button>

              {/* View Details Link */}
              <Link
                to={`/bookDetails/${bookId}`}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-2xs"
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
