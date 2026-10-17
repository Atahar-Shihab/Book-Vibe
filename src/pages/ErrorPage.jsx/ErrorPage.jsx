import { Link } from "react-router";


const ErrorPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-600/20 blur-[120px]" />

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-300"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="select-none bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-[clamp(7rem,25vw,13rem)] font-black leading-none tracking-tighter text-transparent">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Oops! Lost in space?
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-400 sm:text-lg">
          The page you're looking for doesn't exist, may have been moved,
          or is taking a little trip through the universe.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-7 py-3.5 font-semibold shadow-lg shadow-purple-900/30 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/40 sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 10 9-7 9 7" />
              <path d="M9 21v-8h6v8" />
            </svg>
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-slate-300 backdrop-blur-sm transition duration-300 hover:border-purple-400/40 hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          <span>Error 404 — Page Not Found</span>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;
