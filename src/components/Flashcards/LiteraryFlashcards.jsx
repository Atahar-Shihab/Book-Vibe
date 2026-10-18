import { useState } from "react";
import { Sparkles, Check, RotateCw, ChevronLeft, ChevronRight, BookOpen, Trophy, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

const CARDS_DATA = [
  {
    id: 1,
    book: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    concept: "The Green Light across the Bay",
    category: "Literary Symbolism",
    question: "What does the green light at the end of Daisy's dock symbolize in Gatsby's tragic arc?",
    answer:
      "It symbolizes Gatsby's unattainable romantic idealization of Daisy, the illusory nature of the American Dream, and humanity's perpetual struggle against time: 'so we beat on, boats against the current, borne back ceaselessly into the past.'",
    tag: "Themes",
  },
  {
    id: 2,
    book: "1984",
    author: "George Orwell",
    concept: "Doublethink & Newspeak",
    category: "Dystopian Philosophy",
    question: "How do Doublethink and Newspeak function together to eliminate dissident thought in Oceania?",
    answer:
      "Newspeak diminishes vocabulary so revolutionary thoughts become literally unspeakable, while Doublethink trains the human psyche to simultaneously accept two contradictory assertions as absolute truth (e.g. 'War is Peace').",
    tag: "Philosophy",
  },
  {
    id: 3,
    book: "The Republic",
    author: "Plato",
    concept: "The Allegory of the Cave",
    category: "Metaphysics & Epistemology",
    question: "What philosophical awakening is dramatized in the Allegory of the Cave?",
    answer:
      "The ascent from sensory shadows on the wall (unexamined dogmatic belief) into the blinding sunlight of the Forms (objective truth, reason, and the Form of the Good), illustrating the moral responsibility of the enlightened philosopher.",
    tag: "Philosophy",
  },
  {
    id: 4,
    book: "Frankenstein",
    author: "Mary Shelley",
    concept: "The Modern Prometheus & Parental Duty",
    category: "Romantic Literature",
    question: "What ethical tragedy lies at the core of Victor Frankenstein's scientific creation?",
    answer:
      "Victor's moral sin is not the scientific mastery of life itself, but his cowardice in abandoning his creation without love, parental education, or societal empathy, turning an innocent being into a creature of desperate vengeance.",
    tag: "Themes",
  },
  {
    id: 5,
    book: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    concept: "The Extraordinary Man Theory",
    category: "Psychological Realism",
    question: "Why does Raskolnikov's rationalist 'Napoleon' thesis collapse after the murder?",
    answer:
      "Because utilitarian rationalism ignores the indomitable reality of human conscience. True redemption is achieved not through intellectual pride or nihilism, but through psychological confession, suffering, and compassionate love.",
    tag: "Psychology",
  },
  {
    id: 6,
    book: "Meditations",
    author: "Marcus Aurelius",
    concept: "Dichotomy of Control & Amor Fati",
    category: "Stoic Ethics",
    question: "What fundamental rule dictates Stoic tranquility according to Marcus Aurelius?",
    answer:
      "Strictly demarcating what is within your control (your judgments, intentions, virtues) from what is not (fame, external events, mortality), and embracing life's unfolding with equanimity rather than resentment.",
    tag: "Philosophy",
  },
  {
    id: 7,
    book: "Cosmos",
    author: "Carl Sagan",
    concept: "Star Stuff & The Pale Blue Dot",
    category: "Scientific Cosmology",
    question: "What existential perspective does Sagan synthesize regarding humanity's cosmic origins?",
    answer:
      "'We are a way for the cosmos to know itself.' Every atom in our bodies was forged inside dying stars, transforming scientific astrophysics into a deeply humanistic spiritual reverence for life on Earth.",
    tag: "Science",
  },
  {
    id: 8,
    book: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    concept: "The Power of Shared Fictions",
    category: "Anthropology & History",
    question: "How did Homo sapiens conquer the planet compared to other hominid species?",
    answer:
      "Through the Cognitive Revolution, which allowed humans to cooperate flexibly in large numbers by believing in shared inter-subjective fictions: legal systems, currencies, corporations, nations, and religious mythologies.",
    tag: "History",
  },
];

const LiteraryFlashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState(new Set());

  const currentCard = CARDS_DATA[currentIndex];
  const totalCards = CARDS_DATA.length;
  const knownCount = knownIds.size;
  const progressPercent = Math.round((knownCount / totalCards) * 100);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const markKnown = () => {
    const updated = new Set(knownIds);
    updated.add(currentCard.id);
    setKnownIds(updated);

    if (updated.size === totalCards) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.debug(e);
      }
    }
    handleNext();
  };

  const resetDeck = () => {
    setKnownIds(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <section className="my-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-900/40 px-3.5 py-1 text-xs font-bold text-violet-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Active Recall • Literary Mastery Deck
            </div>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-black text-white">
              Literary Concept Flashcards
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Test your recall on central motifs, philosophical allegories, and themes across the canon.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 text-xs font-bold">
            <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
              {currentIndex + 1} of {totalCards}
            </span>
            <button
              onClick={resetDeck}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition"
              title="Reset Deck"
              aria-label="Reset flashcard deck"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              Mastered: <strong className="text-emerald-400">{knownCount}</strong> of {totalCards} Concepts
            </span>
            <span className="text-amber-400">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-emerald-400 to-teal-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 3D Flip Flashcard */}
        <div className="mt-8 perspective-1000 min-h-[290px] cursor-pointer" onClick={flipCard}>
          <div
            className={`relative h-full min-h-[290px] w-full rounded-3xl border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 transform-gpu ${
              isFlipped
                ? "bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 border-violet-400/50"
                : "bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-800/90 border-white/10 hover:border-violet-400/30"
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-600/30 border border-violet-400/40 px-2.5 py-0.5 font-bold text-violet-200">
                  {currentCard.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-serif font-semibold">{currentCard.book}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <RotateCw className="h-3 w-3 text-violet-400" />
                <span>Click to {isFlipped ? "View Prompt" : "Reveal Answer"}</span>
              </div>
            </div>

            {/* Card Content (Prompt or Answer) */}
            <div className="my-6">
              {!isFlipped ? (
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-amber-300 leading-snug">
                    {currentCard.concept}
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentCard.question}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Analytical Synthesis & Meaning
                  </span>
                  <p className="mt-2 text-xs sm:text-sm text-slate-100 leading-relaxed font-serif">
                    {currentCard.answer}
                  </p>
                  <p className="mt-3 text-[11px] text-slate-400 italic">
                    Referenced from {currentCard.book} by {currentCard.author}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Status indicator */}
            <div className="absolute bottom-5 inset-x-6 sm:inset-x-8 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-violet-400" />
                <span>Card {currentIndex + 1}</span>
              </span>

              {knownIds.has(currentCard.id) && (
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  <span>Mastered</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation & Knowledge Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
              aria-label="Next card"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={markKnown}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition hover:scale-105"
          >
            <Check className="h-4 w-4" />
            <span>Mark as Mastered</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiteraryFlashcards;
