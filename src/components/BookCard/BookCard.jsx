
const BookCard = ({ book }) => {
  const {
    bookName,
    author,
    image,
    rating,
    category,
    tags = [],
    totalPages,
    yearOfPublishing,
  } = book;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70">
      {/* Subtle hover decoration */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-100/70 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      {/* Book Cover */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-3">
        <img
          src={image}
          alt={`Cover of ${bookName}`}
          loading="fast"
          className="h-full w-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Book Details */}
      <div className="relative px-0.5 pt-3.5">
        {/* Tags */}
        <div className="mb-2.5 flex flex-wrap gap-2">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium tracking-wide text-green-700 transition-colors duration-300 group-hover:bg-green-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Book Title */}
        <h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-800 transition-colors duration-300 group-hover:text-violet-700">
          {bookName}
        </h2>

        {/* Author */}
        <p className="mt-1 text-xs text-gray-500">
          By <span className="font-medium text-gray-700">{author}</span>
        </p>

        {/* Optional Metadata */}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
          {totalPages && <span>{totalPages} pages</span>}
          {yearOfPublishing && <span>{yearOfPublishing}</span>}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-dashed border-gray-200" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-gray-600">
            {category}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-xs font-semibold tabular-nums text-gray-700">
              {Number(rating).toFixed(2)}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-amber-500 transition-transform duration-300 group-hover:scale-125"
              aria-label={`Rating: ${rating} out of 5`}
              role="img"
            >
              <path d="m12 3 2.75 5.57 6.15.89-4.45 4.34 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.46l6.15-.89L12 3Z" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
