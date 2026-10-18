import { useState, useMemo } from "react";
import { Compass, Sparkles, BookOpen, Clock, ArrowRight, Layers } from "lucide-react";
import TiltCard from "../Effects/TiltCard";

const ERAS = [
  {
    id: "antiquity",
    name: "Ancient Wisdom & Epic Poetry",
    period: "700 BC – 180 AD",
    icon: "🏛️",
    accent: "from-amber-500 to-yellow-600",
    badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.25)",
    summary:
      "From Homeric oral myths to Roman Stoic journals, this foundational epoch birthed ethical philosophy, tragic drama, and political philosophy that still anchors Western thought.",
    bigQuestion: "What is the good life, and what is our duty to the cosmos?",
    bookIds: [14, 20, 7], // The Odyssey, The Republic, Meditations
  },
  {
    id: "enlightenment",
    name: "Romanticism, Gothic & Existential Realism",
    period: "1813 – 1883",
    icon: "🕯️",
    accent: "from-rose-500 to-red-600",
    badgeBg: "bg-rose-500/10 text-rose-600 border-rose-500/30",
    glowColor: "rgba(244, 63, 94, 0.25)",
    summary:
      "A tumultuous century interrogating scientific ambition, social manners, psychological guilt, and the death of traditional metaphysical dogmas in industrial Europe.",
    bigQuestion: "Can human reason conquer mortality and moral chaos without losing the soul?",
    bookIds: [5, 12, 23, 26, 10, 28], // Pride and Prejudice, Frankenstein, Jane Eyre, Wuthering Heights, Crime and Punishment, Thus Spoke Zarathustra
  },
  {
    id: "dystopia",
    name: "Modernist Awakenings & Dystopian Visions",
    period: "1902 – 1949",
    icon: "⏳",
    accent: "from-violet-500 to-indigo-600",
    badgeBg: "bg-violet-500/10 text-violet-600 border-violet-500/30",
    glowColor: "rgba(139, 92, 246, 0.25)",
    summary:
      "Two catastrophic world wars sparked profound disillusionment, jazz-age materialism, existential resilience in concentration camps, and prescient warnings against totalitarian surveillance.",
    bigQuestion: "How do humans preserve inner freedom under the crush of mechanized dogma?",
    bookIds: [18, 1, 17, 6, 16, 19, 3], // Hound of the Baskervilles, Gatsby, Brave New World, Hobbit, Little Prince, Man's Search for Meaning, 1984
  },
  {
    id: "spaceage",
    name: "Post-War Humanism & Cosmic Exploration",
    period: "1951 – 1988",
    icon: "🔭",
    accent: "from-cyan-500 to-teal-600",
    badgeBg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.25)",
    summary:
      "An era stretching from civil rights courtroom courage and mythological world-building to evolutionary genetics, astrophysics, and Carl Sagan's poetic awe for the pale blue dot.",
    bigQuestion: "Who are we in the vast expanse of deep time and evolutionary history?",
    bookIds: [4, 27, 2, 25, 13, 8, 9], // Catcher, Fellowship, Mockingbird, Selfish Gene, Cosmos, Brief History, Alchemist
  },
  {
    id: "contemporary",
    name: "Cognitive Mastery & 21st Century Canon",
    period: "1997 – Present",
    icon: "🧠",
    accent: "from-emerald-500 to-green-600",
    badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.25)",
    summary:
      "The information explosion demands systemic thinking: decoding cognitive biases, understanding biological macro-history, building robust software architectures, and compound personal growth.",
    bigQuestion: "How do we steer human intellect, technology, and habit in an interconnected world?",
    bookIds: [30, 24, 15, 21, 11, 29, 22], // Harry Potter, Guns Germs & Steel, Clean Code, Thinking Fast & Slow, Sapiens, Girl on Train, Atomic Habits
  },
];

const LiteraryGalaxyExplorer = ({ books = [], onSelectBook }) => {
  const [activeEraId, setActiveEraId] = useState("antiquity");

  const currentEra = useMemo(
    () => ERAS.find((e) => e.id === activeEraId) || ERAS[0],
    [activeEraId]
  );

  const eraBooks = useMemo(() => {
    if (!books || books.length === 0) return [];
    return currentEra.bookIds
      .map((id) => books.find((b) => b.bookId === id))
      .filter(Boolean);
  }, [books, currentEra]);

  return (
    <section className="my-14 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
      {/* Background celestial ambient glow */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl transition-all duration-700"
        style={{ backgroundColor: currentEra.glowColor }}
      />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-900/40 px-3.5 py-1 text-xs font-bold text-violet-200">
              <Compass className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              The Literary Galaxy • Historical Timeline
            </div>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Journey Across 2,700 Years of Human Thought
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Navigate human civilization through 5 intellectual epochs. See how literary movements,
              philosophical revolutions, and scientific breakthroughs shaped our 30 classic titles.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Layers className="h-4 w-4 text-violet-400" />
            <span>{eraBooks.length} Masterpieces in this Epoch</span>
          </div>
        </div>

        {/* Era Selector Pills */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {ERAS.map((era) => {
            const isActive = era.id === activeEraId;
            return (
              <button
                key={era.id}
                onClick={() => setActiveEraId(era.id)}
                className={`group flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-300 border ${
                  isActive
                    ? "bg-white text-slate-900 border-white shadow-lg shadow-white/10 scale-102"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-lg">{era.icon}</span>
                <div className="text-left">
                  <div className="leading-tight">{era.name.split(" ")[0]} Epoch</div>
                  <div className={`text-[10px] ${isActive ? "text-violet-700" : "text-slate-400"}`}>
                    {era.period}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Era Philosophy Spotlight Card */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5 sm:p-6 transition-all duration-500">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{currentEra.icon}</span>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-white">
                  {currentEra.name}
                </h3>
                <span className="hidden sm:inline-block rounded-full bg-white/10 px-3 py-0.5 text-xs font-mono font-bold text-amber-300">
                  {currentEra.period}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentEra.summary}
              </p>
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-950/30 p-4 lg:w-80 shrink-0">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>Central Question</span>
              </div>
              <p className="mt-1 text-xs italic text-amber-100 font-serif leading-relaxed">
                "{currentEra.bigQuestion}"
              </p>
            </div>
          </div>
        </div>

        {/* Books Constellation Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {eraBooks.map((book) => (
            <TiltCard key={book.bookId} maxTilt={8}>
              <div className="h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-800/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-violet-400/50 hover:bg-slate-800 shadow-lg">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-violet-900/60 border border-violet-400/30 px-2 py-0.5 text-[10px] font-bold text-violet-200">
                      {book.yearOfPublishing < 0
                        ? `${Math.abs(book.yearOfPublishing)} BC`
                        : book.yearOfPublishing}
                    </span>
                    <span className="rounded-full bg-emerald-900/40 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                      ★ {book.rating}
                    </span>
                  </div>

                  <h4 className="mt-3 font-serif text-sm font-bold text-white line-clamp-1">
                    {book.bookName}
                  </h4>
                  <p className="text-[11px] text-slate-400">By {book.author}</p>

                  <p className="mt-2.5 text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                    {book.review || book.historicalSignificance}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    {book.readingTimeMinutes ? `${Math.round(book.readingTimeMinutes / 60)}h read` : "Classic"}
                  </span>

                  {onSelectBook && (
                    <button
                      onClick={() => onSelectBook(book)}
                      className="inline-flex items-center gap-1 rounded-xl bg-violet-600/80 hover:bg-violet-600 px-2.5 py-1 text-[11px] font-bold text-white transition hover:scale-105"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Flip 3D</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiteraryGalaxyExplorer;
